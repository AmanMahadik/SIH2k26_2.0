// mobile-app/src/components/LocationPermissionExplainer.tsx
// Full-Screen Explainer for AICTE Statutory Location Requirements (APH §4.2.3)

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LocationPermissionState } from '../types/location';
import { COLORS, SHADOWS } from '../constants/theme';

interface LocationPermissionExplainerProps {
  permissionState: LocationPermissionState;
  onRequestPermission: () => void;
  onOpenSettings: () => void;
  onEnableServices: () => void;
}

export const LocationPermissionExplainer: React.FC<LocationPermissionExplainerProps> = ({
  permissionState,
  onRequestPermission,
  onOpenSettings,
  onEnableServices,
}) => {
  const isServicesDisabled = permissionState === 'SERVICES_DISABLED';
  const isPermanentDenied = permissionState === 'DENIED';

  return (
    <View style={styles.container}>
      <View style={[styles.card, SHADOWS.card]}>
        {/* Government Emblem Container */}
        <View style={styles.emblemWrapper}>
          <Image
            source={require('../../assets/nirikshai_emblem.png')}
            style={styles.emblem}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.badgeText}>AICTE EVC REGULATORY SCRUTINY</Text>
        <Text style={styles.title}>Statutory Location Access Required</Text>
        <Text style={styles.clauseRef}>Mandate: APH 2024–27 §4.2.3 &amp; RPwD Act 2016</Text>

        <View style={styles.divider} />

        <Text style={styles.description}>
          Expert Visit Committee (EVC) field scrutiny requires real-time, hardware-attested
          GPS coordinates to calculate physical laboratory perimeters.
        </Text>

        <View style={styles.statutoryBox}>
          <Text style={styles.statutoryBullet}>
            ⚖️ <Text style={styles.statutoryBold}>Statutory Non-Repudiation:</Text> Eliminates
            recycled and off-campus fraudulent photographs under Section 65B of the Indian Evidence Act.
          </Text>
          <Text style={[styles.statutoryBullet, { marginTop: 8 }]}>
            🎯 <Text style={styles.statutoryBold}>On-Device Geofencing:</Text> Enforces physical
            proximity boundaries before allowing evidence capture.
          </Text>
        </View>

        {/* Dynamic Context Status */}
        {isServicesDisabled ? (
          <View style={styles.alertBoxWarning}>
            <Text style={styles.alertTextWarning}>
              ⚠️ <Text style={{ fontWeight: 'bold' }}>Device GPS is turned OFF:</Text> Please enable
              high-accuracy Location Services in your phone settings to proceed.
            </Text>
          </View>
        ) : isPermanentDenied ? (
          <View style={styles.alertBoxError}>
            <Text style={styles.alertTextError}>
              🔒 <Text style={{ fontWeight: 'bold' }}>Permission Denied in Settings:</Text> To enable
              inspection capture, allow Location permission in App Info.
            </Text>
          </View>
        ) : (
          <View style={styles.alertBoxInfo}>
            <Text style={styles.alertTextInfo}>
              📡 Tap below to grant high-accuracy GPS permission.
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actions}>
          {isServicesDisabled ? (
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: '#B45309' }]}
              activeOpacity={0.8}
              onPress={onEnableServices}
            >
              <Text style={styles.primaryButtonText}>Enable Location Services ⚙️</Text>
            </TouchableOpacity>
          ) : isPermanentDenied ? (
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: '#0B2E5C' }]}
              activeOpacity={0.8}
              onPress={onOpenSettings}
            >
              <Text style={styles.primaryButtonText}>Open Device Settings ↗</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: '#0B2E5C' }]}
              activeOpacity={0.8}
              onPress={onRequestPermission}
            >
              <Text style={styles.primaryButtonText}>Grant Location Permission 📡</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.7}
            onPress={onRequestPermission}
          >
            <Text style={styles.secondaryButtonText}>🔄 Re-check Permission Status</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
  },
  emblemWrapper: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  emblem: {
    width: 52,
    height: 52,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'monospace',
    fontWeight: '800',
    color: '#8B1A1A',
    letterSpacing: 1.1,
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0B2E5C',
    textAlign: 'center',
    marginBottom: 4,
  },
  clauseRef: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#E2E8F0',
    marginBottom: 14,
  },
  description: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 19,
    textAlign: 'center',
    marginBottom: 14,
  },
  statutoryBox: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 12,
    width: '100%',
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#0B2E5C',
  },
  statutoryBullet: {
    fontSize: 11,
    color: '#1E293B',
    lineHeight: 16,
  },
  statutoryBold: {
    fontWeight: '700',
    color: '#0B2E5C',
  },
  alertBoxWarning: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FCD34D',
    borderRadius: 8,
    padding: 10,
    width: '100%',
    marginBottom: 16,
  },
  alertTextWarning: {
    fontSize: 11,
    color: '#92400E',
    lineHeight: 16,
  },
  alertBoxError: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 8,
    padding: 10,
    width: '100%',
    marginBottom: 16,
  },
  alertTextError: {
    fontSize: 11,
    color: '#991B1B',
    lineHeight: 16,
  },
  alertBoxInfo: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 8,
    padding: 10,
    width: '100%',
    marginBottom: 16,
  },
  alertTextInfo: {
    fontSize: 11,
    color: '#1E40AF',
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    gap: 10,
  },
  primaryButton: {
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  secondaryButton: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  secondaryButtonText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '700',
  },
});
