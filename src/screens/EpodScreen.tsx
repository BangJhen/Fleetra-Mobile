import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  ChevronRight,
  Plus,
  RotateCcw,
  ShieldCheck,
  Trash2,
} from 'lucide-react-native';
import { colors } from '../theme/colors';

interface EpodScreenProps {
  onBack: () => void;
  onSubmitSuccess: () => void;
}

export const EpodScreen: React.FC<EpodScreenProps> = ({
  onBack,
  onSubmitSuccess,
}) => {
  const [recipientName, setRecipientName] = useState('Budi Setiawan');
  const [hasPhoto, setHasPhoto] = useState(true);
  const [hasSignature, setHasSignature] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClearSignature = () => {
    setHasSignature(false);
  };

  const handleRecreateSignature = () => {
    setHasSignature(true);
  };

  const handleConfirm = () => {
    if (!recipientName.trim()) {
      Alert.alert('Nama Penerima Kosong', 'Harap masukkan nama penerima barang.');
      return;
    }
    if (!hasPhoto) {
      Alert.alert('Foto Wajib Diambil', 'Minimal lampirkan 1 foto bukti serah terima barang.');
      return;
    }
    if (!hasSignature) {
      Alert.alert('Tanda Tangan Wajib', 'Harap bubuhkan tanda tangan digital penerima kargo.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'e-POD Terverifikasi!',
        'Bukti serah terima untuk Toko Sumber Rejeki (Stop 2/4) telah tersimpan dan terkirim otomatis ke Web Dispatcher FLEETRA.',
        [
          {
            text: 'Lanjutkan',
            onPress: onSubmitSuccess,
          },
        ]
      );
    }, 600);
  };

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
          <Text style={styles.headerTitle}>Bukti Pengantaran (e-POD)</Text>
          <Text style={styles.headerSubtitle}>Trip #TRIP-2026-089 • Stop 2/4</Text>
        </View>

        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 2. STOP SUMMARY CARD */}
        <View style={styles.stopCard}>
          <View style={styles.stopLeft}>
            <Text style={styles.stopName}>Toko Sumber Rejeki</Text>
            <Text style={styles.stopAddress}>Jl. Sudirman No. 45, Bandung</Text>
          </View>
          <TouchableOpacity
            style={styles.detailStopLink}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Text style={styles.detailStopLinkText}>Detail Stop</Text>
            <ChevronRight size={13} color={colors.primary} strokeWidth={2.2} />
          </TouchableOpacity>
        </View>

        {/* 3. FOTO BUKTI BARANG CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Foto Bukti Barang</Text>
            <Text style={styles.cardSubtitleRight}>Min. 1 foto</Text>
          </View>

          <View style={styles.photoGrid}>
            {hasPhoto ? (
              <View style={styles.photoPreviewWrapper}>
                <Image
                  source={require('../../assets/package-sample.png')}
                  style={styles.photoPreviewImage}
                  resizeMode="cover"
                />
                <View style={styles.watermarkOverlay}>
                  <Text style={styles.watermarkText}>FLEETRA VERIFIED</Text>
                  <Text style={styles.watermarkTime}>09:12 WIB • B 9821 KCE</Text>
                </View>
                <TouchableOpacity
                  style={styles.photoDeleteBtn}
                  onPress={() => setHasPhoto(false)}
                  activeOpacity={0.75}
                >
                  <Trash2 size={13} color={colors.white} strokeWidth={2.2} />
                </TouchableOpacity>
              </View>
            ) : null}

            {/* Add photo slot */}
            <TouchableOpacity
              style={[
                styles.addPhotoSlot,
                !hasPhoto && styles.addPhotoSlotLarge,
              ]}
              onPress={() => setHasPhoto(true)}
              activeOpacity={0.75}
            >
              <Camera size={22} color={colors.primary} strokeWidth={2} />
              <Text style={styles.addPhotoText}>Tambah Foto</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 4. NAMA PENERIMA CARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Nama Penerima</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={recipientName}
              onChangeText={setRecipientName}
              placeholder="Masukkan nama penerima barang"
              placeholderTextColor={colors.textDisabled}
            />
          </View>
        </View>

        {/* 5. TANDA TANGAN PENERIMA CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Tanda Tangan Penerima</Text>
            {hasSignature ? (
              <TouchableOpacity
                style={styles.clearSignRow}
                onPress={handleClearSignature}
                activeOpacity={0.7}
              >
                <View style={styles.clearDot} />
                <Text style={styles.clearSignText}>Hapus</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.clearSignRow}
                onPress={handleRecreateSignature}
                activeOpacity={0.7}
              >
                <RotateCcw size={12} color={colors.primary} strokeWidth={2.2} />
                <Text style={[styles.clearSignText, { color: colors.primary, marginLeft: 4 }]}>
                  Buat Ulang
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Signature Canvas Box */}
          <TouchableOpacity
            style={styles.signatureBox}
            onPress={() => setHasSignature(true)}
            activeOpacity={0.9}
          >
            {hasSignature ? (
              <View style={styles.signatureCanvas}>
                <Svg height="90" width="100%" viewBox="0 0 300 90">
                  {/* Realistic signature curve representation for Budi S */}
                  <Path
                    d="M 30 55 C 45 20, 60 70, 75 35 C 85 15, 95 65, 110 50 C 130 30, 140 75, 160 40 C 175 60, 190 30, 205 55 C 220 70, 240 25, 270 45"
                    fill="none"
                    stroke={colors.primary}
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Path
                    d="M 50 72 L 260 68"
                    fill="none"
                    stroke="#CBD5E1"
                    strokeWidth="1.2"
                    strokeDasharray="4 4"
                  />
                </Svg>
                <View style={styles.signatureSignerTag}>
                  <Text style={styles.signatureSignerText}>Budi S (Penerima)</Text>
                </View>
              </View>
            ) : (
              <View style={styles.signatureEmptyPrompt}>
                <Text style={styles.signatureEmptyText}>
                  Sentuh area ini untuk menandatangani bukti kirim
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* 6. DISCLAIMER / PERNYATAAN */}
        <View style={styles.disclaimerBox}>
          <ShieldCheck size={16} color={colors.textMuted} strokeWidth={2} style={{ marginTop: 2 }} />
          <Text style={styles.disclaimerText}>
            Dengan menekan Konfirmasi, Anda menyatakan bahwa barang telah diterima
            dengan baik oleh penerima.
          </Text>
        </View>

        {/* 7. PRIMARY CTA BUTTON: KONFIRMASI SERAH TERIMA */}
        <TouchableOpacity
          style={styles.primaryActionButton}
          onPress={handleConfirm}
          activeOpacity={0.85}
          disabled={isSubmitting}
        >
          <Text style={styles.primaryActionText}>
            {isSubmitting ? 'Mengirim e-POD...' : 'Konfirmasi Serah Terima'}
          </Text>
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

  /* STOP SUMMARY */
  stopCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    marginHorizontal: 18,
    marginTop: 14,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stopLeft: {
    flex: 1,
    marginRight: 10,
  },
  stopName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  stopAddress: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  detailStopLink: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryMuted,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  detailStopLinkText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
    marginRight: 3,
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
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  cardSubtitleRight: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },

  /* PHOTO GRID */
  photoGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  photoPreviewWrapper: {
    width: 130,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.border,
  },
  photoPreviewImage: {
    width: '100%',
    height: '100%',
  },
  watermarkOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingVertical: 3,
    paddingHorizontal: 6,
  },
  watermarkText: {
    fontSize: 8,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.3,
  },
  watermarkTime: {
    fontSize: 7,
    color: '#CBD5E1',
  },
  photoDeleteBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoSlot: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#93C5FD',
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  addPhotoSlotLarge: {
    flex: 1,
    height: 100,
  },
  addPhotoText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 6,
  },

  /* TEXT INPUT */
  inputContainer: {
    marginTop: 8,
    backgroundColor: colors.bg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  textInput: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },

  /* SIGNATURE */
  clearSignRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.danger,
    marginRight: 4,
  },
  clearSignText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.danger,
  },
  signatureBox: {
    marginTop: 6,
    height: 110,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bg,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signatureCanvas: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  signatureSignerTag: {
    position: 'absolute',
    bottom: 6,
    right: 10,
  },
  signatureSignerText: {
    fontSize: 10,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  signatureEmptyPrompt: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  signatureEmptyText: {
    fontSize: 12,
    color: colors.textDisabled,
    textAlign: 'center',
  },

  /* DISCLAIMER */
  disclaimerBox: {
    flexDirection: 'row',
    marginHorizontal: 18,
    marginTop: 14,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 11,
    color: colors.textMuted,
    marginLeft: 8,
    lineHeight: 16,
  },

  /* PRIMARY ACTION BUTTON */
  primaryActionButton: {
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
  primaryActionText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
});
