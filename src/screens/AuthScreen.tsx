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
  CheckCircle2,
  ChevronLeft,
  Eye,
  EyeOff,
  FileText,
  KeyRound,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  Truck,
  User,
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';

interface AuthScreenProps {
  initialMode?: 'login' | 'register';
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ initialMode = 'login' }) => {
  const { login, register, navigateTo } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('budi.santoso@fleetra.id');
  const [loginPassword, setLoginPassword] = useState('fleetra2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regSim, setRegSim] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = () => {
    if (!loginIdentifier.trim()) {
      Alert.alert('Data Wajib', 'Harap masukkan Email atau No. Handphone Anda.');
      return;
    }
    if (!loginPassword.trim()) {
      Alert.alert('Kata Sandi Wajib', 'Harap masukkan kata sandi akun mitra Anda.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login(loginIdentifier.trim(), 'Budi Santoso');
    }, 500);
  };

  const handleQuickDemoLogin = () => {
    setLoginIdentifier('budi.santoso@fleetra.id');
    setLoginPassword('fleetra2026');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login('budi.santoso@fleetra.id', 'Budi Santoso');
    }, 400);
  };

  const handleRegisterSubmit = () => {
    if (!regName.trim()) {
      Alert.alert('Nama Lengkap Wajib', 'Harap masukkan nama lengkap sesuai KTP/SIM.');
      return;
    }
    if (!regPhone.trim()) {
      Alert.alert('No. WhatsApp Wajib', 'Harap masukkan nomor WhatsApp aktif Anda.');
      return;
    }
    if (!regSim.trim()) {
      Alert.alert('Nomor SIM Wajib', 'Harap masukkan nomor SIM B1 atau A Anda.');
      return;
    }
    if (!regPassword.trim() || regPassword.length < 6) {
      Alert.alert('Kata Sandi Terlalu Pendek', 'Kata sandi minimal 6 karakter.');
      return;
    }
    if (!agreeTerms) {
      Alert.alert('Persetujuan Syarat', 'Anda wajib menyetujui Ketentuan Kemitraan FLEETRA.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      register({
        name: regName.trim(),
        phone: regPhone.trim(),
        simNumber: regSim.trim(),
        vehicleModel: 'Daihatsu Gran Max Blind Van 1.3L (RTO)',
        vehiclePlate: 'B 9821 KCE',
      });
      Alert.alert(
        'Pendaftaran Berhasil!',
        `Selamat datang mitra ${regName.trim()}! Akun kemitraan dan program Sewa-Beli (RTO) Anda telah aktif.`
      );
    }, 600);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. TOP HEADER WITH LOGO & BACK TO ONBOARDING */}
        <View style={styles.topHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigateTo('onboarding')}
            activeOpacity={0.7}
          >
            <ChevronLeft size={16} color={colors.textSecondary} strokeWidth={2.2} />
            <Text style={styles.backText}>Onboarding</Text>
          </TouchableOpacity>

          <View style={styles.brandRow}>
            <Image
              source={require('../../assets/Fleetra Blue Ribbon Logo.png')}
              style={styles.brandLogo}
              resizeMode="contain"
            />
            <Text style={styles.brandName}>FLEETRA</Text>
          </View>
        </View>

        {/* 2. AUTH CARD */}
        <View style={styles.authCard}>
          {/* Header Title & Subtitle */}
          <View style={styles.cardHeaderBox}>
            <Text style={styles.cardTitle}>
              {mode === 'login' ? 'Masuk ke Akun Mitra' : 'Daftar Mitra Driver'}
            </Text>
            <Text style={styles.cardSubtitle}>
              {mode === 'login'
                ? 'Kelola ritase logistik harian dan pantau akumulasi ekuitas sewa-beli armada Anda.'
                : 'Bergabunglah dalam ekosistem telematika cerdas & miliki armada kargo dari setiap ritase.'}
            </Text>
          </View>

          {/* Mode Switcher Tabs */}
          <View style={styles.switcherContainer}>
            <TouchableOpacity
              style={[
                styles.switcherTab,
                mode === 'login' && styles.switcherTabActive,
              ]}
              onPress={() => setMode('login')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.switcherText,
                  mode === 'login' && styles.switcherTextActive,
                ]}
              >
                Masuk
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.switcherTab,
                mode === 'register' && styles.switcherTabActive,
              ]}
              onPress={() => setMode('register')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.switcherText,
                  mode === 'register' && styles.switcherTextActive,
                ]}
              >
                Daftar Baru
              </Text>
            </TouchableOpacity>
          </View>

          {/* ============================================================== */}
          {/* LOGIN FORM                                                     */}
          {/* ============================================================== */}
          {mode === 'login' ? (
            <View style={styles.formContainer}>
              {/* Field 1: Email / No. HP */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>No. Handphone atau Email</Text>
                <View style={styles.inputWrapper}>
                  <Mail size={16} color={colors.textMuted} strokeWidth={2} />
                  <TextInput
                    style={styles.textInput}
                    value={loginIdentifier}
                    onChangeText={setLoginIdentifier}
                    placeholder="Contoh: 081234567890 / email"
                    placeholderTextColor={colors.textDisabled}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
              </View>

              {/* Field 2: Password */}
              <View style={styles.inputGroup}>
                <View style={styles.inputLabelRow}>
                  <Text style={styles.inputLabel}>Kata Sandi</Text>
                  <TouchableOpacity
                    onPress={() =>
                      Alert.alert(
                        'Pemulihan Sandi',
                        'Instruksi reset kata sandi telah dikirimkan ke WhatsApp resmi mitra pengemudi terdaftar.'
                      )
                    }
                    activeOpacity={0.7}
                  >
                    <Text style={styles.forgotPasswordText}>Lupa Sandi?</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.inputWrapper}>
                  <Lock size={16} color={colors.textMuted} strokeWidth={2} />
                  <TextInput
                    style={styles.textInput}
                    value={loginPassword}
                    onChangeText={setLoginPassword}
                    placeholder="Masukkan kata sandi akun"
                    placeholderTextColor={colors.textDisabled}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword((prev) => !prev)}
                    activeOpacity={0.7}
                    style={styles.eyeBtn}
                  >
                    {showPassword ? (
                      <EyeOff size={16} color={colors.textMuted} strokeWidth={2} />
                    ) : (
                      <Eye size={16} color={colors.textMuted} strokeWidth={2} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Remember Me Checkbox */}
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setRememberMe((prev) => !prev)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.checkboxBox,
                    rememberMe && styles.checkboxBoxChecked,
                  ]}
                >
                  {rememberMe && <Check size={11} color={colors.white} strokeWidth={3} />}
                </View>
                <Text style={styles.checkboxLabel}>
                  Ingat sesi login saya di perangkat ini
                </Text>
              </TouchableOpacity>

              {/* Primary Login Button */}
              <TouchableOpacity
                style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                onPress={handleLoginSubmit}
                activeOpacity={0.85}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <>
                    <Text style={styles.submitButtonText}>Masuk ke FLEETRA</Text>
                    <ArrowRight size={15} color={colors.white} strokeWidth={2.4} />
                  </>
                )}
              </TouchableOpacity>

              {/* Divider Or */}
              <View style={styles.orDividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.orDividerText}>ATAU PENGUJIAN CEPAT</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Quick Demo Login Button */}
              <TouchableOpacity
                style={styles.quickDemoCard}
                onPress={handleQuickDemoLogin}
                activeOpacity={0.85}
              >
                <View style={styles.demoIconCircle}>
                  <Sparkles size={16} color={colors.primary} strokeWidth={2.2} />
                </View>
                <View style={styles.demoTextCol}>
                  <Text style={styles.demoTitle}>1-Tap Demo: Budi Santoso</Text>
                  <Text style={styles.demoSubtitle}>
                    Daihatsu Gran Max Blind Van • Plat B 9821 KCE
                  </Text>
                </View>
                <ArrowRight size={14} color={colors.primary} strokeWidth={2.4} />
              </TouchableOpacity>
            </View>
          ) : (
            /* ============================================================== */
            /* REGISTER FORM                                                  */
            /* ============================================================== */
            <View style={styles.formContainer}>
              {/* Field 1: Nama Lengkap */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nama Lengkap Pengemudi</Text>
                <View style={styles.inputWrapper}>
                  <User size={16} color={colors.textMuted} strokeWidth={2} />
                  <TextInput
                    style={styles.textInput}
                    value={regName}
                    onChangeText={setRegName}
                    placeholder="Sesuai KTP / SIM Pengemudi"
                    placeholderTextColor={colors.textDisabled}
                  />
                </View>
              </View>

              {/* Field 2: No. WhatsApp */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>No. Handphone (WhatsApp)</Text>
                <View style={styles.inputWrapper}>
                  <Phone size={16} color={colors.textMuted} strokeWidth={2} />
                  <TextInput
                    style={styles.textInput}
                    value={regPhone}
                    onChangeText={setRegPhone}
                    placeholder="Contoh: 0812-3456-7890"
                    placeholderTextColor={colors.textDisabled}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              {/* Field 3: Nomor SIM */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nomor SIM (SIM B1 / A Umum)</Text>
                <View style={styles.inputWrapper}>
                  <FileText size={16} color={colors.textMuted} strokeWidth={2} />
                  <TextInput
                    style={styles.textInput}
                    value={regSim}
                    onChangeText={setRegSim}
                    placeholder="Contoh: 9204-1284-9012"
                    placeholderTextColor={colors.textDisabled}
                  />
                </View>
              </View>

              {/* Field 4: Program Armada Sewa-Beli */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Unit Armada & Skema Program</Text>
                <View style={styles.readOnlyVehicleBox}>
                  <Truck size={17} color={colors.primary} strokeWidth={2.2} />
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.vehicleChoiceTitle}>
                      Daihatsu Gran Max Blind Van 1.3L
                    </Text>
                    <Text style={styles.vehicleChoiceSub}>
                      Program Sewa-Beli (RTO) • Rp 50.000/ritase
                    </Text>
                  </View>
                  <CheckCircle2 size={16} color={colors.primary} strokeWidth={2.4} />
                </View>
              </View>

              {/* Field 5: Buat Sandi */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Buat Kata Sandi Akun</Text>
                <View style={styles.inputWrapper}>
                  <Lock size={16} color={colors.textMuted} strokeWidth={2} />
                  <TextInput
                    style={styles.textInput}
                    value={regPassword}
                    onChangeText={setRegPassword}
                    placeholder="Minimal 6 karakter kombinasi"
                    placeholderTextColor={colors.textDisabled}
                    secureTextEntry
                  />
                </View>
              </View>

              {/* Terms Checkbox */}
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setAgreeTerms((prev) => !prev)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.checkboxBox,
                    agreeTerms && styles.checkboxBoxChecked,
                  ]}
                >
                  {agreeTerms && <Check size={11} color={colors.white} strokeWidth={3} />}
                </View>
                <Text style={styles.checkboxLabel}>
                  Saya menyetujui Ketentuan Kemitraan Driver FLEETRA & Program Sewa-Beli (RTO).
                </Text>
              </TouchableOpacity>

              {/* Submit Register Button */}
              <TouchableOpacity
                style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                onPress={handleRegisterSubmit}
                activeOpacity={0.85}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <>
                    <Text style={styles.submitButtonText}>Daftar Sebagai Mitra Pengemudi</Text>
                    <ArrowRight size={15} color={colors.white} strokeWidth={2.4} />
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 3. FOOTER TRUST & HELP */}
        <View style={styles.footerNoteBox}>
          <ShieldCheck size={14} color={colors.textMuted} strokeWidth={2} />
          <Text style={styles.footerNoteText}>
            Platform Manajemen Armada Cerdas ADIKARA 2026 • Terenkripsi End-to-End
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 40,
  },

  /* TOP HEADER */
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 3,
  },
  backText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandLogo: {
    width: 26,
    height: 26,
  },
  brandName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
  },

  /* AUTH CARD */
  authCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeaderBox: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
  },

  /* SWITCHER TABS */
  switcherContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface2,
    borderRadius: 12,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 18,
  },
  switcherTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },
  switcherTabActive: {
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  switcherText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.textMuted,
  },
  switcherTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },

  /* FORMS */
  formContainer: {
    gap: 14,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  forgotPasswordText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    gap: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 12.5,
    color: colors.text,
  },
  eyeBtn: {
    padding: 4,
  },

  /* CHECKBOX */
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 2,
  },
  checkboxBox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxBoxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
  },

  /* SUBMIT BUTTON */
  submitButton: {
    backgroundColor: colors.primary,
    height: 48,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 2,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.white,
  },

  /* DIVIDER */
  orDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  orDividerText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: colors.textDisabled,
    letterSpacing: 0.5,
  },

  /* QUICK DEMO CARD */
  quickDemoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  demoIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  demoTextCol: {
    flex: 1,
  },
  demoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  demoSubtitle: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 1,
  },

  /* READONLY VEHICLE CHOICE */
  readOnlyVehicleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 10,
  },
  vehicleChoiceTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.text,
  },
  vehicleChoiceSub: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 1,
  },

  /* FOOTER NOTE */
  footerNoteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 6,
  },
  footerNoteText: {
    fontSize: 10.5,
    color: colors.textMuted,
  },
});
