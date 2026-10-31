import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  BarChart2,
  Bell,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  Fuel,
  MapPin,
  Milestone,
  Play,
  ShieldCheck,
  TrendingUp,
  Truck,
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { CircularProgress } from '../components/CircularProgress';

interface HomeScreenProps {
  onNavigatePerjalanan: () => void;
  onNavigateProfil: () => void;
  onNavigateNotifications?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigatePerjalanan,
  onNavigateProfil,
  onNavigateNotifications,
}) => {
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* 1. TOP HEADER / APP BAR */}
      <View style={styles.topBar}>
        <View style={styles.logoRow}>
          <Image
            source={require('../../assets/Fleetra Blue Ribbon Logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <TouchableOpacity
          style={styles.bellButton}
          activeOpacity={0.75}
          onPress={onNavigateNotifications}
          accessibilityLabel="Notifikasi"
        >
          <Bell size={22} color={colors.text} strokeWidth={2} />
          <View style={styles.badgeDot} />
        </TouchableOpacity>
      </View>

      {/* 2. DRIVER GREETING & VEHICLE HERO SECTION */}
      <View style={styles.heroSection}>
        <View style={styles.heroLeft}>
          <View style={styles.avatarWrapper}>
            <Image
              source={require('../../assets/driver-avatar.png')}
              style={styles.avatarImage}
            />
          </View>
          <View style={styles.driverInfo}>
            <Text style={styles.greetingText}>Selamat bertugas,</Text>
            <Text style={styles.driverName}>Budi Santoso</Text>
            <View style={styles.vehicleRow}>
              <Truck size={12} color={colors.textMuted} strokeWidth={2} />
              <Text style={styles.vehicleText}>B 9821 KCE • Gran Max Blind Van</Text>
            </View>
          </View>
        </View>

        <View style={styles.heroRight}>
          <Image
            source={require('../../assets/van-illustration.png')}
            style={styles.vanImage}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* 3. CARD: TUGAS HARI INI */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <View style={styles.iconBoxBlue}>
              <ClipboardList size={18} color={colors.white} strokeWidth={2.2} />
            </View>
            <Text style={styles.cardTitle}>Tugas Hari Ini</Text>
          </View>
          <TouchableOpacity
            style={styles.cardHeaderRight}
            onPress={onNavigatePerjalanan}
            activeOpacity={0.7}
          >
            <Text style={styles.activeTaskLink}>1 Penugasan Aktif</Text>
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
                <BarChart2 size={13} color={colors.primary} strokeWidth={2.2} />
                <Text style={styles.metricValue}>± 1 jam 15 menit</Text>
              </View>
              <Text style={styles.metricLabel}>Estimasi</Text>
            </View>
          </View>
        </View>

        {/* Action Button: Mulai Perjalanan */}
        <TouchableOpacity
          style={styles.primaryActionButton}
          onPress={onNavigatePerjalanan}
          activeOpacity={0.85}
        >
          <Play size={14} color={colors.white} fill={colors.white} style={{ marginRight: 8 }} />
          <Text style={styles.primaryActionText}>Mulai Perjalanan</Text>
        </TouchableOpacity>
      </View>

      {/* 4. CARD: STATUS ARMADA */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Truck size={18} color={colors.primary} strokeWidth={2.2} />
            <Text style={[styles.cardTitle, { marginLeft: 8 }]}>Status Armada</Text>
          </View>
          <View style={styles.statusPillGreen}>
            <CheckCircle2 size={13} color={colors.success} strokeWidth={2.5} />
            <Text style={styles.statusPillGreenText}>Siap Digunakan</Text>
          </View>
        </View>

        <View style={styles.armadaRow}>
          {/* Kolom 1: Bahan Bakar */}
          <View style={styles.armadaCol}>
            <View style={styles.iconCircleLightBlue}>
              <Fuel size={20} color={colors.primary} strokeWidth={2.2} />
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
              <Milestone size={20} color={colors.primary} strokeWidth={2.2} />
            </View>
            <View style={styles.armadaColText}>
              <Text style={styles.armadaLabel}>Odometer Hari Ini</Text>
              <Text style={styles.armadaValue}>128 km</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 5. DUA KARTU METRIK: SAFETY SCORE & PROGRESS RTO */}
      <View style={styles.twinCardsRow}>
        {/* Kartu Kiri: Safety Score */}
        <TouchableOpacity
          style={styles.halfCard}
          onPress={onNavigateProfil}
          activeOpacity={0.85}
        >
          <View style={styles.halfCardHeader}>
            <View style={styles.halfCardHeaderLeft}>
              <ShieldCheck size={16} color={colors.primary} strokeWidth={2.2} />
              <Text style={styles.halfCardTitle}>Safety Score</Text>
            </View>
            <ChevronRight size={14} color={colors.textDisabled} strokeWidth={2} />
          </View>

          <View style={styles.halfCardBody}>
            <CircularProgress
              size={56}
              strokeWidth={4.5}
              percentage={94}
              color={colors.primary}
              bgColor="#E2E8F0"
            >
              <Text style={styles.scoreTextMain}>94</Text>
              <Text style={styles.scoreTextSub}>/100</Text>
            </CircularProgress>

            <View style={styles.scoreBadgePill}>
              <Text style={styles.scoreBadgeText}>Sangat Baik</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Kartu Kanan: Progress RTO */}
        <TouchableOpacity
          style={styles.halfCard}
          onPress={onNavigateProfil}
          activeOpacity={0.85}
        >
          <View style={styles.halfCardHeader}>
            <View style={styles.halfCardHeaderLeft}>
              <TrendingUp size={16} color={colors.primary} strokeWidth={2.2} />
              <Text style={styles.halfCardTitle}>Progress RTO</Text>
            </View>
            <ChevronRight size={14} color={colors.textDisabled} strokeWidth={2} />
          </View>

          <View style={styles.halfCardBody}>
            <CircularProgress
              size={56}
              strokeWidth={4.5}
              percentage={64.8}
              color={colors.primary}
              bgColor="#E2E8F0"
            >
              <Text style={styles.rtoPctText}>64,8%</Text>
            </CircularProgress>

            <View style={styles.rtoTextContainer}>
              <Text style={styles.rtoTenureText}>Bulan ke-23</Text>
              <Text style={styles.rtoTenureSub}>dari 36</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    paddingBottom: 110, // Memberikan ruang aman untuk floating bottom bar
  },

  /* TOP APP BAR */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 12,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 124,
    height: 32,
  },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.danger,
    borderWidth: 1.5,
    borderColor: colors.surface,
  },

  /* HERO GREETING SECTION */
  heroSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginBottom: 6,
  },
  heroLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: colors.primary,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  driverInfo: {
    marginLeft: 10,
    flex: 1,
  },
  greetingText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  },
  driverName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginTop: 1,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  vehicleText: {
    fontSize: 10.5,
    color: colors.textMuted,
    fontWeight: '500',
    marginLeft: 4,
  },
  heroRight: {
    width: 110,
    height: 65,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  vanImage: {
    width: '100%',
    height: '100%',
  },

  /* CARD GENERAL STYLES */
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBoxBlue: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 10,
  },
  cardHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeTaskLink: {
    fontSize: 11.5,
    color: colors.primary,
    fontWeight: '600',
    marginRight: 2,
  },

  /* INNER TASK BOX */
  innerTaskBox: {
    backgroundColor: colors.bg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 14,
    marginTop: 12,
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
    marginTop: 3,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 10,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricItem: {
    alignItems: 'flex-start',
  },
  metricIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 4,
  },
  metricLabel: {
    fontSize: 9.5,
    color: colors.textDisabled,
    fontWeight: '500',
    marginTop: 2,
  },

  /* BUTTON PRIMARY */
  primaryActionButton: {
    height: 46,
    backgroundColor: colors.primary,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryActionText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },

  /* STATUS ARMADA */
  statusPillGreen: {
    backgroundColor: colors.successLight,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusPillGreenText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.success,
    marginLeft: 4,
  },
  armadaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  armadaCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircleLightBlue: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  armadaColText: {
    marginLeft: 10,
    flex: 1,
  },
  armadaLabel: {
    fontSize: 10.5,
    color: colors.textMuted,
    fontWeight: '500',
  },
  armadaValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginTop: 1,
  },
  progressBarBg: {
    width: '85%',
    height: 4.5,
    backgroundColor: colors.border,
    borderRadius: 3,
    marginTop: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },

  /* TWIN METRIC CARDS ROW */
  twinCardsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  halfCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    marginHorizontal: 4,
  },
  halfCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
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
    justifyContent: 'space-between',
  },
  scoreTextMain: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },
  scoreTextSub: {
    fontSize: 8.5,
    color: colors.textDisabled,
    fontWeight: '600',
  },
  scoreBadgePill: {
    backgroundColor: colors.successLight,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 10,
  },
  scoreBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.success,
  },
  rtoPctText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: colors.text,
  },
  rtoTextContainer: {
    marginLeft: 8,
    flex: 1,
  },
  rtoTenureText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text,
  },
  rtoTenureSub: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '500',
    marginTop: 1,
  },
});

