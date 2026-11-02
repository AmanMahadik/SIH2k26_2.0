// apps/mobile/src/components/LocationPermissionExplainer.tsx
// Full-Screen Explainer for AICTE Statutory Location Requirements (APH §4.2.3)
// Features Zero-Lockout Dismiss & Web/Mobile Campus Centroid Fallback

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { LocationPermissionState } from '../types/location';
import { COLORS, SHADOWS } from '../constants/theme';

interface LocationPermissionExplainerProps {
  permissionState: LocationPermissionState;
  onRequestPermission: () => void | Promise<void>;
  onOpenSettings: () => void;
  onEnableServices: () => void;
  onDismiss?: () => void;
  onContinueFallback?: () => void;
}

export const LocationPermissionExplainer: React.FC<LocationPermissionExplainerProps> = ({
  permissionState,
  onRequestPermission,
  onOpenSettings,
  onEnableServices,
  onDismiss,
  onContinueFallback,
}) => {
  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const isServicesDisabled = permissionState === 'SERVICES_DISABLED';
  const isPermanentDenied = permissionState === 'DENIED';

  const handleGrant = async () => {
    setIsRequesting(true);
    try {
      await onRequestPermission();
    } finally {
      setIsRequesting(false);
    }
  };

  const handleFallback = () => {
    if (onContinueFallback) {
      onContinueFallback();
    } else if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.card, SHADOWS.card]}>
        {/* Top Dismiss Bar */}
        <View style={styles.topBar}>
          <View style={styles.regulatoryPill}>
            <Text style={styles.regulatoryPillText}>AICTE EVC COMPLIANCE</Text>
          </View>
          {onDismiss && (
            <TouchableOpacity
              style={styles.closeButton}
              activeOpacity={0.7}
              onPress={onDismiss}
              accessibilityLabel="Dismiss location prompt"
            >
              <Text style={styles.closeButtonText}>✕ Dismiss</Text>
            </TouchableOpacity>
          )}
        </View>

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
              high-accuracy Location Services in your phone settings or tap below to test with Campus Centroid.
            </Text>
          </View>
        ) : isPermanentDenied ? (
          <View style={styles.alertBoxError}>
            <Text style={styles.alertTextError}>
              🔒 <Text style={{ fontWeight: 'bold' }}>Permission Denied in Settings:</Text> Allow
              Location in Settings, or continue with campus laboratory coordinates.
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
              onPress={handleGrant}
              disabled={isRequesting}
            >
              {isRequesting ? (
                <View style={styles.buttonRow}>
                  <ActivityIndicator color="#FFFFFF" size="small" style={{ marginRight: 8 }} />
                  <Text style={styles.primaryButtonText}>Verifying Hardware GPS...</Text>
                </View>
              ) : (
                <Text style={styles.primaryButtonText}>Grant Location Permission 📡</Text>
              )}
            </TouchableOpacity>
          )}

          {/* Direct Campus Fallback Button for Web View & Mobile */}
          <TouchableOpacity
            style={styles.fallbackButton}
            activeOpacity={0.8}
            onPress={handleFallback}
          >
            <Text style={styles.fallbackButtonText}>🏛️ Continue with Campus Centroid (MITAOE)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.7}
            onPress={handleGrant}
            disabled={isRequesting}
          >
            <Text style={styles.secondaryButtonText}>🔄 Re-check GPS Fix</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    width: '100%',
    maxWidth: 440,
    alignItems: 'center',
  },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  regulatoryPill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  regulatoryPillText: {
    fontSize: 9,
    fontFamily: 'monospace',
    fontWeight: '800',
    color: '#1D4ED8',
    letterSpacing: 0.5,
  },
  closeButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  closeButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  emblemWrapper: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
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
    marginBottom: 12,
  },
  description: {
    fontSize: 12.5,
    color: '#334155',
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 12,
  },
  statutoryBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    width: '100%',
    marginBottom: 14,
    borderLeftWidth: 3.5,
    borderLeftColor: '#0B2E5C',
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
    marginBottom: 14,
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
    marginBottom: 14,
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
    padding: 9,
    width: '100%',
    marginBottom: 14,
  },
  alertTextInfo: {
    fontSize: 11,
    color: '#1E40AF',
    textAlign: 'center',
    fontWeight: '600',
  },
  actions: {
    width: '100%',
    gap: 9,
  },
  primaryButton: {
    paddingVertical: 12,
    borderRadius: 10,
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
  fallbackButton: {
    backgroundColor: '#1E293B',
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#334155',
  },
  fallbackButtonText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  secondaryButton: {
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
  },
  secondaryButtonText: {
    color: '#475569',
    fontSize: 11.5,
    fontWeight: '700',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
