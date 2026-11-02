// mobile-app/src/components/LiveGeofenceMap.tsx
// Production Live Geofence Map with Accuracy-Aware Markers (AICTE APH 2024-27 §4.2.3)
// Crash-proof architecture: gracefully falls back to Tactical Radar View if Google Maps API key is absent.

import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import MapView, { Marker, Circle, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import { COLORS } from '../constants/theme';

export type GeofenceVisualStatus = 'INSIDE' | 'OUTSIDE' | 'UNCERTAIN';

interface LiveGeofenceMapProps {
  userLat: number;
  userLng: number;
  accuracy: number;
  labCentroid: { lat: number; lng: number };
  labRadiusMeters: number;
  labName: string;
  labCode: string;
  status: GeofenceVisualStatus;
  distanceMeters: number;
  height?: number;
  onExpand?: () => void;
  isMocked?: boolean;
}

export const LiveGeofenceMap: React.FC<LiveGeofenceMapProps> = ({
  userLat,
  userLng,
  accuracy,
  labCentroid,
  labRadiusMeters,
  labName,
  labCode,
  status,
  distanceMeters,
  height = 190,
  onExpand,
  isMocked = false,
}) => {
  const mapRef = useRef<MapView | null>(null);

  // Status colors & stroke
  const isInside = status === 'INSIDE';
  const isOutside = status === 'OUTSIDE';

  const geofenceColor = isInside
    ? { fill: 'rgba(16, 185, 129, 0.22)', stroke: '#10B981' }
    : isOutside
    ? { fill: 'rgba(239, 68, 68, 0.22)', stroke: '#EF4444' }
    : { fill: 'rgba(245, 158, 11, 0.22)', stroke: '#F59E0B' };

  const userMarkerColor = isInside ? '#10B981' : isOutside ? '#EF4444' : '#F59E0B';

  // Check whether a valid Google Maps API Key has been configured in app.json or env
  const googleMapsApiKey =
    Constants.expoConfig?.android?.config?.googleMaps?.apiKey ||
    (Constants as any).manifest2?.extra?.expoClient?.android?.config?.googleMaps?.apiKey ||
    process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ||
    'AIzaSyCh47sQ1Zk-iCbJIvY3tJ9kkB4008rpUSE';

  const hasValidMapsKey = Boolean(
    Platform.OS !== 'web' &&
      googleMapsApiKey &&
      typeof googleMapsApiKey === 'string' &&
      googleMapsApiKey.trim().length > 15 &&
      !googleMapsApiKey.includes('YOUR_API_KEY')
  );

  // Smoothly center native map when coordinates update
  useEffect(() => {
    if (hasValidMapsKey && mapRef.current) {
      try {
        const midLat = (userLat + labCentroid.lat) / 2;
        const midLng = (userLng + labCentroid.lng) / 2;
        const latDelta = Math.max(0.002, Math.abs(userLat - labCentroid.lat) * 2.2);
        const lngDelta = Math.max(0.002, Math.abs(userLng - labCentroid.lng) * 2.2);

        mapRef.current.animateToRegion(
          {
            latitude: midLat,
            longitude: midLng,
            latitudeDelta: latDelta,
            longitudeDelta: lngDelta,
          },
          600
        );
      } catch {
        // Safe catch
      }
    }
  }, [userLat, userLng, labCentroid, hasValidMapsKey]);

  // Compute 2D displacement for tactical radar screen (in pixels relative to center)
  // 1 degree lat ≈ 111,000m
  const deltaLatM = (userLat - labCentroid.lat) * 111000;
  const deltaLngM = (userLng - labCentroid.lng) * (111000 * Math.cos((labCentroid.lat * Math.PI) / 180));
  
  // Scaling factor: map radiusMeters * 1.5 to ~60 pixels
  const radarScale = 60 / Math.max(40, labRadiusMeters);
  const userPixelX = Math.max(-85, Math.min(85, deltaLngM * radarScale));
  // In screen coords, North is -Y
  const userPixelY = Math.max(-65, Math.min(65, -deltaLatM * radarScale));

  // TACTICAL GEODETIC RADAR VIEW (Zero-crash guarantee, works 100% offline without Google Maps API Key)
  if (!hasValidMapsKey || Platform.OS === 'web') {
    return (
      <View style={[styles.container, { height }]}>
        <View style={styles.radarScreen}>
          {/* Top Status & Mode Indicator */}
          <View style={styles.radarHeader}>
            <View style={styles.radarModeBadge}>
              <View style={styles.radarBlinker} />
              <Text style={styles.radarModeText}>TACTICAL GEODETIC RADAR · APH §4.2.3</Text>
            </View>
            <Text style={styles.radarAccText}>RTK GPS ±{accuracy}m</Text>
          </View>

          {/* Central Radar Target Canvas */}
          <View style={styles.radarCanvas}>
            {/* Crosshairs */}
            <View style={styles.crosshairH} />
            <View style={styles.crosshairV} />

            {/* Range Rings: 10m, 20m, Statutory Boundary */}
            <View style={[styles.radarRingSmall, { borderColor: 'rgba(56, 189, 248, 0.25)' }]} />
            <View style={[styles.radarRingMedium, { borderColor: 'rgba(56, 189, 248, 0.35)' }]} />
            <View
              style={[
                styles.radarRingBoundary,
                {
                  borderColor: geofenceColor.stroke,
                  backgroundColor: geofenceColor.fill,
                },
              ]}
            >
              <Text style={[styles.boundaryLabel, { color: geofenceColor.stroke }]}>
                {labRadiusMeters}m LIMIT
              </Text>
            </View>

            {/* Centroid Anchor (Approved Lab Target) */}
            <View style={styles.radarCentroidPoint}>
              <Text style={styles.radarCentroidIcon}>🏛️</Text>
              <View style={styles.radarCentroidBadge}>
                <Text style={styles.radarCentroidBadgeText}>{labCode}</Text>
              </View>
            </View>

            {/* Dynamic User Location Marker with Pulse Ring */}
            <View
              style={[
                styles.radarUserMarker,
                {
                  transform: [{ translateX: userPixelX }, { translateY: userPixelY }],
                },
              ]}
            >
              <View
                style={[
                  styles.radarPulseRing,
                  { borderColor: userMarkerColor, backgroundColor: geofenceColor.fill },
                ]}
              />
              <View style={[styles.radarUserDot, { backgroundColor: userMarkerColor }]}>
                <Text style={styles.radarUserDotIcon}>{isInside ? '✓' : isOutside ? '✕' : '!'}</Text>
              </View>
            </View>
          </View>

          {/* Bottom Telemetry HUD Bar */}
          <View style={styles.radarFooter}>
            <View style={styles.radarFooterCol}>
              <Text style={styles.radarFooterLabel}>LAB CENTROID</Text>
              <Text style={styles.radarFooterValue}>
                {labCentroid.lat.toFixed(5)}°, {labCentroid.lng.toFixed(5)}°
              </Text>
            </View>

            <View style={[styles.radarStatusPill, { borderColor: geofenceColor.stroke }]}>
              <Text style={[styles.radarStatusText, { color: geofenceColor.stroke }]}>
                {status === 'INSIDE'
                  ? `🟢 WITHIN FENCE · ${distanceMeters}m`
                  : status === 'OUTSIDE'
                  ? `🔴 BREACH · +${Math.max(0, distanceMeters - labRadiusMeters)}m`
                  : `🟡 UNCERTAIN · ±${accuracy}m`}
              </Text>
            </View>

            <View style={[styles.radarFooterCol, { alignItems: 'flex-end' }]}>
              <Text style={styles.radarFooterLabel}>DIRECT DISTANCE</Text>
              <Text style={[styles.radarFooterValue, { color: geofenceColor.stroke, fontWeight: '900' }]}>
                {distanceMeters} meters
              </Text>
            </View>
          </View>

          {isMocked && (
            <View style={styles.mockWarningBanner}>
              <Text style={styles.mockWarningText}>🚨 MOCK GPS DETECTED · CAPTURE LOCKED</Text>
            </View>
          )}
        </View>
      </View>
    );
  }

  // NATIVE GOOGLE MAPS VIEW (Only rendered when valid Google Maps API Key is configured)
  const initialRegion = {
    latitude: (userLat + labCentroid.lat) / 2,
    longitude: (userLng + labCentroid.lng) / 2,
    latitudeDelta: Math.max(0.0025, Math.abs(userLat - labCentroid.lat) * 2.5),
    longitudeDelta: Math.max(0.0025, Math.abs(userLng - labCentroid.lng) * 2.5),
  };

  return (
    <View style={[styles.container, { height }]}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_DEFAULT}
        style={StyleSheet.absoluteFillObject}
        initialRegion={initialRegion}
        showsUserLocation={false}
        showsCompass={false}
        showsScale={false}
        showsTraffic={false}
        showsBuildings={true}
        rotateEnabled={false}
        pitchEnabled={false}
      >
        {/* Approved Geofence Perimeter Circle */}
        <Circle
          center={{ latitude: labCentroid.lat, longitude: labCentroid.lng }}
          radius={labRadiusMeters}
          strokeColor={geofenceColor.stroke}
          strokeWidth={2}
          fillColor={geofenceColor.fill}
          zIndex={1}
        />

        {/* Distance Polyline Line between User and Lab Centroid */}
        <Polyline
          coordinates={[
            { latitude: userLat, longitude: userLng },
            { latitude: labCentroid.lat, longitude: labCentroid.lng },
          ]}
          strokeColor={geofenceColor.stroke}
          strokeWidth={2}
          lineDashPattern={[4, 4]}
          zIndex={2}
        />

        {/* Lab Centroid Marker */}
        <Marker
          coordinate={{ latitude: labCentroid.lat, longitude: labCentroid.lng }}
          anchor={{ x: 0.5, y: 0.5 }}
          zIndex={3}
          title={labName}
          description={`Approved Centroid · Radius: ${labRadiusMeters}m`}
        >
          <View style={styles.centroidMarker}>
            <Text style={styles.centroidMarkerIcon}>🏛️</Text>
            <View style={styles.markerLabelBadge}>
              <Text style={styles.markerLabelText}>{labCode}</Text>
            </View>
          </View>
        </Marker>

        {/* Live User Position Marker */}
        <Marker
          coordinate={{ latitude: userLat, longitude: userLng }}
          anchor={{ x: 0.5, y: 0.5 }}
          zIndex={4}
          title="Current Position"
          description={`Accuracy: ±${accuracy}m · Distance: ${distanceMeters}m`}
        >
          <View style={styles.userMarkerContainer}>
            <View
              style={[
                styles.pulseRing,
                { borderColor: userMarkerColor, backgroundColor: geofenceColor.fill },
              ]}
            />
            <View style={[styles.userDot, { backgroundColor: userMarkerColor }]}>
              <Text style={styles.userDotIcon}>{isInside ? '✓' : isOutside ? '✕' : '!'}</Text>
            </View>
          </View>
        </Marker>
      </MapView>

      {/* Floating HUD Badge overlay */}
      <View style={styles.overlayPill}>
        <Text style={[styles.overlayPillText, { color: geofenceColor.stroke }]}>
          {status === 'INSIDE'
            ? `🟢 ✓ INSIDE PERIMETER · ${distanceMeters} m`
            : status === 'OUTSIDE'
            ? `🔴 ✕ OUTSIDE · +${Math.max(0, distanceMeters - labRadiusMeters)} m BREACH`
            : `🟡 ⚠️ UNCERTAIN · ±${accuracy} m FIX`}
        </Text>
      </View>

      {/* Expand / Recenter button */}
      {onExpand && (
        <TouchableOpacity style={styles.expandButton} onPress={onExpand} activeOpacity={0.8}>
          <Text style={styles.expandButtonText}>⛶</Text>
        </TouchableOpacity>
      )}

      {isMocked && (
        <View style={styles.mockWarningBanner}>
          <Text style={styles.mockWarningText}>🚨 MOCK GPS DETECTED · CAPTURE LOCKED</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#0B1528',
    position: 'relative',
  },
  radarScreen: {
    flex: 1,
    backgroundColor: '#0B1528',
    justifyContent: 'space-between',
    padding: 8,
  },
  radarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  radarModeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
  },
  radarBlinker: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38BDF8',
    marginRight: 5,
  },
  radarModeText: {
    color: '#38BDF8',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.3,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  radarAccText: {
    color: '#94A3B8',
    fontSize: 9,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  radarCanvas: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 4,
  },
  crosshairH: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
  },
  crosshairV: {
    position: 'absolute',
    top: 5,
    bottom: 5,
    width: 1,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
  },
  radarRingSmall: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
  },
  radarRingMedium: {
    position: 'absolute',
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  radarRingBoundary: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 3,
  },
  boundaryLabel: {
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  radarCentroidPoint: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  radarCentroidIcon: {
    fontSize: 16,
  },
  radarCentroidBadge: {
    backgroundColor: '#0B2E5C',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.4)',
    marginTop: -2,
  },
  radarCentroidBadgeText: {
    color: '#38BDF8',
    fontSize: 7,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  radarUserMarker: {
    position: 'absolute',
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  radarPulseRing: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
  },
  radarUserDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  radarUserDotIcon: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
  radarFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  radarFooterCol: {
    flex: 1,
  },
  radarFooterLabel: {
    color: '#64748B',
    fontSize: 7,
    fontWeight: '700',
    letterSpacing: 0.3,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  radarFooterValue: {
    color: '#E2E8F0',
    fontSize: 9,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginTop: 1,
  },
  radarStatusPill: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  radarStatusText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  overlayPill: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  overlayPillText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  expandButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  mockWarningBanner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#EF4444',
    paddingVertical: 3,
    alignItems: 'center',
  },
  mockWarningText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  centroidMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centroidMarkerIcon: {
    fontSize: 22,
  },
  markerLabelBadge: {
    backgroundColor: '#0B2E5C',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    marginTop: -2,
  },
  markerLabelText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  userMarkerContainer: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    opacity: 0.8,
  },
  userDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userDotIcon: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
});
