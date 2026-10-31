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
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  MapPin,
  Phone,
  PhoneCall,
  Shield,
  ShieldAlert,
  Siren,
  Truck,
  Wrench,
} from 'lucide-react-native';
import { colors } from '../theme/colors';

interface SosScreenProps {
  onBack: () => void;
}

export const SosScreen: React.FC<SosScreenProps> = ({ onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sosActivated, setSosActivated] = useState(false);

  const handleTriggerSos = (categoryName?: string) => {
    setSosActivated(true);
    Alert.alert(
      'Sinyal Darurat Dikirim!',
      `Pusat Kendali Dispatcher FLEETRA telah menerima sinyal SOS dari B 9821 KCE (Budi Santoso) di lokasi Jl. Pasteur No. 142, Bandung.${
        categoryName ? ` Kategori: ${categoryName}.` : ''
      } Operator segera menghubungi Anda.`,
      [
        {
          text: 'Mengerti',
          onPress: () => {},
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* 1. TOP HEADER / APP BAR */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
          accessibilityLabel="Kembali"
        >
          <ArrowLeft size={20} color={colors.text} strokeWidth={2.2} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>SOS</Text>

        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 2. HERO TITLE & SUBTITLE */}
        <View style={styles.heroHeader}>
          <Text style={styles.heroTitle}>
            Butuh Bantuan{'\n'}Darurat?
          </Text>
          <Text style={styles.heroSubtitle}>
            Tekan tombol SOS untuk menghubungi tim bantuan Fleetra dengan cepat.
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
              <PhoneCall size={26} color={colors.white} strokeWidth={2.2} />
            </View>
            <View style={styles.sosTextCol}>
              <Text style={styles.sosMainText}>
                {sosActivated ? 'SOS Terpancar (Aktif)' : 'Aktifkan SOS'}
              </Text>
              <Text style={styles.sosSubText}>
                {sosActivated
                  ? 'Dispatcher terhubung via telemetry'
                  : 'Hubungi tim Fleetra sekarang'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* 4. SECTION: BUTUH BANTUAN LAIN? */}
        <View style={styles.categorySection}>
          <Text style={styles.categorySectionTitle}>Butuh Bantuan Lain?</Text>

          <View style={styles.categoryGrid}>
            {/* Masalah Kendaraan */}
            <TouchableOpacity
              style={[
                styles.categoryCard,
                selectedCategory === 'kendaraan' && styles.categoryCardSelected,
              ]}
              onPress={() => {
                setSelectedCategory('kendaraan');
                handleTriggerSos('Masalah Kendaraan (Mogok / Mesin)');
              }}
              activeOpacity={0.8}
            >
              <View style={styles.categoryIconCircle}>
                <Wrench size={20} color={colors.primary} strokeWidth={2.2} />
              </View>
              <Text style={styles.categoryLabel}>Masalah{'\n'}Kendaraan</Text>
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
              <View style={[styles.categoryIconCircle, { backgroundColor: '#FEE2E2' }]}>
                <AlertTriangle size={20} color={colors.danger} strokeWidth={2.2} />
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
                handleTriggerSos('Isu Keamanan / Pembegalan');
              }}
              activeOpacity={0.8}
            >
              <View style={[styles.categoryIconCircle, { backgroundColor: '#FEF3C7' }]}>
                <ShieldAlert size={20} color={colors.warningDark} strokeWidth={2.2} />
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
                handleTriggerSos('Bantuan Operasional Lain');
              }}
              activeOpacity={0.8}
            >
              <View style={styles.categoryIconCircle}>
                <HelpCircle size={20} color={colors.primary} strokeWidth={2.2} />
              </View>
              <Text style={styles.categoryLabel}>Lainnya</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 5. CARD: LOKASI SAAT INI */}
        <View style={styles.locationCard}>
          <View style={styles.locationLeft}>
            <View style={styles.locationIconWrapper}>
              <MapPin size={18} color={colors.primary} strokeWidth={2.2} />
            </View>
            <View style={styles.locationTextGroup}>
              <Text style={styles.locationLabel}>Lokasi Saat Ini</Text>
              <Text style={styles.locationAddress}>
                Jl. Pasteur No. 142, Bandung
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.viewMapLink}
            onPress={() =>
              Alert.alert('Koordinat GPS', 'Lat: -6.8992, Lng: 107.5954 (Presisi ± 3 meter)')
            }
            activeOpacity={0.7}
          >
            <Text style={styles.viewMapText}>Lihat di Peta</Text>
          </TouchableOpacity>
        </View>

        {/* 6. STEP TIMELINE: YANG TERJADI SETELAH ANDA MENEKAN SOS */}
        <View style={styles.timelineCard}>
          <Text style={styles.timelineTitle}>
            Yang Terjadi Setelah Anda Menekan SOS
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
                Bantuan{'\n'}diproses
              </Text>
            </View>

            <View style={styles.stepConnector} />

            {/* Step 3 */}
            <View style={styles.stepItem}>
              <View style={styles.stepNumberBadge}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepDesc}>
                Pendampingan{'\n'}hingga selesai
              </Text>
            </View>
          </View>
        </View>

        {/* 7. BOTTOM WARNING / DISCLAIMER BOX */}
        <View style={styles.warningBox}>
          <AlertCircle size={16} color={colors.textMuted} strokeWidth={2} style={{ marginTop: 2 }} />
          <Text style={styles.warningText}>
            Fitur ini hanya digunakan untuk kondisi darurat di perjalanan. Pastikan
            Anda berada di lokasi yang aman.
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
  scrollContent: {
    paddingBottom: 40,
  },

  /* HEADER */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface2,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  headerRightPlaceholder: {
    width: 40,
  },

  /* HERO HEADER */
  heroHeader: {
    paddingHorizontal: 18,
    marginTop: 14,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.4,
    lineHeight: 30,
  },
  heroSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 8,
    lineHeight: 18,
  },

  /* BIG RED SOS BUTTON */
  bigSosButton: {
    backgroundColor: colors.dangerDark,
    marginHorizontal: 18,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 20,
    shadowColor: colors.dangerDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 20,
  },
  bigSosButtonActive: {
    backgroundColor: colors.danger,
  },
  sosInnerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sosIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  sosTextCol: {
    flex: 1,
  },
  sosMainText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: -0.3,
  },
  sosSubText: {
    fontSize: 12,
    color: '#FEE2E2',
    marginTop: 2,
  },

  /* CATEGORY SECTION */
  categorySection: {
    marginHorizontal: 18,
    marginBottom: 16,
  },
  categorySectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  categoryGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  categoryCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  categoryCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryMuted,
  },
  categoryIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 14,
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
    marginBottom: 16,
  },
  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  locationIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  locationTextGroup: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 11,
    color: colors.textMuted,
  },
  locationAddress: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginTop: 2,
  },
  viewMapLink: {
    paddingHorizontal: 8,
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
    marginBottom: 16,
  },
  timelineTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
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
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryMuted,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
  },
  stepDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 14,
    fontWeight: '500',
  },
  stepConnector: {
    height: 2,
    backgroundColor: '#E2E8F0',
    flex: 0.5,
    marginTop: 13,
  },

  /* WARNING BOX */
  warningBox: {
    flexDirection: 'row',
    marginHorizontal: 18,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  warningText: {
    flex: 1,
    fontSize: 11,
    color: colors.textMuted,
    marginLeft: 8,
    lineHeight: 16,
  },
});
