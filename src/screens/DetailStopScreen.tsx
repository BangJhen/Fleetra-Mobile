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
  Compass,
  Info,
  MessageSquare,
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
    selectedStop,
    selectedStopId,
    setSelectedStopId,
    stops,
    completedStops,
    activeTrip,
    arriveAtCurrentStop,
    confirmStopPickup,
    completeEntireTrip,
    navigateTo,
    goBack,
  } = useApp();

  const handleBack = () => {
    if (props.onBack) {
      props.onBack();
    } else {
      navigateTo('perjalanan');
    }
  };

  const stopIndex = stops.findIndex(
    (s, idx) => s.id === selectedStop?.id || idx + 1 === selectedStopId
  );
  const currentIdx = stopIndex >= 0 ? stopIndex : 0;
  const isCompleted =
    props.isCompleted !== undefined
      ? props.isCompleted
      : selectedStop?.status === 'delivered';
  const isPickup = selectedStop?.type === 'pickup';

  const stopData = {
    name: selectedStop?.name || 'Titik Pengantaran',
    address: selectedStop?.address || 'Alamat Logistik Bandung Raya',
    orderCode: `ORD-2026-${selectedStop?.id ? selectedStop.id.slice(-4).toUpperCase() : '7741'}`,
    packages: isPickup ? 'Muatan Utama Kargo (Gudang Asal)' : 'Paket Logistik Pengantaran',
    note: isPickup
      ? 'Konfirmasi muatan kargo siap diberangkatkan dari gudang'
      : 'Pastikan bukti fisik kargo dan tanda tangan penerima terverifikasi',
    stopNumber: `Stop ${currentIdx + 1} / ${stops.length || 4}`,
    distance: `+ ${(currentIdx * 3.2 + 1.5).toFixed(1)} km`,
    duration: isCompleted ? 'Tuntas' : `± ${currentIdx * 8 + 12} menit`,
  };

  const nextStop = currentIdx < stops.length - 1 ? stops[currentIdx + 1] : null;

  const handleArrive = async () => {
    if (isPickup) {
      try {
        await confirmStopPickup();
        Alert.alert('Pickup Terkonfirmasi', 'Muatan kargo gudang asal siap didistribusikan.', [
          { text: 'Lanjut', onPress: () => navigateTo('perjalanan') },
        ]);
        return;
      } catch (err) {
        Alert.alert('Gagal Konfirmasi', err instanceof Error ? err.message : 'Silakan coba lagi');
        return;
      }
    } else {
      try {
        await arriveAtCurrentStop();
      } catch {}
    }
    if (props.onArriveAtLocation) {
      props.onArriveAtLocation();
    } else {
      navigateTo('epod');
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. MODULAR TOP BAR (FIXED, SPACIOUS) */}
      <TopBar
        variant="back"
        title="Detail Stop"
        subtitle={`Trip #${activeTrip?.code || 'TRIP-2026-089'} - Stop ${currentIdx + 1}/${stops.length || 4}`}
        onBack={handleBack}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 2. INTERACTIVE ROUTE MAP (Integrated HUD with live distance & ETA) */}
        <MapWebView
          height={215}
          destinationName={stopData.name}
          distance={stopData.distance}
          duration={stopData.duration}
        />

        {/* 3. CURRENT STOP CARD */}
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

        {/* 6. PRIMARY & SECONDARY CTA BUTTONS */}
        {isCompleted ? (
          <View style={styles.completedActionsContainer}>
            {nextStop ? (
              <TouchableOpacity
                style={styles.primaryActionButton}
                onPress={() => setSelectedStopId(nextStop.id)}
                activeOpacity={0.85}
              >
                <Text
                  style={styles.primaryActionText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  Lanjut ke Stop {currentIdx + 2} ({nextStop.name})
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.primaryActionButton}
                onPress={async () => {
                  await completeEntireTrip();
                  navigateTo('perjalanan');
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryActionText}>
                  Selesaikan Seluruh Pesanan Ritase
                </Text>
              </TouchableOpacity>
            )}

            {!isPickup && (
              <TouchableOpacity
                style={styles.secondaryActionButton}
                onPress={handleArrive}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryActionText}>Lihat Bukti e-POD</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <TouchableOpacity
            style={styles.primaryActionButton}
            onPress={handleArrive}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryActionText}>
              {isPickup ? 'Tiba di Gudang & Konfirmasi Muat' : 'Tiba di Lokasi & Buka e-POD'}
            </Text>
          </TouchableOpacity>
        )}

        {/* 7. STOP BERIKUTNYA CARD */}
        {nextStop && (
          <TouchableOpacity
            style={styles.nextStopCard}
            onPress={() => setSelectedStopId(nextStop.id)}
            activeOpacity={0.8}
          >
            <View style={styles.nextStopHeaderRow}>
              <Text style={styles.nextStopTitle}>Stop Berikutnya</Text>
              <Text style={styles.nextStopHint}>Ketuk untuk buka</Text>
            </View>
            <View style={styles.nextStopBody}>
              <View style={styles.nextStopLeft}>
                <Text style={styles.nextStopName}>{nextStop.name}</Text>
                <Text style={styles.nextStopAddress}>{nextStop.address || 'Bandung Raya'}</Text>
              </View>

              <View style={styles.nextStopRight}>
                <Text style={styles.nextStopDistance}>
                  {`+ ${((currentIdx + 1) * 3.4).toFixed(1)} km`}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
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

  /* PRIMARY & SECONDARY ACTION BUTTONS */
  completedActionsContainer: {
    gap: 8,
    marginTop: 16,
  },
  primaryActionButton: {
    backgroundColor: colors.primary,
    marginHorizontal: 18,
    minHeight: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },
  primaryActionText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
  },
  secondaryActionButton: {
    backgroundColor: colors.surface,
    marginHorizontal: 18,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryActionText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.textSecondary,
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
  nextStopHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  nextStopTitle: {
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  nextStopHint: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.primary,
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
