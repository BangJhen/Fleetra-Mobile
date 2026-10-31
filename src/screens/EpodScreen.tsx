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
  Camera,
  ChevronRight,
  RotateCcw,
  ShieldCheck,
  Trash2,
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { TopBar } from '../components/TopBar';
import { useApp } from '../context/AppContext';

interface EpodScreenProps {
  onBack?: () => void;
  onSubmitSuccess?: () => void;
}

export const EpodScreen: React.FC<EpodScreenProps> = (props) => {
  const {
    selectedStopId,
    epodRecords,
    saveEpodRecord,
    navigateTo,
    goBack,
  } = useApp();

  const handleBack = () => {
    if (props.onBack) {
      props.onBack();
    } else {
      navigateTo('detail-stop');
    }
  };
  const existingRecord = epodRecords[selectedStopId];

  const stopTitle =
    selectedStopId === 1
      ? 'Gudang Pusat Cimahi'
      : selectedStopId === 3
      ? 'Minimarket Sejahtera'
      : selectedStopId === 4
      ? 'Toko Makmur Jaya'
      : 'Toko Sumber Rejeki';

  const stopAddress =
    selectedStopId === 1
      ? 'Jl. Industri Raya No. 12, Cimahi'
      : selectedStopId === 3
      ? 'Jl. Flyover Pasirkoja, Bandung'
      : selectedStopId === 4
      ? 'Jl. Peta No. 88, Bandung'
      : 'Jl. Sudirman No. 45, Bandung';

  const [recipientName, setRecipientName] = useState(
    existingRecord
      ? existingRecord.recipientName
      : selectedStopId === 1
      ? 'Bpk. Budi (Gudang Cimahi)'
      : 'Budi Setiawan'
  );
  const [hasPhoto, setHasPhoto] = useState(
    existingRecord ? existingRecord.hasPhoto : true
  );
  const [hasSignature, setHasSignature] = useState(
    existingRecord ? existingRecord.hasSignature : true
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClearSignature = () => {
    setHasSignature(false);
  };

  const handleRecreateSignature = () => {
    setHasSignature(true);
  };

  const handleConfirm = () => {
    if (!recipientName.trim()) {
      Alert.alert('Nama Penerima Kosong', 'Harap masukkan nama perwakilan penerima barang.');
      return;
    }
    if (!hasPhoto) {
      Alert.alert('Foto Wajib Diambil', 'Minimal lampirkan 1 foto bukti fisik barang diterima.');
      return;
    }
    if (!hasSignature) {
      Alert.alert('Tanda Tangan Wajib', 'Harap bubuhkan tanda tangan digital penerima kargo.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;

      saveEpodRecord({
        stopId: selectedStopId,
        recipientName: recipientName.trim(),
        hasPhoto,
        hasSignature,
        submittedAt: timeStr,
      });

      Alert.alert(
        'e-POD Terverifikasi & Tersimpan',
        `Bukti serah terima untuk ${stopTitle} (Stop ${selectedStopId}/4) telah tersimpan ke in-memory session dan terkirim ke Web Dispatcher FLEETRA.`,
        [
          {
            text: 'Selesai',
            onPress: () => {
              if (props.onSubmitSuccess) {
                props.onSubmitSuccess();
              } else {
                navigateTo('perjalanan');
              }
            },
          },
        ]
      );
    }, 500);
  };

  return (
    <View style={styles.container}>
      {/* 1. MODULAR TOP BAR (FIXED, SPACIOUS) */}
      <TopBar
        variant="back"
        title="Bukti Pengantaran (e-POD)"
        subtitle={`Trip #TRIP-2026-089 • Stop ${selectedStopId}/4`}
        onBack={handleBack}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 2. STOP SUMMARY CARD */}
        <View style={styles.stopCard}>
          <View style={styles.stopLeft}>
            <Text style={styles.stopName}>{stopTitle}</Text>
            <Text style={styles.stopAddress}>{stopAddress}</Text>
          </View>
          <TouchableOpacity
            style={styles.detailStopLink}
            onPress={handleBack}
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
                  <Trash2 size={12} color={colors.white} strokeWidth={2.2} />
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
              <Camera size={20} color={colors.primary} strokeWidth={2} />
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
              placeholder="Nama lengkap perwakilan penerima"
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
                <Text style={styles.clearSignText}>Hapus</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.clearSignRow}
                onPress={handleRecreateSignature}
                activeOpacity={0.7}
              >
                <RotateCcw size={11} color={colors.primary} strokeWidth={2.2} />
                <Text style={[styles.clearSignText, { color: colors.primary, marginLeft: 4 }]}>
                  Ulangi
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
                <Svg height="85" width="100%" viewBox="0 0 300 85">
                  <Path
                    d="M 30 52 C 45 18, 60 68, 75 32 C 85 14, 95 62, 110 48 C 130 28, 140 72, 160 38 C 175 58, 190 28, 205 52 C 220 68, 240 24, 270 42"
                    fill="none"
                    stroke={colors.primary}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Path
                    d="M 50 68 L 260 65"
                    fill="none"
                    stroke="#CBD5E1"
                    strokeWidth="1"
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
          <ShieldCheck size={15} color={colors.textMuted} strokeWidth={2} style={{ marginTop: 2 }} />
          <Text style={styles.disclaimerText}>
            Dengan menekan Konfirmasi, Anda menyatakan bahwa kargo telah diserahterimakan
            dalam kondisi baik dan lengkap sesuai manifest pengiriman.
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
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
    fontSize: 13.5,
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
    backgroundColor: colors.surface2,
    paddingHorizontal: 8,
    paddingVertical: 4.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailStopLinkText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: colors.textSecondary,
    marginRight: 2,
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
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.text,
  },
  cardSubtitleRight: {
    fontSize: 10.5,
    fontWeight: '600',
    color: colors.textMuted,
  },

  /* PHOTO GRID */
  photoGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  photoPreviewWrapper: {
    width: 120,
    height: 95,
    borderRadius: 10,
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
    fontSize: 7.5,
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
    top: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoSlot: {
    width: 95,
    height: 95,
    borderRadius: 10,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.border,
    backgroundColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  addPhotoSlotLarge: {
    flex: 1,
    height: 95,
  },
  addPhotoText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 5,
  },

  /* TEXT INPUT */
  inputContainer: {
    marginTop: 8,
    backgroundColor: colors.surface2,
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
  clearSignText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  signatureBox: {
    marginTop: 6,
    height: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
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
    bottom: 5,
    right: 10,
  },
  signatureSignerText: {
    fontSize: 9.5,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  signatureEmptyPrompt: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  signatureEmptyText: {
    fontSize: 11.5,
    color: colors.textDisabled,
    textAlign: 'center',
  },

  /* DISCLAIMER */
  disclaimerBox: {
    flexDirection: 'row',
    marginHorizontal: 18,
    marginTop: 14,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
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
});
