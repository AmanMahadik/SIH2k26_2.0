// mobile-app/src/screens/OfficerProfileScreen.tsx
import React from 'react';
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
import { CURRENT_EVC_OFFICER } from '../constants/mockData';

interface OfficerProfileScreenProps {
  onLogout: () => void;
}

export const OfficerProfileScreen: React.FC<OfficerProfileScreenProps> = ({ onLogout }) => {
  return (
    <View style={styles.screen}>
      <Header />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Title Header */}
        <View style={styles.headerRow}>
          <Text style={styles.pageTitle}>AICTE Officer Profile</Text>
          <View style={styles.topBtnRow}>
            <TouchableOpacity
              style={styles.btnPillDark}
              onPress={() => Alert.alert('Officer Profile', 'Clearance Level 2 verified via Microsoft Entra ID.')}
            >
              <Text style={styles.btnPillDarkText}>✏️ Credentials</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnPillLight}
              onPress={() => Alert.alert('Settings', 'Azure PostgreSQL sync: Central India (Active)')}
            >
              <Text style={styles.btnPillLightText}>⚙️ Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Officer Card */}
        <View style={[styles.profileCard, SHADOWS.card]}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarIcon}>👤</Text>
            </View>
            <View style={styles.profileMeta}>
              <View style={styles.nameBadgeRow}>
                <Text style={styles.officerName}>{CURRENT_EVC_OFFICER.name}</Text>
                <View style={styles.authBadge}>
                  <Text style={styles.authBadgeText}>✓ Entra ID Verified</Text>
                </View>
              </View>
              <Text style={styles.officerEmail}>{CURRENT_EVC_OFFICER.email}</Text>
              <Text style={styles.officerOffice}>🏢 {CURRENT_EVC_OFFICER.regionalOffice}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.clearanceRow}>
            <Text style={styles.clearanceLabel}>Clearance Level:</Text>
            <Text style={styles.clearanceVal}>{CURRENT_EVC_OFFICER.clearanceLevel}</Text>
          </View>
          <View style={styles.clearanceRow}>
            <Text style={styles.clearanceLabel}>Assigned Campus:</Text>
            <Text style={styles.clearanceVal}>{CURRENT_EVC_OFFICER.assignedCampus}</Text>
          </View>
        </View>

        {/* Azure Documents Vault */}
        <View style={[styles.vaultCard, SHADOWS.card]}>
          <View style={styles.vaultHeader}>
            <View style={styles.vaultTitleRow}>
              <Text style={styles.vaultIcon}>📁</Text>
              <Text style={styles.vaultTitle}>Azure EVC Evidence Vault</Text>
            </View>
            <View style={styles.vaultCountBadge}>
              <Text style={styles.vaultCountText}>3 Containers Synced</Text>
            </View>
          </View>

          <Text style={styles.vaultSub}>
            Private TLS 1.3 encrypted storage for on-site photographs and forensic PDFs.
          </Text>

          {/* Container 1 */}
          <View style={styles.containerItem}>
            <View style={styles.containerIconBox}>
              <Text style={styles.containerEmoji}>📸</Text>
            </View>
            <View style={styles.containerInfo}>
              <Text style={styles.containerName}>evc-geotagged-photos</Text>
              <Text style={styles.containerSub}>Azure Blob Container: Central India</Text>
            </View>
            <View style={styles.syncStatusBadge}>
              <Text style={styles.syncStatusText}>✓ Synced</Text>
            </View>
          </View>

          {/* Container 2 */}
          <View style={styles.containerItem}>
            <View style={styles.containerIconBox}>
              <Text style={styles.containerEmoji}>📄</Text>
            </View>
            <View style={styles.containerInfo}>
              <Text style={styles.containerName}>scanned-noc-affidavits</Text>
              <Text style={styles.containerSub}>Pre-Upload SHA-256 Verified</Text>
            </View>
            <View style={styles.syncStatusBadge}>
              <Text style={styles.syncStatusText}>✓ Synced</Text>
            </View>
          </View>

          {/* Container 3 */}
          <View style={styles.containerItem}>
            <View style={styles.containerIconBox}>
              <Text style={styles.containerEmoji}>⛓️</Text>
            </View>
            <View style={styles.containerInfo}>
              <Text style={styles.containerName}>audit_log (Cryptographic Chain)</Text>
              <Text style={styles.containerSub}>Azure PostgreSQL Flexible Server</Text>
            </View>
            <View style={styles.syncStatusBadge}>
              <Text style={styles.syncStatusText}>✓ Synced</Text>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.8} onPress={onLogout}>
          <Text style={styles.logoutBtnText}>➔ Logout AICTE Account &amp; Lock Mobile App</Text>
        </TouchableOpacity>

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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primaryNavy,
  },
  topBtnRow: {
    flexDirection: 'row',
    gap: 6,
  },
  btnPillDark: {
    backgroundColor: COLORS.primaryNavy,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  btnPillDarkText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  btnPillLight: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  btnPillLightText: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '700',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryNavy,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarIcon: {
    fontSize: 22,
    color: '#FFFFFF',
  },
  profileMeta: {
    flex: 1,
  },
  nameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  officerName: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primaryNavy,
  },
  authBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  authBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#15803D',
  },
  officerEmail: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  officerOffice: {
    fontSize: 10,
    color: '#475569',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  clearanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  clearanceLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  clearanceVal: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryNavy,
  },
  vaultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  vaultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  vaultTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  vaultIcon: {
    fontSize: 16,
  },
  vaultTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryNavy,
  },
  vaultCountBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  vaultCountText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  vaultSub: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 14,
  },
  containerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  containerIconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  containerEmoji: {
    fontSize: 16,
  },
  containerInfo: {
    flex: 1,
  },
  containerName: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1E293B',
    fontFamily: 'monospace',
  },
  containerSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  syncStatusBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  syncStatusText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#059669',
  },
  logoutBtn: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutBtnText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '800',
  },
});
