// mobile-app/src/screens/HomeScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Header } from '../components/Header';
import { COLORS, SHADOWS } from '../constants/theme';
import { CURRENT_EVC_OFFICER } from '../constants/mockData';

interface HomeScreenProps {
  onNavigateToGeotag: () => void;
  onNavigateToScan: () => void;
  onNavigateToAlerts: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToGeotag,
  onNavigateToScan,
  onNavigateToAlerts,
}) => {
  return (
    <View style={styles.screen}>
      <Header />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Card */}
        <View style={[styles.heroCard, SHADOWS.card]}>
          <Text style={styles.heroGreeting}>Namaste, {CURRENT_EVC_OFFICER.name} 🙏</Text>
          <Text style={styles.heroTitle}>AICTE EVC Field Inspection &amp; Compliance Hub</Text>
          <Text style={styles.heroSub}>
            Assigned: {CURRENT_EVC_OFFICER.assignedCampus} (ID: {CURRENT_EVC_OFFICER.aictePermanentId})
          </Text>

          {/* Search bar inside hero */}
          <View style={styles.heroSearchBox}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.heroSearchInput}
              placeholder="Search campus, EOA records, or clause..."
              placeholderTextColor="#94A3B8"
            />
            <Text style={styles.micIcon}>🎙️</Text>
          </View>
        </View>

        {/* 3 Live Metric Badges */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, SHADOWS.card]}>
            <Text style={styles.statIcon}>🏛️</Text>
            <Text style={styles.statNumber}>4,788</Text>
            <Text style={styles.statLabel}>Institutes</Text>
          </View>
          <View style={[styles.statCard, SHADOWS.card]}>
            <Text style={styles.statIcon}>📍</Text>
            <Text style={styles.statNumber}>14</Text>
            <Text style={styles.statLabel}>EVC Visits</Text>
          </View>
          <View style={[styles.statCard, SHADOWS.card]}>
            <Text style={styles.statIcon}>🔒</Text>
            <Text style={styles.statNumber}>100%</Text>
            <Text style={styles.statLabel}>SHA-256</Text>
          </View>
        </View>

        {/* ========================================================================= */}
        {/* 3 HIGH-IMPACT USE CASE ACTION CARDS                                        */}
        {/* ========================================================================= */}
        <Text style={styles.sectionHeading}>CORE MOBILE CAPABILITIES (SIH PS 26261)</Text>

        {/* Card 1: Field Inspection & Geotagging */}
        <TouchableOpacity
          style={[styles.featureCard, SHADOWS.card]}
          activeOpacity={0.8}
          onPress={onNavigateToGeotag}
        >
          <View style={[styles.featureIconBadge, { backgroundColor: '#EFF6FF' }]}>
            <Text style={styles.featureEmoji}>📸</Text>
          </View>
          <View style={styles.featureInfo}>
            <View style={styles.featureHeaderRow}>
              <Text style={styles.featureTitle}>1. Field Inspection &amp; Geotagging</Text>
              <View style={styles.badgeHighest}>
                <Text style={styles.badgeHighestText}>EVC High Marks</Text>
              </View>
            </View>
            <Text style={styles.featureDesc}>
              Capture on-site photos of labs, computer centers &amp; ramps with real-time GPS coordinates and on-device SHA-256 seal.
            </Text>
            <View style={styles.featureActionRow}>
              <Text style={styles.featureActionLink}>Launch Camera &amp; GPS Stamp →</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Card 2: Document Fast-Scan & Hash */}
        <TouchableOpacity
          style={[styles.featureCard, SHADOWS.card]}
          activeOpacity={0.8}
          onPress={onNavigateToScan}
        >
          <View style={[styles.featureIconBadge, { backgroundColor: '#F0FDF4' }]}>
            <Text style={styles.featureEmoji}>📄</Text>
          </View>
          <View style={styles.featureInfo}>
            <View style={styles.featureHeaderRow}>
              <Text style={styles.featureTitle}>2. Document Fast-Scan &amp; Hashing</Text>
              <View style={[styles.badgeHighest, { backgroundColor: '#DCFCE7' }]}>
                <Text style={[styles.badgeHighestText, { color: '#15803D' }]}>Registrar Portal</Text>
              </View>
            </View>
            <Text style={styles.featureDesc}>
              Camera edge-detection for State NOCs, Affidavits &amp; Land Deeds. Hashes with SHA-256 before upload.
            </Text>
            <View style={styles.featureActionRow}>
              <Text style={styles.featureActionLink}>Open Fast-Scanner →</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Card 3: Instant Deficiency Push Alerts */}
        <TouchableOpacity
          style={[styles.featureCard, SHADOWS.card]}
          activeOpacity={0.8}
          onPress={onNavigateToAlerts}
        >
          <View style={[styles.featureIconBadge, { backgroundColor: '#FEF3C7' }]}>
            <Text style={styles.featureEmoji}>🔔</Text>
          </View>
          <View style={styles.featureInfo}>
            <View style={styles.featureHeaderRow}>
              <Text style={styles.featureTitle}>3. Instant Deficiency Push Alerts</Text>
              <View style={[styles.badgeHighest, { backgroundColor: '#FEE2E2' }]}>
                <Text style={[styles.badgeHighestText, { color: '#DC2626' }]}>2 Pending Fixes</Text>
              </View>
            </View>
            <Text style={styles.featureDesc}>
              Real-time push alerts on expired NOCs and clause mismatches with 1-click mobile resubmission.
            </Text>
            <View style={styles.featureActionRow}>
              <Text style={styles.featureActionLink}>Review Actionable Alerts →</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* 6 Inspection Categories Grid */}
        <Text style={[styles.sectionHeading, { marginTop: 22 }]}>
          ON-SITE INFRASTRUCTURE CATEGORIES
        </Text>
        <View style={styles.categoriesGrid}>
          {[
            { label: 'Computer Center', icon: '💻', count: '540 PCs' },
            { label: 'Laboratories', icon: '🔬', count: '18 Labs' },
            { label: 'Wheelchair Ramps', icon: '♿', count: '100% Compliant' },
            { label: 'Fire Safety NOC', icon: '🧯', count: 'Valid' },
            { label: 'Central Library', icon: '📚', count: '24,000 Vol' },
            { label: 'Hostel & Sports', icon: '🏟️', count: 'Verified' },
          ].map((cat, i) => (
            <TouchableOpacity key={i} style={[styles.catCard, SHADOWS.card]} activeOpacity={0.7}>
              <Text style={styles.catIcon}>{cat.icon}</Text>
              <Text style={styles.catLabel}>{cat.label}</Text>
              <Text style={styles.catCount}>{cat.count}</Text>
            </TouchableOpacity>
          ))}
        </View>

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
    paddingBottom: 24,
  },
  heroCard: {
    backgroundColor: COLORS.primaryNavy,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },
  heroGreeting: {
    fontSize: 13,
    fontWeight: '700',
    color: '#93C5FD',
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 24,
    marginBottom: 6,
  },
  heroSub: {
    fontSize: 11,
    color: '#E2E8F0',
    marginBottom: 14,
  },
  heroSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  heroSearchInput: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textMain,
    padding: 0,
  },
  micIcon: {
    fontSize: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statIcon: {
    fontSize: 18,
    marginBottom: 4,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primaryNavy,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primaryNavy,
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'flex-start',
  },
  featureIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureEmoji: {
    fontSize: 22,
  },
  featureInfo: {
    flex: 1,
  },
  featureHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryNavy,
    flex: 1,
  },
  badgeHighest: {
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 6,
  },
  badgeHighestText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  featureDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 15,
    marginBottom: 8,
  },
  featureActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureActionLink: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primaryOrange,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  catCard: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  catIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  catLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primaryNavy,
    textAlign: 'center',
  },
  catCount: {
    fontSize: 9,
    color: '#059669',
    fontWeight: '600',
    marginTop: 2,
  },
});
