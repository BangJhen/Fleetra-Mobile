import React from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ArrowLeft,
  ChevronRight,
  Clock,
  Compass,
  FileText,
  Info,
  MapPin,
  MessageSquare,
  Navigation,
  Package,
  Phone,
} from 'lucide-react-native';
import { colors } from '../theme/colors';

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
      {/* 1. TOP HEADER / APP BAR */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
          accessibilityLabel="Kembali"
        >
          <ArrowLeft size={20} color={colors.text} strokeWidth={2.2} />
        </TouchableOpacity>

        <View style={styles.headerTitleCenter}>
          <Text style={styles.headerTitle}>Detail Stop</Text>
          <Text style={styles.headerSubtitle}>Trip #TRIP-2026-089</Text>
        </View>

        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 2. TOP DISTANCE & ETA BANNER */}
        <View style={styles.distanceBanner}>
          <View style={styles.bannerItem}>
            <Navigation size={14} color={colors.primary} strokeWidth={2.2} />
            <Text style={styles.bannerValue}>+ 4,2 km</Text>
          </View>
          <View style={styles.bannerDivider} />
          <View style={styles.bannerItem}>
            <Clock size={14} color={colors.primary} strokeWidth={2.2} />
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
                  'Membuka panduan perutean Google Maps / Mapbox ke Jl. Sudirman No. 45.'
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
                  'Akses bongkar muat berada di samping toko. Pintu gerbang loading dock warna biru.'
                )
              }
              activeOpacity={0.75}
            >
              <View style={styles.actionIconCircle}>
                <Info size={18} color={colors.primary} strokeWidth={2.2} />
              </View>
              <Text style={styles.actionBtnLabel}>Detail Lokasi</Text>
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
            <Text style={styles.detailLabel}>Catatan</Text>
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
          <View style={styles.nextStopHeader}>
            <Text style={styles.nextStopTitle}>Stop Berikutnya</Text>
          </View>

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
  scrollContent: {
    paddingBottom: 40,
  },

  /* HEADER */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface2,
  },
  headerTitleCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  headerRightPlaceholder: {
    width: 40,
  },

  /* TOP DISTANCE & ETA BANNER */
  distanceBanner: {
    flexDirection: 'row',
    backgroundColor: colors.primaryMuted,
    marginHorizontal: 18,
    marginTop: 14,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  bannerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 6,
  },
  bannerDivider: {
    width: 1,
    height: 18,
    backgroundColor: '#BFDBFE',
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
    elevation: 2,
  },

  /* STOP HEADER */
  stopHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stopTextGroup: {
    flex: 1,
    marginRight: 10,
  },
  stopTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.2,
  },
  stopAddress: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 3,
  },
  badgesCol: {
    alignItems: 'flex-end',
  },
  currentPill: {
    backgroundColor: colors.primaryMuted,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 4,
  },
  currentPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
  },
  stopOrderPill: {
    backgroundColor: colors.surface2,
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 10,
  },
  stopOrderPillText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  /* QUICK ACTIONS ROW */
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 14,
  },
  actionBtn: {
    alignItems: 'center',
    width: 65,
  },
  actionIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  actionBtnLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  /* DETAIL PENGANTARAN */
  cardSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  detailValueBold: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  detailValue: {
    fontSize: 12,
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
    marginTop: 18,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 6,
    elevation: 3,
  },
  btnDotWhite: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.white,
    marginRight: 8,
  },
  primaryActionText: {
    fontSize: 14,
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
  nextStopHeader: {
    marginBottom: 8,
  },
  nextStopTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
    fontSize: 13,
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
