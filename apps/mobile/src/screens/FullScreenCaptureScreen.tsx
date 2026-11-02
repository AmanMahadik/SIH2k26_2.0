// mobile-app/src/screens/FullScreenCaptureScreen.tsx
// Phase 3: Full-Screen Immersive Geotagged Capture Screen with Burned-In Watermark

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  Dimensions,
  ScrollView,
  Modal,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Crypto from 'expo-crypto';
import * as FileSystem from 'expo-file-system';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useKeepAwake } from 'expo-keep-awake';
import * as Haptics from 'expo-haptics';
import * as NavigationBar from 'expo-navigation-bar';
import { captureRef } from 'react-native-view-shot';

import { StatutoryLab } from './FieldInspectionScreen';
import { LocationState } from '../types/location';
import { GeofenceVisualStatus } from '../components/LiveGeofenceMap';
import { CURRENT_EVC_OFFICER } from '../constants/mockData';
import { captureQueue, CaptureRecord } from '../services/captureQueue';

interface FullScreenCaptureScreenProps {
  activeLab: StatutoryLab;
  locationState: LocationState | null;
  currentLat: number;
  currentLng: number;
  currentAccuracy: number;
  currentAltitude: number;
  compassHeading: string;
  magneticField: string;
  addressText: string;
  distanceMeters: number;
  geofenceStatus: GeofenceVisualStatus;
  isMocked: boolean;
  onClose: () => void;
  onCapturesComplete?: (captures: CaptureRecord[]) => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const FullScreenCaptureScreen: React.FC<FullScreenCaptureScreenProps> = ({
  activeLab,
  locationState,
  currentLat,
  currentLng,
  currentAccuracy,
  currentAltitude,
  compassHeading,
  magneticField,
  addressText,
  distanceMeters,
  geofenceStatus,
  isMocked,
  onClose,
  onCapturesComplete,
}) => {
  // Prevent device screen from dimming/sleeping during official inspection
  useKeepAwake();

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [cameraFacing, setCameraFacing] = useState<'back' | 'front'>('back');
  const [torchEnabled, setTorchEnabled] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(0);
  const [zoomLabel, setZoomLabel] = useState<'0.6X' | '1X' | '2X'>('1X');
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Multi-shot session state
  const [sessionCaptures, setSessionCaptures] = useState<CaptureRecord[]>([]);
  const [reviewCapture, setReviewCapture] = useState<CaptureRecord | null>(null);

  // View & Camera references
  const cameraRef = useRef<CameraView | null>(null);
  const compositeRef = useRef<View | null>(null);
  const [capturedRawUri, setCapturedRawUri] = useState<string | null>(null);

  // Immersive system UI setup (Sticky Immersive Mode + Orientation unlock)
  useEffect(() => {
    async function configureImmersiveMode() {
      try {
        if (Platform.OS === 'android') {
          await NavigationBar.setVisibilityAsync('hidden');
          await NavigationBar.setBehaviorAsync('overlay-swipe');
        }
        await ScreenOrientation.unlockAsync();
      } catch (err) {
        // Safe catch
      }
    }
    configureImmersiveMode();

    return () => {
      if (Platform.OS === 'android') {
        NavigationBar.setVisibilityAsync('visible').catch(() => {});
      }
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch(() => {});
    };
  }, []);

  const isCompliant = geofenceStatus === 'INSIDE';
  const isGpsWeak = currentAccuracy > 30;

  // Zoom control handler
  const handleZoomChange = (level: '0.6X' | '1X' | '2X') => {
    setZoomLabel(level);
    if (level === '0.6X') setZoomLevel(0);
    else if (level === '1X') setZoomLevel(0.2);
    else setZoomLevel(0.5);
  };

  // Perform High-Quality Capture & Burn Watermark into final image bytes
  const handleShutterPress = async () => {
    if (isMocked) {
      Alert.alert(
        '🚨 Statutory Security Lock: Mock Location Detected',
        'AICTE APH 2024-27 §4.2.3 and Section 65B of Indian Evidence Act prohibit simulated or spoofed GPS coordinates.'
      );
      return;
    }

    if (isGpsWeak) {
      Alert.alert(
        '⚠️ Weak GPS Signal',
        `Current accuracy is ±${currentAccuracy}m (> 30m limit). Please move to an open area.`
      );
      return;
    }

    if (!isCompliant) {
      Alert.alert(
        '🚨 Geofence Breach',
        `Inspector is ${distanceMeters}m from ${activeLab.name} centroid (Fence: ${activeLab.radiusMeters}m).\n\nShutter locked to prevent recycled photo fraud.`
      );
      return;
    }

    if (!cameraRef.current) return;

    setIsProcessing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});

