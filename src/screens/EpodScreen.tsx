import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  ChevronRight,
  Edit3,
  Plus,
  RotateCcw,
  ShieldCheck,
  Trash2,
  User,
  X,
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { TopBar } from '../components/TopBar';
import { useApp } from '../context/AppContext';

interface EpodScreenProps {
  onBack?: () => void;
  onSubmitSuccess?: () => void;
}

interface PhotoItem {
  id: string;
  title: string;
  time: string;
}

const DEFAULT_PHOTOS: PhotoItem[] = [
  {
    id: 'photo-1',
    title: 'Fisik Kargo Diterima',
    time: '09:12 WIB • B 9821 KCE',
  },
];

export const EpodScreen: React.FC<EpodScreenProps> = (props) => {
  const {
    selectedStopId,
    setSelectedStopId,
    epodRecords,
    saveEpodRecord,
    completeEntireTrip,
    driverProfile,
    navigateTo,
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

  // 1. Photos State (Supports up to 3 interactive photos)
  const [photos, setPhotos] = useState<PhotoItem[]>(
    existingRecord && !existingRecord.hasPhoto ? [] : DEFAULT_PHOTOS
  );

  // 2. Recipient Name State
  const [recipientName, setRecipientName] = useState(
    existingRecord
      ? existingRecord.recipientName
      : selectedStopId === 1
      ? 'Bpk. Budi (Gudang Cimahi)'
      : 'Budi Setiawan'
  );

  // 3. Signature State & Style Variant
  const [hasSignature, setHasSignature] = useState(
    existingRecord ? existingRecord.hasSignature : true
  );
  const [signatureVariant, setSignatureVariant] = useState<number>(0);

  // 4. Submitting & Success Modal State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Quick recipient suggestions
  const recipientSuggestions = [
    'Budi Setiawan (PIC)',
    'Staf Gudang',
    'Kasir Toko',
  ];

  const handleAddPhoto = () => {
    if (photos.length >= 3) {
      Alert.alert('Batas Maksimal', 'Maksimal 3 foto bukti kargo per titik pengantaran.');
      return;
    }

    Alert.alert(
      'Ambil Foto Bukti Serah Terima',
      'Pilih jenis dokumen atau bukti fisik kargo yang ingin dilampirkan:',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Foto Fisik Kargo / Paket',
          onPress: () => {
            const now = new Date();
            const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
              now.getMinutes()
            ).padStart(2, '0')} WIB • ${driverProfile.vehiclePlate}`;
            const newPhoto: PhotoItem = {
              id: `photo-${Date.now()}`,
              title: `Fisik Kargo #${photos.length + 1}`,
              time: timeStr,
            };
            setPhotos((prev) => [...prev, newPhoto]);
            Alert.alert('Foto Berhasil Dilampirkan', 'Stempel waktu & watermark GPS otomatis dibubuhkan.');
          },
        },
        {
          text: 'Foto Surat Jalan / Resi',
          onPress: () => {
            const now = new Date();
            const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
              now.getMinutes()
            ).padStart(2, '0')} WIB • ${driverProfile.vehiclePlate}`;
            const newPhoto: PhotoItem = {
              id: `photo-${Date.now()}`,
              title: 'Dokumen Surat Jalan',
              time: timeStr,
            };
            setPhotos((prev) => [...prev, newPhoto]);
            Alert.alert('Surat Jalan Dilampirkan', 'Dokumen manifes pengiriman berhasil ditambahkan.');
          },
        },
      ]
    );
  };

  const handleDeletePhoto = (id: string) => {
    Alert.alert(
      'Hapus Foto',
      'Apakah Anda yakin ingin menghapus foto bukti kargo ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => setPhotos((prev) => prev.filter((p) => p.id !== id)),
        },
      ]
    );
  };

  const handleClearSignature = () => {
    setHasSignature(false);
  };

  const handleSignCanvas = () => {
    setHasSignature(true);
  };

  const handleToggleSignatureStyle = () => {
    setSignatureVariant((prev) => (prev === 0 ? 1 : 0));
  };

  const handleConfirm = () => {
    if (!recipientName.trim()) {
      Alert.alert('Nama Penerima Wajib', 'Harap masukkan nama perwakilan penerima kargo.');
      return;
    }
    if (photos.length === 0) {
      Alert.alert('Foto Wajib Dilampirkan', 'Minimal lampirkan 1 foto bukti fisik barang diterima.');
      return;
    }
    if (!hasSignature) {
      Alert.alert('Tanda Tangan Wajib', 'Harap bubuhkan tanda tangan digital penerima barang pada kanvas.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes()
      ).padStart(2, '0')} WIB`;

      saveEpodRecord({
        stopId: selectedStopId,
        recipientName: recipientName.trim(),
        hasPhoto: true,
        hasSignature: true,
        submittedAt: timeStr,
      });

      setShowSuccessModal(true);
    }, 500);
  };

  return (
    <View style={styles.container}>
      {/* 1. MODULAR TOP BAR */}
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
            <View>
              <Text style={styles.cardTitle}>Foto Bukti Kargo</Text>
              <Text style={styles.cardSubtitle}>
                {photos.length}/3 Foto Terlampir (Min. 1 foto wajib)
              </Text>
            </View>
            {photos.length < 3 && (
              <TouchableOpacity
                style={styles.addPhotoHeaderBtn}
                onPress={handleAddPhoto}
                activeOpacity={0.75}
              >
                <Plus size={13} color={colors.primary} strokeWidth={2.5} />
                <Text style={styles.addPhotoHeaderText}>Tambah</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Photo Gallery Grid */}
          <View style={styles.photoGrid}>
            {photos.map((item) => (
              <View key={item.id} style={styles.photoItemCard}>
                <Image
                  source={require('../../assets/package-sample.png')}
                  style={styles.photoPreviewImage}
                  resizeMode="cover"
                />
                <View style={styles.watermarkOverlay}>
                  <Text style={styles.watermarkTag}>FLEETRA VERIFIED</Text>
                  <Text style={styles.watermarkTime}>{item.time}</Text>
                </View>
                <TouchableOpacity
                  style={styles.photoDeleteBtn}
                  onPress={() => handleDeletePhoto(item.id)}
                  activeOpacity={0.8}
                >
                  <Trash2 size={12} color={colors.white} strokeWidth={2.2} />
                </TouchableOpacity>
              </View>
            ))}

            {/* Upload slot button if photos < 3 */}
            {photos.length < 3 && (
              <TouchableOpacity
                style={[
                  styles.addPhotoSlot,
                  photos.length === 0 && styles.addPhotoSlotEmpty,
                ]}
                onPress={handleAddPhoto}
                activeOpacity={0.75}
              >
                <View style={styles.cameraIconCircle}>
                  <Camera size={20} color={colors.primary} strokeWidth={2.2} />
                </View>
                <Text style={styles.addPhotoText}>
                  {photos.length === 0 ? 'Ambil Foto Bukti (Wajib)' : 'Tambah Foto'}
                </Text>
                <Text style={styles.addPhotoSubText}>
                  {photos.length === 0 ? 'Ketuk untuk melampirkan kargo' : 'Maks. 3 foto'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 4. NAMA PENERIMA CARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Nama Penerima</Text>
          <Text style={styles.cardSubtitle}>
            Nama perwakilan penerima yang bertanda tangan di lokasi
          </Text>

          <View style={styles.inputContainer}>
            <User size={16} color={colors.textSecondary} strokeWidth={2} />
            <TextInput
              style={styles.textInput}
              value={recipientName}
              onChangeText={setRecipientName}
              placeholder="Nama lengkap perwakilan penerima"
              placeholderTextColor={colors.textDisabled}
              autoCapitalize="words"
            />
            {recipientName.length > 0 && (
              <TouchableOpacity
                onPress={() => setRecipientName('')}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <X size={15} color={colors.textDisabled} strokeWidth={2} />
              </TouchableOpacity>
            )}
          </View>

          {/* Quick chip suggestions */}
          <View style={styles.suggestionChipsRow}>
            {recipientSuggestions.map((name) => (
              <TouchableOpacity
                key={name}
                style={styles.suggestionChip}
                onPress={() => setRecipientName(name)}
                activeOpacity={0.7}
              >
                <Text style={styles.suggestionChipText}>{name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 5. TANDA TANGAN PENERIMA CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={styles.cardTitle}>Tanda Tangan Penerima</Text>
              <Text style={styles.cardSubtitle}>
                Bubuhkan tanda tangan digital di atas kanvas
              </Text>
            </View>

            {hasSignature ? (
              <View style={styles.signActionsRow}>
                <TouchableOpacity
                  style={styles.signActionBtn}
                  onPress={handleToggleSignatureStyle}
                  activeOpacity={0.7}
                >
                  <RotateCcw size={11} color={colors.primary} strokeWidth={2.2} />
                  <Text style={styles.signActionTextPrimary}>Ganti Gaya</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.signActionBtn}
                  onPress={handleClearSignature}
                  activeOpacity={0.7}
                >
                  <Trash2 size={11} color={colors.dangerDark} strokeWidth={2.2} />
                  <Text style={styles.signActionTextDanger}>Hapus</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.signActionBtn}
                onPress={handleSignCanvas}
                activeOpacity={0.7}
              >
                <Edit3 size={11} color={colors.primary} strokeWidth={2.2} />
                <Text style={styles.signActionTextPrimary}>Tanda Tangani</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Interactive Signature Canvas Box */}
          <TouchableOpacity
            style={[
              styles.signatureBox,
              !hasSignature && styles.signatureBoxEmpty,
            ]}
            onPress={hasSignature ? handleToggleSignatureStyle : handleSignCanvas}
            activeOpacity={0.88}
          >
            {hasSignature ? (
              <View style={styles.signatureCanvas}>
                <Svg height="85" width="100%" viewBox="0 0 300 85">
                  {signatureVariant === 0 ? (
                    <Path
                      d="M 30 52 C 45 18, 60 68, 75 32 C 85 14, 95 62, 110 48 C 130 28, 140 72, 160 38 C 175 58, 190 28, 205 52 C 220 68, 240 24, 270 42"
                      fill="none"
                      stroke={colors.primary}
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ) : (
                    <Path
                      d="M 25 40 C 45 20, 60 65, 85 30 C 105 18, 125 58, 145 35 C 165 20, 185 62, 210 40 C 230 25, 250 50, 275 35"
                      fill="none"
                      stroke={colors.primary}
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                  <Path
                    d="M 40 68 L 260 68"
                    fill="none"
                    stroke="#CBD5E1"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                </Svg>
                <View style={styles.signatureSignerTag}>
                  <CheckCircle2 size={11} color={colors.primary} strokeWidth={2.2} />
                  <Text style={styles.signatureSignerText}>
                    {recipientName.trim() || 'Penerima Kargo'} • Tervalidasi Digital
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.signatureEmptyPrompt}>
                <View style={styles.penIconCircle}>
                  <Edit3 size={18} color={colors.textDisabled} strokeWidth={2} />
                </View>
                <Text style={styles.signatureEmptyTitle}>
                  Sentuh area ini untuk menandatangani
                </Text>
                <Text style={styles.signatureEmptySub}>
                  Ketuk kanvas untuk membubuhkan tanda tangan digital penerima
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* 6. DISCLAIMER / PERNYATAAN INTEGRITAS */}
        <View style={styles.disclaimerBox}>
          <ShieldCheck size={16} color={colors.primary} strokeWidth={2} style={{ marginTop: 2 }} />
          <Text style={styles.disclaimerText}>
            Dengan mengonfirmasi, Anda menyatakan bahwa seluruh kargo telah diserahterimakan dalam kondisi baik, lengkap, dan terverifikasi digital.
          </Text>
        </View>

        {/* 7. PRIMARY CTA BUTTON: KONFIRMASI SERAH TERIMA */}
        <TouchableOpacity
          style={[
            styles.primaryActionButton,
            isSubmitting && styles.primaryActionButtonDisabled,
          ]}
          onPress={handleConfirm}
          activeOpacity={0.85}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <View style={styles.submittingRow}>
              <ActivityIndicator size="small" color={colors.white} />
              <Text style={styles.primaryActionText}>Mengunggah e-POD & Telematika...</Text>
            </View>
          ) : (
            <Text style={styles.primaryActionText}>Konfirmasi Serah Terima</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* 8. IN-APP SUCCESS MODAL */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            {/* Top Icon Circle */}
            <View style={styles.modalIconBox}>
              <CheckCircle2 size={32} color={colors.primary} strokeWidth={2.4} />
            </View>

            <Text style={styles.modalTitle}>
              {selectedStopId >= 4 ? 'Ritase #TRIP-2026-089 Selesai!' : 'Serah Terima Berhasil!'}
            </Text>
            <Text style={styles.modalSubtitle}>
              {selectedStopId >= 4
                ? 'Seluruh 4 titik pengantaran telah sukses diselesaikan dengan verifikasi e-POD.'
                : `${stopTitle} (Stop ${selectedStopId}/4) telah terverifikasi secara digital.`}
            </Text>

            {/* Receipt Summary Card */}
            <View style={styles.modalReceiptCard}>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Penerima</Text>
                <Text style={styles.receiptValueBold}>{recipientName.trim()}</Text>
              </View>
              <View style={styles.receiptDivider} />
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Dokumen e-POD</Text>
                <Text style={styles.receiptValue}>{photos.length} Foto + TTD Digital</Text>
              </View>
              <View style={styles.receiptDivider} />
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Setoran Ekuitas (RTO)</Text>
                <Text style={styles.receiptValueGreen}>+Rp 50.000 (Masuk)</Text>
              </View>
            </View>

            {/* Action Buttons */}
            {selectedStopId < 4 ? (
              <TouchableOpacity
                style={styles.modalPrimaryBtn}
                onPress={() => {
                  setShowSuccessModal(false);
                  setSelectedStopId(selectedStopId + 1);
                  navigateTo('detail-stop');
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.modalPrimaryBtnText}>
                  Lanjut ke Stop Berikutnya (Stop {selectedStopId + 1})
                </Text>
                <ArrowRight size={15} color={colors.white} strokeWidth={2.2} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.modalPrimaryBtn}
                onPress={() => {
                  setShowSuccessModal(false);
                  completeEntireTrip();
                  navigateTo('perjalanan');
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.modalPrimaryBtnText}>
                  Selesaikan Seluruh Pesanan
                </Text>
                <CheckCircle2 size={15} color={colors.white} strokeWidth={2.2} />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.modalSecondaryBtn}
              onPress={() => {
                setShowSuccessModal(false);
                navigateTo('perjalanan');
              }}
              activeOpacity={0.75}
            >
              <Text style={styles.modalSecondaryBtnText}>Kembali ke Daftar Perjalanan</Text>
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
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
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
    shadowRadius: 4,
    elevation: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.text,
  },
  cardSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  addPhotoHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryMuted,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  addPhotoHeaderText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },

  /* PHOTO SECTION */
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  photoItemCard: {
    width: 130,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface2,
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
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  watermarkTag: {
    fontSize: 8,
    fontWeight: '800',
    color: '#60A5FA',
    letterSpacing: 0.5,
  },
  watermarkTime: {
    fontSize: 7.5,
    color: '#FFFFFF',
    marginTop: 1,
  },
  photoDeleteBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoSlot: {
    width: 130,
    height: 100,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    backgroundColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  addPhotoSlotEmpty: {
    width: '100%',
    height: 110,
  },
  cameraIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  addPhotoText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
  },
  addPhotoSubText: {
    fontSize: 9.5,
    color: colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },

  /* INPUT SECTION */
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    marginTop: 10,
    gap: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 12.5,
    color: colors.text,
  },
  suggestionChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  suggestionChip: {
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 14,
  },
  suggestionChipText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  /* SIGNATURE SECTION */
  signActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  signActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  signActionTextPrimary: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
  signActionTextDanger: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.dangerDark,
  },
  signatureBox: {
    backgroundColor: colors.surface2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  signatureBoxEmpty: {
    borderStyle: 'dashed',
    borderColor: colors.primary,
  },
  signatureCanvas: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signatureSignerTag: {
    position: 'absolute',
    bottom: 6,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  signatureSignerText: {
    fontSize: 9.5,
    fontWeight: '600',
    color: colors.primary,
  },
  signatureEmptyPrompt: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  penIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  signatureEmptyTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.primary,
  },
  signatureEmptySub: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },

  /* DISCLAIMER */
  disclaimerBox: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: 18,
    marginTop: 14,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'flex-start',
  },
  disclaimerText: {
    flex: 1,
    fontSize: 10.5,
    color: colors.textMuted,
    marginLeft: 8,
    lineHeight: 15,
  },

  /* CTA BUTTON */
  primaryActionButton: {
    backgroundColor: colors.primary,
    marginHorizontal: 18,
    marginTop: 14,
    marginBottom: 20,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 2,
  },
  primaryActionButtonDisabled: {
    opacity: 0.75,
  },
  submittingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  primaryActionText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.white,
  },

  /* SUCCESS MODAL */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  modalIconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EFF6FF',
    borderWidth: 2,
    borderColor: '#BFDBFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 17,
    marginBottom: 16,
  },
  modalReceiptCard: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 18,
    gap: 8,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptLabel: {
    fontSize: 11,
    color: colors.textMuted,
  },
  receiptValue: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text,
  },
  receiptValueBold: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.text,
  },
  receiptValueGreen: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.primary,
  },
  receiptDivider: {
    height: 1,
    backgroundColor: '#EDF2F7',
  },
  modalPrimaryBtn: {
    width: '100%',
    height: 46,
    backgroundColor: colors.primary,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  modalPrimaryBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.white,
  },
  modalSecondaryBtn: {
    width: '100%',
    height: 42,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSecondaryBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
