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
      {/* Official NirikshAi Emblem Banner Logo */}
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
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexShrink: 1,
  },
  logoBanner: {
    width: 148,
    height: 31,
  },
  langSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  langPill: {
    paddingHorizontal: 5.5,
    paddingVertical: 2.5,
    borderRadius: 12,
  },
  langPillActive: {
    backgroundColor: COLORS.primaryNavy,
  },
  langText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#475569',
  },
  langTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  bellButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bellIcon: {
    fontSize: 14,
  },
  bellDot: {
    position: 'absolute',
    top: 5,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EAB308',
  },
});