    try {
      // 1. Take raw high-resolution photograph
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.9,
        skipProcessing: false,
      });

      if (!photo || !photo.uri) {
        throw new Error('Camera failed to capture frame');
      }

      setCapturedRawUri(photo.uri);

      // Brief delay to allow composite view to mount with the raw photo background
      await new Promise((resolve) => setTimeout(resolve, 150));

      // 2. Burn the watermark card directly into the image using react-native-view-shot
      let finalImageUri = photo.uri;
      if (compositeRef.current) {
        try {
          finalImageUri = await captureRef(compositeRef.current, {
            format: 'jpg',
            quality: 0.92,
            result: 'tmpfile',
          });
        } catch {
          finalImageUri = photo.uri;
        }
      }

      // 3. Compute SHA-256 hash of the final image bytes (not just URI)
      const base64Bytes = await FileSystem.readAsStringAsync(finalImageUri, {
        encoding: 'base64',
      });

      const imageHash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        base64Bytes
      );

      // 4. Create immutable statutory capture record
      const captureId = `insp-${Date.now()}`;
      const record: CaptureRecord = {
        id: captureId,
        imageUri: finalImageUri,
        imageHash,
        lat: currentLat,
        lng: currentLng,
        accuracy: currentAccuracy,
        geofenceStatus: isCompliant ? 'COMPLIANT' : 'BREACH',
        distanceM: distanceMeters,
        deviceId: `DEV-${Platform.OS.toUpperCase()}-${Math.round(currentAltitude)}`,
        officerId: CURRENT_EVC_OFFICER.aictePermanentId,
        officerName: CURRENT_EVC_OFFICER.name,
        campusName: CURRENT_EVC_OFFICER.assignedCampus,
        labId: activeLab.id,
        labName: activeLab.name,
        labCode: activeLab.code,
        clause: activeLab.clause,
        address: addressText,
        capturedAt: new Date().toISOString(),
        appVersion: '2.0.0-PROD',
        syncStatus: 'PENDING',
        retryCount: 0,
      };

      // 5. Persist to local offline-first SQLite queue
      await captureQueue.enqueueCapture(record);

      setSessionCaptures((prev) => [record, ...prev]);
      setCapturedRawUri(null);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } catch (err: any) {
      Alert.alert('Capture Failed', err.message || 'Error capturing geotagged proof');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinishSession = () => {
    if (onCapturesComplete) {
      onCapturesComplete(sessionCaptures);
    }
    onClose();
  };

  const handleRetakePhoto = (id: string) => {
    setSessionCaptures((prev) => prev.filter((c) => c.id !== id));
    setReviewCapture(null);
  };

  return (
    <View style={styles.fullscreenContainer}>
      <StatusBar hidden />

      {/* Main Full-Viewport Camera */}
      {cameraPermission?.granted ? (
        <CameraView
          ref={cameraRef}
          facing={cameraFacing}
          enableTorch={torchEnabled}
          zoom={zoomLevel}
          style={StyleSheet.absoluteFillObject}
        />
      ) : (
        <View style={styles.permissionFallback}>
          <Text style={styles.permissionText}>Camera permission required</Text>
          <TouchableOpacity onPress={requestCameraPermission} style={styles.permButton}>
            <Text style={styles.permButtonText}>Grant Camera Access</Text>
          </TouchableOpacity>
        </View>
      )}

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

      {/* Top Floating HUD Controls */}
      <View style={styles.topHud}>
        {/* Close Button */}
        <TouchableOpacity style={styles.iconCircle} onPress={onClose} activeOpacity={0.8}>
          <Text style={styles.iconCircleText}>✕</Text>
        </TouchableOpacity>

        {/* Persistent Statutory Geofence Status Chip */}
        <View
          style={[
            styles.geofenceChip,
            isCompliant
              ? styles.chipGreen
              : geofenceStatus === 'OUTSIDE'
              ? styles.chipRed
              : styles.chipAmber,
          ]}
        >
          <Text
            style={[
              styles.geofenceChipText,
              isCompliant
                ? styles.textGreen
                : geofenceStatus === 'OUTSIDE'
                ? styles.textRed
                : styles.textAmber,
            ]}
          >
            {isCompliant
              ? `🟢 ✓ INSIDE PERIMETER · ${distanceMeters}m`
              : geofenceStatus === 'OUTSIDE'
              ? `🔴 ✕ OUTSIDE · +${Math.max(0, distanceMeters - activeLab.radiusMeters)}m BREACH`
              : `🟡 ⚠️ UNCERTAIN · ±${currentAccuracy}m FIX`}
          </Text>
        </View>

        {/* Top Actions: Grid, Flash, Flip */}
        <View style={styles.topRightActions}>
          <TouchableOpacity
            style={[styles.iconCircle, showGrid && styles.iconActive]}
            onPress={() => setShowGrid(!showGrid)}
          >
            <Text style={styles.iconCircleText}>⊞</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconCircle, torchEnabled && styles.iconActive]}
            onPress={() => setTorchEnabled(!torchEnabled)}
          >
            <Text style={styles.iconCircleText}>⚡</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconCircle}
            onPress={() => setCameraFacing(cameraFacing === 'back' ? 'front' : 'back')}
          >
            <Text style={styles.iconCircleText}>🔄</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Zoom Pills */}
      <View style={styles.zoomRow}>
        {(['0.6X', '1X', '2X'] as const).map((z) => (
          <TouchableOpacity
            key={z}
            onPress={() => handleZoomChange(z)}
            style={[styles.zoomPill, zoomLabel === z && styles.zoomPillActive]}
          >
            <Text style={[styles.zoomPillText, zoomLabel === z && styles.zoomPillTextActive]}>
              {z}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bottom Live Watermark Card Overlay */}
      <View style={styles.bottomWatermarkCard}>
        <View style={styles.watermarkRow}>
          <View style={styles.satThumbSquare}>
            <View style={styles.satRadarDot} />
            <Text style={styles.satLabel}>SAT</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.wmCampusTitle} numberOfLines={1}>
              {CURRENT_EVC_OFFICER.assignedCampus}
            </Text>
            <Text style={styles.wmLabTitle} numberOfLines={1}>
              {activeLab.name} ({activeLab.code})
            </Text>
            <Text style={styles.wmCoordsText}>
              Lat {currentLat.toFixed(5)}° N · Long {currentLng.toFixed(5)}° E (±{currentAccuracy}m)
            </Text>
            <Text style={styles.wmAddressText} numberOfLines={1}>
              📍 {addressText}
            </Text>
          </View>
        </View>
        <View style={styles.wmTelemetryBar}>
          <Text style={styles.wmTelemItem}>⛰️ {currentAltitude} m</Text>
          <Text style={styles.wmTelemItem}>🧭 {compassHeading}</Text>
          <Text style={styles.wmTelemItem}>🧲 {magneticField}</Text>
          <Text style={styles.wmTelemItem}>⚖️ Sec 65B</Text>
        </View>
      </View>

      {/* Multi-Shot Thumbnail Strip & Shutter Action Bar */}
      <View style={styles.bottomControlBar}>
        {/* Thumbnail Preview / Session Counter */}
        {sessionCaptures.length > 0 ? (
          <TouchableOpacity
            style={styles.thumbnailButton}
            onPress={() => setReviewCapture(sessionCaptures[0])}
            activeOpacity={0.8}
          >
            <Image source={{ uri: sessionCaptures[0].imageUri }} style={styles.thumbnailImg} />
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{sessionCaptures.length}</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.thumbnailPlaceholder} />
        )}

        {/* Large Shutter Button */}
        <TouchableOpacity
          onPress={handleShutterPress}
          disabled={isProcessing || !isCompliant || isMocked || isGpsWeak}
          activeOpacity={0.85}
          style={[
            styles.shutterRing,
            (!isCompliant || isMocked || isGpsWeak) && styles.shutterRingDisabled,
          ]}
        >
          <View
            style={[
              styles.shutterCenter,
              (!isCompliant || isMocked || isGpsWeak) && styles.shutterCenterDisabled,
            ]}
          >
            {isProcessing ? (
              <Text style={styles.shutterIcon}>⏳</Text>
            ) : (
              <Text style={styles.shutterIcon}>
                {isCompliant && !isMocked && !isGpsWeak ? '📷' : '🔒'}
              </Text>
            )}
          </View>
        </TouchableOpacity>

        {/* Finish / Done Button */}
        {sessionCaptures.length > 0 ? (
          <TouchableOpacity
            style={styles.doneButton}
            onPress={handleFinishSession}
            activeOpacity={0.8}
          >
            <Text style={styles.doneButtonText}>Done ({sessionCaptures.length})</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.thumbnailPlaceholder} />
        )}
      </View>

      {/* Hidden Offscreen Composite Container for Burning Watermark */}
      {capturedRawUri && (
        <View
          ref={compositeRef}
          collapsable={false}
          style={styles.hiddenCompositeContainer}
        >
          <Image source={{ uri: capturedRawUri }} style={StyleSheet.absoluteFillObject} />
          {/* Burned Watermark Overlay */}
          <View style={styles.burnedWatermarkOverlay}>
            <View style={styles.burnedRow}>
              <View style={styles.satThumbSquare}>
                <View style={styles.satRadarDot} />
                <Text style={styles.satLabel}>SAT</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.burnedCampusText}>{CURRENT_EVC_OFFICER.assignedCampus}</Text>
                <Text style={styles.burnedLabText}>
                  {activeLab.name} · {activeLab.code}
                </Text>
                <Text style={styles.burnedCoordsText}>
                  Lat {currentLat.toFixed(6)}° N · Long {currentLng.toFixed(6)}° E (±{currentAccuracy}m)
                </Text>
                <Text style={styles.burnedAddressText} numberOfLines={2}>
                  {addressText}
                </Text>
                <Text style={styles.burnedMetaText}>
                  Inspector: {CURRENT_EVC_OFFICER.name} ({CURRENT_EVC_OFFICER.aictePermanentId})
                </Text>
                <Text style={styles.burnedTimeText}>
                  {new Date().toISOString()} · Section 65B Certified
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Multi-Shot Review Modal */}
      <Modal visible={Boolean(reviewCapture)} transparent animationType="slide">
        <View style={styles.reviewModalContainer}>
          <View style={styles.reviewHeader}>
            <Text style={styles.reviewTitle}>Evidence Review &amp; Hash Verification</Text>
            <TouchableOpacity onPress={() => setReviewCapture(null)} style={styles.closeReviewBtn}>
              <Text style={styles.closeReviewText}>✕</Text>
            </TouchableOpacity>
          </View>

          {reviewCapture && (
            <View style={styles.reviewContent}>
              <Image source={{ uri: reviewCapture.imageUri }} style={styles.reviewImage} />
              <View style={styles.reviewDetails}>
                <Text style={styles.reviewLabName}>{reviewCapture.labName}</Text>
                <Text style={styles.reviewCoords}>
                  GPS: {reviewCapture.lat.toFixed(5)}°, {reviewCapture.lng.toFixed(5)}° · {reviewCapture.distanceM}m
                </Text>
                <View style={styles.hashBadge}>
                  <Text style={styles.hashLabel}>SHA-256 Digest:</Text>
                  <Text style={styles.hashValue} numberOfLines={1}>
                    {reviewCapture.imageHash}
                  </Text>
                </View>
                <View style={styles.reviewActions}>
                  <TouchableOpacity
                    style={styles.retakeBtn}
                    onPress={() => handleRetakePhoto(reviewCapture.id)}
                  >
                    <Text style={styles.retakeBtnText}>🗑️ Retake</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.confirmBtn}
                    onPress={() => setReviewCapture(null)}
                  >
                    <Text style={styles.confirmBtnText}>✓ Keep Photo</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#000000',
    position: 'relative',
  },
  permissionFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
  },
  permissionText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 16,
  },
  permButton: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  permButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
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
  topHud: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 44 : 20,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 20,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  iconActive: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  geofenceChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
  },
  chipGreen: {
    borderColor: '#10B981',
  },
  chipRed: {
    borderColor: '#EF4444',
  },
  chipAmber: {
    borderColor: '#F59E0B',
  },
  geofenceChipText: {
    fontSize: 11,
    fontWeight: '800',
  },
  textGreen: {
    color: '#10B981',
  },
  textRed: {
    color: '#EF4444',
  },
  textAmber: {
    color: '#F59E0B',
  },
  topRightActions: {
    flexDirection: 'row',
    gap: 8,
  },
  zoomRow: {
    position: 'absolute',
    bottom: 190,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    zIndex: 20,
  },
  zoomPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  zoomPillActive: {
    backgroundColor: '#F59E0B',
  },
  zoomPillText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '700',
  },
  zoomPillTextActive: {
    color: '#000000',
    fontWeight: '900',
  },
  bottomWatermarkCard: {
    position: 'absolute',
    bottom: 95,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(11, 46, 92, 0.88)',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 20,
  },
  watermarkRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  satThumbSquare: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#38BDF8',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  satRadarDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  satLabel: {
    position: 'absolute',
    bottom: 2,
    fontSize: 7,
    fontWeight: '900',
    color: '#38BDF8',
  },
  wmCampusTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  wmLabTitle: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
  },
  wmCoordsText: {
    color: '#E2E8F0',
    fontSize: 10,
    fontFamily: 'monospace',
    marginTop: 1,
  },
  wmAddressText: {
    color: '#94A3B8',
    fontSize: 9.5,
  },
  wmTelemetryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  wmTelemItem: {
    color: '#F8FAFC',
    fontSize: 9,
    fontFamily: 'monospace',
  },
  bottomControlBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 20,
  },
  shutterRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  shutterRingDisabled: {
    borderColor: '#EF4444',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  shutterCenter: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterCenterDisabled: {
    backgroundColor: '#EF4444',
  },
  shutterIcon: {
    fontSize: 24,
  },
  thumbnailButton: {
    width: 52,
    height: 52,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnailImg: {
    width: '100%',
    height: '100%',
  },
  countBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#0284C7',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  countBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  thumbnailPlaceholder: {
    width: 52,
  },
  doneButton: {
    backgroundColor: '#059669',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#34D399',
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  hiddenCompositeContainer: {
    position: 'absolute',
    left: -9999,
    top: -9999,
    width: 1080,
    height: 1440,
  },
  burnedWatermarkOverlay: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: 'rgba(11, 46, 92, 0.92)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#38BDF8',
  },
  burnedRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  burnedCampusText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
  },
  burnedLabText: {
    color: '#38BDF8',
    fontSize: 18,
    fontWeight: '800',
  },
  burnedCoordsText: {
    color: '#F8FAFC',
    fontSize: 16,
    fontFamily: 'monospace',
    marginTop: 4,
  },
  burnedAddressText: {
    color: '#CBD5E1',
    fontSize: 14,
    marginTop: 2,
  },
  burnedMetaText: {
    color: '#FCD34D',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  burnedTimeText: {
    color: '#94A3B8',
    fontSize: 13,
    fontFamily: 'monospace',
    marginTop: 2,
  },
  reviewModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.92)',
    padding: 20,
    justifyContent: 'center',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  reviewTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  closeReviewBtn: {
    padding: 8,
  },
  closeReviewText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  reviewContent: {
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
  },
  reviewImage: {
    width: '100%',
    height: 380,
    resizeMode: 'contain',
  },
  reviewDetails: {
    padding: 16,
  },
  reviewLabName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  reviewCoords: {
    color: '#38BDF8',
    fontSize: 12,
    fontFamily: 'monospace',
    marginTop: 2,
  },
  hashBadge: {
    backgroundColor: '#1E293B',
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#475569',
  },
  hashLabel: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
  },
  hashValue: {
    color: '#10B981',
    fontSize: 10,
    fontFamily: 'monospace',
    marginTop: 2,
  },
  reviewActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  retakeBtn: {
    flex: 1,
    backgroundColor: '#EF4444',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  retakeBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: '#10B981',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
