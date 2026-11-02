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
  ChevronLeft,
  Eye,
  EyeOff,
  FileText,
  Lock,
  Mail,
  Phone,
  Truck,
  User,
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';

export const RegisterScreen: React.FC = () => {
  const { register, navigateTo, vehicle, driverProfile } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [simNumber, setSimNumber] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Nama Wajib', 'Harap masukkan nama lengkap Anda sesuai KTP/SIM.');
      return;
    }
    if (!phone.trim()) {
      Alert.alert('No. Handphone Wajib', 'Harap masukkan nomor WhatsApp aktif Anda.');
      return;
    }
    if (!simNumber.trim()) {
      Alert.alert('Nomor SIM Wajib', 'Harap masukkan nomor SIM pengemudi Anda.');
      return;
    }
    if (!vehicleModel.trim()) {
      Alert.alert('Model Kendaraan Wajib', 'Harap masukkan tipe/model kendaraan yang Anda kemudikan.');
      return;
    }
    if (!vehiclePlate.trim()) {
      Alert.alert('Nomor Pelat Wajib', 'Harap masukkan nomor pelat nomor kendaraan Anda.');
      return;
    }
    if (!password.trim() || password.length < 6) {
      Alert.alert('Kata Sandi Terlalu Pendek', 'Kata sandi minimal 6 karakter.');
      return;
    }
    if (!agreeTerms) {
      Alert.alert('Syarat & Ketentuan', 'Anda wajib menyetujui Ketentuan Kemitraan FLEETRA.');
      return;
    }

    setIsLoading(true);
    try {
      const userEmail =
        email.trim() || `${name.trim().toLowerCase().replace(/\s+/g, '.')}@fleetra.id`;

      await register({
        name: name.trim(),
        email: userEmail,
        phone: phone.trim(),
        simNumber: simNumber.trim(),
        vehicleModel: vehicleModel.trim(),
        vehiclePlate: vehiclePlate.trim().toUpperCase(),
        password: password.trim(),
      });
      Alert.alert(
        'Pendaftaran Berhasil!',
        `Selamat datang mitra ${name.trim()}! Akun kemitraan armada Anda telah aktif.`
      );
    } catch (err) {
      Alert.alert(
        'Pendaftaran Gagal',
        err instanceof Error ? err.message : 'Silakan periksa data pendaftaran Anda.'
      );
    } finally {
      setIsLoading(false);
    }
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
          {/* TOP BACK TO LOGIN */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigateTo('login')}
            activeOpacity={0.7}
          >
            <ChevronLeft size={16} color={colors.textSecondary} strokeWidth={2.2} />
            <Text style={styles.backText}>Kembali ke Masuk</Text>
          </TouchableOpacity>

          {/* BRAND LOGO (Centered, No Card Box) */}
          <View style={styles.logoRow}>
            <Image
              source={require('../../assets/Fleetra Blue Ribbon Logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          {/* TITLE & SUBTITLE */}
          <Text style={styles.title}>Daftar Mitra Driver</Text>
          <Text style={styles.subtitle}>
            Lengkapi data untuk bergabung dalam armada cerdas FLEETRA
          </Text>

          {/* INPUT: NAMA LENGKAP */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nama Lengkap (sesuai KTP/SIM)</Text>
            <View style={styles.inputContainer}>
              <User size={16} color={colors.textMuted} strokeWidth={2} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Contoh: Budi Santoso"
                placeholderTextColor={colors.textDisabled}
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          {/* INPUT: EMAIL */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Mitra (Opsional / Otomatis)</Text>
            <View style={styles.inputContainer}>
              <Mail size={16} color={colors.textMuted} strokeWidth={2} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="nama@fleetra.id"
                placeholderTextColor={colors.textDisabled}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* INPUT: NO HANDPHONE */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>No. Handphone / WhatsApp</Text>
            <View style={styles.inputContainer}>
              <Phone size={16} color={colors.textMuted} strokeWidth={2} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="0812-xxxx-xxxx"
                placeholderTextColor={colors.textDisabled}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* INPUT: NOMOR SIM */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nomor SIM (B1 / A Umum)</Text>
            <View style={styles.inputContainer}>
              <FileText size={16} color={colors.textMuted} strokeWidth={2} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Contoh: 9204-1284-9012"
                placeholderTextColor={colors.textDisabled}
                value={simNumber}
                onChangeText={setSimNumber}
                autoCapitalize="characters"
              />
            </View>
          </View>

          {/* INPUT: MODEL KENDARAAN */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Model Kendaraan Mitra</Text>
            <View style={styles.inputContainer}>
              <Truck size={16} color={colors.textMuted} strokeWidth={2} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Contoh: Daihatsu Gran Max Blind Van"
                placeholderTextColor={colors.textDisabled}
                value={vehicleModel}
                onChangeText={setVehicleModel}
              />
            </View>
          </View>

          {/* INPUT: NOMOR PELAT KENDARAAN */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nomor Pelat Polisi</Text>
            <View style={styles.inputContainer}>
              <Truck size={16} color={colors.textMuted} strokeWidth={2} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Contoh: D 8124 FTR"
                placeholderTextColor={colors.textDisabled}
                value={vehiclePlate}
                onChangeText={(t) => setVehiclePlate(t.toUpperCase())}
                autoCapitalize="characters"
              />
            </View>
          </View>

          {/* INPUT: PASSWORD */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Kata Sandi Akun</Text>
            <View style={styles.inputContainer}>
              <Lock size={16} color={colors.textMuted} strokeWidth={2} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Minimal 6 karakter"
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
              >
                {showPassword ? (
                  <EyeOff size={16} color={colors.textMuted} strokeWidth={2} />
                ) : (
                  <Eye size={16} color={colors.textMuted} strokeWidth={2} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* TERMS CHECKBOX */}
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setAgreeTerms(!agreeTerms)}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, agreeTerms && styles.checkboxActive]}>
              {agreeTerms && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
            </View>
            <Text style={styles.checkboxText}>
              Saya menyetujui Ketentuan Kemitraan & Program Sewa-Beli (RTO) FLEETRA.
            </Text>
          </TouchableOpacity>

          {/* SUBMIT BUTTON */}
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
                <Text style={styles.submitButtonText}>Daftar Akun Mitra</Text>
                <ArrowRight size={16} color="#FFFFFF" strokeWidth={2.4} />
              </>
            )}
          </TouchableOpacity>

          {/* FOOTER: LINK TO LOGIN */}
          <View style={styles.footerRow}>
            <Text style={styles.footerTextMuted}>Sudah memiliki akun mitra?</Text>
            <TouchableOpacity
              onPress={() => navigateTo('login')}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.footerLinkBold}> Masuk di Sini</Text>
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
    paddingVertical: 32,
  },
  formWrapper: {
    width: '100%',
    maxWidth: 360,
  },

  /* BACK BUTTON */
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  /* LOGO */
  logoRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoImage: {
    width: 155,
    height: 40,
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
    marginBottom: 22,
    paddingHorizontal: 6,
  },

  /* INPUTS */
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.text,
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
    alignItems: 'flex-start',
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
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxText: {
    flex: 1,
    fontSize: 11.5,
    color: colors.textSecondary,
    lineHeight: 16,
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
    marginBottom: 20,
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

