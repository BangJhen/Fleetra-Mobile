import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Bell,
  ChevronRight,
  Cpu,
  FileText,
  Info,
  Lock,
  LogOut,
  Moon,
  Radio,
  RotateCcw,
  Shield,
  Sparkles,
  Volume2,
  Vibrate,
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { TopBar } from '../components/TopBar';
import { LogoutModal } from '../components/LogoutModal';
import { useApp } from '../context/AppContext';

export const PengaturanAkunScreen: React.FC = () => {
  const { goBack, settings, toggleSetting, logout, navigateTo } = useApp();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleClearCache = () => {
    Alert.alert(
      'Hapus Cache Operasional',
      'Apakah Anda ingin membersihkan cache peta offline, thumbnail e-POD lokal, dan log telematika sementara?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus Cache',
          style: 'destructive',
          onPress: () =>
            Alert.alert('Sukses', 'Cache operasional (14,2 MB) berhasil dibersihkan.'),
        },
      ]
    );
  };

  const handleChangePin = () => {
    Alert.alert(
      'Ganti PIN Pengemudi',
      'Kode OTP verifikasi untuk mengatur ulang 6-digit PIN e-POD telah dikirimkan via SMS/WhatsApp ke nomor terdaftar.',
      [{ text: 'Lanjutkan' }]
    );
  };

  return (
    <View style={styles.container}>
      <TopBar
        variant="back"
        title="Pengaturan Akun"
        subtitle="Preferensi, Suara & Keamanan"
        onBack={goBack}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* SECTION 1: NOTIFIKASI & FEEDBACK */}
        <View style={styles.section}>
          <Text style={styles.sectionHeaderTitle}>Notifikasi & Feedback</Text>
          <View style={styles.card}>
            {/* Push Notifications */}
            <View style={styles.settingRow}>
              <View style={styles.iconCircle}>
                <Bell size={16} color={colors.primary} strokeWidth={2.2} />
              </View>
              <View style={styles.settingTextGroup}>
                <Text style={styles.settingTitle}>Notifikasi Ritase & Penugasan</Text>
                <Text style={styles.settingSubtitle}>
                  Terima alert rute baru, reminder e-POD, dan update jadwal.
                </Text>
              </View>
              <Switch
                value={settings.pushNotifications}
                onValueChange={() => toggleSetting('pushNotifications')}
                trackColor={{ false: '#CBD5E1', true: colors.primaryLight }}
                thumbColor={settings.pushNotifications ? colors.primary : '#F8FAFC'}
              />
            </View>

            <View style={styles.divider} />

            {/* Suara Navigasi */}
            <View style={styles.settingRow}>
              <View style={styles.iconCircle}>
                <Volume2 size={16} color={colors.primary} strokeWidth={2.2} />
              </View>
              <View style={styles.settingTextGroup}>
                <Text style={styles.settingTitle}>Panduan Suara Navigasi OSRM</Text>
                <Text style={styles.settingSubtitle}>
                  Instruksi suara belokan demi belokan (turn-by-turn).
                </Text>
              </View>
              <Switch
                value={settings.navSound}
                onValueChange={() => toggleSetting('navSound')}
                trackColor={{ false: '#CBD5E1', true: colors.primaryLight }}
                thumbColor={settings.navSound ? colors.primary : '#F8FAFC'}
              />
            </View>

            <View style={styles.divider} />

            {/* Getar Peringatan */}
            <View style={styles.settingRow}>
              <View style={styles.iconCircle}>
                <Vibrate size={16} color={colors.primary} strokeWidth={2.2} />
              </View>
              <View style={styles.settingTextGroup}>
                <Text style={styles.settingTitle}>Getar Peringatan Telematika</Text>
                <Text style={styles.settingSubtitle}>
                  Haptic alert saat deteksi pengereman mendadak atau kelelahan.
                </Text>
              </View>
              <Switch
                value={settings.hapticFeedback}
                onValueChange={() => toggleSetting('hapticFeedback')}
                trackColor={{ false: '#CBD5E1', true: colors.primaryLight }}
                thumbColor={settings.hapticFeedback ? colors.primary : '#F8FAFC'}
              />
            </View>
          </View>
        </View>

        {/* SECTION 2: DAYA & HARDWARE */}
        <View style={styles.section}>
          <Text style={styles.sectionHeaderTitle}>Daya & Telematika IoT</Text>
          <View style={styles.card}>
            {/* Mode Hemat Baterai */}
            <View style={styles.settingRow}>
              <View style={styles.iconCircle}>
                <Moon size={16} color={colors.primary} strokeWidth={2.2} />
              </View>
              <View style={styles.settingTextGroup}>
                <Text style={styles.settingTitle}>Mode Efisiensi Baterai / Data</Text>
                <Text style={styles.settingSubtitle}>
                  Streaming telematika GPS diatur per 10 detik saat layar mati.
                </Text>
              </View>
              <Switch
                value={settings.batterySaver}
                onValueChange={() => toggleSetting('batterySaver')}
                trackColor={{ false: '#CBD5E1', true: colors.primaryLight }}
                thumbColor={settings.batterySaver ? colors.primary : '#F8FAFC'}
              />
            </View>

            <View style={styles.divider} />

            {/* Dongle OBD-II */}
            <TouchableOpacity
              style={styles.settingActionRow}
              onPress={() =>
                Alert.alert(
                  'Status Perangkat OBD-II',
                  'Model: FLEETRA Telematics Dongle v2.1\nProtokol: CAN-Bus ISO 15765-4\nKoneksi: BLE 5.0 (Aktif & Terhubung)\nSinyal Satelit GPS: 14 Satelit (Akurasi 2,1m)\nStatus Sensor Gyro: Terkalibrasi',
                  [{ text: 'Tutup' }]
                )
              }
              activeOpacity={0.7}
            >
              <View style={styles.iconCircle}>
                <Radio size={16} color={colors.primary} strokeWidth={2.2} />
              </View>
              <View style={styles.settingTextGroup}>
                <Text style={styles.settingTitle}>Dongle OBD-II Terhubung</Text>
                <Text style={styles.settingSubtitle}>
                  ID: #BDG-OBD-092 - Sinyal Kuat (Terhubung)
                </Text>
              </View>
              <ChevronRight size={16} color={colors.textDisabled} strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        {/* SECTION 3: KEAMANAN & AKUN */}
        <View style={styles.section}>
          <Text style={styles.sectionHeaderTitle}>Keamanan & Verifikasi</Text>
          <View style={styles.card}>
            {/* Ganti PIN */}
            <TouchableOpacity
              style={styles.settingActionRow}
              onPress={handleChangePin}
              activeOpacity={0.7}
            >
              <View style={styles.iconCircle}>
                <Lock size={16} color={colors.primary} strokeWidth={2.2} />
              </View>
              <View style={styles.settingTextGroup}>
                <Text style={styles.settingTitle}>Ganti PIN Pengemudi (6-Digit)</Text>
                <Text style={styles.settingSubtitle}>
                  Digunakan untuk konfirmasi darurat dan penyerahan kargo.
                </Text>
              </View>
              <ChevronRight size={16} color={colors.textDisabled} strokeWidth={2} />
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Syarat & Kebijakan */}
            <TouchableOpacity
              style={styles.settingActionRow}
              onPress={() =>
                Alert.alert(
                  'Kebijakan Privasi & Kemitraan',
                  'FLEETRA menjamin perlindungan data lokasi, telematika, dan keuangan mitra pengemudi sesuai regulasi UU PDP No. 27/2022 dan standar ISO 27001.',
                  [{ text: 'Tutup' }]
                )
              }
              activeOpacity={0.7}
            >
              <View style={styles.iconCircle}>
                <Shield size={16} color={colors.primary} strokeWidth={2.2} />
              </View>
              <View style={styles.settingTextGroup}>
                <Text style={styles.settingTitle}>Kebijakan Privasi & Privasi Data</Text>
                <Text style={styles.settingSubtitle}>
                  Kepatuhan perlindungan data telematika pengemudi.
                </Text>
              </View>
              <ChevronRight size={16} color={colors.textDisabled} strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        {/* SECTION 4: TENTANG & CACHE */}
        <View style={styles.section}>
          <Text style={styles.sectionHeaderTitle}>Sistem & Pemeliharaan</Text>
          <View style={styles.card}>
            {/* Clear cache */}
            <TouchableOpacity
              style={styles.settingActionRow}
              onPress={handleClearCache}
              activeOpacity={0.7}
            >
              <View style={styles.iconCircle}>
                <RotateCcw size={16} color={colors.primary} strokeWidth={2.2} />
              </View>
              <View style={styles.settingTextGroup}>
                <Text style={styles.settingTitle}>Bersihkan Cache Aplikasi</Text>
                <Text style={styles.settingSubtitle}>
                  Hapus file peta offline sementara dan log lokal.
                </Text>
              </View>
              <ChevronRight size={16} color={colors.textDisabled} strokeWidth={2} />
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Onboarding walkthrough */}
            <TouchableOpacity
              style={styles.settingActionRow}
              onPress={() => navigateTo('onboarding')}
              activeOpacity={0.7}
            >
              <View style={styles.iconCircle}>
                <Sparkles size={16} color={colors.primary} strokeWidth={2.2} />
              </View>
              <View style={styles.settingTextGroup}>
                <Text style={styles.settingTitle}>Buka Panduan Onboarding</Text>
                <Text style={styles.settingSubtitle}>
                  Pelajari kembali fitur telematika, e-POD, dan Sewa-Beli RTO.
                </Text>
              </View>
              <ChevronRight size={16} color={colors.textDisabled} strokeWidth={2} />
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* App Info */}
            <View style={styles.settingRow}>
              <View style={styles.iconCircle}>
                <Info size={16} color={colors.primary} strokeWidth={2.2} />
              </View>
              <View style={styles.settingTextGroup}>
                <Text style={styles.settingTitle}>FLEETRA Mobile</Text>
                <Text style={styles.settingSubtitle}>
                  Versi 1.0.0-mvp (Build 2026.11 ADIKARA Finalist Edition)
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* LOGOUT BUTTON */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => setShowLogoutModal(true)}
          activeOpacity={0.8}
          accessibilityLabel="Keluar dari Akun Mitra"
        >
          <LogOut size={15} color={colors.dangerDark} strokeWidth={2} style={{ marginRight: 6 }} />
          <Text style={styles.logoutBtnText}>Keluar dari Akun Mitra</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* LOGOUT CONFIRMATION MODAL */}
      <LogoutModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          setShowLogoutModal(false);
          logout();
        }}
      />
    </View>
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
    paddingBottom: 40,
  },
  section: {
    marginHorizontal: 18,
    marginTop: 16,
  },
  sectionHeaderTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
  },
  settingActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingTextGroup: {
    flex: 1,
    marginRight: 8,
  },
  settingTitle: {
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.text,
  },
  settingSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
    lineHeight: 15,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginLeft: 46,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginHorizontal: 18,
    marginTop: 18,
    marginBottom: 30,
    height: 46,
    borderRadius: 12,
  },
  logoutBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.dangerDark,
  },
});

