// mobile-app/App.tsx
import React, { useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
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

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        {!isLoggedIn ? (
          <LoginScreen
            onLoginSuccess={() => setIsLoggedIn(true)}
            onExploreGuest={() => setIsLoggedIn(true)}
          />
        ) : (
          <View style={styles.innerRoot}>
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
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Pure white behind status bar & header to seamlessly blend
  },
  innerRoot: {
    flex: 1,
    position: 'relative',
    backgroundColor: COLORS.background,
  },
  screenWrapper: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
