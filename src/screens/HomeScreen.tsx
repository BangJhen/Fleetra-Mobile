import React from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ChevronRight,
  ClipboardList,
  Clock,
  Fuel,
  MapPin,
  Milestone,
  Play,
  Power,
  ShieldCheck,
  Timer,
  TrendingUp,
  Truck,
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { CircularProgress } from '../components/CircularProgress';
import { TopBar } from '../components/TopBar';
import { useApp } from '../context/AppContext';

interface HomeScreenProps {
  onNavigatePerjalanan?: () => void;
  onNavigateProfil?: () => void;
  onNavigateNotifications?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigatePerjalanan,
  onNavigateProfil,
  onNavigateNotifications,
}) => {
  const {
    navigateTo,
    hasUnreadNotifications,
    driverStatus,
    toggleDriverStatus,
    fuelPercent,
    odometerKm,
    safetyScore,
    rtoPercent,
    completedStops,
  } = useApp();

  const handlePerjalanan = onNavigatePerjalanan || (() => navigateTo('perjalanan'));
  const handleProfil = onNavigateProfil || (() => navigateTo('profil'));
  const handleNotifications = onNavigateNotifications || (() => navigateTo('notifikasi'));

  return (
    <View style={styles.container}>
      {/* 1. MODULAR TOP BAR (FIXED, NOT CRAMPED) */}
      <TopBar
        variant="logo"
        showNotificationBell
        hasUnreadNotifications={hasUnreadNotifications}
        onPressNotifications={handleNotifications}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 2. DRIVER PROFILE HERO CARD */}
        <View style={styles.heroCard}>
          <TouchableOpacity
            style={styles.heroLeft}
            onPress={handleProfil}
            activeOpacity={0.8}
            accessibilityLabel="Buka Profil Pengemudi"
          >
            <View style={styles.avatarWrapper}>
              <Image
                source={require('../../assets/driver-avatar.png')}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.driverInfo}>
              <Text style={styles.greetingText}>Selamat bertugas,</Text>
              <Text style={styles.driverName}>Budi Santoso</Text>
              <View style={styles.vehicleRow}>
                <Truck size={12} color={colors.textSecondary} strokeWidth={2} />
                <Text style={styles.vehicleText} numberOfLines={1}>
                  Gran Max - B 9821 KCE
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* DEDICATED ON / OFF DUTY SWITCH BUTTON */}
          <View style={styles.dutySwitchCol}>
            <Text style={styles.dutySwitchLabel}>STATUS TUGAS</Text>
            <TouchableOpacity
              style={[
                styles.dutyToggleBtn,
                driverStatus === 'Aktif'
                  ? styles.dutyToggleBtnActive
                  : styles.dutyToggleBtnInactive,
              ]}
              onPress={toggleDriverStatus}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={`Status kerja ${driverStatus}. Ketuk untuk mengalihkan mode.`}
            >
              <Power
                size={13}
                color={driverStatus === 'Aktif' ? '#065F46' : '#64748B'}
                strokeWidth={2.4}
              />
              <Text
                style={[
                  styles.dutyToggleStatusText,
                  driverStatus === 'Aktif'
                    ? styles.dutyToggleStatusTextActive
                    : styles.dutyToggleStatusTextInactive,
                ]}
              >
                {driverStatus === 'Aktif' ? 'ON' : 'OFF'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. CARD: TUGAS HARI INI */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={styles.iconBoxBlue}>
                <ClipboardList size={16} color={colors.white} strokeWidth={2.2} />
              </View>
              <Text style={styles.cardTitle}>Tugas Hari Ini</Text>
            </View>
            <TouchableOpacity
              style={styles.cardHeaderRight}
              onPress={handlePerjalanan}
              activeOpacity={0.7}
            >
              <Text style={styles.activeTaskLink}>
                {completedStops.length >= 4
                  ? 'Semua Stop Selesai'
                  : `${completedStops.length}/4 Stop Selesai`}
              </Text>
              <ChevronRight size={14} color={colors.primary} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          {/* Inner Task Details Box */}
          <View style={styles.innerTaskBox}>
            <Text style={styles.tripCode}>#TRIP-2026-089</Text>
            <Text style={styles.tripRoute}>Gudang Cimahi → 4 Titik Bandung Kota</Text>

            <View style={styles.divider} />

            <View style={styles.metricsRow}>
              {/* Metric 1 */}
              <View style={styles.metricItem}>
                <View style={styles.metricIconRow}>
                  <Clock size={13} color={colors.primary} strokeWidth={2.2} />
                  <Text style={styles.metricValue}>08.00 WIB</Text>
                </View>
                <Text style={styles.metricLabel}>Waktu Mulai</Text>
              </View>

              {/* Metric 2 */}
              <View style={styles.metricItem}>
                <View style={styles.metricIconRow}>
                  <MapPin size={13} color={colors.primary} strokeWidth={2.2} />
                  <Text style={styles.metricValue}>4 Stop</Text>
                </View>
                <Text style={styles.metricLabel}>Tujuan</Text>
              </View>

              {/* Metric 3 */}
              <View style={styles.metricItem}>
                <View style={styles.metricIconRow}>
                  <Timer size={13} color={colors.primary} strokeWidth={2.2} />
                  <Text style={styles.metricValue}>± 1j 15m</Text>
                </View>
                <Text style={styles.metricLabel}>Estimasi</Text>
              </View>
            </View>
          </View>

          {/* Action Button: Mulai / Lanjutkan Perjalanan */}
          <TouchableOpacity
            style={styles.primaryActionButton}
            onPress={handlePerjalanan}
            activeOpacity={0.85}
          >
            <Play size={14} color={colors.white} fill={colors.white} style={{ marginRight: 8 }} />
            <Text style={styles.primaryActionText}>
              {completedStops.length >= 4
                ? 'Ritase Selesai - Lihat Riwayat'
                : completedStops.length > 1
                ? 'Lanjutkan Perjalanan'
                : 'Mulai Perjalanan'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 4. CARD: STATUS ARMADA (Interactive: Tap for live diagnostics) */}
        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            Alert.alert(
              'Telemetri Armada (B 9821 KCE)',
              '- Bahan Bakar: 74% (± 280 km jarak tempuh tersisa)\n- Odometer Hari Ini: 128 km (Ritase ke-2)\n- Tekanan Ban: 33 PSI (Normal)\n- Suhu Mesin: 88°C (Optimal)\n- Kondisi Keseluruhan: Siap Digunakan',
              [{ text: 'Tutup' }]
            )
          }
          activeOpacity={0.85}
        >
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Truck size={17} color={colors.primary} strokeWidth={2.2} />
              <Text style={[styles.cardTitle, { marginLeft: 8 }]}>Status Armada</Text>
            </View>

            <View style={styles.statusPillNeutral}>
              <Text style={styles.statusPillNeutralText}>Siap Digunakan</Text>
            </View>
          </View>

          <View style={styles.armadaRow}>
            {/* Kolom 1: Bahan Bakar */}
            <View style={styles.armadaCol}>
              <View style={styles.iconCircleLightBlue}>
                <Fuel size={18} color={colors.primary} strokeWidth={2.2} />
              </View>
              <View style={styles.armadaColText}>
                <Text style={styles.armadaLabel}>Bahan Bakar</Text>
                <Text style={styles.armadaValue}>74%</Text>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: '74%' }]} />
                </View>
              </View>
            </View>

            {/* Kolom 2: Odometer Hari Ini */}
            <View style={styles.armadaCol}>
              <View style={styles.iconCircleLightBlue}>
                <Milestone size={18} color={colors.primary} strokeWidth={2.2} />
              </View>
              <View style={styles.armadaColText}>
                <Text style={styles.armadaLabel}>Odometer Hari Ini</Text>
                <Text style={styles.armadaValue}>128 km</Text>
                <Text style={styles.armadaSubLabel}>Ritase Ke-2</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* 5. DUA KARTU METRIK: SAFETY SCORE & PROGRESS RTO */}
        <View style={styles.twinCardsRow}>
          {/* Kartu Kiri: Safety Score */}
          <TouchableOpacity
            style={styles.halfCard}
            onPress={handleProfil}
            activeOpacity={0.85}
          >
            <View style={styles.halfCardHeader}>
              <View style={styles.halfCardHeaderLeft}>
                <ShieldCheck size={15} color={colors.primary} strokeWidth={2.2} />
                <Text style={styles.halfCardTitle}>Safety Score</Text>
              </View>
              <ChevronRight size={14} color={colors.textDisabled} strokeWidth={2} />
            </View>

            <View style={styles.halfCardBody}>
              <CircularProgress
                size={54}
                strokeWidth={4.5}
                percentage={94}
                color={colors.primary}
                bgColor="#E2E8F0"
              >
                <Text style={styles.scoreTextMain}>94</Text>
                <Text style={styles.scoreTextSub}>/100</Text>
              </CircularProgress>

              <View style={styles.scoreMetaContainer}>
                <Text style={styles.scoreHeadlineText}>Sangat Baik</Text>
                <Text style={styles.scoreSubText}>30 hari terakhir</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Kartu Kanan: Progress RTO */}
          <TouchableOpacity
            style={styles.halfCard}
            onPress={handleProfil}
            activeOpacity={0.85}
          >
            <View style={styles.halfCardHeader}>
              <View style={styles.halfCardHeaderLeft}>
                <TrendingUp size={15} color={colors.primary} strokeWidth={2.2} />
                <Text style={styles.halfCardTitle}>Progress RTO</Text>
              </View>
              <ChevronRight size={14} color={colors.textDisabled} strokeWidth={2} />
            </View>

            <View style={styles.halfCardBody}>
              <CircularProgress
                size={54}
                strokeWidth={4.5}
                percentage={64.8}
                color={colors.primary}
                bgColor="#E2E8F0"
              >
                <Text style={styles.rtoPctText}>64,8%</Text>
              </CircularProgress>

              <View style={styles.rtoMetaContainer}>
                <Text style={styles.rtoHeadlineText}>Bulan ke-23</Text>
                <Text style={styles.rtoSubText}>dari 36 bulan</Text>
              </View>
            </View>
          </TouchableOpacity>
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
    paddingBottom: 110,
  },

  /* DRIVER HERO CARD */
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    marginHorizontal: 18,
    marginTop: 14,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  heroLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: colors.primary,
    overflow: 'hidden',
    backgroundColor: colors.surface2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 26,
  },
  driverInfo: {
    marginLeft: 14,
    flex: 1,
    justifyContent: 'center',
  },
  greetingText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  driverName: {
    fontSize: 15.5,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.2,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  vehicleText: {
    fontSize: 11.5,
    fontWeight: '500',
    color: colors.textSecondary,
    marginLeft: 5,
  },
  /* DUTY ON / OFF BUTTON */
  dutySwitchCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 10,
  },
  dutySwitchLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  dutyToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 5,
    minWidth: 58,
  },
  dutyToggleBtnActive: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
  },
  dutyToggleBtnInactive: {
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1',
  },
  dutyToggleStatusText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  dutyToggleStatusTextActive: {
    color: '#065F46',
  },
  dutyToggleStatusTextInactive: {
    color: '#64748B',
  },

  /* CARD GENERIC */
  card: {
    backgroundColor: colors.surface,
    marginHorizontal: 18,
    marginTop: 14,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBoxBlue: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 8,
  },
  cardHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeTaskLink: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
    marginRight: 2,
  },

  /* INNER TASK BOX */
  innerTaskBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EDF2F7',
    marginBottom: 14,
  },
  tripCode: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  tripRoute: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 10,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: {
    flex: 1,
  },
  metricIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 4,
  },
  metricLabel: {
    fontSize: 10,
    color: colors.textMuted,
  },

  /* PRIMARY ACTION BUTTON */
  primaryActionButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },
  primaryActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.white,
  },

  /* STATUS ARMADA */
  statusPillNeutral: {
    backgroundColor: colors.surface2,
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusPillNeutralText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  armadaRow: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 12,
  },
  armadaCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EDF2F7',
  },
  iconCircleLightBlue: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  armadaColText: {
    flex: 1,
  },
  armadaLabel: {
    fontSize: 10,
    color: colors.textMuted,
  },
  armadaValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginTop: 1,
  },
  armadaSubLabel: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 1,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    marginTop: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },

  /* TWIN CARDS */
  twinCardsRow: {
    flexDirection: 'row',
    marginHorizontal: 18,
    marginTop: 14,
    gap: 12,
  },
  halfCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  halfCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  halfCardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  halfCardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 6,
  },
  halfCardBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreTextMain: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
  },
  scoreTextSub: {
    fontSize: 8,
    fontWeight: '600',
    color: colors.textMuted,
  },
  scoreMetaContainer: {
    marginLeft: 10,
    flex: 1,
  },
  scoreHeadlineText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  scoreSubText: {
    fontSize: 9.5,
    color: colors.textMuted,
    marginTop: 2,
  },

  rtoPctText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
  },
  rtoMetaContainer: {
    marginLeft: 10,
    flex: 1,
  },
  rtoHeadlineText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  rtoSubText: {
    fontSize: 9.5,
    color: colors.textMuted,
    marginTop: 2,
  },
});
