// mobile-app/src/screens/FieldInspectionScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Header } from '../components/Header';
import { COLORS, SHADOWS } from '../constants/theme';
import { INITIAL_GEOTAGGED_PHOTOS, CURRENT_EVC_OFFICER, GeotaggedEvidence } from '../constants/mockData';

export const FieldInspectionScreen: React.FC = () => {
  const [photos, setPhotos] = useState<GeotaggedEvidence[]>(INITIAL_GEOTAGGED_PHOTOS);
  const [selectedCategory, setSelectedCategory] = useState('Computer Center');
  const [isCapturing, setIsCapturing] = useState(false);

  const categories = [
    'Computer Center',
    'Chemistry Lab',
    'Wheelchair Ramp',
    'Fire Safety Exit',
    'Library Hall',
  ];

  const handleCaptureGeotagged = () => {
    setIsCapturing(true);

    setTimeout(() => {
      // Simulate real on-device GPS capture and SHA-256 hash calculation
      const randomLat = 18.45753 + (Math.random() - 0.5) * 0.001;
      const randomLng = 73.85083 + (Math.random() - 0.5) * 0.001;
      const fakeHash = Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('');

      const newEvidence: GeotaggedEvidence = {
        id: `geo-${Date.now()}`,
        category: selectedCategory,
        campusName: CURRENT_EVC_OFFICER.assignedCampus,
        aicteId: CURRENT_EVC_OFFICER.aictePermanentId,
        latitude: parseFloat(randomLat.toFixed(6)),
        longitude: parseFloat(randomLng.toFixed(6)),
        accuracy: 1.9,
        timestamp: new Date().toISOString(),
        sha256Hash: fakeHash,
        inspectorName: CURRENT_EVC_OFFICER.name,
        status: 'Verified & Sealed',
      };

      setPhotos([newEvidence, ...photos]);
      setIsCapturing(false);
      Alert.alert(
        '📸 Geotagged Photo Sealed',
        `GPS Coordinates stamped: ${newEvidence.latitude}° N, ${newEvidence.longitude}° E\nSHA-256 Digest: ${newEvidence.sha256Hash.slice(0, 16)}...\nSynced to Azure Central India.`
      );
    }, 1200);
  };

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
            <View style={styles.azureBadge}>
              <Text style={styles.azureBadgeText}>Azure GPS Vault</Text>
            </View>
          </View>
          <Text style={styles.mainTitle}>1. Field Inspection &amp; Geotagging</Text>
          <Text style={styles.subTitle}>
            On-device GPS coordinate stamping &amp; SHA-256 hashing prevents recycled campus photographs.
          </Text>
        </View>

        {/* Live Camera Viewfinder Simulation */}
        <View style={[styles.viewfinderCard, SHADOWS.card]}>
          <View style={styles.cameraPreview}>
            {/* Viewfinder Target Reticle */}
            <View style={styles.reticleBox}>
              <View style={[styles.corner, styles.tl]} />
              <View style={[styles.corner, styles.tr]} />
              <View style={[styles.corner, styles.bl]} />
              <View style={[styles.corner, styles.br]} />
              <Text style={styles.previewCenterText}>📷 EVC CAMERA VIEWFINDER</Text>
              <Text style={styles.previewCampusName}>{CURRENT_EVC_OFFICER.assignedCampus}</Text>
            </View>

            {/* Live GPS & Timestamp HUD Overlay */}
            <View style={styles.hudOverlay}>
              <Text style={styles.hudText}>📍 GPS: 18.457532° N, 73.850831° E (±1.9m)</Text>
              <Text style={styles.hudText}>🕒 UTC: {new Date().toISOString().replace('T', ' ').slice(0, 19)}</Text>
              <Text style={styles.hudText}>🔒 WebCrypto SHA-256 On-Device Stamping</Text>
            </View>
          </View>

          {/* Category Selector */}
          <Text style={styles.categoryLabel}>Select Campus Asset to Inspect:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[
                  styles.catChip,
                  selectedCategory === cat ? styles.catChipActive : styles.catChipInactive,
                ]}
              >
                <Text
                  style={[
                    styles.catChipText,
                    selectedCategory === cat ? styles.catChipTextActive : styles.catChipTextInactive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Shutter Capture Button */}
          <TouchableOpacity
            style={[styles.captureBtn, isCapturing && styles.captureBtnDisabled]}
            activeOpacity={0.85}
            onPress={handleCaptureGeotagged}
            disabled={isCapturing}
          >
            <Text style={styles.captureBtnText}>
              {isCapturing ? '⚡ Hashing with SHA-256 & Sealing...' : '📸 Capture Geotagged Photo Evidence'}
            </Text>
          </TouchableOpacity>
        </View>

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
                <Text style={styles.verifiedStatusText}>✓ {item.status}</Text>
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
                <Text style={styles.hashLabel}>On-Device SHA-256 Seal:</Text>
                <Text style={styles.hashValue} numberOfLines={1}>
                  {item.sha256Hash}
                </Text>
              </View>
            </View>
          </View>
        ))}

        <View style={{ height: 80 }} />
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
    marginBottom: 14,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
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
  azureBadge: {
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  azureBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#047857',
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
  viewfinderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 18,
  },
  cameraPreview: {
    width: '100%',
    height: 180,
    backgroundColor: '#0F172A',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reticleBox: {
    width: 140,
    height: 100,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
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
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  previewCampusName: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  hudOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(11, 46, 92, 0.88)',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  hudText: {
    color: '#E0F2FE',
    fontSize: 9,
    fontFamily: 'monospace',
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primaryNavy,
    marginTop: 12,
    marginBottom: 6,
  },
  catScroll: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  catChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
  },
  catChipActive: {
    backgroundColor: COLORS.primaryNavy,
    borderColor: COLORS.primaryNavy,
  },
  catChipInactive: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  catChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  catChipTextActive: {
    color: '#FFFFFF',
  },
  catChipTextInactive: {
    color: '#4B5563',
  },
  captureBtn: {
    backgroundColor: COLORS.primaryOrange,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureBtnDisabled: {
    opacity: 0.7,
  },
  captureBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  historyHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primaryNavy,
    marginBottom: 10,
  },
  evidenceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 10,
  },
  evidenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  evidenceCategoryPill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  evidenceCategoryText: {
    fontSize: 11,
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
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
  },
  evidenceBody: {
    gap: 3,
  },
  evidenceLoc: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
  },
  evidenceTime: {
    fontSize: 10,
    color: '#64748B',
  },
  evidenceInspector: {
    fontSize: 10,
    color: '#475569',
  },
  hashBox: {
    marginTop: 6,
    padding: 6,
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  hashLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
  },
  hashValue: {
    fontSize: 9,
    fontFamily: 'monospace',
    color: '#0F172A',
    fontWeight: '600',
  },
});
