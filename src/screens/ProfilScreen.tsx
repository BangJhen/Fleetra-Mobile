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
  CreditCard,
  History,
  LogOut,
  Settings,
  ShieldCheck,
  TrendingUp,
  Truck,
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { CircularProgress } from '../components/CircularProgress';
import { useApp } from '../context/AppContext';

interface ProfilScreenProps {
  onBackToHome?: () => void;
  onNavigatePerjalanan?: () => void;
}

export const ProfilScreen: React.FC<ProfilScreenProps> = (props) => {
  const {
    navigateTo,
    safetyScore,
    rtoPercent,
    driverStatus,
    hasUnreadNotifications,
    driverProfile,
  } = useApp();

  const handleBackHome = props.onBackToHome || (() => navigateTo('beranda'));
  const handlePerjalanan = props.onNavigatePerjalanan || (() => navigateTo('perjalanan'));

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* PAGE TITLE & SUBTITLE */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Profil</Text>
          <Text style={styles.pageSubtitle}>
            Kelola informasi akun, performa, dan progres kemitraan armada
          </Text>
        </View>

        {/* 3. PROFILE HEADER CARD */}
        <View style={styles.profileCard}>
          <View style={styles.profileLeft}>
            <View style={styles.avatarWrapper}>
              <Image
                source={require('../../assets/driver-avatar.png')}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.profileTextGroup}>
              <Text style={styles.driverName}>{driverProfile.name}</Text>
              <Text style={styles.driverRole}>Mitra Pengemudi</Text>
              <View style={styles.plateRow}>
                <Truck size={12} color={colors.textSecondary} strokeWidth={2} />
                <Text style={styles.plateText}>{driverProfile.vehiclePlate}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.editProfileBtn}
            onPress={() => navigateTo('edit-profil')}
            activeOpacity={0.75}
          >
            <Text style={styles.editProfileBtnText}>Edit Profil</Text>
          </TouchableOpacity>
        </View>

        {/* 4. TWIN METRIC CARDS (SAFETY SCORE & KONDISI ARMADA) */}
        <View style={styles.twinCardsRow}>
          {/* Left Card: Safety Score (Interactive breakdown) */}
          <TouchableOpacity
            style={styles.twinCard}
            onPress={() =>
              Alert.alert(
                'Rincian Driver Safety Score (94/100)',
                '• Pengereman Halus (Smooth Braking): 96/100\n• Kepatuhan Batas Kecepatan: 92/100\n• Akselerasi & Manuver Menikung: 95/100\n• Kebugaran Pengemudi (Fatigue Monitoring): 94/100\n\nKategori: Sangat Baik. Anda berhak atas insentif ritase prioritas bulan ini!',
                [{ text: 'Tutup' }]
              )
            }
            activeOpacity={0.85}
          >
            <View style={styles.twinCardHeader}>
              <ShieldCheck size={15} color={colors.primary} strokeWidth={2.2} />
              <Text style={styles.twinCardTitle}>Safety Score</Text>
            </View>

            <View style={styles.twinCardBody}>
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

              <View style={styles.scoreMetaCol}>
                <Text style={styles.scoreHeadline}>Sangat Baik</Text>
                <Text style={styles.scoreSubMeta}>Performa 30 hari</Text>
                <Text style={styles.scoreSubMeta}>Zero-Incident</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Right Card: Kondisi Armada (Interactive telemetry) */}
          <TouchableOpacity
            style={styles.twinCard}
            onPress={() =>
              Alert.alert(
                'Diagnostik Armada (B 9821 KCE)',
                '• Model: Gran Max Blind Van\n• Odometer: 128.430 km\n• Sistem Rem & ABS: Normal (Tebal Kampas 85%)\n• Tekanan Ban: 33 PSI rata 4 roda\n• Oli Mesin: 82% (Servis berkala 1.570 km lagi)\n• Tilang Elektronik (ETLE): Bersih (0 Pelanggaran)',
                [{ text: 'Tutup' }]
              )
            }
            activeOpacity={0.85}
          >
            <View style={styles.twinCardHeader}>
              <Truck size={15} color={colors.primary} strokeWidth={2.2} />
              <Text style={styles.twinCardTitle}>Kondisi Armada</Text>
            </View>

            <View style={styles.armadaCardBody}>
              <View style={styles.armadaStatusRow}>
                <Text style={styles.armadaStatusText}>Normal (Siap Pakai)</Text>
              </View>
              <Text style={styles.armadaModelText}>Gran Max Blind Van</Text>
              <Text style={styles.armadaOdoText}>128.430 km</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 5. PROGRESS RENT-TO-OWN (RTO) CARD (Navigates to Riwayat Setoran) */}
        <TouchableOpacity
          style={styles.rtoCard}
          onPress={() => navigateTo('riwayat-setoran')}
          activeOpacity={0.85}
        >
          <View style={styles.rtoCardHeader}>
            <View style={styles.rtoHeaderLeft}>
              <TrendingUp size={15} color={colors.primary} strokeWidth={2.2} />
              <Text style={styles.rtoCardTitle}>Progress Rent-To-Own (RTO)</Text>
            </View>
            <ChevronRight size={15} color={colors.textDisabled} strokeWidth={2} />
          </View>

          <Text style={styles.rtoTenureSubtitle}>Bulan ke-23 dari 36 bulan tenor</Text>

          <View style={styles.rtoBodyRow}>
            {/* Circular Donut Progress Ring */}
            <CircularProgress
              size={72}
              strokeWidth={5.5}
              percentage={64.8}
              color={colors.primary}
              bgColor="#E2E8F0"
            >
              <Text style={styles.rtoLargePct}>64,8%</Text>
            </CircularProgress>

            {/* Stats Breakdown */}
            <View style={styles.rtoStatsCol}>
              <View style={styles.rtoStatItem}>
                <Text style={styles.rtoStatLabel}>Setoran Terkumpul</Text>
                <Text style={styles.rtoStatValueBold}>Rp 194.400.000</Text>
              </View>

              <View style={styles.rtoStatDivider} />

              <View style={styles.rtoStatItem}>
                <Text style={styles.rtoStatLabel}>Sisa Kewajiban</Text>
                <Text style={styles.rtoStatValueBold}>Rp 105.600.000</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* 6. NAVIGATION MENU LIST */}
        <View style={styles.menuCard}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handlePerjalanan}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <History size={16} color={colors.textSecondary} strokeWidth={2} />
              <Text style={styles.menuItemTitle}>Riwayat Perjalanan</Text>
            </View>
            <ChevronRight size={15} color={colors.textDisabled} strokeWidth={2} />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigateTo('riwayat-setoran')}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <CreditCard size={16} color={colors.textSecondary} strokeWidth={2} />
              <Text style={styles.menuItemTitle}>Riwayat Setoran RTO</Text>
            </View>
            <ChevronRight size={15} color={colors.textDisabled} strokeWidth={2} />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigateTo('pengaturan-akun')}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <Settings size={16} color={colors.textSecondary} strokeWidth={2} />
              <Text style={styles.menuItemTitle}>Pengaturan Akun</Text>
            </View>
            <ChevronRight size={15} color={colors.textDisabled} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* 7. DANGER ACTION BUTTON: KELUAR AKUN */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() =>
            Alert.alert(
              'Keluar Akun',
              'Apakah Anda yakin ingin keluar dari akun mitra pengemudi FLEETRA?',
              [
                { text: 'Batal', style: 'cancel' },
                { text: 'Keluar', style: 'destructive', onPress: handleBackHome },
              ]
            )
          }
          activeOpacity={0.8}
        >
          <LogOut size={15} color={colors.dangerDark} strokeWidth={2} style={{ marginRight: 6 }} />
          <Text style={styles.logoutButtonText}>Keluar Akun</Text>
        </TouchableOpacity>
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

  /* PAGE HEADER */
  pageHeader: {
    paddingHorizontal: 18,
    marginTop: 20,
    marginBottom: 12,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.3,
  },
  pageSubtitle: {
    fontSize: 12.5,
    color: colors.textMuted,
    marginTop: 3,
  },

  /* PROFILE CARD */
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    marginHorizontal: 18,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarWrapper: {
    width: 54,
    height: 54,
    borderRadius: 27,
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
    borderRadius: 27,
  },
  profileTextGroup: {
    marginLeft: 14,
    flex: 1,
    justifyContent: 'center',
  },
  driverName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.2,
  },
  driverRole: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  plateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  plateText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginLeft: 5,
  },
  editProfileBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  editProfileBtnText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  /* TWIN CARDS */
  twinCardsRow: {
    flexDirection: 'row',
    marginHorizontal: 18,
    gap: 12,
    marginBottom: 14,
  },
  twinCard: {
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
  twinCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  twinCardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 6,
  },
  twinCardBody: {
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
  scoreMetaCol: {
    marginLeft: 10,
    flex: 1,
  },
  scoreHeadline: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  scoreSubMeta: {
    fontSize: 9.5,
    color: colors.textMuted,
    lineHeight: 13,
    marginTop: 1,
  },

  armadaCardBody: {
    justifyContent: 'center',
  },
  armadaStatusRow: {
    marginBottom: 3,
  },
  armadaStatusText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  armadaModelText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  armadaOdoText: {
    fontSize: 10.5,
    color: colors.textMuted,
    marginTop: 1,
  },

  /* RTO CARD */
  rtoCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 18,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  rtoCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  rtoHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rtoCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 6,
  },
  rtoTenureSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 12,
  },
  rtoBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rtoLargePct: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
  },
  rtoStatsCol: {
    marginLeft: 14,
    flex: 1,
  },
  rtoStatItem: {
    paddingVertical: 1,
  },
  rtoStatLabel: {
    fontSize: 10,
    color: colors.textMuted,
    marginBottom: 1,
  },
  rtoStatValueBold: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.text,
  },
  rtoStatDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 5,
  },

  /* MENU CARD */
  menuCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemTitle: {
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 10,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginLeft: 42,
  },

  /* LOGOUT BUTTON */
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 18,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  logoutButtonText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.dangerDark,
  },
});
