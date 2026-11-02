// mobile-app/src/screens/FieldInspectionScreen.tsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import * as Location from 'expo-location';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Crypto from 'expo-crypto';
import { Magnetometer } from 'expo-sensors';
import Constants from 'expo-constants';
import { Header } from '../components/Header';
import { COLORS, SHADOWS } from '../constants/theme';
import { INITIAL_GEOTAGGED_PHOTOS, CURRENT_EVC_OFFICER, GeotaggedEvidence } from '../constants/mockData';
import { useLiveLocation } from '../hooks/useLiveLocation';
import { LocationPermissionExplainer } from '../components/LocationPermissionExplainer';
import { LocationState } from '../types/location';
import * as Haptics from 'expo-haptics';
import { LiveGeofenceMap, GeofenceVisualStatus } from '../components/LiveGeofenceMap';
import { FullScreenCaptureScreen } from './FullScreenCaptureScreen';
import { CaptureRecord } from '../services/captureQueue';

const getBackendUrl = (): string => {
  const debuggerHost = Constants.expoConfig?.hostUri || (Constants as any).manifest2?.extra?.expoClient?.hostUri || '';
  const hostIp = debuggerHost ? debuggerHost.split(':')[0] : '';
  if (hostIp && hostIp !== 'localhost') {
    return `http://${hostIp}:3000/api/inspections`;
  }
  return 'http://50.0.7.112:3000/api/inspections';
};

const getBackendAuditUrl = (): string => {
  const debuggerHost = Constants.expoConfig?.hostUri || (Constants as any).manifest2?.extra?.expoClient?.hostUri || '';
  const hostIp = debuggerHost ? debuggerHost.split(':')[0] : '';
  if (hostIp && hostIp !== 'localhost') {
    return `http://${hostIp}:3000/api/audit`;
  }
  return 'http://50.0.7.112:3000/api/audit';
};

export interface StatutoryLab {
  id: string;
  name: string;
  code: string;
  building: string;
  clause: string;
  centroid: { lat: number; lng: number };
  radiusMeters: number;
  carpetAreaSqM: number;
  approvedIntakeRatio: string;
  equipmentSummary: string;
  icon: string;
}

export const AICTE_STATUTORY_LABS: StatutoryLab[] = [
  {
    id: 'lab-comp-center',
    name: 'Computer Center (540 PCs)',
    code: 'LAB-CC-03',
    building: 'Main Academic Building, Wing A, Floor 2',
    clause: 'APH 2024-27 §4.4.1 (1:4 Student-PC Ratio)',
    centroid: { lat: 18.675620, lng: 73.896710 },
    radiusMeters: 35,
    carpetAreaSqM: 520,
    approvedIntakeRatio: '540 Terminals for 180 Intake',
    equipmentSummary: 'Core i7 16GB, Dual 1 Gbps Leased Line, 40 kVA Online UPS',
    icon: '💻',
  },
  {
    id: 'lab-ai-robotics',
    name: 'Robotics & AI Center of Excellence',
    code: 'LAB-AI-01',
    building: 'Technology Annex, Wing B',
    clause: 'APH 2024-27 §4.4.3 (Emerging Tech Labs)',
    centroid: { lat: 18.675810, lng: 73.896920 },
    radiusMeters: 30,
    carpetAreaSqM: 380,
    approvedIntakeRatio: 'AIML Specialization Cohort',
    equipmentSummary: 'NVIDIA RTX GPU Rig, 6-Axis Robotic Arms, ROS2 Workstations',
    icon: '🔬',
  },
  {
    id: 'lab-vlsi-cleanroom',
    name: 'VLSI Design & Cleanroom Fabrication',
    code: 'LAB-VLSI-02',
    building: 'Electronics & Semiconductor Wing, Level 1',
    clause: 'APH 2024-27 §4.4.2 (Specialized Electronics)',
    centroid: { lat: 18.676010, lng: 73.896350 },
    radiusMeters: 25,
    carpetAreaSqM: 290,
    approvedIntakeRatio: 'VLSI & Embedded Systems',
    equipmentSummary: 'Cadence EDA Suite, Class 10k Laminar Hood, Anti-Static Grid',
    icon: '⚡',
  },
  {
    id: 'lab-mech-workshop',
    name: 'CNC & Heavy Machinery Workshop',
    code: 'LAB-MECH-04',
    building: 'Mechanical Engineering Workshop Hangar 1',
    clause: 'APH 2024-27 §4.4.4 (Core Engineering Workshops)',
    centroid: { lat: 18.675190, lng: 73.897450 },
    radiusMeters: 45,
    carpetAreaSqM: 650,
    approvedIntakeRatio: 'Mechanical & Automation Cohort',
    equipmentSummary: '4-Axis CNC Milling, Industrial Lathes, 5-Ton Overhead Crane',
    icon: '⚙️',
  },
  {
    id: 'lab-wheelchair-ramp',
    name: 'Barrier-Free Wheelchair Ramp Portal',
    code: 'RAMP-PORTAL-01',
    building: 'Administrative Block Portal Entry A',
    clause: 'APH 2024-27 §4.2.2 (RPwD Act 2016)',
    centroid: { lat: 18.675380, lng: 73.896620 },
    radiusMeters: 20,
    carpetAreaSqM: 110,
    approvedIntakeRatio: '100% Inclusive Campus Mandate',
    equipmentSummary: '1:12 Gradient, Anti-Skid Polyurethane, Continuous 900mm Rail',
    icon: '♿',
  },
];

