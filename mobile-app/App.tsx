// mobile-app/App.tsx
import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { COLORS } from './src/constants/theme';
import { BottomNav, NavTab } from './src/components/BottomNav';
import { LoginScreen } from './src/screens/LoginScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { FieldInspectionScreen } from './src/screens/FieldInspectionScreen';
import { DocumentScannerScreen } from './src/screens/DocumentScannerScreen';
import { DeficiencyAlertsScreen } from './src/screens/DeficiencyAlertsScreen';
import { OfficerProfileScreen } from './src/screens/OfficerProfileScreen';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [activeTab, setActiveTab] = useState<NavTab>('home');

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <LoginScreen
          onLoginSuccess={() => setIsLoggedIn(true)}
          onExploreGuest={() => setIsLoggedIn(true)}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <View style={styles.screenWrapper}>
        {activeTab === 'home' && (
          <HomeScreen
            onNavigateToGeotag={() => setActiveTab('inspection')}
            onNavigateToScan={() => setActiveTab('scan')}
            onNavigateToAlerts={() => setActiveTab('alerts')}
          />
        )}

        {activeTab === 'inspection' && <FieldInspectionScreen />}

        {activeTab === 'scan' && <DocumentScannerScreen />}

        {activeTab === 'alerts' && <DeficiencyAlertsScreen />}

        {activeTab === 'profile' && (
          <OfficerProfileScreen onLogout={() => setIsLoggedIn(false)} />
        )}
      </View>

      {/* Floating Pill Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onQuickActionPress={() => setActiveTab('scan')}
        pendingAlertsCount={2}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  screenWrapper: {
    flex: 1,
  },
});
