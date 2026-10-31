import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  AlertCircle,
  AlertTriangle,
  HelpCircle,
  MapPin,
  PhoneCall,
  Radio,
  ShieldAlert,
  Truck,
  User,
  Wrench,
  X,
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { TopBar } from '../components/TopBar';
import { useApp } from '../context/AppContext';

interface SosScreenProps {
  onBack?: () => void;
}

export const SosScreen: React.FC<SosScreenProps> = (props) => {
  const {
    isSosActive,
    sosCategory,
    sosTimestamp,
    activateSos,
    deactivateSos,
    driverProfile,
    goBack,
  } = useApp();

  const handleBack = props.onBack || goBack;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(sosCategory);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState<boolean>(false);
  const [pendingCategory, setPendingCategory] = useState<string | null>(null);

  const handleOpenConfirmModal = (categoryName?: string, categoryKey?: string) => {
    if (isSosActive) {
      handleDeactivateSos();
      return;
    }
    setPendingCategory(categoryName || 'Panggilan Darurat Umum');
    if (categoryKey) {
      setSelectedCategory(categoryKey);
    }
    setIsConfirmModalVisible(true);
  };

  const handleConfirmActivateSos = () => {
    setIsConfirmModalVisible(false);
    const categoryToActivate = pendingCategory || 'Panggilan Darurat Umum';
    activateSos(categoryToActivate);
    Alert.alert(
      'Sinyal Darurat Dipancarkan',
      `Pusat Kendali Dispatcher FLEETRA telah menerima sinyal SOS dari armada ${driverProfile.vehiclePlate} (${driverProfile.name}) di lokasi Jl. Pasteur No. 142, Bandung.\n\nKategori: ${categoryToActivate}.\n\nPetugas dispatcher dan tim tanggap darurat segera menghubungi Anda. Status darurat tersimpan aktif di seluruh sistem aplikasi.`,
      [{ text: 'Konfirmasi Diterima' }]
    );
  };

  const handleCancelConfirm = () => {
    setIsConfirmModalVisible(false);
    setPendingCategory(null);
  };

  const handleDeactivateSos = () => {
    Alert.alert(
      'Akhiri Sinyal Darurat?',
      'Apakah kendala armada di jalan raya telah tertangani dan kondisi kembali aman?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya, Akhiri SOS',
          onPress: () => {
            deactivateSos();
            setSelectedCategory(null);
            setPendingCategory(null);
            Alert.alert('Status Normal', 'Sinyal darurat telah dinonaktifkan.');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* 1. MODULAR TOP BAR (FIXED, SPACIOUS) */}
      <TopBar
        variant="back"
        title="Bantuan Darurat (SOS)"
        subtitle={isSosActive ? `Status: Aktif sejak ${sosTimestamp}` : 'Siaga Operasional 24/7'}
        onBack={handleBack}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 2. HERO TITLE & SUBTITLE */}
        <View style={styles.heroHeader}>
          <Text style={styles.heroTitle}>
            {isSosActive ? 'Status Darurat\nSedang Berjalan' : 'Butuh Bantuan\nDarurat di Perjalanan?'}
          </Text>
          <Text style={styles.heroSubtitle}>
            {isSosActive
              ? `Kategori kendala: ${sosCategory || 'Panggilan Darurat'}. Pusat kendali memantau koordinat GPS Anda secara langsung.`
              : 'Tekan tombol SOS untuk memancarkan koordinat telematika prioritas tinggi langsung ke konsol pusat kendali dispatcher.'}
          </Text>
        </View>

        {/* 3. BIG RED SOS CALL BUTTON */}
        <TouchableOpacity
          style={[styles.bigSosButton, isSosActive && styles.bigSosButtonActive]}
          onPress={() => (isSosActive ? handleDeactivateSos() : handleOpenConfirmModal())}
          activeOpacity={0.85}
        >
          <View style={styles.sosInnerContent}>
            <View style={styles.sosIconCircle}>
              <PhoneCall size={24} color={colors.white} strokeWidth={2.2} />
            </View>
            <View style={styles.sosTextCol}>
              <Text style={styles.sosMainText}>
                {isSosActive ? 'SOS Terpancar (Aktif)' : 'Aktifkan SOS'}
              </Text>
              <Text style={styles.sosSubText}>
                {isSosActive
                  ? 'Ketuk untuk mengakhiri atau memperbarui status'
                  : 'Hubungi tim siaga Fleetra sekarang'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Tombol Akhiri SOS Jika Sedang Aktif */}
        {isSosActive && (
          <TouchableOpacity
            style={styles.cancelSosButton}
            onPress={handleDeactivateSos}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelSosButtonText}>Akhiri Status Darurat (Kondisi Aman)</Text>
          </TouchableOpacity>
        )}

        {/* 4. SECTION: KATEGORI KENDALA */}
        <View style={styles.categorySection}>
          <Text style={styles.categorySectionTitle}>Pilih Kategori Kendala</Text>

          <View style={styles.categoryGrid}>
            {/* Masalah Kendaraan */}
            <TouchableOpacity
              style={[
                styles.categoryCard,
                selectedCategory === 'kendaraan' && styles.categoryCardSelected,
              ]}
              onPress={() =>
                handleOpenConfirmModal('Kendala Mesin / Mogok / Ban Pecah', 'kendaraan')
              }
              activeOpacity={0.8}
            >
              <View style={styles.categoryIconCircle}>
                <Wrench size={18} color={colors.primary} strokeWidth={2.2} />
              </View>
              <Text style={styles.categoryLabel}>Kendaraan</Text>
            </TouchableOpacity>

            {/* Kecelakaan */}
            <TouchableOpacity
              style={[
                styles.categoryCard,
                selectedCategory === 'kecelakaan' && styles.categoryCardSelected,
              ]}
              onPress={() =>
                handleOpenConfirmModal('Insiden Kecelakaan Lalu Lintas', 'kecelakaan')
              }
              activeOpacity={0.8}
            >
              <View style={styles.categoryIconCircle}>
                <AlertTriangle size={18} color={colors.dangerDark} strokeWidth={2.2} />
              </View>
              <Text style={styles.categoryLabel}>Kecelakaan</Text>
            </TouchableOpacity>

            {/* Keamanan */}
            <TouchableOpacity
              style={[
                styles.categoryCard,
                selectedCategory === 'keamanan' && styles.categoryCardSelected,
              ]}
              onPress={() =>
                handleOpenConfirmModal('Isu Keamanan / Pembegalan / Bahaya Kriminal', 'keamanan')
              }
              activeOpacity={0.8}
            >
              <View style={styles.categoryIconCircle}>
                <ShieldAlert size={18} color={colors.warning} strokeWidth={2.2} />
              </View>
              <Text style={styles.categoryLabel}>Keamanan</Text>
            </TouchableOpacity>

            {/* Lainnya */}
            <TouchableOpacity
              style={[
                styles.categoryCard,
                selectedCategory === 'lainnya' && styles.categoryCardSelected,
              ]}
              onPress={() =>
                handleOpenConfirmModal('Kendala Operasional Lain', 'lainnya')
              }
              activeOpacity={0.8}
            >
              <View style={styles.categoryIconCircle}>
                <HelpCircle size={18} color={colors.textSecondary} strokeWidth={2.2} />
              </View>
              <Text style={styles.categoryLabel}>Lainnya</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 5. CARD: LOKASI SAAT INI */}
        <View style={styles.locationCard}>
          <View style={styles.locationLeft}>
            <View style={styles.locationIconWrapper}>
              <MapPin size={16} color={colors.primary} strokeWidth={2.2} />
            </View>
            <View style={styles.locationTextGroup}>
              <Text style={styles.locationLabel}>Koordinat Lokasi Saat Ini</Text>
              <Text style={styles.locationAddress}>
                Jl. Pasteur No. 142, Bandung
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.viewMapLink}
            onPress={() =>
              Alert.alert('Koordinat GPS', 'Lat: -6.8992, Lng: 107.5954 (Presisi ± 3m)')
            }
            activeOpacity={0.7}
          >
            <Text style={styles.viewMapText}>Cek Titik</Text>
          </TouchableOpacity>
        </View>

        {/* 6. STEP TIMELINE: SOP PENANGANAN DARURAT */}
        <View style={styles.timelineCard}>
          <Text style={styles.timelineTitle}>
            Tahap Penanganan Setelah Tombol Ditekan
          </Text>

          <View style={styles.stepsRow}>
            {/* Step 1 */}
            <View style={styles.stepItem}>
              <View style={styles.stepNumberBadge}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepDesc}>
                Terhubung ke{'\n'}tim Fleetra
              </Text>
            </View>

            <View style={styles.stepConnector} />

            {/* Step 2 */}
            <View style={styles.stepItem}>
              <View style={styles.stepNumberBadge}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepDesc}>
                Bantuan teknis{'\n'}dikoordinasikan
              </Text>
            </View>

            <View style={styles.stepConnector} />

            {/* Step 3 */}
            <View style={styles.stepItem}>
              <View style={styles.stepNumberBadge}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepDesc}>
                Pendampingan{'\n'}hingga aman
              </Text>
            </View>
          </View>
        </View>

        {/* 7. BOTTOM WARNING / DISCLAIMER BOX */}
        <View style={styles.warningBox}>
          <AlertCircle size={15} color={colors.textMuted} strokeWidth={2} style={{ marginTop: 2 }} />
          <Text style={styles.warningText}>
            Fitur ini hanya digunakan khusus kondisi darurat operasional di jalan raya.
            Pastikan kendaraan menepi di lokasi aman saat menunggu instruksi dispatcher.
          </Text>
        </View>
      </ScrollView>

      {/* 8. MODAL ALERT KONFIRMASI SADAR DARURAT SOS */}
      <Modal
        visible={isConfirmModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelConfirm}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Warning Shield Header */}
            <View style={styles.modalIconWrapper}>
              <ShieldAlert size={30} color={colors.dangerDark} strokeWidth={2.2} />
            </View>

            <Text style={styles.modalTitle}>Konfirmasi Sinyal Darurat SOS</Text>

            <Text style={styles.modalDescription}>
              Apakah Anda yakin dan sadar ingin mengaktifkan sinyal darurat SOS? Sinyal prioritas tinggi dan telematika langsung akan dikirimkan ke konsol dispatcher FLEETRA.
            </Text>

            {/* Emergency Context Details */}
            <View style={styles.modalDetailBox}>
              <View style={styles.modalDetailRow}>
                <Radio size={13} color={colors.primary} strokeWidth={2.2} />
                <Text style={styles.modalDetailLabel}>Kategori</Text>
                <Text style={styles.modalDetailColon}>:</Text>
                <Text style={styles.modalDetailValue} numberOfLines={1}>
                  {pendingCategory || 'Panggilan Darurat Umum'}
                </Text>
              </View>

              <View style={styles.modalDetailRow}>
                <Truck size={13} color={colors.primary} strokeWidth={2.2} />
                <Text style={styles.modalDetailLabel}>Armada</Text>
                <Text style={styles.modalDetailColon}>:</Text>
                <Text style={styles.modalDetailValue} numberOfLines={1}>
                  {driverProfile.vehiclePlate} ({driverProfile.name})
                </Text>
              </View>

              <View style={styles.modalDetailRow}>
                <MapPin size={13} color={colors.primary} strokeWidth={2.2} />
                <Text style={styles.modalDetailLabel}>Lokasi</Text>
                <Text style={styles.modalDetailColon}>:</Text>
                <Text style={styles.modalDetailValue} numberOfLines={1}>
                  Jl. Pasteur No. 142, Bandung
                </Text>
              </View>
            </View>

            <Text style={styles.modalDisclaimer}>
              Pastikan kendaraan Anda telah menepi di bahu jalan yang aman sebelum menunggu respons tim dispatcher.
            </Text>

            {/* Action Buttons */}
            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={styles.modalBtnCancel}
                onPress={handleCancelConfirm}
                activeOpacity={0.75}
              >
                <Text style={styles.modalBtnCancelText}>Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalBtnConfirm}
                onPress={handleConfirmActivateSos}
                activeOpacity={0.85}
              >
                <Text style={styles.modalBtnConfirmText}>Ya, Aktifkan SOS</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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

  /* HERO HEADER */
  heroHeader: {
    paddingHorizontal: 18,
    marginTop: 14,
    marginBottom: 14,
  },
  heroTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.4,
    lineHeight: 27,
  },
  heroSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 6,
    lineHeight: 17,
  },

  /* BIG RED SOS BUTTON */
  bigSosButton: {
    backgroundColor: colors.dangerDark,
    marginHorizontal: 18,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    shadowColor: colors.dangerDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
  },
  bigSosButtonActive: {
    backgroundColor: '#B91C1C',
  },
  cancelSosButton: {
    marginHorizontal: 18,
    marginTop: -6,
    marginBottom: 16,
    paddingVertical: 10,
    backgroundColor: colors.surface2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelSosButtonText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  sosInnerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sosIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  sosTextCol: {
    flex: 1,
  },
  sosMainText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: -0.3,
  },
  sosSubText: {
    fontSize: 11.5,
    color: '#FEE2E2',
    marginTop: 2,
  },

  /* CATEGORY SECTION */
  categorySection: {
    marginHorizontal: 18,
    marginBottom: 14,
  },
  categorySectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  categoryGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  categoryCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryMuted,
  },
  categoryIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },

  /* LOCATION CARD */
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    marginHorizontal: 18,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  locationIconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  locationTextGroup: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 10.5,
    color: colors.textMuted,
  },
  locationAddress: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.text,
    marginTop: 1,
  },
  viewMapLink: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  viewMapText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },

  /* TIMELINE CARD */
  timelineCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 18,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  timelineTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 14,
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepNumberBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  stepNumberText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textSecondary,
  },
  stepDesc: {
    fontSize: 10.5,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 13.5,
    fontWeight: '500',
  },
  stepConnector: {
    height: 1.5,
    backgroundColor: colors.border,
    flex: 0.5,
    marginTop: 12,
  },

  /* WARNING BOX */
  warningBox: {
    flexDirection: 'row',
    marginHorizontal: 18,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  warningText: {
    flex: 1,
    fontSize: 10.5,
    color: colors.textMuted,
    marginLeft: 8,
    lineHeight: 15,
  },

  /* MODAL ALERT STYLES */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  modalIconWrapper: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FEF2F2',
    borderWidth: 2,
    borderColor: '#FECACA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    letterSpacing: -0.2,
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 17,
    marginBottom: 14,
  },
  modalDetailBox: {
    width: '100%',
    backgroundColor: colors.surface2,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
    marginBottom: 12,
  },
  modalDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalDetailLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    width: 54,
  },
  modalDetailColon: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    marginRight: 6,
  },
  modalDetailValue: {
    flex: 1,
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.text,
  },
  modalDisclaimer: {
    fontSize: 10.5,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 14.5,
    marginBottom: 16,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  modalBtnCancel: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnCancelText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  modalBtnConfirm: {
    flex: 1.3,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.dangerDark,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.dangerDark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 2,
  },
  modalBtnConfirmText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.white,
  },
});
