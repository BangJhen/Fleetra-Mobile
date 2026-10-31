import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Clock,
  Compass,
  Info,
  MessageSquare,
  Navigation,
  Phone,
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { TopBar } from '../components/TopBar';

interface DetailStopScreenProps {
  onBack: () => void;
  onArriveAtLocation: () => void;
  isCompleted?: boolean;
}

export const DetailStopScreen: React.FC<DetailStopScreenProps> = ({
  onBack,
  onArriveAtLocation,
  isCompleted = false,
}) => {
  return (
    <View style={styles.container}>
      {/* 1. MODULAR TOP BAR (FIXED, SPACIOUS) */}
      <TopBar
        variant="back"
        title="Detail Stop"
        subtitle="Trip #TRIP-2026-089"
        onBack={onBack}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 2. TOP DISTANCE & ETA BANNER */}
        <View style={styles.distanceBanner}>
          <View style={styles.bannerItem}>
            <Navigation size={13} color={colors.primary} strokeWidth={2.2} />
            <Text style={styles.bannerValue}>+ 4,2 km</Text>
          </View>
          <View style={styles.bannerDivider} />
          <View style={styles.bannerItem}>
            <Clock size={13} color={colors.primary} strokeWidth={2.2} />
            <Text style={styles.bannerValue}>± 12 menit</Text>
          </View>
        </View>

        {/* 3. CURRENT STOP CARD */}
        <View style={styles.card}>
          <View style={styles.stopHeaderRow}>
            <View style={styles.stopTextGroup}>
              <Text style={styles.stopTitle}>Toko Sumber Rejeki</Text>
              <Text style={styles.stopAddress}>Jl. Sudirman No. 45, Bandung</Text>
            </View>

            <View style={styles.badgesCol}>
              <View style={styles.currentPill}>
                <Text style={styles.currentPillText}>Tujuan Saat Ini</Text>
              </View>
              <View style={styles.stopOrderPill}>
                <Text style={styles.stopOrderPillText}>2 / 4 Stop</Text>
              </View>
            </View>
          </View>

          {/* 4 Quick Action Buttons */}
          <View style={styles.quickActionsRow}>
            {/* Navigasi */}
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() =>
                Alert.alert(
                  'Panduan Navigasi',
                  'Membuka panduan perutean rute dinamis ke Jl. Sudirman No. 45.'
                )
              }
              activeOpacity={0.75}
            >
              <View style={styles.actionIconCircle}>
                <Compass size={18} color={colors.primary} strokeWidth={2.2} />
              </View>
              <Text style={styles.actionBtnLabel}>Navigasi</Text>
            </TouchableOpacity>

            {/* Telepon */}
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() =>
                Alert.alert('Hubungi PIC', 'Menghubungi Bpk. Budi Setiawan (+62 812-3456-7890)')
              }
              activeOpacity={0.75}
            >
              <View style={styles.actionIconCircle}>
                <Phone size={18} color={colors.primary} strokeWidth={2.2} />
              </View>
              <Text style={styles.actionBtnLabel}>Telepon</Text>
            </TouchableOpacity>

            {/* Pesan */}
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() =>
                Alert.alert('Kirim Pesan', 'Mengirim pesan WhatsApp konfirmasi kedatangan ke PIC Toko.')
              }
              activeOpacity={0.75}
            >
              <View style={styles.actionIconCircle}>
                <MessageSquare size={18} color={colors.primary} strokeWidth={2.2} />
              </View>
              <Text style={styles.actionBtnLabel}>Pesan</Text>
            </TouchableOpacity>

            {/* Detail Lokasi */}
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() =>
                Alert.alert(
                  'Detail Lokasi',
                  'Akses loading dock berada di gerbang samping toko. Kapasitas parkir LCV tersedia.'
                )
              }
              activeOpacity={0.75}
            >
              <View style={styles.actionIconCircle}>
                <Info size={18} color={colors.primary} strokeWidth={2.2} />
              </View>
              <Text style={styles.actionBtnLabel}>Detail</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 4. DETAIL PENGANTARAN CARD */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>Detail Pengantaran</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Kode Order</Text>
            <Text style={styles.detailValueBold}>ORD-2026-7741</Text>
          </View>

          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Jumlah Barang</Text>
            <Text style={styles.detailValue}>12 Paket</Text>
          </View>

          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Catatan Khusus</Text>
            <Text style={styles.detailValue}>Serahkan ke PIC toko</Text>
          </View>
        </View>

        {/* 5. PRIMARY CTA BUTTON: TIBA DI LOKASI */}
        <TouchableOpacity
          style={styles.primaryActionButton}
          onPress={onArriveAtLocation}
          activeOpacity={0.85}
        >
          <View style={styles.btnDotWhite} />
          <Text style={styles.primaryActionText}>
            {isCompleted ? 'Lihat Bukti e-POD' : 'Tiba di Lokasi'}
          </Text>
        </TouchableOpacity>

        {/* 6. STOP BERIKUTNYA CARD */}
        <View style={styles.nextStopCard}>
          <Text style={styles.nextStopTitle}>Stop Berikutnya</Text>
          <View style={styles.nextStopBody}>
            <View style={styles.nextStopLeft}>
              <Text style={styles.nextStopName}>Minimarket Sejahtera</Text>
              <Text style={styles.nextStopAddress}>
                Jl. Flyover Pasirkoja, Bandung
              </Text>
            </View>

            <View style={styles.nextStopRight}>
              <Text style={styles.nextStopDistance}>+ 6,8 km</Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  /* TOP DISTANCE & ETA BANNER */
  distanceBanner: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: 18,
    marginTop: 14,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: colors.border,
  },
  bannerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerValue: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 6,
  },
  bannerDivider: {
    width: 1,
    height: 16,
    backgroundColor: colors.border,
  },

  /* CARDS */
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

  /* STOP HEADER */
  stopHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  stopTextGroup: {
    flex: 1,
    marginRight: 10,
  },
  stopTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.2,
  },
  stopAddress: {
    fontSize: 11.5,
    color: colors.textMuted,
    marginTop: 2,
  },
  badgesCol: {
    alignItems: 'flex-end',
  },
  currentPill: {
    backgroundColor: colors.primaryMuted,
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 4,
  },
  currentPillText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: colors.primary,
  },
  stopOrderPill: {
    backgroundColor: colors.surface2,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stopOrderPillText: {
    fontSize: 9.5,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  /* QUICK ACTIONS ROW */
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  actionBtn: {
    alignItems: 'center',
    width: 60,
  },
  actionIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionBtnLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  /* DETAIL PENGANTARAN */
  cardSectionTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 7,
  },
  detailLabel: {
    fontSize: 11.5,
    color: colors.textMuted,
  },
  detailValueBold: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.text,
  },
  detailValue: {
    fontSize: 11.5,
    fontWeight: '600',
    color: colors.text,
  },
  detailDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
  },

  /* PRIMARY ACTION BUTTON */
  primaryActionButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    marginHorizontal: 18,
    marginTop: 16,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },
  btnDotWhite: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.white,
    marginRight: 8,
  },
  primaryActionText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.white,
  },

  /* NEXT STOP CARD */
  nextStopCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 18,
    marginTop: 14,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  nextStopTitle: {
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  nextStopBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nextStopLeft: {
    flex: 1,
    marginRight: 10,
  },
  nextStopName: {
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.text,
  },
  nextStopAddress: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  nextStopRight: {
    alignItems: 'flex-end',
  },
  nextStopDistance: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
});
