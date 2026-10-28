// mobile-app/src/screens/DeficiencyAlertsScreen.tsx
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
import { DEFICIENCY_ALERTS, DeficiencyAlert } from '../constants/mockData';

export const DeficiencyAlertsScreen: React.FC = () => {
  const [alerts, setAlerts] = useState<DeficiencyAlert[]>(DEFICIENCY_ALERTS);

  const handleResolveAlert = (id: string, ruleTitle: string) => {
    Alert.alert(
      '📸 Camera Rectification',
      `Launch camera to scan updated document for "${ruleTitle}"? On-device SHA-256 seal will re-verify the statutory clause.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Scan & Resubmit',
          onPress: () => {
            setAlerts((prev) =>
              prev.map((item) =>
                item.id === id ? { ...item, status: 'Resubmitted' } : item
              )
            );
            Alert.alert('✅ Resubmitted', 'Replacement document uploaded & sealed into Azure DB.');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.screen}>
      <Header />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
          <View style={styles.badgeRow}>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>INSTITUTION &amp; OFFICER PUSH ALERTS</Text>
            </View>
            <View style={styles.azureBadge}>
              <Text style={styles.azureBadgeText}>WebPush &amp; SMS Gateway</Text>
            </View>
          </View>
          <Text style={styles.mainTitle}>3. Instant Deficiency Push Alerts</Text>
          <Text style={styles.subTitle}>
            Real-time push alerts on expired State NOCs or clause mismatches, allowing instant resubmission from the phone.
          </Text>
        </View>

        {/* Banner summary */}
        <View style={[styles.summaryCard, SHADOWS.card]}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryIconBox}>
              <Text style={styles.summaryIcon}>🔔</Text>
            </View>
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryCount}>
                {alerts.filter((a) => a.status === 'Action Required').length} Actionable Deficiencies
              </Text>
              <Text style={styles.summarySub}>
                APH 2024–27 clauses require statutory correction before Committee final approval.
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.listHeading}>ACTIVE REGULATORY ALERTS</Text>

        {alerts.map((item) => {
          const isResolved = item.status === 'Resubmitted';
          const isCritical = item.severity === 'Critical';

          return (
            <View key={item.id} style={[styles.alertCard, SHADOWS.card]}>
              <View style={styles.alertHeader}>
                <View
                  style={[
                    styles.severityBadge,
                    isResolved
                      ? { backgroundColor: '#DCFCE7' }
                      : isCritical
                      ? { backgroundColor: '#FEE2E2' }
                      : { backgroundColor: '#FEF3C7' },
                  ]}
                >
                  <Text
                    style={[
                      styles.severityText,
                      isResolved
                        ? { color: '#15803D' }
                        : isCritical
                        ? { color: '#DC2626' }
                        : { color: '#B45309' },
                    ]}
                  >
                    {isResolved ? '✓ RESOLVED' : item.severity.toUpperCase()}
                  </Text>
                </View>

                <Text style={styles.alertTime}>
                  {new Date(item.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>

              <Text style={styles.institutionName}>{item.institutionName}</Text>
              <Text style={styles.clauseCitation}>⚖️ Statutory Clause: {item.clauseId}</Text>
              <Text style={styles.ruleTitle}>{item.ruleTitle}</Text>
              <Text style={styles.messageText}>{item.message}</Text>

              {/* Action Button */}
              {isResolved ? (
                <View style={styles.resolvedBanner}>
                  <Text style={styles.resolvedText}>
                    ✓ Replacement uploaded via mobile fast-scan. Status: Under Committee Review.
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.actionBtn}
                  activeOpacity={0.8}
                  onPress={() => handleResolveAlert(item.id, item.ruleTitle)}
                >
                  <Text style={styles.actionBtnIcon}>📷</Text>
                  <Text style={styles.actionBtnText}>Upload Corrective Document with Camera</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}

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
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  azureBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#B45309',
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
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryIconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  summaryIcon: {
    fontSize: 20,
  },
  summaryInfo: {
    flex: 1,
  },
  summaryCount: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryNavy,
  },
  summarySub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  listHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primaryNavy,
    marginBottom: 10,
  },
  alertCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  severityText: {
    fontSize: 10,
    fontWeight: '800',
  },
  alertTime: {
    fontSize: 10,
    color: '#94A3B8',
  },
  institutionName: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryNavy,
    marginBottom: 2,
  },
  clauseCitation: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D97706',
    marginBottom: 4,
  },
  ruleTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 16,
    marginBottom: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryOrange,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  actionBtnIcon: {
    fontSize: 14,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  resolvedBanner: {
    backgroundColor: '#F0FDF4',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  resolvedText: {
    color: '#15803D',
    fontSize: 10,
    fontWeight: '700',
  },
});
