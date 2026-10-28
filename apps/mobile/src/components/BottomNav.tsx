// mobile-app/src/components/BottomNav.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '../constants/theme';

export type NavTab = 'home' | 'inspection' | 'scan' | 'alerts' | 'profile';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onQuickActionPress: () => void;
  pendingAlertsCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  onQuickActionPress,
  pendingAlertsCount = 2,
}) => {
  const insets = useSafeAreaInsets();
  const bottomOffset = Platform.OS === 'ios'
    ? Math.max(insets.bottom, 18)
    : Math.max(insets.bottom + 8, 12);

  return (
    <View style={[styles.navWrapper, { bottom: bottomOffset }]} pointerEvents="box-none">
      <View style={[styles.navContainer, SHADOWS.floatingNav]}>
        {/* Tab 1: Home */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onTabChange('home')}
          style={[styles.tabButton, activeTab === 'home' && styles.tabButtonActive]}
        >
          <Text style={[styles.tabIcon, activeTab === 'home' && styles.tabIconActive]}>
            ⌂
          </Text>
          <Text style={[styles.tabLabel, activeTab === 'home' && styles.tabLabelActive]}>
            Home
          </Text>
        </TouchableOpacity>

        {/* Tab 2: Geotag EVC (Use Case 1) */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onTabChange('inspection')}
          style={[styles.tabButton, activeTab === 'inspection' && styles.tabButtonActive]}
        >
          <Text style={[styles.tabIcon, activeTab === 'inspection' && styles.tabIconActive]}>
            📍
          </Text>
          <Text style={[styles.tabLabel, activeTab === 'inspection' && styles.tabLabelActive]}>
            EVC Geo
          </Text>
        </TouchableOpacity>

        {/* Center Floating Fast-Scan FAB (Use Case 2) */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onQuickActionPress}
          style={[styles.micFab, SHADOWS.micFab]}
        >
          <Text style={styles.micIcon}>📷</Text>
        </TouchableOpacity>

        {/* Tab 4: Push Alerts (Use Case 3) */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onTabChange('alerts')}
          style={[styles.tabButton, activeTab === 'alerts' && styles.tabButtonActive]}
        >
          <View style={styles.iconWithBadge}>
            <Text style={[styles.tabIcon, activeTab === 'alerts' && styles.tabIconActive]}>
              ⚠️
            </Text>
            {pendingAlertsCount > 0 && (
              <View style={styles.badgeCount}>
                <Text style={styles.badgeText}>{pendingAlertsCount}</Text>
              </View>
            )}
          </View>
          <Text style={[styles.tabLabel, activeTab === 'alerts' && styles.tabLabelActive]}>
            Alerts
          </Text>
        </TouchableOpacity>

        {/* Tab 5: Profile */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onTabChange('profile')}
          style={[styles.tabButton, activeTab === 'profile' && styles.tabButtonActive]}
        >
          <Text style={[styles.tabIcon, activeTab === 'profile' && styles.tabIconActive]}>
            👤
          </Text>
          <Text style={[styles.tabLabel, activeTab === 'profile' && styles.tabLabelActive]}>
            Officer
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navWrapper: {
    position: 'absolute',
    left: 14,
    right: 14,
    alignItems: 'center',
    zIndex: 999,
  },
  navContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 36,
    paddingHorizontal: 8,
    paddingVertical: 6,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'visible',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 20,
    minWidth: 54,
  },
  tabButtonActive: {
    backgroundColor: COLORS.navActiveBg,
  },
  tabIcon: {
    fontSize: 17,
    color: COLORS.navInactiveText,
  },
  tabIconActive: {
    color: COLORS.navActiveText,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.navInactiveText,
    marginTop: 2,
  },
  tabLabelActive: {
    color: COLORS.navActiveText,
    fontWeight: '800',
  },
  iconWithBadge: {
    position: 'relative',
  },
  badgeCount: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    width: 15,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
  micFab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primaryOrange,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3.5,
    borderColor: '#FFFFFF',
    transform: [{ translateY: -16 }],
    elevation: 8,
    shadowColor: '#FF8C00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  micIcon: {
    fontSize: 22,
    color: '#FFFFFF',
  },
});
