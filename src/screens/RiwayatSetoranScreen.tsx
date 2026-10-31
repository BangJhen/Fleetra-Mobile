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
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  HelpCircle,
  TrendingUp,
  Truck,
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { TopBar } from '../components/TopBar';
import { CircularProgress } from '../components/CircularProgress';
import { useApp } from '../context/AppContext';

interface DepositTransaction {
  id: string;
  tripCode: string;
  date: string;
  time: string;
  stopsCount: number;
  amount: number;
  status: 'selesai' | 'proses';
  notes: string;
}

const DEPOSIT_HISTORY: DepositTransaction[] = [
  {
    id: 'tx-089',
    tripCode: '#TRIP-2026-089',
    date: 'Hari ini',
    time: '08:15 WIB',
    stopsCount: 4,
    amount: 50000,
    status: 'proses',
    notes: 'Estimasi setoran ritase aktif hari ini',
  },
  {
    id: 'tx-088',
    tripCode: '#TRIP-2026-088',
    date: '31 Okt 2026',
    time: '17:40 WIB',
    stopsCount: 4,
    amount: 45000,
    status: 'selesai',
    notes: 'Terpotong otomatis via e-POD terverifikasi',
  },
  {
    id: 'tx-087',
    tripCode: '#TRIP-2026-087',
    date: '28 Okt 2026',
    time: '16:15 WIB',
    stopsCount: 6,
    amount: 60000,
    status: 'selesai',
    notes: 'Terpotong otomatis via e-POD terverifikasi',
  },
  {
    id: 'tx-086',
    tripCode: '#TRIP-2026-086',
    date: '26 Okt 2026',
    time: '18:00 WIB',
    stopsCount: 7,
    amount: 75000,
    status: 'selesai',
    notes: 'Bonus ritase kargo puncak sore',
  },
  {
    id: 'tx-085',
    tripCode: '#TRIP-2026-085',
    date: '24 Okt 2026',
    time: '15:30 WIB',
    stopsCount: 5,
    amount: 50000,
    status: 'selesai',
    notes: 'Terpotong otomatis via e-POD terverifikasi',
  },
  {
    id: 'tx-084',
    tripCode: '#TRIP-2026-084',
    date: '22 Okt 2026',
    time: '17:10 WIB',
    stopsCount: 6,
    amount: 65000,
    status: 'selesai',
    notes: 'Terpotong otomatis via e-POD terverifikasi',
  },
];

