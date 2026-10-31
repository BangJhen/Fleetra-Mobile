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
  ArrowDownLeft,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  FileText,
  HelpCircle,
  ShieldCheck,
  TrendingUp,
  Truck,
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { TopBar } from '../components/TopBar';
import { useApp } from '../context/AppContext';

interface DepositTransaction {
  id: string;
  tripCode: string;
  route: string;
  date: string;
  time: string;
  group: 'hari-ini' | 'bulan-ini' | 'bulan-lalu';
  stopsCount: number;
  amount: number;
  status: 'selesai' | 'proses';
  notes: string;
}

const DEPOSIT_HISTORY: DepositTransaction[] = [
  {
    id: 'tx-089',
    tripCode: '#TRIP-2026-089',
    route: 'Gudang Cimahi → 4 Titik Bandung Kota',
    date: 'Hari ini',
    time: '08:15 WIB',
    group: 'hari-ini',
    stopsCount: 4,
    amount: 50000,
    status: 'proses',
    notes: 'Estimasi setoran ritase aktif (Menunggu verifikasi e-POD)',
  },
  {
    id: 'tx-088',
    tripCode: '#TRIP-2026-088',
    route: 'Gudang Cimahi → Padalarang',
    date: '31 Okt 2026',
    time: '17:40 WIB',
    group: 'bulan-ini',
    stopsCount: 4,
    amount: 45000,
    status: 'selesai',
    notes: 'Terpotong otomatis via e-POD terverifikasi',
  },
  {
    id: 'tx-087',
    tripCode: '#TRIP-2026-087',
    route: 'Gudang Cimahi → Buah Batu',
    date: '28 Okt 2026',
    time: '16:15 WIB',
    group: 'bulan-ini',
    stopsCount: 6,
    amount: 60000,
    status: 'selesai',
    notes: 'Terpotong otomatis via e-POD terverifikasi',
  },
  {
    id: 'tx-086',
    tripCode: '#TRIP-2026-086',
    route: 'Gudang Cimahi → Cibiru & Ujungberung',
    date: '26 Okt 2026',
    time: '18:00 WIB',
    group: 'bulan-ini',
    stopsCount: 7,
    amount: 75000,
    status: 'selesai',
    notes: 'Bonus ritase kargo jam sibuk sore',
  },
  {
    id: 'tx-085',
    tripCode: '#TRIP-2026-085',
    route: 'Gudang Cimahi → Pasirkaliki',
    date: '24 Okt 2026',
    time: '15:30 WIB',
    group: 'bulan-ini',
    stopsCount: 5,
    amount: 50000,
    status: 'selesai',
    notes: 'Terpotong otomatis via e-POD terverifikasi',
  },
  {
    id: 'tx-084',
    tripCode: '#TRIP-2026-084',
    route: 'Gudang Cimahi → Dago & Cihampelas',
    date: '22 Okt 2026',
    time: '17:10 WIB',
    group: 'bulan-ini',
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
    if (filterPeriod === 'bulan-ini') return tx.group === 'hari-ini' || tx.group === 'bulan-ini';
    if (filterPeriod === 'bulan-lalu') return tx.group === 'bulan-lalu';
    return true;
  });

  const todayTx = filteredTransactions.filter((tx) => tx.group === 'hari-ini');
  const pastTx = filteredTransactions.filter((tx) => tx.group !== 'hari-ini');

  const handleDownloadReport = () => {
    Alert.alert(
      'Unduh Rekap Mutasi RTO',
      'Laporan mutasi setoran sewa-beli armada pay-per-trip (Oktober 2026) berhasil diproses.\n\nFile: FLEETRA_RTO_Statement_B9821KCE_202610.pdf telah dikirim ke email terdaftar pengemudi.',
      [{ text: 'Tutup' }]
    );
  };

  const handleTxDetail = (tx: DepositTransaction) => {
    Alert.alert(
      `Rincian Setoran ${tx.tripCode}`,
      `• Rute Pengantaran: ${tx.route}\n• Waktu: ${tx.date} (${tx.time})\n• Total Stop: ${tx.stopsCount} Titik Singgah\n• Nilai Ekuitas: Rp ${tx.amount.toLocaleString('id-ID')}\n• Status: ${
        tx.status === 'selesai' ? 'Terverifikasi (Masuk Ekuitas Kepemilikan)' : 'Diproses (Menunggu Verifikasi e-POD)'
      }\n• Catatan: ${tx.notes}`,
      [{ text: 'Tutup' }]
    );
  };

  const handleRtoInfo = () => {
    Alert.alert(
      'Skema Sewa-Beli (Rent-to-Own) FLEETRA',
      'Skema RTO memungkinkan mitra pengemudi mengumpulkan ekuitas kepemilikan armada secara bertahap melalui pemotongan wajar otomatis per-ritase kargo (Pay-per-Trip).\n\nSetelah masa tenor 36 bulan (3 tahun) terpenuhi 100%, hak kepemilikan armada (BPKB & STNK) dialihkan sepenuhnya atas nama mitra.',
      [{ text: 'Mengerti' }]
    );
  };

  return (
    <View style={styles.container}>
      {/* 1. TOP BAR */}
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
        {/* 2. HERO FINANCIAL ASSET CARD */}
        <View style={styles.heroCard}>
          {/* Header Row */}
          <View style={styles.heroHeaderRow}>
            <View style={styles.programBadge}>
              <ShieldCheck size={12} color={colors.primary} strokeWidth={2.2} />
              <Text style={styles.programBadgeText}>PROGRAM SEWA-BELI (RTO)</Text>
            </View>

            <TouchableOpacity
              style={styles.tenorPill}
              onPress={handleRtoInfo}
              activeOpacity={0.7}
            >
              <Text style={styles.tenorPillText}>Bulan 23 / 36</Text>
              <HelpCircle size={13} color={colors.textMuted} strokeWidth={2} style={{ marginLeft: 3 }} />
            </TouchableOpacity>
          </View>

          {/* Large Financial Headline */}
          <Text style={styles.assetLabel}>Total Ekuitas Terkumpul</Text>
          <View style={styles.assetAmountRow}>
            <Text style={styles.assetCurrency}>Rp</Text>
            <Text style={styles.assetAmountBold}>194.400.000</Text>
            <View style={styles.pctBadge}>
              <Text style={styles.pctBadgeText}>64,8%</Text>
            </View>
          </View>

          {/* Sleek Milestone Progress Bar */}
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${rtoPercent}%` }]} />
          </View>

          {/* Milestone Details */}
          <View style={styles.milestoneRow}>
            <View style={styles.milestoneLeft}>
              <Text style={styles.milestoneSub}>Target Nilai Armada</Text>
              <Text style={styles.milestoneVal}>Rp 300.000.000</Text>
            </View>
            <View style={styles.milestoneDivider} />
            <View style={styles.milestoneRight}>
              <Text style={styles.milestoneSub}>Sisa Kewajiban (13 Bln)</Text>
              <Text style={styles.milestoneValDark}>Rp 105.600.000</Text>
            </View>
          </View>

          {/* Vehicle Strip */}
          <View style={styles.vehicleStrip}>
            <View style={styles.vehicleIconBox}>
              <Truck size={14} color={colors.primary} strokeWidth={2.2} />
            </View>
            <View style={styles.vehicleInfoCol}>
              <Text style={styles.vehicleModelText} numberOfLines={1}>
                {driverProfile.vehicleModel}
              </Text>
              <Text style={styles.vehiclePlateText}>
                {driverProfile.vehiclePlate} • Kontrak #RTO-BDG-089
              </Text>
            </View>
          </View>
        </View>

        {/* 3. TWIN MONTHLY STATS CARDS */}
        <View style={styles.twinStatsRow}>
          {/* Card Left: Akumulasi Bulan Ini */}
          <View style={styles.statCard}>
            <View style={styles.statCardHeader}>
              <View style={styles.statIconGreen}>
                <TrendingUp size={15} color={colors.success} strokeWidth={2.2} />
              </View>
              <Text style={styles.statCardLabel}>Bulan Ini (Okt)</Text>
            </View>
            <Text style={styles.statValueGreen}>Rp 4.250.000</Text>
            <Text style={styles.statSubText}>+12% vs bulan September</Text>
          </View>

          {/* Card Right: Ritase Berkontribusi */}
          <View style={styles.statCard}>
            <View style={styles.statCardHeader}>
              <View style={styles.statIconBlue}>
                <CheckCircle2 size={15} color={colors.primary} strokeWidth={2.2} />
              </View>
              <Text style={styles.statCardLabel}>Ritase Logistik</Text>
            </View>
            <Text style={styles.statValueDark}>18 Ritase</Text>
            <Text style={styles.statSubText}>Rata-rata Rp 52.500/trip</Text>
          </View>
        </View>

        {/* 4. MODERN SEGMENTED FILTER CONTROL */}
        <View style={styles.segmentContainer}>
          {(
            [
              { id: 'semua', label: 'Semua', count: DEPOSIT_HISTORY.length },
              { id: 'bulan-ini', label: 'Bulan Ini', count: 5 },
              { id: 'bulan-lalu', label: 'Bulan Lalu', count: 1 },
            ] as const
          ).map((tab) => {
            const isActive = filterPeriod === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.segmentBtn, isActive && styles.segmentBtnActive]}
                onPress={() => setFilterPeriod(tab.id)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.segmentBtnText,
                    isActive && styles.segmentBtnTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
                <View
                  style={[
                    styles.segmentCountBadge,
                    isActive && styles.segmentCountBadgeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.segmentCountText,
                      isActive && styles.segmentCountTextActive,
                    ]}
                  >
                    {tab.count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 5. GROUPED TRANSACTION LIST (Per DESIGN.md Section 4.4) */}
        {/* GROUP 1: HARI INI */}
        {todayTx.length > 0 && (
          <View style={styles.txGroupSection}>
            <Text style={styles.groupHeaderTitle}>HARI INI</Text>
            <View style={styles.txGroupCard}>
              {todayTx.map((tx, idx) => (
                <TouchableOpacity
                  key={tx.id}
                  style={[
                    styles.txItemRow,
                    idx !== todayTx.length - 1 && styles.txItemBorderBottom,
                  ]}
                  onPress={() => handleTxDetail(tx)}
                  activeOpacity={0.7}
                >
                  <View style={styles.txIconAmber}>
                    <Clock size={16} color={colors.warning} strokeWidth={2.2} />
                  </View>

                  <View style={styles.txMainCol}>
                    <View style={styles.txTitleRow}>
                      <Text style={styles.txTitleText}>{tx.tripCode}</Text>
                      <Text style={styles.txAmountAmber}>
                        +Rp {tx.amount.toLocaleString('id-ID')}
                      </Text>
                    </View>

                    <Text style={styles.txRouteText} numberOfLines={1}>
                      {tx.route}
                    </Text>

                    <View style={styles.txFooterRow}>
                      <Text style={styles.txTimeText}>
                        {tx.time} • Estimasi Ritase Aktif
                      </Text>
                      <View style={styles.badgeAmber}>
                        <Text style={styles.badgeTextAmber}>Diproses</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* GROUP 2: OKTOBER 2026 */}
        {pastTx.length > 0 && (
          <View style={styles.txGroupSection}>
            <Text style={styles.groupHeaderTitle}>OKTOBER 2026</Text>
            <View style={styles.txGroupCard}>
              {pastTx.map((tx, idx) => {
                const isLast = idx === pastTx.length - 1;
                return (
                  <TouchableOpacity
                    key={tx.id}
                    style={[
                      styles.txItemRow,
                      !isLast && styles.txItemBorderBottom,
                    ]}
                    onPress={() => handleTxDetail(tx)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.txIconGreen}>
                      <ArrowDownLeft size={16} color={colors.success} strokeWidth={2.2} />
                    </View>

                    <View style={styles.txMainCol}>
                      <View style={styles.txTitleRow}>
                        <Text style={styles.txTitleText}>{tx.tripCode}</Text>
                        <Text style={styles.txAmountGreen}>
                          +Rp {tx.amount.toLocaleString('id-ID')}
                        </Text>
                      </View>

                      <Text style={styles.txRouteText} numberOfLines={1}>
                        {tx.route}
                      </Text>

                      <View style={styles.txFooterRow}>
                        <Text style={styles.txTimeText}>
                          {tx.date} • {tx.time}
                        </Text>
                        <View style={styles.badgeGreen}>
                          <Text style={styles.badgeTextGreen}>Masuk Ekuitas</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* 6. DOWNLOAD PDF REPORT BUTTON */}
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={handleDownloadReport}
          activeOpacity={0.8}
        >
          <FileText size={16} color={colors.primary} strokeWidth={2.2} />
          <Text style={styles.downloadButtonText}>Unduh Rekap Mutasi RTO (PDF)</Text>
        </TouchableOpacity>

        <Text style={styles.footerAuditText}>
          Dokumen mutasi ekuitas dienkripsi dan tervalidasi via Smart Contract FLEETRA Ledger.
        </Text>
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

  /* HERO FINANCIAL ASSET CARD */
  heroCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 18,
    marginTop: 14,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  programBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
    gap: 4,
  },
  programBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.4,
  },
  tenorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface2,
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tenorPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
  },

  assetLabel: {
    fontSize: 11.5,
    fontWeight: '500',
    color: colors.textMuted,
    marginBottom: 4,
  },
  assetAmountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 14,
  },
  assetCurrency: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginRight: 4,
  },
  assetAmountBold: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.6,
  },
  pctBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  pctBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
  },

  /* Progress Bar */
  progressTrack: {
    height: 7,
    backgroundColor: '#E2E8F0',
    borderRadius: 3.5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3.5,
  },

  /* Milestone Details */
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    marginBottom: 12,
  },
  milestoneLeft: {
    flex: 1,
  },
  milestoneRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  milestoneSub: {
    fontSize: 10,
    color: colors.textMuted,
    marginBottom: 2,
  },
  milestoneVal: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  milestoneValDark: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  milestoneDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.borderLight,
    marginHorizontal: 10,
  },

  /* Vehicle Strip */
  vehicleStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface2,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  vehicleIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  vehicleInfoCol: {
    flex: 1,
  },
  vehicleModelText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.text,
  },
  vehiclePlateText: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 1,
  },

  /* TWIN STATS CARDS */
  twinStatsRow: {
    flexDirection: 'row',
    marginHorizontal: 18,
    marginTop: 12,
    gap: 10,
  },
  statCard: {
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
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  statIconGreen: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconBlue: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statCardLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  statValueGreen: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.success,
    letterSpacing: -0.3,
  },
  statValueDark: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.3,
  },
  statSubText: {
    fontSize: 9.5,
    color: colors.textMuted,
    marginTop: 2,
  },

  /* SEGMENTED CONTROL BAR */
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#EEF2F6',
    marginHorizontal: 18,
    marginTop: 16,
    borderRadius: 12,
    padding: 3,
    gap: 4,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: 9,
    gap: 5,
  },
  segmentBtnActive: {
    backgroundColor: colors.white,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1.5,
  },
  segmentBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },
  segmentBtnTextActive: {
    color: colors.text,
    fontWeight: '700',
  },
  segmentCountBadge: {
    backgroundColor: 'transparent',
    paddingHorizontal: 4,
    borderRadius: 6,
  },
  segmentCountBadgeActive: {
    backgroundColor: colors.primaryLight,
  },
  segmentCountText: {
    fontSize: 9.5,
    fontWeight: '600',
    color: colors.textDisabled,
  },
  segmentCountTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },

  /* TRANSACTION GROUPS */
  txGroupSection: {
    marginHorizontal: 18,
    marginTop: 14,
  },
  groupHeaderTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 6,
    marginLeft: 2,
  },
  txGroupCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  txItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 13,
    gap: 12,
  },
  txItemBorderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  txIconGreen: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  txIconAmber: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFBEB',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  txMainCol: {
    flex: 1,
  },
  txTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  txTitleText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.text,
  },
  txAmountGreen: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.success,
  },
  txAmountAmber: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.warning,
  },
  txRouteText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 5,
  },
  txFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  txTimeText: {
    fontSize: 10,
    color: colors.textMuted,
  },

  /* BADGES */
  badgeGreen: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  badgeTextGreen: {
    fontSize: 9.5,
    fontWeight: '700',
    color: colors.success,
  },
  badgeAmber: {
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  badgeTextAmber: {
    fontSize: 9.5,
    fontWeight: '700',
    color: colors.warning,
  },

  /* DOWNLOAD BUTTON */
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginHorizontal: 18,
    marginTop: 18,
    height: 46,
    borderRadius: 14,
    gap: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  downloadButtonText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.text,
  },
  footerAuditText: {
    fontSize: 10,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 10,
    marginHorizontal: 24,
    lineHeight: 14,
  },
});
