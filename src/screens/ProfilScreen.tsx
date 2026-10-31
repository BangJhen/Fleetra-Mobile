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
  ArrowLeft,
  Award,
  CheckCircle2,
  FileCheck2,
  Phone,
  ShieldCheck,
  TrendingUp,
  Truck,
  UserCheck,
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { CircularProgress } from '../components/CircularProgress';

interface ProfilScreenProps {
  onBackToHome: () => void;
}

export const ProfilScreen: React.FC<ProfilScreenProps> = ({ onBackToHome }) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBackToHome}>
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil & Kemitraan RTO</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <Image
              source={require('../../assets/driver-avatar.png')}
              style={styles.avatarImage}
            />
          </View>
          <View style={styles.profileTextCol}>
            <Text style={styles.driverName}>Budi Santoso</Text>
            <Text style={styles.driverId}>ID Mitra: #DRV-1042 • Pengemudi Aktif</Text>
            <View style={styles.statusBadgeRow}>
              <View style={styles.badgePillGreen}>
                <UserCheck size={12} color={colors.success} />
                <Text style={styles.badgePillGreenText}>Terverifikasi</Text>
              </View>
              <View style={styles.badgePillBlue}>
                <Truck size={12} color={colors.primary} />
                <Text style={styles.badgePillBlueText}>Gran Max Blind Van</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 1. SEWA-BELI (RENT-TO-OWN / RTO) EQUITY CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <TrendingUp size={18} color={colors.primary} strokeWidth={2.2} />
              <Text style={styles.cardTitle}>Progres Kepemilikan Sewa-Beli (RTO)</Text>
            </View>
          </View>

          <View style={styles.rtoHeroRow}>
            <CircularProgress
              size={72}
              strokeWidth={6}
              percentage={64.8}
              color={colors.primary}
              bgColor="#E2E8F0"
            >
              <Text style={styles.rtoPctBig}>64,8%</Text>
            </CircularProgress>

            <View style={styles.rtoHeroText}>
              <Text style={styles.rtoTenureTitle}>Bulan ke-23 dari 36 Bulan</Text>
              <Text style={styles.rtoSub}>Unit: Daihatsu Gran Max Blind Van (B 9821 KCE)</Text>
              <Text style={styles.rtoEst}>Tersisa 13 Bulan menuju BPKB Hak Milik Pribadi</Text>
            </View>
          </View>

          {/* Equity Breakdown */}
          <View style={styles.equityDetailsBox}>
            <View style={styles.equityRow}>
              <Text style={styles.equityLabel}>Akumulasi Ekuitas Terbayar</Text>
              <Text style={styles.equityValuePrimary}>Rp 64.800.000</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.equityRow}>
              <Text style={styles.equityLabel}>Sisa Kewajiban Pokok</Text>
              <Text style={styles.equityValue}>Rp 35.200.000</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.equityRow}>
              <Text style={styles.equityLabel}>Saldo Escrow Setoran Berjalan</Text>
              <Text style={styles.equityValueGreen}>Rp 1.450.000</Text>
            </View>
          </View>
        </View>

        {/* 2. DRIVER SAFETY SCORING BREAKDOWN */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <ShieldCheck size={18} color={colors.primary} strokeWidth={2.2} />
              <Text style={styles.cardTitle}>Analitik Keselamatan Berkendara</Text>
            </View>
            <View style={styles.scoreBadgePill}>
              <Text style={styles.scoreBadgeText}>Sangat Baik</Text>
            </View>
          </View>

          <View style={styles.safetyScoreBanner}>
            <Text style={styles.safetyBigScore}>94</Text>
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.safetyScoreScale}>/100 Total Poin</Text>
              <Text style={styles.safetyScoreSub}>Evaluasi 30 Hari Terakhir</Text>
            </View>
          </View>

          <View style={styles.safetyMetricsGrid}>
            <View style={styles.safetyMetricCell}>
              <Text style={styles.safetyMetricNum}>0</Text>
              <Text style={styles.safetyMetricLbl}>Pengereman Mendadak</Text>
            </View>
            <View style={styles.cellDivider} />
            <View style={styles.safetyMetricCell}>
              <Text style={styles.safetyMetricNum}>1</Text>
              <Text style={styles.safetyMetricLbl}>Akselerasi Agresif</Text>
            </View>
            <View style={styles.cellDivider} />
            <View style={styles.safetyMetricCell}>
              <Text style={styles.safetyMetricNum}>0</Text>
              <Text style={styles.safetyMetricLbl}>Overspeeding</Text>
            </View>
          </View>
        </View>

        {/* 3. STATUS KEPATUHAN TILANG ELEKTRONIK (ETLE) */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <FileCheck2 size={18} color={colors.primary} strokeWidth={2.2} />
              <Text style={styles.cardTitle}>Status Hukum Tilang Elektronik (ETLE)</Text>
            </View>
          </View>

          <View style={styles.etleCleanBox}>
            <CheckCircle2 size={24} color={colors.success} />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={styles.etleCleanTitle}>Nihil Catatan Pelanggaran ETLE</Text>
              <Text style={styles.etleCleanSub}>
                Tidak ada sengketa tilang kamera polisi aktif pada kendaraan B 9821 KCE. Legalitas dokumen STNK aman.
              </Text>
            </View>
          </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 16,
  },
  avatarWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors.primary,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  profileTextCol: {
    marginLeft: 14,
    flex: 1,
  },
  driverName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  driverId: {
    fontSize: 11.5,
    color: colors.textMuted,
    marginTop: 2,
  },
  statusBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  badgePillGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 6,
  },
  badgePillGreenText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.success,
    marginLeft: 3,
  },
  badgePillBlue: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgePillBlueText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 3,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 8,
  },
  rtoHeroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  rtoPctBig: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
  rtoHeroText: {
    marginLeft: 14,
    flex: 1,
  },
  rtoTenureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  rtoSub: {
    fontSize: 11.5,
    color: colors.textSecondary,
    marginTop: 2,
  },
  rtoEst: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  equityDetailsBox: {
    backgroundColor: colors.bg,
    borderRadius: 14,
    padding: 12,
  },
  equityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  equityLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  equityValuePrimary: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  equityValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  equityValueGreen: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.success,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },
  scoreBadgePill: {
    backgroundColor: colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  scoreBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.success,
  },
  safetyScoreBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  safetyBigScore: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.primary,
  },
  safetyScoreScale: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  safetyScoreSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  safetyMetricsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  safetyMetricCell: {
    flex: 1,
    alignItems: 'center',
  },
  safetyMetricNum: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  safetyMetricLbl: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  cellDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.border,
  },
  etleCleanBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    padding: 12,
    borderRadius: 12,
  },
  etleCleanTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.successDark,
  },
  etleCleanSub: {
    fontSize: 11,
    color: colors.successDark,
    marginTop: 2,
    lineHeight: 15,
  },
});
