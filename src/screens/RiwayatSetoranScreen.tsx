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
  Clock,
  Download,
  HelpCircle,
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
    route: '4 Titik Pengantaran',
    date: 'Hari ini',
    time: '08:15 WIB',
    group: 'hari-ini',
    stopsCount: 4,
    amount: 50000,
    status: 'proses',
    notes: 'Estimasi setoran ritase aktif hari ini',
  },
  {
    id: 'tx-088',
    tripCode: '#TRIP-2026-088',
    route: 'Padalarang (4 Stop)',
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
    route: 'Buah Batu (6 Stop)',
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
    route: 'Cibiru & Ujungberung (7 Stop)',
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
    route: 'Pasirkaliki (5 Stop)',
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
    route: 'Dago & Cihampelas (6 Stop)',
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
      'Laporan mutasi setoran sewa-beli armada (Oktober 2026) berhasil diproses dan dikirim ke email terdaftar pengemudi.',
      [{ text: 'Tutup' }]
    );
  };

  const handleTxDetail = (tx: DepositTransaction) => {
    Alert.alert(
      `Rincian ${tx.tripCode}`,
      `• Pengantaran: ${tx.route}\n• Waktu: ${tx.date} (${tx.time})\n• Nilai Ekuitas: Rp ${tx.amount.toLocaleString('id-ID')}\n• Status: ${
        tx.status === 'selesai' ? 'Selesai (Masuk Ekuitas)' : 'Diproses (Menunggu e-POD)'
      }\n• Catatan: ${tx.notes}`,
      [{ text: 'Tutup' }]
    );
  };

  const handleRtoInfo = () => {
    Alert.alert(
      'Tentang Skema RTO FLEETRA',
      'Sistem Rent-to-Own mengalokasikan pemotongan otomatis per-ritase kargo (Pay-per-Trip) untuk kepemilikan armada.\n\nSetelah 36 bulan (3 tahun), kepemilikan armada (BPKB & STNK) dialihkan sepenuhnya ke mitra pengemudi.',
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
        {/* 2. CALM & SPACIOUS HERO CARD */}
        <View style={styles.heroCard}>
          <View style={styles.heroHeaderRow}>
            <Text style={styles.assetLabel}>Ekuitas Terkumpul</Text>
            <TouchableOpacity
              style={styles.tenorPill}
              onPress={handleRtoInfo}
              activeOpacity={0.7}
            >
              <Text style={styles.tenorPillText}>Tenor Bln 23/36</Text>
              <HelpCircle size={13} color={colors.textMuted} strokeWidth={2} style={{ marginLeft: 3 }} />
            </TouchableOpacity>
          </View>

          {/* Large Clean Balance */}
          <View style={styles.assetAmountRow}>
            <Text style={styles.assetAmountBold}>Rp 194.400.000</Text>
            <Text style={styles.pctText}>({rtoPercent.toString().replace('.', ',')}%)</Text>
          </View>

          {/* Minimalist Progress Bar */}
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${rtoPercent}%` }]} />
          </View>

          {/* Clean Sub-details */}
          <View style={styles.milestoneRow}>
            <Text style={styles.milestoneText}>
              Target: <Text style={styles.milestoneBold}>Rp 300.000.000</Text>
            </Text>
            <Text style={styles.milestoneText}>
              Sisa: <Text style={styles.milestoneBold}>Rp 105.600.000</Text> (13 Bln)
            </Text>
          </View>

          {/* Vehicle Strip */}
          <View style={styles.vehicleStrip}>
            <Truck size={14} color={colors.textSecondary} strokeWidth={2} />
            <Text style={styles.vehicleText} numberOfLines={1}>
              {driverProfile.vehicleModel} • {driverProfile.vehiclePlate}
            </Text>
          </View>
        </View>

        {/* 3. CALM TWIN STATS CARDS (NO LOUD COLORS) */}
        <View style={styles.twinStatsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Bulan Ini (Okt)</Text>
            <Text style={styles.statValue}>Rp 4.250.000</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Ritase Logistik</Text>
            <Text style={styles.statValue}>18 Trip</Text>
          </View>
        </View>

        {/* 4. CLEAN NEUTRAL SEGMENTED FILTER */}
        <View style={styles.segmentContainer}>
          {(
            [
              { id: 'semua', label: 'Semua' },
              { id: 'bulan-ini', label: 'Bulan Ini' },
              { id: 'bulan-lalu', label: 'Bulan Lalu' },
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
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 5. SPACIOUS & MONOCHROME TRANSACTION LIST (NO GREEN/YELLOW/LOUD BACKGROUNDS) */}
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
                  {/* Clean Neutral Icon */}
                  <View style={styles.txNeutralIconBox}>
                    <Clock size={16} color={colors.textSecondary} strokeWidth={2} />
                  </View>

                  <View style={styles.txMainCol}>
                    {/* Line 1: Code & Amount */}
                    <View style={styles.txLineRow}>
                      <Text style={styles.txCodeText}>{tx.tripCode}</Text>
                      <Text style={styles.txAmountText}>
                        +Rp {tx.amount.toLocaleString('id-ID')}
                      </Text>
                    </View>

                    {/* Line 2: Route, Time, Clean Text Status (NO BACKGROUND PILL) */}
                    <View style={styles.txLineRow}>
                      <Text style={styles.txDetailText}>
                        {tx.route} • {tx.time}
                      </Text>
                      <Text style={styles.txStatusTextPending}>Diproses</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

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
                    {/* Clean Neutral Icon */}
                    <View style={styles.txNeutralIconBox}>
                      <ArrowDownLeft size={16} color={colors.textSecondary} strokeWidth={2} />
                    </View>

                    <View style={styles.txMainCol}>
                      {/* Line 1: Code & Amount */}
                      <View style={styles.txLineRow}>
                        <Text style={styles.txCodeText}>{tx.tripCode}</Text>
                        <Text style={styles.txAmountText}>
                          +Rp {tx.amount.toLocaleString('id-ID')}
                        </Text>
                      </View>

                      {/* Line 2: Route, Time, Clean Text Status (NO BACKGROUND PILL) */}
                      <View style={styles.txLineRow}>
                        <Text style={styles.txDetailText}>
                          {tx.route} • {tx.time}
                        </Text>
                        <Text style={styles.txStatusTextDone}>Selesai</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* 6. CLEAN DOWNLOAD BUTTON */}
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={handleDownloadReport}
          activeOpacity={0.8}
        >
          <Download size={15} color={colors.textSecondary} strokeWidth={2} />
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

  /* 2. HERO FINANCIAL CARD */
  heroCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 18,
    marginTop: 14,
    borderRadius: 18,
    padding: 18,
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
    alignItems: 'center',
    marginBottom: 8,
  },
  assetLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
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
    fontSize: 10.5,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  assetAmountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 12,
  },
  assetAmountBold: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.4,
  },
  pctText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },

  /* Progress Bar */
  progressTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },

  /* Milestones */
  milestoneRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  milestoneText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  milestoneBold: {
    fontWeight: '600',
    color: colors.textSecondary,
  },

  /* Vehicle Strip */
  vehicleStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface2,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  vehicleText: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
    flex: 1,
  },

  /* 3. TWIN STATS CARDS */
  twinStatsRow: {
    flexDirection: 'row',
    marginHorizontal: 18,
    marginTop: 12,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textMuted,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.3,
  },

  /* 4. SEGMENTED FILTER */
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#EEF2F6',
    marginHorizontal: 18,
    marginTop: 16,
    borderRadius: 10,
    padding: 3,
    gap: 4,
  },
  segmentBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: 8,
  },
  segmentBtnActive: {
    backgroundColor: colors.white,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  segmentBtnText: {
    fontSize: 11.5,
    fontWeight: '500',
    color: colors.textMuted,
  },
  segmentBtnTextActive: {
    color: colors.text,
    fontWeight: '700',
  },

  /* 5. TRANSACTION LIST (SPACIOUS, NO LOUD COLORS) */
  txGroupSection: {
    marginHorizontal: 18,
    marginTop: 16,
  },
  groupHeaderTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 2,
  },
  txGroupCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  txItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16, // Spacious breathing room!
    gap: 12,
  },
  txItemBorderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  /* Neutral Icon Box (NO green, NO yellow) */
  txNeutralIconBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txMainCol: {
    flex: 1,
    gap: 4,
  },
  txLineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  txCodeText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  txAmountText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text, // Neutral dark text!
  },
  txDetailText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  /* Clean Plain Text Status (NO BACKGROUND PILL) */
  txStatusTextPending: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted, // Plain clean text, no yellow box!
  },
  txStatusTextDone: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted, // Plain clean text, no green box!
  },

  /* 6. DOWNLOAD BUTTON */
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 18,
    marginTop: 18,
    marginBottom: 20,
    height: 44,
    borderRadius: 12,
    gap: 8,
  },
  downloadButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