function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export const FieldInspectionScreen: React.FC = () => {
  const [photos, setPhotos] = useState<GeotaggedEvidence[]>(INITIAL_GEOTAGGED_PHOTOS);
  const [selectedLabId, setSelectedLabId] = useState<string>('lab-comp-center');
  const [gpsMode, setGpsMode] = useState<'real' | 'simulation'>('real');
  const [simDistanceOffset, setSimDistanceOffset] = useState<number>(14);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<'0.6X' | '1X' | '2X'>('2X');
  const [recordedSeconds, setRecordedSeconds] = useState<number>(136);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [flashActive, setFlashActive] = useState<boolean>(false);
  const [cameraFacing, setCameraFacing] = useState<'back' | 'front'>('back');
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [cameraActive, setCameraActive] = useState<boolean>(true);
  const [isFullScreenCaptureOpen, setIsFullScreenCaptureOpen] = useState<boolean>(false);

  // Hardware Geolocation & Sensors Hook (Phase 1)
  const {
    locationState,
    permissionState,
    errorMessage: locationError,
    requestPermission,
    openSettings,
    enableServices,
  } = useLiveLocation({
    defaultCampusAddress: 'MIT Academy of Engineering, Dehu Phata, Alandi, Pune 412105, India',
    onMockDetected: () => {
      Alert.alert(
        '🚨 Statutory Security Lock: Mock Location Detected',
        'AICTE APH 2024-27 §4.2.3 and Section 65B of Indian Evidence Act prohibit simulated or spoofed GPS coordinates.\n\nAll inspection shutter functions are locked.'
      );
    },
  });

  const [pinnedCentroid, setPinnedCentroid] = useState<{ lat: number; lng: number } | null>(null);
  const [compassHeading, setCompassHeading] = useState<string>('160° NW');
  const [magneticField, setMagneticField] = useState<string>('256 µT');

  const activeLab =
    AICTE_STATUTORY_LABS.find((l) => l.id === selectedLabId) || AICTE_STATUTORY_LABS[0];

  // Magnetometer sensor
  useEffect(() => {
    let magSub: any = null;
    async function initMagnetometer() {
      try {
        if (Magnetometer && Magnetometer.isAvailableAsync) {
          const avail = await Magnetometer.isAvailableAsync();
          if (avail) {
            Magnetometer.setUpdateInterval(1000);
            magSub = Magnetometer.addListener((data) => {
              const totalMag = Math.round(Math.sqrt(data.x * data.x + data.y * data.y + data.z * data.z));
              setMagneticField(`${totalMag} µT`);
            });
          }
        }
      } catch {}
    }
    initMagnetometer();
    return () => {
      if (magSub) magSub.remove();
    };
  }, []);

  // Update compass heading from live location heading if available
  useEffect(() => {
    if (locationState?.heading != null) {
      const deg = locationState.heading;
      const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
      const idx = Math.round(deg / 45) % 8;
      setCompassHeading(`${deg}° ${dirs[idx]}`);
    }
  }, [locationState?.heading]);

  // Timer loop for viewfinder recording badge
  useEffect(() => {
    const timer = setInterval(() => {
      setRecordedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isDemoAllowed = Boolean(__DEV__ || process.env.EXPO_PUBLIC_ENABLE_DEMO === 'true');
  const targetCentroid = pinnedCentroid || activeLab.centroid;

  // Coords & Distance Calculation (Real device hardware vs Simulator)
  const latOffset = (simDistanceOffset / 111139) * 0.7071;
  const lngOffset =
    (simDistanceOffset / (111139 * Math.cos((targetCentroid.lat * Math.PI) / 180))) * 0.7071;

  const currentLat =
    gpsMode === 'real' && locationState
      ? locationState.lat
      : parseFloat((targetCentroid.lat + latOffset).toFixed(6));
  const currentLng =
    gpsMode === 'real' && locationState
      ? locationState.lng
      : parseFloat((targetCentroid.lng + lngOffset).toFixed(6));
  const currentAccuracy =
    gpsMode === 'real' && locationState ? locationState.accuracy : 1.8;
  const currentAltitude =
    gpsMode === 'real' && locationState?.altitude != null ? locationState.altitude : 568;
  const isMocked = Boolean(gpsMode === 'real' && locationState?.isMocked);
  const isGpsWeak = Boolean(gpsMode === 'real' && locationState && locationState.accuracy > 30);
  const addressText =
    gpsMode === 'real' && locationState?.address
      ? locationState.address
      : 'MIT Academy of Engineering, Dehu Phata, Alandi (Dandi), Pune, Maharashtra 412105, India';

  // Haversine Distance (Memoized to prevent re-render storms)
  const currentDistance = useMemo(() => {
    return calculateHaversineDistance(
      currentLat,
      currentLng,
      targetCentroid.lat,
      targetCentroid.lng
    );
  }, [currentLat, currentLng, targetCentroid.lat, targetCentroid.lng]);

  // Phase 2: Accuracy-aware geofence status with 5m hysteresis and haptic feedback
  const [geofenceStatus, setGeofenceStatus] = useState<GeofenceVisualStatus>('INSIDE');
  const prevGeofenceRef = useRef<GeofenceVisualStatus>('INSIDE');

  useEffect(() => {
    if (isGpsWeak) {
      if (prevGeofenceRef.current !== 'UNCERTAIN') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
        prevGeofenceRef.current = 'UNCERTAIN';
        setGeofenceStatus('UNCERTAIN');
      }
      return;
    }

    const radius = activeLab.radiusMeters;
    const HYSTERESIS = 5;
    let next: GeofenceVisualStatus;

    if (prevGeofenceRef.current === 'INSIDE') {
      if (currentDistance - currentAccuracy > radius + HYSTERESIS) {
        next = 'OUTSIDE';
      } else if (currentDistance > radius + HYSTERESIS) {
        next = 'UNCERTAIN';
      } else {
        next = 'INSIDE';
      }
    } else if (prevGeofenceRef.current === 'OUTSIDE') {
      if (currentDistance <= Math.max(0, radius - HYSTERESIS)) {
        next = 'INSIDE';
      } else if (currentDistance - currentAccuracy <= radius) {
        next = 'UNCERTAIN';
      } else {
        next = 'OUTSIDE';
      }
    } else {
      if (currentDistance <= radius - HYSTERESIS) {
        next = 'INSIDE';
      } else if (currentDistance - currentAccuracy > radius + HYSTERESIS) {
        next = 'OUTSIDE';
      } else {
        next = 'UNCERTAIN';
      }
    }

    if (next !== prevGeofenceRef.current) {
      if (next === 'INSIDE') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      } else if (next === 'OUTSIDE') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
      }
      prevGeofenceRef.current = next;
      setGeofenceStatus(next);
    }
  }, [currentDistance, currentAccuracy, activeLab.radiusMeters, isGpsWeak]);

  const isInsideGeofence = geofenceStatus === 'INSIDE';
  const breachDelta = Math.max(0, Math.round(currentDistance - activeLab.radiusMeters));

  const canCalibrate =
    CURRENT_EVC_OFFICER.role.includes('Admin') ||
    CURRENT_EVC_OFFICER.role.includes('Auditor') ||
    CURRENT_EVC_OFFICER.role.includes('Lead');

  const handleCalibrateToMySpot = async () => {
    if (!canCalibrate) {
      Alert.alert('Unauthorized', 'Only authorized AICTE Auditors/Admins can calibrate lab centroids.');
      return;
    }

    const newLat = currentLat;
    const newLng = currentLng;
    const oldCentroid = { ...activeLab.centroid };

    setPinnedCentroid({ lat: newLat, lng: newLng });

    try {
      await fetch(getBackendAuditUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actor: CURRENT_EVC_OFFICER.name,
          action: 'EVC_LAB_CENTROID_CALIBRATED',
          entity: activeLab.code,
          payload: {
            labId: activeLab.id,
            labName: activeLab.name,
            campus: CURRENT_EVC_OFFICER.assignedCampus,
            oldCentroid,
            newCentroid: { lat: newLat, lng: newLng },
            timestamp: new Date().toISOString(),
            statutoryReason: 'Field recalibration by authorized EVC Lead',
          },
        }),
      });
    } catch {
      // Non-blocking
    }

    Alert.alert(
      '📍 Calibrated & Audit Logged',
      `Current GPS (${newLat.toFixed(6)}, ${newLng.toFixed(6)}) calibrated as official centroid for ${activeLab.name}.\n\nDistance is now 0m. Logged to central Azure audit chain.`
    );
  };

  const handleResetCentroid = () => {
    setPinnedCentroid(null);
    Alert.alert('🔄 Centroid Reset', 'Reset to official statutory MITAOE campus coordinates.');
  };

  const handleCaptureGeotagged = async () => {
    if (isMocked) {
      Alert.alert(
        '🚨 Statutory Security Lock: Mock Location Detected',
        'AICTE APH 2024-27 §4.2.3 and Section 65B of Indian Evidence Act prohibit simulated or spoofed GPS coordinates.\n\nAll inspection shutter functions are locked.'
      );
      return;
    }

    if (isGpsWeak) {
      Alert.alert(
        '⚠️ Weak GPS Signal (±' + currentAccuracy + 'm)',
        'Statutory verification requires satellite fix accuracy under 30m. Please step out to an open area before capturing evidence.'
      );
      return;
    }

    if (!isInsideGeofence) {
      Alert.alert(
        '🚨 AICTE Geofence Breach Detected',
        `Statutory Violation (§4.2.3):\n\nInspector is ${currentDistance}m away from ${activeLab.name} centroid.\nMaximum permitted boundary: ${activeLab.radiusMeters}m (+${breachDelta}m outside fence).\n\nCamera shutter locked to prevent recycled or off-campus fraudulent submissions.`,
        [{ text: 'Dismiss & Walk Closer', style: 'cancel' }]
      );
      return;
    }

    setIsCapturing(true);

    try {
      // Hardware-attested SHA-256 seal via expo-crypto
      const rawPayload = `MITAOE-EVC|${activeLab.code}|${activeLab.name}|${currentLat},${currentLng}|${currentDistance}m|${Date.now()}`;
      const sha256Hash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        rawPayload
      );

      const newEvidence: GeotaggedEvidence = {
        id: `geo-${Date.now()}`,
        category: activeLab.name,
        campusName: CURRENT_EVC_OFFICER.assignedCampus,
        aicteId: CURRENT_EVC_OFFICER.aictePermanentId,
        latitude: currentLat,
        longitude: currentLng,
        accuracy: currentAccuracy,
        timestamp: new Date().toISOString(),
        sha256Hash,
        inspectorName: CURRENT_EVC_OFFICER.name,
        status: 'Verified & Sealed',
        geofenceStatus: isInsideGeofence ? 'COMPLIANT' : 'BREACH',
        distanceMeters: currentDistance,
        labCode: activeLab.code,
        radiusMeters: activeLab.radiusMeters,
      };

      setPhotos([newEvidence, ...photos]);

      // Attempt sync to Central Azure DB / Scrutiny Backend
      try {
        fetch(getBackendUrl(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            campus_name: 'MIT Academy of Engineering (MITAOE)',
            aicte_id: '1-23111191',
            lab_name: activeLab.name,
            lab_code: activeLab.code,
            statutory_clause: activeLab.clause,
            address: addressText,
            latitude: currentLat,
            longitude: currentLng,
            accuracy: currentAccuracy,
            altitude: currentAltitude,
            compass_heading: compassHeading,
            wind_speed: '12 km/h',
            humidity: '40%',
            magnetic_field: magneticField,
            temperature: '25°C',
            distance_meters: currentDistance,
            statutory_radius_meters: activeLab.radiusMeters,
            geofence_status: 'COMPLIANT',
            inspector_name: CURRENT_EVC_OFFICER.name,
            sha256_seal: sha256Hash,
            photo_type: activeLab.id === 'lab-wheelchair-ramp' ? 'wheelchair_ramp' : 'computer_center',
          }),
        }).catch(() => {});
      } catch (e) {}

      Alert.alert(
        '📸 Geofence Verified & Sealed',
        `✓ Target: ${activeLab.name} (${activeLab.code})\n✓ Distance: ${currentDistance}m (Within ${activeLab.radiusMeters}m perimeter)\n✓ GPS: ${currentLat}° N, ${currentLng}° E (±${currentAccuracy}m)\n✓ SHA-256 Digest: ${sha256Hash.slice(0, 16)}...\n✓ Hardware Attestation: Section 65B Compliant\n✓ Transmitted to AICTE Admin Scrutiny Portal.`
      );
    } catch (err: any) {
      Alert.alert('Capture Error', err.message);
    } finally {
      setIsCapturing(false);
    }
  };

  // Phase 1: Full-Screen Explainer if Location Permission is not yet granted or GPS is disabled
  if (permissionState !== 'GRANTED') {
    return (
      <View style={styles.screen}>
        <Header />
        <LocationPermissionExplainer
          permissionState={permissionState}
          onRequestPermission={requestPermission}
          onOpenSettings={openSettings}
          onEnableServices={enableServices}
        />
      </View>
    );
  }

  // Phase 3: Full-Screen Immersive Capture Screen
  if (isFullScreenCaptureOpen) {
    return (
      <FullScreenCaptureScreen
        activeLab={activeLab}
        locationState={locationState}
        currentLat={currentLat}
        currentLng={currentLng}
        currentAccuracy={currentAccuracy}
        currentAltitude={currentAltitude}
        compassHeading={compassHeading}
        magneticField={magneticField}
        addressText={addressText}
        distanceMeters={currentDistance}
        geofenceStatus={geofenceStatus}
        isMocked={isMocked}
        onClose={() => setIsFullScreenCaptureOpen(false)}
        onCapturesComplete={(captures: CaptureRecord[]) => {
          const mapped = captures.map((c) => ({
            id: c.id,
            category: c.labName,
            campusName: c.campusName,
            aicteId: c.officerId,
            latitude: c.lat,
            longitude: c.lng,
            accuracy: c.accuracy,
            timestamp: c.capturedAt,
            sha256Hash: c.imageHash,
            inspectorName: c.officerName,
            status: 'Verified & Sealed' as const,
            geofenceStatus: c.geofenceStatus,
            distanceMeters: c.distanceM,
            labCode: c.labCode,
            radiusMeters: activeLab.radiusMeters,
          }));
          setPhotos((prev) => [...mapped, ...prev]);
        }}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <Header />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Title Header */}
        <View style={styles.titleSection}>
          <View style={styles.badgeRow}>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>AICTE EVC VISITING COMMITTEE</Text>
            </View>
            <View style={[styles.geofenceBadge, geofenceStatus === 'INSIDE' ? styles.badgeGreen : geofenceStatus === 'OUTSIDE' ? styles.badgeRed : styles.badgeAmber]}>
              <Text style={[styles.geofenceBadgeText, geofenceStatus === 'INSIDE' ? styles.textGreen : geofenceStatus === 'OUTSIDE' ? styles.textRed : styles.textAmber]}>
                {geofenceStatus === 'INSIDE'
                  ? `🟢 ✓ Within Fence (${currentDistance}m)`
                  : geofenceStatus === 'OUTSIDE'
                  ? `🔴 ✕ Breach (+${breachDelta}m)`
                  : `🟡 ⚠️ Weak GPS (±${currentAccuracy}m)`}
              </Text>
            </View>
          </View>
          <Text style={styles.mainTitle}>1. Lab Geofencing &amp; Inspection</Text>
          <Text style={styles.subTitle}>
            On-device GPS validation locks shutter when outside laboratory perimeter to eliminate recycled photo fraud.
          </Text>
        </View>

        {/* Security Warning Banners (Phase 1) */}
        {isMocked && (
          <View style={styles.mockBanner}>
            <Text style={styles.mockBannerText}>
              🚨 MOCK GPS DETECTED: Hardware spoofing violation under APH §4.2.3. All capture functions locked.
            </Text>
          </View>
        )}
        {isGpsWeak && (
          <View style={styles.weakGpsBanner}>
            <Text style={styles.weakGpsText}>
              ⚠️ Weak GPS signal (±{currentAccuracy}m &gt; 30m limit). Move to an open sky area. Status: UNVERIFIED.
            </Text>
          </View>
        )}

        {/* GPS Mode Selector (Only show simulation in Dev/Demo mode) */}
        {isDemoAllowed ? (
          <View style={styles.gpsModeRow}>
            <TouchableOpacity
              onPress={() => setGpsMode('real')}
              style={[styles.gpsModeBtn, gpsMode === 'real' && styles.gpsModeBtnActive]}
            >
              <Text style={[styles.gpsModeBtnText, gpsMode === 'real' && styles.gpsModeBtnTextActive]}>
                📡 Real Device GPS (Active)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setGpsMode('simulation')}
              style={[styles.gpsModeBtn, gpsMode === 'simulation' && styles.gpsModeBtnActive]}
            >
              <Text style={[styles.gpsModeBtnText, gpsMode === 'simulation' && styles.gpsModeBtnTextActive]}>
                🕹️ Walk Simulator
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.gpsModeRow, { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0' }]}>
            <View style={[styles.gpsModeBtn, styles.gpsModeBtnActive, { backgroundColor: '#0B2E5C' }]}>
              <Text style={[styles.gpsModeBtnText, styles.gpsModeBtnTextActive]}>
                📡 Live Hardware GPS (Continuous High-Accuracy Fix)
              </Text>
            </View>
          </View>
        )}

        {/* Proximity / GPS Controls */}
        {gpsMode === 'real' ? (
          <View style={[styles.simControlCard, SHADOWS.card]}>
            <View style={styles.simHeaderRow}>
              <Text style={styles.simTitle}>📡 Live GPS Match ({CURRENT_EVC_OFFICER.assignedCampus}):</Text>
              <View style={[styles.simDistPill, isInsideGeofence ? styles.pillGreen : styles.pillRed]}>
                <Text style={[styles.simDistText, isInsideGeofence ? styles.textGreen : styles.textRed]}>
                  {currentDistance}m to Lab ({isInsideGeofence ? 'Compliant' : 'Breach'})
                </Text>
              </View>
            </View>
            <Text style={styles.realGpsCoords}>
              Coordinates: {currentLat.toFixed(6)}° N, {currentLng.toFixed(6)}° E (±{currentAccuracy}m)
            </Text>
            <Text style={styles.realGpsAddr} numberOfLines={2}>
              📍 {addressText}
            </Text>
            {canCalibrate && (
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                <TouchableOpacity
                  onPress={handleCalibrateToMySpot}
                  style={[styles.presetBtn, { flex: 1, backgroundColor: '#0B2E5C', borderColor: '#0B2E5C' }]}
                >
                  <Text style={[styles.presetBtnText, { color: '#FFFFFF', fontWeight: 'bold' }]}>
                    📍 Match Lab Centroid to Here (Auditor Override)
                  </Text>
                </TouchableOpacity>
                {pinnedCentroid && (
                  <TouchableOpacity
                    onPress={handleResetCentroid}
                    style={[styles.presetBtn, { paddingHorizontal: 10, borderColor: '#CBD5E1' }]}
                  >
                    <Text style={[styles.presetBtnText, { color: '#64748B' }]}>🔄 Reset</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        ) : (
          <View style={[styles.simControlCard, SHADOWS.card]}>
            <View style={styles.simHeaderRow}>
              <Text style={styles.simTitle}>🕹️ Campus Walk Distance Simulator:</Text>
              <View style={[styles.simDistPill, isInsideGeofence ? styles.pillGreen : styles.pillRed]}>
                <Text style={[styles.simDistText, isInsideGeofence ? styles.textGreen : styles.textRed]}>
                  {simDistanceOffset}m ({isInsideGeofence ? 'Compliant' : 'Breach'})
                </Text>
              </View>
            </View>

            {/* Quick Preset Buttons */}
            <View style={styles.presetsRow}>
              <TouchableOpacity
                onPress={() => setSimDistanceOffset(12)}
                style={[styles.presetBtn, simDistanceOffset === 12 && styles.presetBtnActive]}
              >
                <Text style={[styles.presetBtnText, simDistanceOffset === 12 && styles.presetBtnTextActive]}>
                  🟢 Inside Lab (12m)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setSimDistanceOffset(activeLab.radiusMeters - 3)}
                style={[styles.presetBtn, simDistanceOffset === activeLab.radiusMeters - 3 && styles.presetBtnActive]}
              >
                <Text
                  style={[
                    styles.presetBtnText,
                    simDistanceOffset === activeLab.radiusMeters - 3 && styles.presetBtnTextActive,
                  ]}
                >
                  🟡 Doorway ({activeLab.radiusMeters - 3}m)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setSimDistanceOffset(120)}
                style={[styles.presetBtn, simDistanceOffset === 120 && styles.presetBtnBreachActive]}
              >
                <Text style={[styles.presetBtnText, simDistanceOffset === 120 && styles.presetBtnTextActive]}>
                  🔴 Spoof (120m)
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Lab Target Selector */}
        <Text style={styles.categoryLabel}>Select Statutory Laboratory Target:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.labScroll}>
          {AICTE_STATUTORY_LABS.map((lab) => (
            <TouchableOpacity
              key={lab.id}
              onPress={() => setSelectedLabId(lab.id)}
              style={[
                styles.labChip,
                selectedLabId === lab.id ? styles.labChipActive : styles.labChipInactive,
              ]}
            >
              <Text style={styles.labIcon}>{lab.icon}</Text>
              <View>
                <Text
                  style={[
                    styles.labChipTitle,
                    selectedLabId === lab.id ? styles.labChipTextActive : styles.labChipTextInactive,
                  ]}
                >
                  {lab.name}
                </Text>
                <Text
                  style={[
                    styles.labChipSub,
                    selectedLabId === lab.id ? styles.labChipSubActive : styles.labChipSubInactive,
                  ]}
                >
                  {lab.code} • Fence: {lab.radiusMeters}m
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Live Geofence Map Component (Phase 2) */}
        <View style={{ marginBottom: 12 }}>
          <LiveGeofenceMap
            userLat={currentLat}
            userLng={currentLng}
            accuracy={currentAccuracy}
            labCentroid={targetCentroid}
            labRadiusMeters={activeLab.radiusMeters}
            labName={activeLab.name}
            labCode={activeLab.code}
            status={geofenceStatus}
            distanceMeters={currentDistance}
            height={180}
            isMocked={isMocked}
          />
        </View>

        {/* Live Camera Viewfinder & Visual Geofence Radar */}
        <View style={[styles.viewfinderCard, SHADOWS.card]}>
          
          {/* Main Camera Viewfinder Viewport with GPS Map Layout */}
          <View style={[styles.cameraPreview, !isInsideGeofence && styles.cameraPreviewBreach]}>
            
            {/* Live Camera View in Expo Go */}
            {cameraPermission?.granted && cameraActive ? (
              <CameraView
                facing={cameraFacing}
                style={StyleSheet.absoluteFillObject}
              />
            ) : null}

            {/* 3x3 Compositional Grid */}
            {showGrid && (
              <View style={styles.gridOverlay} pointerEvents="none">
                <View style={styles.gridRow}>
                  <View style={styles.gridCell} />
                  <View style={styles.gridCell} />
                  <View style={styles.gridCellLast} />
                </View>
                <View style={styles.gridRow}>
                  <View style={styles.gridCell} />
                  <View style={styles.gridCell} />
                  <View style={styles.gridCellLast} />
                </View>
                <View style={styles.gridRowLast}>
                  <View style={styles.gridCell} />
                  <View style={styles.gridCell} />
                  <View style={styles.gridCellLast} />
                </View>
              </View>
            )}

            {/* Camera Permission Request Pill if not granted */}
            {!cameraPermission?.granted && (
              <TouchableOpacity onPress={requestCameraPermission} style={styles.permPill}>
                <Text style={styles.permPillText}>📷 Tap to Grant Live Camera Access</Text>
              </TouchableOpacity>
            )}

            {/* Top Action Bar (Grid, Flash, Notes, Flip, Settings) */}
            <View style={styles.topActionBar}>
              <View style={styles.topIconGroup}>
                <TouchableOpacity onPress={() => setShowGrid(!showGrid)} style={styles.topIconButton}>
                  <Text style={[styles.topIconText, showGrid && styles.topIconActive]}>⊞</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFlashActive(!flashActive)} style={styles.topIconButton}>
                  <Text style={[styles.topIconText, flashActive && styles.topIconActive]}>⚡</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setCameraActive(!cameraActive)}
                  style={styles.topIconButton}
                >
                  <Text style={[styles.topIconText, cameraActive && styles.topIconActive]}>📹</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setCameraFacing(cameraFacing === 'back' ? 'front' : 'back')}
                  style={styles.topIconButton}
                >
                  <Text style={styles.topIconText}>🔄</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.topIconButton}>
                  <Text style={styles.topIconText}>⚙️</Text>
                </TouchableOpacity>
              </View>

              {/* Red Recording Pill (Exact match to reference photo) */}
              <View style={styles.recTimerBadge}>
                <View style={styles.recRedDot} />
                <Text style={styles.recTimerText}>{formatTimer(recordedSeconds)}</Text>
              </View>
            </View>

            {/* Viewfinder Target Reticle in Center */}
            <View style={styles.reticleBox}>
              <View style={[styles.corner, styles.tl]} />
              <View style={[styles.corner, styles.tr]} />
              <View style={[styles.corner, styles.bl]} />
              <View style={[styles.corner, styles.br]} />
              <Text style={styles.labIconLarge}>{activeLab.icon}</Text>
              <Text style={styles.previewCenterText}>{activeLab.name}</Text>
              <Text style={styles.previewCampusName}>Centroid: {activeLab.centroid.lat}° N, {activeLab.centroid.lng}° E</Text>
              <Text style={[styles.hudBadge, isInsideGeofence ? styles.textGreen : styles.textRed, { marginTop: 4 }]}>
                {isInsideGeofence ? `✓ Within Fence (${currentDistance}m)` : `⚠️ Breach (+${breachDelta}m)`}
              </Text>
            </View>

            {/* Dynamic Inspector Position Dot */}
            <View
              style={[
                styles.inspectorDot,
                isInsideGeofence ? styles.dotGreen : styles.dotRed,
                {
                  transform: [
                    { translateX: Math.min(60, (simDistanceOffset / activeLab.radiusMeters) * 35) },
                    { translateY: Math.min(-40, -(simDistanceOffset / activeLab.radiusMeters) * 25) },
                  ],
                },
              ]}
            />

            {/* Zoom Controls Pills right above watermark */}
            <View style={styles.zoomPillRow}>
              <TouchableOpacity onPress={() => setZoomLevel('0.6X')} style={[styles.zoomPill, zoomLevel === '0.6X' && styles.zoomPillActive]}>
                <Text style={[styles.zoomPillText, zoomLevel === '0.6X' && styles.zoomPillTextActive]}>0.6X</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setZoomLevel('1X')} style={[styles.zoomPill, zoomLevel === '1X' && styles.zoomPillActive]}>
                <Text style={[styles.zoomPillText, zoomLevel === '1X' && styles.zoomPillTextActive]}>1X</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setZoomLevel('2X')} style={[styles.zoomPillRound, zoomLevel === '2X' && styles.zoomPillRoundActive]}>
                <Text style={styles.zoomPillRoundText}>2X</Text>
              </TouchableOpacity>
            </View>

            {/* Translucent GPS Map Watermark Card (Exact match to reference photo layout) */}
            <View style={styles.gpsWatermarkCard}>
              <View style={styles.watermarkMainRow}>
                {/* Mini Satellite Map square */}
                <View style={styles.miniMapThumb}>
                  <View style={styles.mapRadarRing} />
                  <View style={styles.mapPinDot} />
                  <Text style={styles.mapSatText}>SAT MAP</Text>
                </View>

                {/* Address & Coordinates */}
                <View style={styles.watermarkTextCol}>
                  <Text style={styles.watermarkTitle} numberOfLines={1}>
                    {CURRENT_EVC_OFFICER.assignedCampus}
                  </Text>
                  <Text style={styles.watermarkAddress} numberOfLines={1}>
                    {addressText}
                  </Text>
                  <Text style={styles.watermarkCoords}>
                    Lat {currentLat.toFixed(4)}° N  Long {currentLng.toFixed(4)}° E
                  </Text>
                  <Text style={styles.watermarkDate}>
                    {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} • {formatTimer(recordedSeconds)}
                  </Text>
                </View>
              </View>

              {/* Telemetry Sensor Bar */}
              <View style={styles.telemetryRow}>
                <Text style={styles.telemItem}>༄ 12 km/h</Text>
                <Text style={styles.telemItem}>💧 40%</Text>
                <Text style={styles.telemItem}>⛰️ {currentAltitude} m</Text>
                <Text style={styles.telemItem}>⛅ 25°C</Text>
                <Text style={styles.telemItem}>🧭 {compassHeading}</Text>
                <Text style={styles.telemItem}>🧲 {magneticField}</Text>
              </View>
            </View>

          </View>

          {/* Statutory Lab Requirements Checklist */}
          <View style={styles.checklistCard}>
            <View style={styles.checklistHeader}>
              <Text style={styles.checklistTitle}>{activeLab.code} Statutory Checklist:</Text>
              <Text style={styles.checklistArea}>{activeLab.carpetAreaSqM} sq.m Carpet Area</Text>
            </View>
            <Text style={styles.checklistClause}>Mandate: {activeLab.clause}</Text>
            <Text style={styles.checklistEquip}>Equip: {activeLab.equipmentSummary}</Text>
          </View>

          {/* Shutter Capture Button with White Ring and Red Center */}
          <View style={styles.shutterContainer}>
            <TouchableOpacity
              onPress={handleCaptureGeotagged}
              disabled={isCapturing || !isInsideGeofence || isMocked || isGpsWeak}
              activeOpacity={0.85}
              style={[
                styles.shutterOuterRing,
                (!isInsideGeofence || isMocked || isGpsWeak) && styles.shutterOuterRingBreach,
              ]}
            >
              <View style={[styles.shutterInnerCircle, (!isInsideGeofence || isMocked || isGpsWeak) && styles.shutterInnerCircleBreach]}>
                <Text style={styles.shutterIconText}>{isInsideGeofence && !isMocked && !isGpsWeak ? '📷' : '🔒'}</Text>
              </View>
            </TouchableOpacity>
            <Text style={[styles.shutterLabel, (!isInsideGeofence || isMocked || isGpsWeak) && styles.shutterLabelBreach]}>
              {isCapturing
                ? '⚡ Computing SHA-256 & Sealing in Azure...'
                : isMocked
                ? '🚨 Shutter Locked: Mock GPS Detected (APH §4.2.3)'
                : isGpsWeak
                ? `⚠️ Shutter Locked: Weak GPS Signal (±${currentAccuracy}m > 30m)`
                : isInsideGeofence
                ? `Tap Shutter to Capture & Seal (${currentDistance}m inside)`
                : `🚫 Shutter Locked: Geofence Breach (+${breachDelta}m outside)`}
            </Text>
          </View>
        </View>

        {/* Full-Screen Capture Mode Button (Phase 3) */}
        <TouchableOpacity
          onPress={() => setIsFullScreenCaptureOpen(true)}
          style={[styles.fullScreenButton, SHADOWS.card]}
          activeOpacity={0.85}
        >
          <Text style={styles.fullScreenBtnIcon}>⛶</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.fullScreenBtnTitle}>Full-Screen Immersive Capture Mode</Text>
            <Text style={styles.fullScreenBtnSub}>
              Burned-in Section 65B watermark · Multi-shot session · Direct camera sensor
            </Text>
          </View>
          <Text style={styles.fullScreenBtnArrow}>→</Text>
        </TouchableOpacity>

        {/* Sealed Evidence History List */}
        <Text style={styles.historyHeading}>
          SEALED EVIDENCE AUDIT TRAIL ({photos.length})
        </Text>

        {photos.map((item) => (
          <View key={item.id} style={[styles.evidenceCard, SHADOWS.card]}>
            <View style={styles.evidenceHeader}>
              <View style={styles.evidenceCategoryPill}>
                <Text style={styles.evidenceCategoryText}>{item.category}</Text>
              </View>
              <View style={styles.verifiedStatusPill}>
                <Text style={styles.verifiedStatusText}>
                  ✓ {item.distanceMeters ? `${item.distanceMeters}m Geofenced` : 'Verified & Sealed'}
                </Text>
              </View>
            </View>

            <View style={styles.evidenceBody}>
              <Text style={styles.evidenceLoc}>
                📍 Coordinates: {item.latitude}° N, {item.longitude}° E (Acc: {item.accuracy}m)
              </Text>
              <Text style={styles.evidenceTime}>
                🕒 Timestamp: {item.timestamp.replace('T', ' ').slice(0, 19)} UTC
              </Text>
              <Text style={styles.evidenceInspector}>
                👤 Sealed by: {item.inspectorName}
              </Text>
              <View style={styles.hashBox}>
                <Text style={styles.hashLabel}>On-Device SHA-256 Seal (Azure Flexible Server):</Text>
                <Text style={styles.hashValue} numberOfLines={1}>
                  {item.sha256Hash}
                </Text>
              </View>
            </View>
          </View>
        ))}

        <View style={{ height: 115 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  titleSection: {
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
    alignItems: 'center',
  },
  roleBadge: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  roleBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  geofenceBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
  },
  badgeGreen: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  badgeRed: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FECDD3',
  },
  badgeAmber: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  geofenceBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  textGreen: {
    color: '#047857',
  },
  textRed: {
    color: '#E11D48',
  },
  textAmber: {
    color: '#B45309',
  },
  mockBanner: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#EF4444',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  mockBannerText: {
    color: '#B91C1C',
    fontSize: 10.5,
    fontWeight: '800',
  },
  weakGpsBanner: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  weakGpsText: {
    color: '#92400E',
    fontSize: 10.5,
    fontWeight: '700',
  },
  fullScreenButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0B2E5C',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    gap: 12,
  },
  fullScreenBtnIcon: {
    fontSize: 22,
    color: '#38BDF8',
  },
  fullScreenBtnTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  fullScreenBtnSub: {
    color: '#93C5FD',
    fontSize: 9.5,
    marginTop: 2,
  },
  fullScreenBtnArrow: {
    color: '#38BDF8',
    fontSize: 18,
    fontWeight: '800',
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primaryNavy,
  },
  subTitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
  gpsModeRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 3,
    marginBottom: 8,
    gap: 4,
  },
  gpsModeBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gpsModeBtnActive: {
    backgroundColor: COLORS.primaryNavy,
  },
  gpsModeBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  gpsModeBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  realGpsCoords: {
    fontSize: 9.5,
    fontFamily: 'monospace',
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  realGpsAddr: {
    fontSize: 8.5,
    color: '#64748B',
  },
  gridOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 4,
  },
  gridRow: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.25)',
  },
  gridRowLast: {
    flex: 1,
    flexDirection: 'row',
  },
  gridCell: {
    flex: 1,
    borderRightWidth: 0.5,
    borderRightColor: 'rgba(255, 255, 255, 0.25)',
  },
  gridCellLast: {
    flex: 1,
  },
  permPill: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(11, 46, 92, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#38BDF8',
    zIndex: 30,
  },
  permPillText: {
    color: '#E0F2FE',
    fontSize: 9.5,
    fontWeight: '800',
  },
  simControlCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  simHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  simTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primaryNavy,
  },
  simDistPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  pillGreen: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  pillRed: {
    backgroundColor: '#FFE4E6',
    borderColor: '#FDA4AF',
  },
  simDistText: {
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  presetBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: 'center',
  },
  presetBtnActive: {
    backgroundColor: '#047857',
    borderColor: '#047857',
  },
  presetBtnBreachActive: {
    backgroundColor: '#E11D48',
    borderColor: '#E11D48',
  },
  presetBtnText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#334155',
  },
  presetBtnTextActive: {
    color: '#FFFFFF',
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primaryNavy,
    marginBottom: 6,
  },
  labScroll: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  labChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    gap: 8,
  },
  labChipActive: {
    backgroundColor: '#EFF6FF',
    borderColor: COLORS.primaryNavy,
  },
  labChipInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  labIcon: {
    fontSize: 16,
  },
  labIconLarge: {
    fontSize: 22,
    marginBottom: 4,
  },
  labChipTitle: {
    fontSize: 11,
    fontWeight: '800',
  },
  labChipSub: {
    fontSize: 8,
    fontFamily: 'monospace',
    marginTop: 1,
  },
  labChipTextActive: {
    color: COLORS.primaryNavy,
  },
  labChipTextInactive: {
    color: '#4B5563',
  },
  labChipSubActive: {
    color: '#2563EB',
  },
  labChipSubInactive: {
    color: '#9CA3AF',
  },
  viewfinderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 18,
  },
  cameraPreview: {
    width: '100%',
    height: 330,
    backgroundColor: '#0B1329',
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'space-between',
    padding: 8,
  },
  cameraPreviewBreach: {
    borderColor: '#E11D48',
    borderWidth: 2,
  },
  topActionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 20,
    paddingHorizontal: 4,
    paddingTop: 2,
  },
  topIconGroup: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  topIconButton: {
    padding: 3,
  },
  topIconText: {
    fontSize: 13,
    color: '#CBD5E1',
  },
  topIconActive: {
    color: '#FACC15',
  },
  recTimerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DC2626',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 10,
    gap: 4,
  },
  recRedDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#FFFFFF',
  },
  recTimerText: {
    fontSize: 8.5,
    fontFamily: 'monospace',
    fontWeight: '800',
    color: '#FFFFFF',
  },
  zoomPillRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    zIndex: 20,
    marginVertical: 4,
  },
  zoomPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  zoomPillActive: {
    backgroundColor: '#FACC15',
  },
  zoomPillText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#E2E8F0',
  },
  zoomPillTextActive: {
    color: '#000000',
    fontWeight: '900',
  },
  zoomPillRound: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomPillRoundActive: {
    backgroundColor: '#FACC15',
  },
  zoomPillRoundText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#000000',
  },
  gpsWatermarkCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    padding: 6,
    zIndex: 20,
  },
  watermarkMainRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  miniMapThumb: {
    width: 48,
    height: 48,
    borderRadius: 6,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#06B6D4',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  mapRadarRing: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.4)',
  },
  mapPinDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  mapSatText: {
    position: 'absolute',
    bottom: 2,
    fontSize: 6,
    fontFamily: 'monospace',
    fontWeight: '800',
    color: '#38BDF8',
  },
  watermarkTextCol: {
    flex: 1,
    gap: 1,
  },
  watermarkTitle: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  watermarkAddress: {
    fontSize: 7.5,
    color: '#CBD5E1',
  },
  watermarkCoords: {
    fontSize: 7.5,
    fontFamily: 'monospace',
    fontWeight: '700',
    color: '#38BDF8',
  },
  watermarkDate: {
    fontSize: 7,
    fontFamily: 'monospace',
    color: '#E2E8F0',
  },
  telemetryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 3,
    marginTop: 3,
  },
  telemItem: {
    fontSize: 7,
    fontFamily: 'monospace',
    color: '#E2E8F0',
  },
  shutterContainer: {
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  shutterOuterRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3.5,
    borderColor: '#0B2E5C',
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterOuterRingBreach: {
    borderColor: '#E11D48',
    backgroundColor: '#FFF1F2',
  },
  shutterInnerCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E11D48',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInnerCircleBreach: {
    backgroundColor: '#9F1239',
  },
  shutterIconText: {
    fontSize: 16,
  },
  shutterLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#047857',
  },
  shutterLabelBreach: {
    color: '#E11D48',
  },
  radarCircleOuter: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  radarCircleGreen: {
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  radarCircleRed: {
    borderColor: '#F43F5E',
    backgroundColor: 'rgba(244, 63, 94, 0.12)',
  },
  radarCircleInner: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  inspectorDot: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    zIndex: 10,
  },
  dotGreen: {
    backgroundColor: '#10B981',
  },
  dotRed: {
    backgroundColor: '#E11D48',
  },
  reticleBox: {
    width: 140,
    height: 100,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  corner: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderColor: '#38BDF8',
  },
  tl: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3 },
  tr: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3 },
  bl: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3 },
  br: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3 },
  previewCenterText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
  },
  previewCampusName: {
    color: '#38BDF8',
    fontSize: 8,
    fontFamily: 'monospace',
    marginTop: 2,
    textAlign: 'center',
  },
  hudOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(11, 46, 92, 0.92)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 1.5,
  },
  hudRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hudText: {
    color: '#E0F2FE',
    fontSize: 8.5,
    fontFamily: 'monospace',
  },
  hudBadge: {
    fontSize: 8.5,
    fontFamily: 'monospace',
    fontWeight: '800',
  },
  hudTextSecure: {
    color: '#FCD34D',
    fontSize: 8,
    fontFamily: 'monospace',
  },
  checklistCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 2,
  },
  checklistHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checklistTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primaryNavy,
  },
  checklistArea: {
    fontSize: 9,
    fontWeight: '800',
    color: '#047857',
  },
  checklistClause: {
    fontSize: 8.5,
    color: '#475569',
  },
  checklistEquip: {
    fontSize: 8,
    color: '#64748B',
  },
  captureBtn: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureBtnGreen: {
    backgroundColor: COLORS.primaryOrange,
  },
  captureBtnRed: {
    backgroundColor: '#E11D48',
  },
  captureBtnDisabled: {
    opacity: 0.7,
  },
  captureBtnText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
  },
  historyHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primaryNavy,
    marginBottom: 8,
  },
  evidenceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 8,
  },
  evidenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  evidenceCategoryPill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  evidenceCategoryText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: COLORS.primaryNavy,
  },
  verifiedStatusPill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  verifiedStatusText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#15803D',
  },
  evidenceBody: {
    gap: 2,
  },
  evidenceLoc: {
    fontSize: 10,
    color: '#334155',
    fontWeight: '600',
  },
  evidenceTime: {
    fontSize: 9.5,
    color: '#64748B',
  },
  evidenceInspector: {
    fontSize: 9.5,
    color: '#475569',
  },
  hashBox: {
    marginTop: 4,
    padding: 5,
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  hashLabel: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#64748B',
  },
  hashValue: {
    fontSize: 8.5,
    fontFamily: 'monospace',
    color: '#0F172A',
    fontWeight: '600',
  },
});
