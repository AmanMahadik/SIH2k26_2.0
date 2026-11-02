// mobile-app/src/components/LiveGeofenceMap.tsx
// Production Live Geofence Map with Accuracy-Aware Markers (AICTE APH 2024-27 §4.2.3)

import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
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
  height = 180,
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

  // Smoothly center the map when coordinates update
  useEffect(() => {
    if (mapRef.current && Platform.OS !== 'web') {
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
  }, [userLat, userLng, labCentroid]);

  // Fallback for Web preview
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, { height }]}>
        <View style={styles.webFallbackContainer}>
          <View
            style={[
              styles.webRadarRing,
              {
                borderColor: geofenceColor.stroke,
                backgroundColor: geofenceColor.fill,
              },
            ]}
          >
            {/* Lab Centroid Dot */}
            <View style={styles.webCentroidDot} />
            {/* User Location Dot */}
            <View
              style={[
                styles.webUserDot,
                {
                  backgroundColor: userMarkerColor,
                  transform: [
                    { translateX: Math.min(45, (distanceMeters / labRadiusMeters) * 25) },
                    { translateY: Math.min(-30, -(distanceMeters / labRadiusMeters) * 15) },
                  ],
                },
              ]}
            />
          </View>
          <View style={styles.webInfoRow}>
            <Text style={styles.webInfoText}>
              📍 Centroid: {labCentroid.lat.toFixed(5)}°, {labCentroid.lng.toFixed(5)}°
            </Text>
            <Text style={[styles.webStatusText, { color: geofenceColor.stroke }]}>
              {status === 'INSIDE'
                ? `✓ Inside (${distanceMeters}m)`
                : status === 'OUTSIDE'
                ? `✕ Outside (+${Math.max(0, distanceMeters - labRadiusMeters)}m)`
                : `⚠️ Uncertain (±${accuracy}m)`}
            </Text>
          </View>
        </View>
      </View>
    );
  }

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
    backgroundColor: '#F1F5F9',
    position: 'relative',
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
    paddingVertical: 4,
    alignItems: 'center',
  },
  mockWarningText: {
    color: '#FFFFFF',
    fontSize: 11,
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
  webFallbackContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  webRadarRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  webCentroidDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#38BDF8',
  },
  webUserDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  webInfoRow: {
    marginTop: 8,
    alignItems: 'center',
  },
  webInfoText: {
    color: '#94A3B8',
    fontSize: 10,
  },
  webStatusText: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
});
