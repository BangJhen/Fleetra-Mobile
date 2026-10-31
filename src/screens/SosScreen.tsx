import React, { useState } from 'react';
import {
  Alert,
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
  ShieldAlert,
  Wrench,
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { TopBar } from '../components/TopBar';

interface SosScreenProps {
  onBack: () => void;
}

export const SosScreen: React.FC<SosScreenProps> = ({ onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sosActivated, setSosActivated] = useState(false);

  const handleTriggerSos = (categoryName?: string) => {
    setSosActivated(true);
    Alert.alert(
      'Sinyal Darurat Dipancarkan',
      `Pusat Kendali Dispatcher FLEETRA telah menerima sinyal SOS dari armada B 9821 KCE (Budi Santoso) di lokasi Jl. Pasteur No. 142, Bandung.${
        categoryName ? ` Kategori: ${categoryName}.` : ''
      } Petugas dispatcher dan tim tanggap darurat segera menghubungi Anda.`,
      [
        {
          text: 'Konfirmasi Diterima',
          onPress: () => {},
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
        subtitle="Siaga Operasional 24/7"
        onBack={onBack}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 2. HERO TITLE & SUBTITLE */}
        <View style={styles.heroHeader}>
          <Text style={styles.heroTitle}>
            Butuh Bantuan{'\n'}Darurat di Perjalanan?
          </Text>
          <Text style={styles.heroSubtitle}>
            Tekan tombol SOS untuk memancarkan koordinat telematika prioritas tinggi
            langsung ke konsol pusat kendali dispatcher.
          </Text>
        </View>

        {/* 3. BIG RED SOS CALL BUTTON */}
        <TouchableOpacity
          style={[styles.bigSosButton, sosActivated && styles.bigSosButtonActive]}
          onPress={() => handleTriggerSos()}
          activeOpacity={0.85}
        >
          <View style={styles.sosInnerContent}>
            <View style={styles.sosIconCircle}>
              <PhoneCall size={24} color={colors.white} strokeWidth={2.2} />
            </View>
            <View style={styles.sosTextCol}>
              <Text style={styles.sosMainText}>
                {sosActivated ? 'SOS Terpancar (Aktif)' : 'Aktifkan SOS'}
              </Text>
              <Text style={styles.sosSubText}>
                {sosActivated
                  ? 'Dispatcher terhubung via telemetry streaming'
                  : 'Hubungi tim siaga Fleetra sekarang'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

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
              onPress={() => {
                setSelectedCategory('kendaraan');
                handleTriggerSos('Kendala Mesin / Mogok / Ban Pecah');
              }}
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
              onPress={() => {
                setSelectedCategory('kecelakaan');
                handleTriggerSos('Insiden Kecelakaan Lalu Lintas');
              }}
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
              onPress={() => {
                setSelectedCategory('keamanan');
                handleTriggerSos('Isu Keamanan / Pembegalan / Bahaya Kriminal');
              }}
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
              onPress={() => {
                setSelectedCategory('lainnya');
                handleTriggerSos('Kendala Operasional Lain');
              }}
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
});
