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
import { MapWebView } from '../components/MapWebView';
import { useApp } from '../context/AppContext';

interface DetailStopScreenProps {
  onBack?: () => void;
  onArriveAtLocation?: () => void;
  isCompleted?: boolean;
}

export const DetailStopScreen: React.FC<DetailStopScreenProps> = (props) => {
  const {
    selectedStopId,
    completedStops,
    epodRecords,
    navigateTo,
    goBack,
  } = useApp();

  const handleBack = props.onBack || goBack;
  const isCompleted =
    props.isCompleted !== undefined
      ? props.isCompleted
      : completedStops.includes(selectedStopId);
  const handleArrive = props.onArriveAtLocation || (() => navigateTo('epod'));

  const stopData =
    selectedStopId === 1
      ? {
          name: 'Gudang Pusat Cimahi',
          address: 'Jl. Industri Raya No. 12, Cimahi',
          orderCode: 'ORD-2026-7740',
          packages: '48 Koli Blind Van',
          note: 'Pemberangkatan ritase kargo awal',
          stopNumber: '1 / 4 Stop',
          distance: '0 km',
          duration: 'Selesai 08.15',
        }
      : selectedStopId === 3
      ? {
          name: 'Minimarket Sejahtera',
          address: 'Jl. Flyover Pasirkoja, Bandung',
          orderCode: 'ORD-2026-7742',
          packages: '8 Paket Farmasi',
          note: 'Hubungi Ibu Ratna (PIC)',
          stopNumber: '3 / 4 Stop',
          distance: '+ 6,8 km',
          duration: '± 18 menit',
        }
      : selectedStopId === 4
      ? {
          name: 'Toko Makmur Jaya',
          address: 'Jl. Peta No. 88, Bandung',
          orderCode: 'ORD-2026-7743',
          packages: '6 Paket Sembako',
          note: 'Titik akhir ritase hari ini',
          stopNumber: '4 / 4 Stop',
          distance: '+ 11,2 km',
          duration: '± 28 menit',
        }
      : {
          name: 'Toko Sumber Rejeki',
          address: 'Jl. Sudirman No. 45, Bandung',
          orderCode: 'ORD-2026-7741',
          packages: '12 Paket',
          note: 'Serahkan ke PIC toko (Bpk. Budi Setiawan)',
          stopNumber: '2 / 4 Stop',
          distance: '+ 4,2 km',
          duration: '± 12 menit',
        };

  return (
    <View style={styles.container}>
      {/* 1. MODULAR TOP BAR (FIXED, SPACIOUS) */}
      <TopBar
        variant="back"
        title="Detail Stop"
        subtitle={`Trip #TRIP-2026-089 • Stop ${selectedStopId}/4`}
        onBack={handleBack}
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
            <Text style={styles.bannerValue}>{stopData.distance}</Text>
          </View>
          <View style={styles.bannerDivider} />
          <View style={styles.bannerItem}>
            <Clock size={13} color={colors.primary} strokeWidth={2.2} />
            <Text style={styles.bannerValue}>{stopData.duration}</Text>
          </View>
        </View>

        {/* 3. INTERACTIVE WEBVIEW MAP (OpenStreetMap & Leaflet OSRM corridor) */}
        <MapWebView
          height={195}
          destinationName={stopData.name}
          distance={stopData.distance}
          duration={stopData.duration}
        />

        {/* 4. CURRENT STOP CARD */}
        <View style={styles.card}>
          <View style={styles.stopHeaderRow}>
            <View style={styles.stopTextGroup}>
              <Text style={styles.stopTitle}>{stopData.name}</Text>
              <Text style={styles.stopAddress}>{stopData.address}</Text>
            </View>

            <View style={styles.badgesCol}>
              <Text style={styles.currentStatusText}>
                {isCompleted ? 'Selesai' : 'Tujuan Saat Ini'}
              </Text>
              <Text style={styles.stopOrderText}>{stopData.stopNumber}</Text>
            </View>
          </View>

          {/* 4 Quick Action Buttons */}
          <View style={styles.quickActionsRow}>
            {/* Navigasi */}
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() =>
                Alert.alert(
                  'Panduan Navigasi OSRM',
                  `Membuka panduan perutean dinamis ke ${stopData.name} (${stopData.address}).`
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
                Alert.alert('Hubungi PIC', `Menghubungi PIC ${stopData.name} (+62 812-3456-7890)`)
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
                Alert.alert('Kirim Pesan', `Mengirim pesan WhatsApp konfirmasi kedatangan ke ${stopData.name}.`)
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
                  'Detail Titik Serah Terima',
                  `Akses loading dock untuk ${stopData.name} berada di samping gerbang utama. Parkir armada blind van tersedia.`
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

        {/* 5. DETAIL PENGANTARAN CARD */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>Detail Pengantaran</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Kode Order</Text>
            <Text style={styles.detailValueBold}>{stopData.orderCode}</Text>
          </View>

          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Jumlah Barang</Text>
            <Text style={styles.detailValue}>{stopData.packages}</Text>
          </View>

          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Catatan Khusus</Text>
            <Text style={styles.detailValue}>{stopData.note}</Text>
          </View>
        </View>

        {/* 6. PRIMARY CTA BUTTON: TIBA DI LOKASI / LIHAT e-POD */}
        <TouchableOpacity
          style={styles.primaryActionButton}
          onPress={handleArrive}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryActionText}>
            {isCompleted ? 'Lihat Bukti e-POD' : 'Tiba di Lokasi'}
          </Text>
        </TouchableOpacity>

        {/* 6. STOP BERIKUTNYA CARD (Interactive preview) */}
        <TouchableOpacity
          style={styles.nextStopCard}
          onPress={() =>
            Alert.alert(
              'Pratinjau Stop 3: Minimarket Sejahtera',
              '• Alamat: Jl. Flyover Pasirkoja, Bandung\n• Jarak dari titik ini: +6,8 km (± 18 menit)\n• Muatan: 8 Paket Logistik (ORD-2026-7742)\n• Kontak PIC: Ibu Ratna (+62 813-9876-5432)\n\nSelesaikan serah terima e-POD Toko Sumber Rejeki terlebih dahulu.',
              [{ text: 'Tutup' }]
            )
          }
          activeOpacity={0.8}
        >
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
    justifyContent: 'center',
  },
  currentStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 2,
  },
  stopOrderText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: colors.textMuted,
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
