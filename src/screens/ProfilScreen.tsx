import React, { useState } from 'react';
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
  Sparkles,
  TrendingUp,
  Truck,
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { CircularProgress } from '../components/CircularProgress';
import { LogoutModal } from '../components/LogoutModal';
import { useApp } from '../context/AppContext';

interface ProfilScreenProps {
  onBackToHome?: () => void;
  onNavigatePerjalanan?: () => void;
}

export const ProfilScreen: React.FC<ProfilScreenProps> = (props) => {
  const {
    navigateTo,
    logout,
    safetyScore,
    rtoPercent,
    rtoPaid,
    rtoRemaining,
    rtoContract,
    vehicle,
    odometerKm,
    driverStatus,
    hasUnreadNotifications,
    driverProfile,
  } = useApp();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleBackHome = props.onBackToHome || (() => navigateTo('beranda'));
  const handlePerjalanan = props.onNavigatePerjalanan || (() => navigateTo('perjalanan'));

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const scoreHeadline =
    safetyScore >= 90 ? 'Sangat Baik' : safetyScore >= 75 ? 'Baik' : 'Perlu Perhatian';

  const odoDisplay = vehicle ? `${odometerKm.toLocaleString('id-ID')} km` : '-';
  const vehicleName = vehicle?.model || 'Belum Ada Armada';
  const vehiclePlate = vehicle?.plate || 'Belum Ada Armada';

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
              <Text style={styles.driverRole}>{driverProfile.email || 'Mitra Pengemudi'}</Text>
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
                `Rincian Driver Safety Score (${safetyScore}/100)`,
                `Total Ritase Kumulatif: ${driverProfile.trips || 42} Perjalanan (100% Selesai & e-POD)\nPengereman Halus (Smooth Braking): ${Math.min(100, safetyScore + 2)}/100\nKepatuhan Batas Kecepatan: ${Math.max(70, safetyScore - 2)}/100\nAkselerasi & Manuver Menikung: ${Math.min(100, safetyScore + 1)}/100\nKebugaran Pengemudi (Fatigue Monitoring): ${safetyScore}/100\n\nKategori: ${scoreHeadline}. Sinkron real-time dengan server Fleetra Dispatcher.`,
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
                percentage={safetyScore}
                color={colors.primary}
                bgColor="#E2E8F0"
              >
                <Text style={styles.scoreTextMain}>{safetyScore}</Text>
                <Text style={styles.scoreTextSub}>/100</Text>
              </CircularProgress>

              <View style={styles.scoreMetaCol}>
                <Text style={styles.scoreHeadline}>{scoreHeadline}</Text>
                <Text style={styles.scoreSubMeta}>{driverProfile.trips || 0} Ritase Selesai</Text>
                <Text style={styles.scoreSubMeta}>Zero-Incident</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Right Card: Kondisi Armada (Interactive telemetry) */}
          <TouchableOpacity
            style={styles.twinCard}
            onPress={() =>
              Alert.alert(
                vehicle ? `Diagnostik Armada (${vehiclePlate})` : 'Kondisi Armada',
                vehicle
                  ? `Model: ${vehicleName}\nOdometer: ${odoDisplay}\nStatus Mesin: ${vehicle?.status === 'moving' ? 'Aktif di Rute' : 'Siap Pakai'}\nBahan Bakar: ${vehicle?.fuel ?? 75}%\nSistem Rem & ABS: Normal (Tebal Kampas 85%)\nTilang Elektronik (ETLE): Bersih (0 Pelanggaran)`
                  : 'Armada kendaraan belum dialokasikan oleh dispatcher. Hubungi operator logistik untuk penugasan unit armada.',
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
                <Text style={styles.armadaStatusText}>
                  {vehicle ? (vehicle?.status === 'moving' ? 'Bergerak (Rute)' : 'Normal (Siap Pakai)') : 'Belum Dialokasikan'}
                </Text>
              </View>
              <Text style={styles.armadaModelText} numberOfLines={1}>{vehicleName}</Text>
              <Text style={styles.armadaOdoText}>{odoDisplay}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 5. PROGRESS RENT-TO-OWN (RTO) CARD (Navigates to Riwayat Setoran) */}
        <TouchableOpacity
          style={styles.rtoCard}
          onPress={() => {
            if (rtoContract) {
              navigateTo('riwayat-setoran');
            } else {
              Alert.alert(
                'Program Sewa-Beli (RTO)',
                'Akun Anda belum memiliki kontrak kepemilikan sewa-beli (Rent-To-Own) aktif. Hubungi manajemen FLEETRA untuk mengajukan alokasi armada.',
                [{ text: 'Tutup' }]
              );
            }
          }}
          activeOpacity={0.85}
        >
          <View style={styles.rtoCardHeader}>
            <View style={styles.rtoHeaderLeft}>
              <TrendingUp size={15} color={colors.primary} strokeWidth={2.2} />
              <Text style={styles.rtoCardTitle}>Progress Rent-To-Own (RTO)</Text>
            </View>
            <ChevronRight size={15} color={colors.textDisabled} strokeWidth={2} />
          </View>

          <Text style={styles.rtoTenureSubtitle}>
            {rtoContract ? `${rtoContract.vehicleName} - Tenor ${rtoContract.tenureMonths} Bulan` : 'Program Kepemilikan Sewa-Beli Belum Aktif'}
          </Text>

          <View style={styles.rtoBodyRow}>
            {/* Circular Donut Progress Ring */}
            <CircularProgress
              size={72}
              strokeWidth={5.5}
              percentage={rtoPercent}
              color={colors.primary}
              bgColor="#E2E8F0"
            >
              <Text style={styles.rtoLargePct}>{rtoPercent}%</Text>
            </CircularProgress>

            {/* Stats Breakdown */}
            <View style={styles.rtoStatsCol}>
              <View style={styles.rtoStatItem}>
                <Text style={styles.rtoStatLabel}>Setoran Terkumpul</Text>
                <Text style={styles.rtoStatValueBold}>{formatRupiah(rtoPaid)}</Text>
              </View>

              <View style={styles.rtoStatDivider} />

              <View style={styles.rtoStatItem}>
                <Text style={styles.rtoStatLabel}>Sisa Kewajiban</Text>
                <Text style={styles.rtoStatValueBold}>{formatRupiah(rtoRemaining)}</Text>
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

          <View style={styles.menuDivider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigateTo('onboarding')}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <Sparkles size={16} color={colors.primary} strokeWidth={2} />
              <Text style={styles.menuItemTitle}>Panduan & Onboarding Aplikasi</Text>
            </View>
            <ChevronRight size={15} color={colors.textDisabled} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* 7. DANGER ACTION BUTTON: KELUAR AKUN */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => setShowLogoutModal(true)}
          activeOpacity={0.8}
          accessibilityLabel="Keluar dari Akun Mitra"
        >
          <LogOut size={15} color={colors.dangerDark} strokeWidth={2} style={{ marginRight: 6 }} />
          <Text style={styles.logoutButtonText}>Keluar Akun</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* CONFIRMATION LOGOUT MODAL */}
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
