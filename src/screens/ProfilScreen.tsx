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
  Clock,
  CreditCard,
  FileText,
  History,
  LogOut,
  Settings,
  ShieldCheck,
  TrendingUp,
  Truck,
  UserCheck,
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { CircularProgress } from '../components/CircularProgress';

interface ProfilScreenProps {
  onBackToHome: () => void;
  onNavigatePerjalanan?: () => void;
}

export const ProfilScreen: React.FC<ProfilScreenProps> = ({
  onBackToHome,
  onNavigatePerjalanan,
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
      </View>

      {/* 2. PAGE TITLE & SUBTITLE */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Profil</Text>
        <Text style={styles.pageSubtitle}>
          Kelola informasi akun, performa,{'\n'}dan progres kepemilikan armada.
        </Text>
      </View>

      {/* 3. PROFILE HEADER CARD */}
      <View style={styles.profileCard}>
        <View style={styles.profileLeft}>
          <View style={styles.avatarWrapper}>
            <Image
              source={require('../../assets/driver-avatar.png')}
              style={styles.avatarImage}
            />
          </View>
          <View style={styles.profileTextGroup}>
            <Text style={styles.driverName}>Budi Santoso</Text>
            <Text style={styles.driverRole}>Mitra Pengemudi</Text>
            <View style={styles.plateRow}>
              <Truck size={12} color={colors.textMuted} strokeWidth={2} />
              <Text style={styles.plateText}>B 9821 KCE</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.editProfileBtn}
          onPress={() =>
            Alert.alert('Edit Profil', 'Fitur pembaruan data diri mitra pengemudi.')
          }
          activeOpacity={0.75}
        >
          <Text style={styles.editProfileBtnText}>Edit Profil</Text>
        </TouchableOpacity>
      </View>

      {/* 4. TWIN METRIC CARDS (SAFETY SCORE & KONDISI ARMADA) */}
      <View style={styles.twinCardsRow}>
        {/* Left Card: Safety Score */}
        <View style={styles.twinCard}>
          <View style={styles.twinCardHeader}>
            <ShieldCheck size={16} color={colors.primary} strokeWidth={2.2} />
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
              <View style={styles.badgeGreenPill}>
                <Text style={styles.badgeGreenPillText}>Sangat Baik</Text>
              </View>
              <Text style={styles.scoreSubMeta}>Performa berkendara</Text>
              <Text style={styles.scoreSubMeta}>30 hari terakhir</Text>
            </View>
          </View>
        </View>

        {/* Right Card: Kondisi Armada */}
        <View style={styles.twinCard}>
          <View style={styles.twinCardHeader}>
            <Truck size={16} color={colors.primary} strokeWidth={2.2} />
            <Text style={styles.twinCardTitle}>Kondisi Armada</Text>
          </View>

          <View style={styles.armadaCardBody}>
            <View style={styles.badgeGreenPill}>
              <Text style={styles.badgeGreenPillText}>Normal</Text>
            </View>
            <Text style={styles.armadaModelText}>Gran Max Blind Van</Text>
            <Text style={styles.armadaOdoText}>128.430 km</Text>
          </View>
        </View>
      </View>

      {/* 5. PROGRESS RENT-TO-OWN (RTO) CARD */}
      <View style={styles.rtoCard}>
        <View style={styles.rtoCardHeader}>
          <View style={styles.rtoHeaderLeft}>
            <TrendingUp size={16} color={colors.primary} strokeWidth={2.2} />
            <Text style={styles.rtoCardTitle}>Progress Rent-To-Own (RTO)</Text>
          </View>
          <ChevronRight size={16} color={colors.textDisabled} strokeWidth={2} />
        </View>

        <Text style={styles.rtoTenureSubtitle}>Bulan ke-23 dari 36</Text>

        <View style={styles.rtoBodyRow}>
          {/* Circular Donut Progress Ring */}
          <CircularProgress
            size={76}
            strokeWidth={6}
            percentage={64.8}
            color={colors.primary}
            bgColor="#E2E8F0"
          >
            <Text style={styles.rtoLargePct}>64,8%</Text>
          </CircularProgress>

          {/* Stats Breakdown */}
          <View style={styles.rtoStatsCol}>
            {/* Setoran Terkumpul */}
            <View style={styles.rtoStatItem}>
              <Text style={styles.rtoStatLabel}>Setoran Terkumpul</Text>
              <Text style={styles.rtoStatValueBold}>Rp 194.400.000</Text>
            </View>

            <View style={styles.rtoStatDivider} />

            {/* Sisa Setoran */}
            <View style={styles.rtoStatItem}>
              <Text style={styles.rtoStatLabel}>Sisa Setoran</Text>
              <Text style={styles.rtoStatValueBold}>Rp 105.600.000</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 6. NAVIGATION MENU LIST */}
      <View style={styles.menuCard}>
        {/* Riwayat Perjalanan */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={onNavigatePerjalanan}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemLeft}>
            <History size={18} color={colors.textSecondary} strokeWidth={2} />
            <Text style={styles.menuItemTitle}>Riwayat Perjalanan</Text>
          </View>
          <ChevronRight size={16} color={colors.textDisabled} strokeWidth={2} />
        </TouchableOpacity>

        <View style={styles.menuDivider} />

        {/* Riwayat Setoran RTO */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            Alert.alert(
              'Riwayat Setoran RTO',
              'Menampilkan rekam audit setoran otomatis pay-per-trip dari setiap ritase pengantaran yang diselesaikan.'
            )
          }
          activeOpacity={0.7}
        >
          <View style={styles.menuItemLeft}>
            <CreditCard size={18} color={colors.textSecondary} strokeWidth={2} />
            <Text style={styles.menuItemTitle}>Riwayat Setoran RTO</Text>
          </View>
          <ChevronRight size={16} color={colors.textDisabled} strokeWidth={2} />
        </TouchableOpacity>

        <View style={styles.menuDivider} />

        {/* Pengaturan Akun */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            Alert.alert('Pengaturan Akun', 'Pengaturan notifikasi, bahasa, dan keamanan kata sandi.')
          }
          activeOpacity={0.7}
        >
          <View style={styles.menuItemLeft}>
            <Settings size={18} color={colors.textSecondary} strokeWidth={2} />
            <Text style={styles.menuItemTitle}>Pengaturan Akun</Text>
          </View>
          <ChevronRight size={16} color={colors.textDisabled} strokeWidth={2} />
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
              { text: 'Keluar', style: 'destructive', onPress: onBackToHome },
            ]
          )
        }
        activeOpacity={0.8}
      >
        <LogOut size={16} color={colors.danger} strokeWidth={2} style={{ marginRight: 8 }} />
        <Text style={styles.logoutButtonText}>Keluar Akun</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    paddingBottom: 110,
  },

  /* TOP BAR */
  topBar: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 4,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 120,
    height: 30,
  },

  /* PAGE HEADER */
  pageHeader: {
    paddingHorizontal: 18,
    marginTop: 6,
    marginBottom: 14,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.3,
  },
  pageSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
    lineHeight: 18,
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: colors.primary,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  profileTextGroup: {
    marginLeft: 12,
    flex: 1,
  },
  driverName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  driverRole: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  plateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  plateText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    marginLeft: 4,
  },
  editProfileBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  editProfileBtnText: {
    fontSize: 11,
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
    shadowRadius: 5,
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
  badgeGreenPill: {
    backgroundColor: colors.successLight,
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  badgeGreenPillText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.success,
  },
  scoreSubMeta: {
    fontSize: 9,
    color: colors.textMuted,
    lineHeight: 12,
  },

  armadaCardBody: {
    justifyContent: 'center',
    paddingTop: 2,
  },
  armadaModelText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    marginTop: 4,
  },
  armadaOdoText: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
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
    elevation: 2,
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
    marginBottom: 14,
  },
  rtoBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rtoLargePct: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
  },
  rtoStatsCol: {
    marginLeft: 16,
    flex: 1,
  },
  rtoStatItem: {
    paddingVertical: 2,
  },
  rtoStatLabel: {
    fontSize: 10,
    color: colors.textMuted,
    marginBottom: 2,
  },
  rtoStatValueBold: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  rtoStatDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 6,
  },

  /* MENU CARD */
  menuCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 12,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginLeft: 46,
  },

  /* LOGOUT BUTTON */
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.danger,
  },
});
