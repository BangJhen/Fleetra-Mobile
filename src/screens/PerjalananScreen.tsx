import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ArrowLeft,
  Camera,
  Check,
  CheckCircle2,
  Clock,
  FileCheck,
  MapPin,
  Navigation,
  PenTool,
  Truck,
  X,
} from 'lucide-react-native';
import { colors } from '../theme/colors';

interface PerjalananScreenProps {
  onBackToHome: () => void;
}

export const PerjalananScreen: React.FC<PerjalananScreenProps> = ({ onBackToHome }) => {
  const [epodModalVisible, setEpodModalVisible] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [signed, setSigned] = useState(false);
  const [completedStops, setCompletedStops] = useState<number[]>([1]);

  const handleConfirmEpod = () => {
    if (!photoTaken || !signed) {
      Alert.alert(
        'Bukti Belum Lengkap',
        'Harap ambil foto bukti barang dan bubuhkan tanda tangan digital penerima.'
      );
      return;
    }
    setCompletedStops((prev) => [...prev, 2]);
    setEpodModalVisible(false);
    Alert.alert('Sukses', 'Bukti pengiriman e-POD Toko Sumber Rejeki berhasil diunggah!');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBackToHome}>
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rute Perjalanan Aktif</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Trip Overview Card */}
        <View style={styles.tripCard}>
          <View style={styles.tripBadgeRow}>
            <View style={styles.tripCodeBadge}>
              <Text style={styles.tripCodeText}>#TRIP-2026-089</Text>
            </View>
            <View style={styles.livePill}>
              <View style={styles.pulseDot} />
              <Text style={styles.livePillText}>Sedang Berjalan</Text>
            </View>
          </View>

          <Text style={styles.tripHeadline}>Gudang Cimahi → 4 Titik Bandung Kota</Text>
          <Text style={styles.tripSubtext}>Armada: Gran Max Blind Van (B 9821 KCE)</Text>

          <View style={styles.summaryStatsRow}>
            <View style={styles.summaryStatItem}>
              <MapPin size={14} color={colors.primary} />
              <Text style={styles.summaryStatVal}>4 Stop</Text>
              <Text style={styles.summaryStatLbl}>Tujuan</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.summaryStatItem}>
              <Clock size={14} color={colors.primary} />
              <Text style={styles.summaryStatVal}>± 1j 15m</Text>
              <Text style={styles.summaryStatLbl}>Estimasi</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.summaryStatItem}>
              <Truck size={14} color={colors.primary} />
              <Text style={styles.summaryStatVal}>28,4 km</Text>
              <Text style={styles.summaryStatLbl}>Jarak Rute</Text>
            </View>
          </View>
        </View>

        {/* Section Title */}
        <Text style={styles.sectionTitle}>Daftar Titik Singgah (Stops)</Text>

        {/* Stop 1: Gudang Cimahi (Selesai) */}
        <View style={styles.stopCard}>
          <View style={styles.stopIconCol}>
            <View style={[styles.stopIconCircle, styles.stopIconCompleted]}>
              <Check size={14} color={colors.white} strokeWidth={3} />
            </View>
            <View style={styles.timelineLine} />
          </View>
          <View style={styles.stopContent}>
            <View style={styles.stopHeader}>
              <Text style={styles.stopName}>1. Gudang Logistik Cimahi (Pickup)</Text>
              <Text style={styles.completedBadge}>Selesai 08:30</Text>
            </View>
            <Text style={styles.stopAddress}>Jl. Raya Baros No. 12, Kota Cimahi</Text>
            <Text style={styles.cargoInfo}>Muatan: 45 Koli Paket Ritel</Text>
          </View>
        </View>

        {/* Stop 2: Toko Sumber Rejeki (Aktif) */}
        <View style={[styles.stopCard, styles.stopCardActive]}>
          <View style={styles.stopIconCol}>
            <View style={[styles.stopIconCircle, styles.stopIconActive]}>
              <Navigation size={14} color={colors.white} strokeWidth={2.5} />
            </View>
            <View style={styles.timelineLine} />
          </View>
          <View style={styles.stopContent}>
            <View style={styles.stopHeader}>
              <Text style={styles.stopName}>2. Toko Sumber Rejeki (Drop-off)</Text>
              <Text style={styles.activeBadge}>Menuju Lokasi</Text>
            </View>
            <Text style={styles.stopAddress}>Jl. Asia Afrika No. 45, Braga, Bandung</Text>
            <Text style={styles.cargoInfo}>Muatan: 12 Koli • PIC: Bpk. Ridwan</Text>

            {completedStops.includes(2) ? (
              <View style={styles.doneEpodRow}>
                <CheckCircle2 size={16} color={colors.success} />
                <Text style={styles.doneEpodText}>e-POD Telah Terverifikasi</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.epodTriggerButton}
                onPress={() => setEpodModalVisible(true)}
                activeOpacity={0.85}
              >
                <FileCheck size={16} color={colors.white} style={{ marginRight: 6 }} />
                <Text style={styles.epodTriggerText}>Serah Terima Barang (e-POD)</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Stop 3: Ritel Prima */}
        <View style={styles.stopCard}>
          <View style={styles.stopIconCol}>
            <View style={[styles.stopIconCircle, styles.stopIconPending]}>
              <Text style={styles.pendingNumber}>3</Text>
            </View>
            <View style={styles.timelineLine} />
          </View>
          <View style={styles.stopContent}>
            <View style={styles.stopHeader}>
              <Text style={styles.stopName}>3. Ritel Prima Buah Batu</Text>
              <Text style={styles.pendingBadge}>Menunggu</Text>
            </View>
            <Text style={styles.stopAddress}>Jl. Buah Batu No. 112, Bandung</Text>
            <Text style={styles.cargoInfo}>Muatan: 18 Koli • Estimasi: 10:15 WIB</Text>
          </View>
        </View>

        {/* Stop 4: Grosir Sukajadi */}
        <View style={styles.stopCard}>
          <View style={styles.stopIconCol}>
            <View style={[styles.stopIconCircle, styles.stopIconPending]}>
              <Text style={styles.pendingNumber}>4</Text>
            </View>
          </View>
          <View style={styles.stopContent}>
            <View style={styles.stopHeader}>
              <Text style={styles.stopName}>4. Grosir Sukajadi Sejahtera</Text>
              <Text style={styles.pendingBadge}>Menunggu</Text>
            </View>
            <Text style={styles.stopAddress}>Jl. Sukajadi No. 78, Pasteur, Bandung</Text>
            <Text style={styles.cargoInfo}>Muatan: 15 Koli • Estimasi: 11:00 WIB</Text>
          </View>
        </View>
      </ScrollView>

      {/* MODAL e-POD (FOTO & TANDA TANGAN DIGITAL) */}
      <Modal visible={epodModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Bukti Serah Terima (e-POD)</Text>
                <Text style={styles.modalSub}>Toko Sumber Rejeki (#TRIP-2026-089)</Text>
              </View>
              <TouchableOpacity onPress={() => setEpodModalVisible(false)}>
                <X size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Step 1: Foto Barang */}
            <Text style={styles.inputLabel}>1. Foto Bukti Penyerahan Kargo</Text>
            <TouchableOpacity
              style={[styles.uploadBox, photoTaken && styles.uploadBoxDone]}
              onPress={() => setPhotoTaken(!photoTaken)}
              activeOpacity={0.8}
            >
              {photoTaken ? (
                <View style={styles.uploadedRow}>
                  <CheckCircle2 size={24} color={colors.success} />
                  <Text style={styles.uploadedText}>Foto Berhasil Diambil (kargo_089_stop2.jpg)</Text>
                </View>
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <Camera size={26} color={colors.primary} />
                  <Text style={styles.uploadText}>Ketuk untuk Ambil Foto Barang</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Step 2: Tanda Tangan Penerima */}
            <Text style={styles.inputLabel}>2. Tanda Tangan Digital Penerima</Text>
            <TouchableOpacity
              style={[styles.signBox, signed && styles.signBoxDone]}
              onPress={() => setSigned(!signed)}
              activeOpacity={0.8}
            >
              {signed ? (
                <View style={styles.signedContent}>
                  <Text style={styles.signatureSample}>Budi & Ridwan S.</Text>
                  <Text style={styles.signedCaption}>Tanda tangan terverifikasi digital</Text>
                </View>
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <PenTool size={24} color={colors.textMuted} />
                  <Text style={styles.signPlaceholderText}>Sentuh di sini untuk bubuhkan tanda tangan</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Konfirmasi Tombol */}
            <TouchableOpacity
              style={styles.confirmEpodButton}
              onPress={handleConfirmEpod}
              activeOpacity={0.85}
            >
              <Check size={18} color={colors.white} strokeWidth={2.5} style={{ marginRight: 6 }} />
              <Text style={styles.confirmEpodText}>Konfirmasi Serah Terima</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  tripCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 16,
  },
  tripBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tripCodeBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tripCodeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
    marginRight: 5,
  },
  livePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.success,
  },
  tripHeadline: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  tripSubtext: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
    marginBottom: 14,
  },
  summaryStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.bg,
    borderRadius: 12,
    paddingVertical: 10,
  },
  summaryStatItem: {
    alignItems: 'center',
  },
  summaryStatVal: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    marginTop: 2,
  },
  summaryStatLbl: {
    fontSize: 10,
    color: colors.textDisabled,
    marginTop: 1,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  stopCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 10,
  },
  stopCardActive: {
    borderColor: colors.primary,
    borderWidth: 1.5,
  },
  stopIconCol: {
    alignItems: 'center',
    marginRight: 12,
  },
  stopIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopIconCompleted: {
    backgroundColor: colors.success,
  },
  stopIconActive: {
    backgroundColor: colors.primary,
  },
  stopIconPending: {
    backgroundColor: colors.surface2,
  },
  pendingNumber: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
    marginTop: 4,
  },
  stopContent: {
    flex: 1,
  },
  stopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stopName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  completedBadge: {
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.success,
  },
  activeBadge: {
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.primary,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  pendingBadge: {
    fontSize: 10.5,
    color: colors.textDisabled,
  },
  stopAddress: {
    fontSize: 11.5,
    color: colors.textSecondary,
    marginTop: 2,
  },
  cargoInfo: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 4,
  },
  epodTriggerButton: {
    backgroundColor: colors.primary,
    height: 40,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  epodTriggerText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  doneEpodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: colors.successLight,
    padding: 6,
    borderRadius: 8,
  },
  doneEpodText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: colors.success,
    marginLeft: 6,
  },

  /* MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  modalSub: {
    fontSize: 11.5,
    color: colors.textMuted,
    marginTop: 2,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    marginTop: 12,
    marginBottom: 6,
  },
  uploadBox: {
    height: 72,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
  uploadBoxDone: {
    borderColor: colors.success,
    borderStyle: 'solid',
    backgroundColor: colors.successLight,
  },
  uploadPlaceholder: {
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 11.5,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  uploadedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadedText: {
    fontSize: 12,
    color: colors.successDark,
    fontWeight: '600',
    marginLeft: 8,
  },
  signBox: {
    height: 90,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
  signBoxDone: {
    borderColor: colors.primary,
    borderStyle: 'solid',
    backgroundColor: colors.surface,
  },
  signPlaceholderText: {
    fontSize: 11.5,
    color: colors.textMuted,
    marginTop: 4,
  },
  signedContent: {
    alignItems: 'center',
  },
  signatureSample: {
    fontSize: 22,
    fontStyle: 'italic',
    fontWeight: '700',
    color: colors.primaryDark,
  },
  signedCaption: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 4,
  },
  confirmEpodButton: {
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  confirmEpodText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
