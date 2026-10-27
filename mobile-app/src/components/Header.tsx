// mobile-app/src/components/Header.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS } from '../constants/theme';

interface HeaderProps {
  onNotificationPress?: () => void;
  activeLanguage?: string;
  onLanguageChange?: (lang: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNotificationPress,
  activeLanguage = 'EN',
  onLanguageChange,
}) => {
  const [lang, setLang] = useState(activeLanguage);
  const languages = ['EN', 'HI', 'MR', 'KN'];

  const handleLang = (code: string) => {
    setLang(code);
    onLanguageChange?.(code);
  };

  return (
    <View style={styles.container}>
      {/* Brand Logo & Name with Official Banner */}
      <View style={styles.brandRow}>
        <Image
          source={require('../../assets/nirikshai_banner_logo.png')}
          style={styles.logoBanner}
          resizeMode="contain"
        />
      </View>

      {/* Language Switcher Pills */}
      <View style={styles.langSelector}>
        {languages.map((code) => {
          const isActive = lang === code;
          return (
            <TouchableOpacity
              key={code}
              activeOpacity={0.7}
              onPress={() => handleLang(code)}
              style={[styles.langPill, isActive && styles.langPillActive]}
            >
              <Text style={[styles.langText, isActive && styles.langTextActive]}>
                {code}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Notification Bell */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onNotificationPress}
        style={styles.bellButton}
      >
        <Text style={styles.bellIcon}>🔔</Text>
        <View style={styles.bellDot} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: COLORS.background,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBanner: {
    width: 140,
    height: 38,
  },
  logoCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#1D4ED8',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
    shadowColor: '#0B2E5C',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  logoIcon: {
    fontSize: 16,
    lineHeight: 18,
  },
  logoSmallText: {
    fontSize: 6,
    fontWeight: '800',
    color: '#0B2E5C',
    textAlign: 'center',
  },
  titleContainer: {
    marginLeft: 8,
  },
  titleEnglish: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.primaryNavy,
    letterSpacing: -0.3,
  },
  titleHindi: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryOrange,
  },
  langSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    padding: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  langPill: {
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 14,
  },
  langPillActive: {
    backgroundColor: COLORS.primaryNavy,
  },
  langText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
  },
  langTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  bellButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    position: 'relative',
  },
  bellIcon: {
    fontSize: 17,
  },
  bellDot: {
    position: 'absolute',
    top: 7,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#EAB308',
  },
});