export const RiwayatSetoranScreen: React.FC = () => {
  const { goBack, driverProfile, rtoPercent } = useApp();
  const [filterPeriod, setFilterPeriod] = useState<'semua' | 'bulan-ini' | 'bulan-lalu'>('semua');

  const filteredTransactions = DEPOSIT_HISTORY.filter((tx) => {
    if (filterPeriod === 'semua') return true;
    if (filterPeriod === 'bulan-ini') return tx.date.includes('Okt') || tx.date.includes('Hari ini');
    if (filterPeriod === 'bulan-lalu') return !tx.date.includes('Okt') && !tx.date.includes('Hari ini');
    return true;
  });

  const handleDownloadReport = () => {
    Alert.alert(
      'Unduh Rekonsiliasi RTO',
      'Laporan mutasi setoran sewa-beli armada pay-per-trip (Oktober 2026) berhasil diproses dan dikirimkan ke email terdaftar.',
      [{ text: 'Mengerti' }]
    );
  };

  const handleTxDetail = (tx: DepositTransaction) => {
    Alert.alert(
      `Detail Setoran ${tx.tripCode}`,
      `• Tanggal: ${tx.date} (${tx.time})\n• Jumlah Titik: ${tx.stopsCount} Titik Antar\n• Nilai Ekuitas: Rp ${tx.amount.toLocaleString('id-ID')}\n• Status: ${tx.status === 'selesai' ? 'Terverifikasi (Masuk Ekuitas)' : 'Menunggu Penyelesaian Rute'}\n• Catatan: ${tx.notes}`,
      [{ text: 'Tutup' }]
    );
  };

  return (
    <View style={styles.container}>
      <TopBar
        variant="back"
        title="Riwayat Setoran RTO"
        subtitle="Sewa-Beli Pay-per-Trip Armada"
        onBack={goBack}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* SUMMARY HERO CARD */}
        <View style={styles.heroCard}>
          <View style={styles.heroHeaderRow}>
            <View style={styles.heroTitleGroup}>
              <Text style={styles.heroSubtitle}>PROGRES KEPEMILIKAN ARMADA</Text>
              <Text style={styles.heroTitle}>Ekuitas Terkumpul: 64,8%</Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  'Tentang Skema RTO FLEETRA',
                  'Sistem Rent-to-Own memotong proporsi wajar dari setiap trip kargo secara otomatis (Pay-per-Trip), sehingga mitra pengemudi dapat memiliki armada tanpa beban cicilan bulanan yang kaku.'
                )
              }
              activeOpacity={0.7}
            >
              <HelpCircle size={18} color={colors.textSecondary} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <View style={styles.heroBodyRow}>
            <CircularProgress
              size={76}
              strokeWidth={6}
              percentage={rtoPercent}
              color={colors.primary}
              bgColor="#E2E8F0"
            >
              <Text style={styles.circlePctText}>64,8%</Text>
            </CircularProgress>

            <View style={styles.heroStatsCol}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Total Terkumpul</Text>
                <Text style={styles.statValuePrimary}>Rp 194.400.000</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Sisa Kewajiban (13 Bln)</Text>
                <Text style={styles.statValueDark}>Rp 105.600.000</Text>
              </View>
            </View>
          </View>

          {/* Vehicle info bar */}
          <View style={styles.heroVehicleBanner}>
            <Truck size={14} color={colors.primary} strokeWidth={2.2} />
            <Text style={styles.heroVehicleText}>
              {driverProfile.vehicleModel} • {driverProfile.vehiclePlate}
            </Text>
          </View>
        </View>

        {/* MONTHLY SUMMARY METRIC */}
        <View style={styles.monthlyCard}>
          <View style={styles.monthlyItem}>
            <View style={styles.monthlyIconCircle}>
              <TrendingUp size={16} color={colors.primary} strokeWidth={2.2} />
            </View>
            <View>
              <Text style={styles.monthlyLabel}>Akumulasi Bulan Ini</Text>
              <Text style={styles.monthlyValue}>Rp 4.250.000</Text>
            </View>
          </View>
          <View style={styles.monthlyDividerCol} />
          <View style={styles.monthlyItem}>
            <View style={styles.monthlyIconCircle}>
              <Calendar size={16} color={colors.primary} strokeWidth={2.2} />
            </View>
            <View>
              <Text style={styles.monthlyLabel}>Ritase Berkontribusi</Text>
              <Text style={styles.monthlyValue}>18 Ritase Selesai</Text>
            </View>
          </View>
        </View>

        {/* FILTER PERIOD CHIPS */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionHeaderTitle}>Daftar Mutasi Setoran</Text>
          <View style={styles.filterChipsRow}>
            {(
              [
                { id: 'semua', label: 'Semua' },
                { id: 'bulan-ini', label: 'Bulan Ini' },
                { id: 'bulan-lalu', label: 'Bulan Lalu' },
              ] as const
            ).map((chip) => {
              const active = filterPeriod === chip.id;
              return (
                <TouchableOpacity
                  key={chip.id}
                  style={[styles.filterChip, active && styles.filterChipActive]}
                  onPress={() => setFilterPeriod(chip.id)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                    {chip.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* TRANSACTIONS LIST */}
        <View style={styles.txCard}>
          {filteredTransactions.map((tx, idx) => {
            const isLast = idx === filteredTransactions.length - 1;
            const isProcess = tx.status === 'proses';

            return (
              <View key={tx.id}>
                <TouchableOpacity
                  style={styles.txRow}
                  onPress={() => handleTxDetail(tx)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.txStatusIconWrapper,
                      isProcess ? styles.txProcessBg : styles.txSuccessBg,
                    ]}
                  >
                    {isProcess ? (
                      <Clock size={16} color={colors.warning} strokeWidth={2.2} />
                    ) : (
                      <CheckCircle2 size={16} color={colors.primary} strokeWidth={2.2} />
                    )}
                  </View>

                  <View style={styles.txContent}>
                    <View style={styles.txTopLine}>
                      <Text style={styles.txTripCode}>{tx.tripCode}</Text>
                      <Text
                        style={[
                          styles.txAmountText,
                          isProcess ? styles.txAmountProcess : styles.txAmountSuccess,
                        ]}
                      >
                        +{isProcess ? '(Est.) ' : ''}Rp {tx.amount.toLocaleString('id-ID')}
                      </Text>
                    </View>

                    <Text style={styles.txNotes}>{tx.notes}</Text>

                    <View style={styles.txBottomLine}>
                      <Text style={styles.txDateText}>
                        {tx.date} • {tx.time}
                      </Text>
                      <View
                        style={[
                          styles.badge,
                          isProcess ? styles.badgeProcess : styles.badgeSuccess,
                        ]}
                      >
                        <Text
                          style={[
                            styles.badgeText,
                            isProcess ? styles.badgeTextProcess : styles.badgeTextSuccess,
                          ]}
                        >
                          {isProcess ? 'Diproses' : 'Masuk Ekuitas'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
                {!isLast && <View style={styles.txDivider} />}
              </View>
            );
          })}
        </View>

        {/* DOWNLOAD BUTTON */}
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={handleDownloadReport}
          activeOpacity={0.85}
        >
          <Download size={16} color={colors.primary} strokeWidth={2.2} style={{ marginRight: 8 }} />
          <Text style={styles.downloadButtonText}>Unduh Rekap Mutasi RTO (PDF)</Text>
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
    paddingBottom: 40,
  },

  /* HERO CARD */
  heroCard: {
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
  heroHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  heroTitleGroup: {
    flex: 1,
  },
  heroSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.2,
    marginTop: 2,
  },
  heroBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  circlePctText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
  },
  heroStatsCol: {
    marginLeft: 16,
    flex: 1,
  },
  statBox: {
    paddingVertical: 1,
  },
  statLabel: {
    fontSize: 10,
    color: colors.textMuted,
    marginBottom: 1,
  },
  statValuePrimary: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.primary,
  },
  statValueDark: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  statDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 5,
  },
  heroVehicleBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface2,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  heroVehicleText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  /* MONTHLY CARD */
  monthlyCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: 18,
    marginTop: 12,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  monthlyItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  monthlyIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthlyLabel: {
    fontSize: 9.5,
    color: colors.textMuted,
  },
  monthlyValue: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    marginTop: 1,
  },
  monthlyDividerCol: {
    width: 1,
    height: 28,
    backgroundColor: colors.borderLight,
    marginHorizontal: 8,
  },

  /* FILTER SECTION */
  filterSection: {
    marginHorizontal: 18,
    marginTop: 18,
    marginBottom: 10,
  },
  sectionHeaderTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  filterChipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: colors.white,
  },

  /* TRANSACTIONS CARD */
  txCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 18,
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
  txRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 13,
  },
  txStatusIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  txSuccessBg: {
    backgroundColor: colors.primaryMuted,
  },
  txProcessBg: {
    backgroundColor: '#FFFBEB',
  },
  txContent: {
    flex: 1,
  },
  txTopLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  txTripCode: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.text,
  },
  txAmountText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  txAmountSuccess: {
    color: colors.primary,
  },
  txAmountProcess: {
    color: colors.warningText,
  },
  txNotes: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 4,
  },
  txBottomLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  txDateText: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeSuccess: {
    backgroundColor: colors.primaryMuted,
  },
  badgeProcess: {
    backgroundColor: '#FEF3C7',
  },
  badgeText: {
    fontSize: 9.5,
    fontWeight: '600',
  },
  badgeTextSuccess: {
    color: colors.primary,
  },
  badgeTextProcess: {
    color: colors.warningText,
  },
  txDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginLeft: 46,
  },

  /* DOWNLOAD BUTTON */
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.primary,
    marginHorizontal: 18,
    marginTop: 14,
    marginBottom: 20,
    height: 46,
    borderRadius: 12,
  },
  downloadButtonText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.primary,
  },
});
