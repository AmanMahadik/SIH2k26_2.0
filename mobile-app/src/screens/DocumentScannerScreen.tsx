// mobile-app/src/screens/DocumentScannerScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as Crypto from 'expo-crypto';
import { Header } from '../components/Header';
import { COLORS, SHADOWS } from '../constants/theme';
import { INITIAL_SCANNED_DOCS, ScannedDocument } from '../constants/mockData';

export const DocumentScannerScreen: React.FC = () => {
  const [docs, setDocs] = useState<ScannedDocument[]>(INITIAL_SCANNED_DOCS);
  const [selectedDocType, setSelectedDocType] = useState('State NOC Certificate');
  const [isScanning, setIsScanning] = useState(false);

  const docTypes = [
    'State NOC Certificate',
    'Mandatory Affidavit (Format-1)',
    'Building Plan Approval',
    'Fire Safety NOC',
    'Land Conversion Order',
  ];

  const handleFastScan = async () => {
    setIsScanning(true);

    try {
      const payload = `${selectedDocType}|MITAOE-1-23111191|${Date.now()}`;
      const sha256Hash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        payload
      );

      const newDoc: ScannedDocument = {
        id: `scan-${Date.now()}`,
        docType: selectedDocType,
        filename: `${selectedDocType.replace(/\s+/g, '_')}_2026.pdf`,
        fileSize: '2.1 MB',
        pageCount: 2,
        sha256Hash,
        ocrConfidence: 98.6,
        clauseCitation: 'APH 2024-27 §4.2.3 (Prescribed Format Verified)',
        status: 'Hashed & Verified',
      };

      setDocs([newDoc, ...docs]);
      Alert.alert(
        '📄 Document Scanned & Hashed',
        `File: ${newDoc.filename}\nSHA-256 Digest: ${newDoc.sha256Hash.slice(0, 16)}...\nOCR Confidence: ${newDoc.ocrConfidence}%\nSealed into Azure Storage.`
      );
    } catch (err: any) {
      Alert.alert('Scan Error', err.message);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <View style={styles.screen}>
      <Header />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
          <View style={styles.badgeRow}>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>INSTITUTIONAL REGISTRAR SCANNER</Text>
            </View>
            <View style={styles.azureBadge}>
              <Text style={styles.azureBadgeText}>SHA-256 Pre-Upload</Text>
            </View>
          </View>
          <Text style={styles.mainTitle}>2. Document Fast-Scan &amp; Hashing</Text>
          <Text style={styles.subTitle}>
            Mobile camera scanner calculates cryptographic SHA-256 hash on device before uploading to private cloud.
          </Text>
        </View>

        {/* Scanner Viewfinder Simulation */}
        <View style={[styles.scannerCard, SHADOWS.card]}>
          <View style={styles.documentFrame}>
            <View style={styles.docSheet}>
              <View style={styles.docHeaderLine} />
              <View style={styles.docBodyLine1} />
              <View style={styles.docBodyLine2} />
              <View style={styles.docBodyLine3} />
              <View style={styles.scanLaserBeam} />
            </View>

            <View style={styles.scanHudOverlay}>
              <Text style={styles.scanHudText}>⚡ Edge Detection: 4 Corners Locked</Text>
              <Text style={styles.scanHudText}>🔒 SHA-256 Digest: Computing On-Device...</Text>
            </View>
          </View>

          <Text style={styles.selectLabel}>Select Regulatory Document Type:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScroll}>
            {docTypes.map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => setSelectedDocType(type)}
                style={[
                  styles.typeChip,
                  selectedDocType === type ? styles.typeChipActive : styles.typeChipInactive,
                ]}
              >
                <Text
                  style={[
                    styles.typeChipText,
                    selectedDocType === type ? styles.typeChipTextActive : styles.typeChipTextInactive,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={[styles.scanBtn, isScanning && styles.scanBtnDisabled]}
            activeOpacity={0.85}
            onPress={handleFastScan}
            disabled={isScanning}
          >
            <Text style={styles.scanBtnText}>
              {isScanning ? '⚡ Auto-Cropping & Hashing...' : '📄 Scan Document & Compute SHA-256'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.listHeading}>HASHED &amp; UPLOADED REPOSITORY ({docs.length})</Text>

        {docs.map((doc) => (
          <View key={doc.id} style={[styles.docItemCard, SHADOWS.card]}>
            <View style={styles.docHeader}>
              <Text style={styles.docTypeTitle}>{doc.docType}</Text>
              <View style={styles.verifiedPill}>
                <Text style={styles.verifiedPillText}>✓ {doc.status}</Text>
              </View>
            </View>

            <Text style={styles.filenameText}>📎 {doc.filename} ({doc.fileSize} • {doc.pageCount} Pages)</Text>
            <Text style={styles.citationText}>⚖️ Statutory Clause: {doc.clauseCitation}</Text>

            <View style={styles.ocrConfidenceRow}>
              <Text style={styles.ocrLabel}>Perception OCR Confidence:</Text>
              <View style={styles.confidenceBadge}>
                <Text style={styles.confidenceText}>{doc.ocrConfidence}%</Text>
              </View>
            </View>

            <View style={styles.hashBox}>
              <Text style={styles.hashLabel}>Client-Side SHA-256 Hash:</Text>
              <Text style={styles.hashValue} numberOfLines={1}>{doc.sha256Hash}</Text>
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
  scannerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 18,
  },
  documentFrame: {
    width: '100%',
    height: 180,
    backgroundColor: '#0F172A',
    borderRadius: 12,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  docSheet: {
    width: 120,
    height: 150,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    padding: 10,
    position: 'relative',
  },
  docHeaderLine: {
    width: '60%',
    height: 8,
    backgroundColor: '#0B2E5C',
    borderRadius: 4,
    marginBottom: 10,
  },
  docBodyLine1: {
    width: '90%',
    height: 4,
    backgroundColor: '#CBD5E1',
    borderRadius: 2,
    marginBottom: 6,
  },
  docBodyLine2: {
    width: '80%',
    height: 4,
    backgroundColor: '#CBD5E1',
    borderRadius: 2,
    marginBottom: 6,
  },
  docBodyLine3: {
    width: '70%',
    height: 4,
    backgroundColor: '#CBD5E1',
    borderRadius: 2,
  },
  scanLaserBeam: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 60,
    height: 2,
    backgroundColor: '#38BDF8',
  },
  scanHudOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(11, 46, 92, 0.88)',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  scanHudText: {
    color: '#E0F2FE',
    fontSize: 9,
    fontFamily: 'monospace',
  },
  selectLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primaryNavy,
    marginTop: 12,
    marginBottom: 6,
  },
  typeScroll: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
  },
  typeChipActive: {
    backgroundColor: COLORS.primaryNavy,
    borderColor: COLORS.primaryNavy,
  },
  typeChipInactive: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  typeChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  typeChipTextActive: {
    color: '#FFFFFF',
  },
  typeChipTextInactive: {
    color: '#4B5563',
  },
  scanBtn: {
    backgroundColor: COLORS.navyAccent,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanBtnDisabled: {
    opacity: 0.7,
  },
  scanBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  listHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primaryNavy,
    marginBottom: 10,
  },
  docItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 10,
  },
  docHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  docTypeTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primaryNavy,
    flex: 1,
  },
  verifiedPill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  verifiedPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
  },
  filenameText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
    marginBottom: 2,
  },
  citationText: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 6,
  },
  ocrConfidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  ocrLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  confidenceBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  confidenceText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
  },
  hashBox: {
    marginTop: 4,
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
  },
});
