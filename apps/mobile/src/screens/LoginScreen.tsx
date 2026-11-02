// mobile-app/src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { Header } from '../components/Header';
import { COLORS, SHADOWS } from '../constants/theme';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onExploreGuest: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onExploreGuest,
}) => {
  const [authMethod, setAuthMethod] = useState<'email' | 'mobile'>('email');
  const [email, setEmail] = useState('priya.sharma@aicte-india.org');
  const [mobile, setMobile] = useState('+91 94220 18293');
  const [password, setPassword] = useState('demo123');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleSignIn = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      onLoginSuccess();
    }, 700);
  };

  const setRoleDemo = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('demo123');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.screen}
    >
      <Header />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Main Floating Auth Card */}
        <View style={[styles.card, SHADOWS.card]}>
          {/* Official AICTE NirikshAI Circular Seal */}
          <View style={styles.emblemContainer}>
            <Image
              source={require('../../assets/nirikshai_emblem.png')}
              style={styles.emblemImage}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.portalTitle}>
            <Text style={{ color: '#8B1A1A' }}>Niriksh</Text>
            <Text style={{ color: '#0B2E5C' }}>AI</Text>
          </Text>

          {/* Subtitle */}
          <Text style={styles.portalSubtitle}>
            AICTE Regulatory Scrutiny &amp; EVC Field Inspection Bureau
          </Text>

          {/* Auth Gate Security Badge */}
          <View style={styles.authGateBadge}>
            <Text style={styles.authGateText}>
              🔒 MICROSOFT ENTRA ID &amp; AZURE POSTGRESQL GATE
            </Text>
          </View>

          {/* Gov SSO Button */}
          <TouchableOpacity
            style={styles.googleButton}
            activeOpacity={0.75}
            onPress={handleSignIn}
          >
            <View style={styles.googleIconBox}>
              <Text style={styles.googleG}>🏛️</Text>
            </View>
            <Text style={styles.googleButtonText}>Sign In with Official AICTE SSO</Text>
          </TouchableOpacity>

          {/* Quick Demo Role Selector Pills */}
          <View style={styles.rolePickerBox}>
            <Text style={styles.rolePickerLabel}>Quick Demo Personas:</Text>
            <View style={styles.rolePillsRow}>
              <TouchableOpacity
                onPress={() => setRoleDemo('priya.sharma@aicte-india.org')}
                style={[
                  styles.rolePill,
                  email === 'priya.sharma@aicte-india.org' && styles.rolePillActive,
                ]}
              >
                <Text
                  style={[
                    styles.rolePillText,
                    email === 'priya.sharma@aicte-india.org' && styles.rolePillTextActive,
                  ]}
                >
                  EVC Officer
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setRoleDemo('principal@mitaoe.ac.in')}
                style={[
                  styles.rolePill,
                  email === 'principal@mitaoe.ac.in' && styles.rolePillActive,
                ]}
              >
                <Text
                  style={[
                    styles.rolePillText,
                    email === 'principal@mitaoe.ac.in' && styles.rolePillTextActive,
                  ]}
                >
                  MITAOE College
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setRoleDemo('auditor@aicte-india.org')}
                style={[
                  styles.rolePill,
                  email === 'auditor@aicte-india.org' && styles.rolePillActive,
                ]}
              >
                <Text
                  style={[
                    styles.rolePillText,
                    email === 'auditor@aicte-india.org' && styles.rolePillTextActive,
                  ]}
                >
                  Auditor
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* OR Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR SIGN IN WITH CREDENTIALS</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Email / Mobile Segmented Switch */}
          <View style={styles.segmentedRow}>
            <TouchableOpacity
              style={[
                styles.segmentBtn,
                authMethod === 'email' ? styles.segmentBtnActive : styles.segmentBtnInactive,
              ]}
              activeOpacity={0.75}
              onPress={() => setAuthMethod('email')}
            >
              <Text style={styles.segmentIcon}>✉</Text>
              <Text
                style={[
                  styles.segmentText,
                  authMethod === 'email' ? styles.segmentTextActive : styles.segmentTextInactive,
                ]}
              >
                AICTE Official Email
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.segmentBtn,
                authMethod === 'mobile' ? styles.segmentBtnActive : styles.segmentBtnInactive,
              ]}
              activeOpacity={0.75}
              onPress={() => setAuthMethod('mobile')}
            >
              <Text style={styles.segmentIcon}>📱</Text>
              <Text
                style={[
                  styles.segmentText,
                  authMethod === 'mobile' ? styles.segmentTextActive : styles.segmentTextInactive,
                ]}
              >
                Mobile OTP
              </Text>
            </TouchableOpacity>
          </View>

          {/* Inputs */}
          {authMethod === 'email' ? (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Official User ID / Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="officer@aicte-india.org"
                placeholderTextColor={COLORS.textMuted}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
          ) : (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Registered Mobile Number</Text>
              <TextInput
                style={styles.input}
                value={mobile}
                onChangeText={setMobile}
                placeholder="+91 94220 18293"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="phone-pad"
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry
            />
          </View>

          {/* Action Button: Authenticating... */}
          <TouchableOpacity
            style={[styles.primaryActionBtn, isAuthenticating && styles.btnDisabled]}
            activeOpacity={0.85}
            onPress={handleSignIn}
            disabled={isAuthenticating}
          >
            <Text style={styles.primaryActionBtnText}>
              {isAuthenticating ? 'Connecting Azure Central India...' : 'Sign In to NirikshAI Mobile'}
            </Text>
          </TouchableOpacity>

          {/* Bottom Guest Link */}
          <View style={styles.linksContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onExploreGuest}
              style={styles.guestLinkTouch}
            >
              <Text style={styles.guestLinkText}>Open Field Scrutiny as Guest Officer →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    paddingBottom: 40,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  emblemContainer: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  emblemImage: {
    width: 80,
    height: 80,
  },
  portalTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  portalSubtitle: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#D97706',
    marginTop: 2,
    marginBottom: 10,
    textAlign: 'center',
  },
  authGateBadge: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 14,
  },
  authGateText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#1D4ED8',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  googleButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  googleIconBox: {
    marginRight: 8,
  },
  googleG: {
    fontSize: 16,
  },
  googleButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMain,
  },
  rolePickerBox: {
    width: '100%',
    marginBottom: 12,
  },
  rolePickerLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 5,
  },
  rolePillsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  rolePill: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  rolePillActive: {
    backgroundColor: COLORS.primaryNavy,
    borderColor: COLORS.primaryNavy,
  },
  rolePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  rolePillTextActive: {
    color: '#FFFFFF',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#9CA3AF',
    marginHorizontal: 8,
    letterSpacing: 0.4,
  },
  segmentedRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 8,
    marginBottom: 14,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  segmentBtnActive: {
    backgroundColor: COLORS.primaryNavy,
    borderColor: COLORS.primaryNavy,
  },
  segmentBtnInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  segmentIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  segmentText: {
    fontSize: 11,
    fontWeight: '700',
  },
  segmentTextActive: {
    color: '#FFFFFF',
  },
  segmentTextInactive: {
    color: COLORS.textSecondary,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMain,
    marginBottom: 4,
  },
  input: {
    width: '100%',
    backgroundColor: '#FBF9F5',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: COLORS.textMain,
    fontWeight: '500',
  },
  primaryActionBtn: {
    width: '100%',
    backgroundColor: COLORS.primaryOrange,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    shadowColor: COLORS.primaryOrange,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  primaryActionBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  linksContainer: {
    alignItems: 'center',
    marginTop: 14,
  },
  guestLinkTouch: {
    paddingVertical: 4,
  },
  guestLinkText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryNavy,
  },
});
