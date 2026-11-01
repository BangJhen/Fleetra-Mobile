import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Sparkles,
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';

export const LoginScreen: React.FC = () => {
  const { login, navigateTo } = useApp();

  const [identifier, setIdentifier] = useState('budi.santoso@fleetra.id');
  const [password, setPassword] = useState('fleetra2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (!identifier.trim()) {
      Alert.alert('Data Wajib', 'Harap masukkan Email atau No. Handphone Anda.');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Kata Sandi Wajib', 'Harap masukkan kata sandi akun mitra Anda.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login(identifier.trim(), 'Budi Santoso');
    }, 450);
  };

  const handleQuickDemo = () => {
    setIdentifier('budi.santoso@fleetra.id');
    setPassword('fleetra2026');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login('budi.santoso@fleetra.id', 'Budi Santoso');
    }, 350);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formWrapper}>
          {/* 1. BRAND LOGO (Centered, No Card Box) */}
          <View style={styles.logoRow}>
            <Image
              source={require('../../assets/Fleetra Blue Ribbon Logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          {/* 2. TITLE & SUBTITLE */}
          <Text style={styles.title}>Masuk ke Akun</Text>
          <Text style={styles.subtitle}>
            Silakan masukkan data akun kemitraan pengemudi Anda
          </Text>

          {/* 3. INPUT: EMAIL / PHONE */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>No. Handphone atau Email</Text>
            <View style={styles.inputContainer}>
              <Mail size={16} color={colors.textMuted} strokeWidth={2} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="nama@fleetra.id atau 081234..."
                placeholderTextColor={colors.textDisabled}
                value={identifier}
                onChangeText={setIdentifier}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* 4. INPUT: PASSWORD */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.inputLabel}>Kata Sandi</Text>
              <TouchableOpacity
                onPress={() =>
                  Alert.alert(
                    'Lupa Kata Sandi',
                    'Silakan hubungi tim Dispatcher FLEETRA di pool armada atau WhatsApp tim operasional untuk reset kata sandi.'
                  )
                }
                activeOpacity={0.7}
              >
                <Text style={styles.forgotPasswordText}>Lupa Sandi?</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Lock size={16} color={colors.textMuted} strokeWidth={2} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Masukkan kata sandi"
                placeholderTextColor={colors.textDisabled}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
                activeOpacity={0.7}
                accessibilityLabel="Tampilkan Kata Sandi"
              >
                {showPassword ? (
                  <EyeOff size={16} color={colors.textMuted} strokeWidth={2} />
                ) : (
                  <Eye size={16} color={colors.textMuted} strokeWidth={2} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* 5. REMEMBER ME CHECKBOX */}
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setRememberMe(!rememberMe)}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
              {rememberMe && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
            </View>
            <Text style={styles.checkboxText}>Ingat sesi login di perangkat ini</Text>
          </TouchableOpacity>

          {/* 6. SUBMIT BUTTON */}
          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            activeOpacity={0.85}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.submitButtonText}>Masuk</Text>
                <ArrowRight size={16} color="#FFFFFF" strokeWidth={2.4} />
              </>
            )}
          </TouchableOpacity>

          {/* 7. QUICK 1-TAP DEMO BUTTON (Clean & minimal) */}
          <TouchableOpacity
            style={styles.demoButton}
            onPress={handleQuickDemo}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            <Sparkles size={14} color={colors.primary} strokeWidth={2} />
            <Text style={styles.demoButtonText}>1-Tap Demo: Budi Santoso (Driver)</Text>
          </TouchableOpacity>

          {/* 8. FOOTER: LINK TO REGISTER */}
          <View style={styles.footerRow}>
            <Text style={styles.footerTextMuted}>Belum memiliki akun mitra?</Text>
            <TouchableOpacity
              onPress={() => navigateTo('register')}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.footerLinkBold}> Daftar Sekarang</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Clean pure white background, no card
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center', // Vertically center content
    alignItems: 'center',     // Horizontally center content
    paddingHorizontal: 24,
    paddingVertical: 36,
  },
  formWrapper: {
    width: '100%',
    maxWidth: 360, // Optimal reading and input form width
  },

  /* LOGO */
  logoRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  logoImage: {
    width: 170,
    height: 44,
  },

  /* HEADINGS */
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 26,
    paddingHorizontal: 8,
  },

  /* INPUTS */
  inputGroup: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  forgotPasswordText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontSize: 13.5,
    color: colors.text,
  },
  eyeButton: {
    padding: 6,
  },

  /* CHECKBOX */
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 2,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxText: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  /* SUBMIT BUTTON */
  submitButton: {
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 12,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },

  /* DEMO BUTTON */
  demoButton: {
    height: 42,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 24,
  },
  demoButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },

  /* FOOTER */
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerTextMuted: {
    fontSize: 12.5,
    color: colors.textSecondary,
  },
  footerLinkBold: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.primary,
  },
});

