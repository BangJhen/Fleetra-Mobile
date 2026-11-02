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
import {
  AlertTriangle,
  Camera,
  Check,
  Clock,
  CreditCard,
  Lock,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  Truck,
  User,
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { TopBar } from '../components/TopBar';
import { useApp } from '../context/AppContext';

export const EditProfileScreen: React.FC = () => {
  const { driverProfile, updateDriverProfile, rtoContract, driverId, userEmail, goBack } = useApp();

  const [name, setName] = useState(driverProfile.name || '');
  const [phone, setPhone] = useState(driverProfile.phone || '');
  const [emergencyContact, setEmergencyContact] = useState(
    driverProfile.emergencyContact || ''
  );
  const [simNumber, setSimNumber] = useState(driverProfile.simNumber || '');
  const [simExpiry, setSimExpiry] = useState(driverProfile.simExpiry || '');
  const [vehicleModel, setVehicleModel] = useState(driverProfile.vehicleModel || '');
  const [vehiclePlate, setVehiclePlate] = useState(driverProfile.vehiclePlate || '');

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Nama Kosong', 'Nama lengkap pengemudi tidak boleh kosong.');
      return;
    }
    if (!phone.trim()) {
      Alert.alert('Nomor Ponsel Kosong', 'Nomor kontak telepon wajib diisi.');
      return;
    }

    try {
      await updateDriverProfile({
        name: name.trim(),
        phone: phone.trim(),
        emergencyContact: emergencyContact.trim(),
        simNumber: simNumber.trim(),
        simExpiry: simExpiry.trim(),
        vehicleModel: vehicleModel.trim(),
        vehiclePlate: vehiclePlate.trim().toUpperCase(),
      });

      Alert.alert(
        'Profil Berhasil Diperbarui',
        'Data diri dan armada mitra pengemudi telah disinkronkan ke server pusat kendali FLEETRA.',
        [
          {
            text: 'Selesai',
            onPress: goBack,
          },
        ]
      );
    } catch (err) {
      Alert.alert('Gagal Memperbarui', err instanceof Error ? err.message : 'Silakan coba lagi');
    }
  };

  return (
    <View style={styles.container}>
      <TopBar
        variant="back"
        title="Edit Profil"
        subtitle="Data Diri Mitra Pengemudi"
        onBack={goBack}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* AVATAR UPLOAD SECTION */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <Image
              source={require('../../assets/driver-avatar.png')}
              style={styles.avatarImage}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={styles.cameraBadge}
              onPress={() =>
                Alert.alert(
                  'Ganti Foto Profil',
                  'Ambil foto baru atau pilih dari galeri untuk verifikasi pengemudi.'
                )
              }
              activeOpacity={0.8}
            >
              <Camera size={13} color={colors.white} strokeWidth={2.2} />
            </TouchableOpacity>
          </View>
          <Text style={styles.avatarDriverId}>
            ID MITRA: {driverProfile.driverId ? driverProfile.driverId.toUpperCase() : (driverId ? driverId.toUpperCase() : 'MITRA BARU')}
          </Text>
          {driverProfile.verificationStatus === 'pending' ? (
            <View style={[styles.verifiedTag, { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }]}>
              <Clock size={12} color="#D97706" strokeWidth={2.2} />
              <Text style={[styles.verifiedTagText, { color: '#B45309' }]}>Menunggu Verifikasi Operator</Text>
            </View>
          ) : driverProfile.verificationStatus === 'rejected' ? (
            <View style={[styles.verifiedTag, { backgroundColor: '#FFE4E6', borderColor: '#FECDD3' }]}>
              <AlertTriangle size={12} color="#E11D48" strokeWidth={2.2} />
              <Text style={[styles.verifiedTagText, { color: '#BE123C' }]}>Pendaftaran Ditolak</Text>
            </View>
          ) : (
            <View style={styles.verifiedTag}>
              <ShieldCheck size={12} color={colors.primary} strokeWidth={2.2} />
              <Text style={styles.verifiedTagText}>Akun Terverifikasi FLEETRA</Text>
            </View>
          )}
        </View>

        {/* SECTION 1: DATA PRIBADI */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Data Diri Pengemudi</Text>

          {/* Nama Lengkap */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nama Lengkap</Text>
            <View style={styles.inputBox}>
              <User size={15} color={colors.textSecondary} strokeWidth={2} />
              <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder="Nama lengkap sesuai KTP"
                placeholderTextColor={colors.textDisabled}
              />
            </View>
          </View>

          {/* Email Akun Terdaftar (Sistem MariaDB) */}
          <View style={styles.inputGroup}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.inputLabel}>Email Akun Pengemudi</Text>
              <Text style={{ fontSize: 10, color: colors.textMuted, fontWeight: '500' }}>Tersinkron Database</Text>
            </View>
            <View style={[styles.inputBox, { backgroundColor: '#F8FAFC' }]}>
              <Mail size={15} color={colors.primary} strokeWidth={2} />
              <TextInput
                style={[styles.textInput, { color: colors.text }]}
                value={driverProfile.email || userEmail || ''}
                editable={false}
              />
              <Lock size={13} color={colors.textMuted} strokeWidth={2} />
            </View>
          </View>

          {/* Nomor Ponsel */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nomor WhatsApp / Ponsel</Text>
            <View style={styles.inputBox}>
              <Phone size={15} color={colors.textSecondary} strokeWidth={2} />
              <TextInput
                style={styles.textInput}
                value={phone}
                onChangeText={setPhone}
                placeholder="+62 8xx-xxxx-xxxx"
                keyboardType="phone-pad"
                placeholderTextColor={colors.textDisabled}
              />
            </View>
          </View>

          {/* Kontak Darurat */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Kontak Darurat (Keluarga)</Text>
            <View style={styles.inputBox}>
              <Phone size={15} color={colors.textSecondary} strokeWidth={2} />
              <TextInput
                style={styles.textInput}
                value={emergencyContact}
                onChangeText={setEmergencyContact}
                placeholder="Belum diisi (Contoh: +62 812-xxxx)"
                keyboardType="phone-pad"
                placeholderTextColor={colors.textDisabled}
              />
            </View>
          </View>
        </View>

        {/* SECTION 2: LISENSI MENGEMUDI (SIM) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Lisensi Mengemudi (SIM)</Text>

          {/* Nomor SIM */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nomor SIM B1 Umum</Text>
            <View style={styles.inputBox}>
              <CreditCard size={15} color={colors.textSecondary} strokeWidth={2} />
              <TextInput
                style={styles.textInput}
                value={simNumber}
                onChangeText={setSimNumber}
                placeholder="Belum diisi (Contoh: 9204-1284-9012)"
                placeholderTextColor={colors.textDisabled}
              />
            </View>
          </View>

          {/* Masa Berlaku */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Masa Berlaku SIM</Text>
            <View style={styles.inputBox}>
              <CreditCard size={15} color={colors.textSecondary} strokeWidth={2} />
              <TextInput
                style={styles.textInput}
                value={simExpiry}
                onChangeText={setSimExpiry}
                placeholder="Belum diisi (Contoh: 14 Nov 2028)"
                placeholderTextColor={colors.textDisabled}
              />
            </View>
          </View>
        </View>

        {/* SECTION 3: KENDARAAN OPERASIONAL */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Kendaraan Kemitraan (RTO)</Text>

          {/* Model Kendaraan */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Model Kendaraan Mitra</Text>
            <View style={styles.inputBox}>
              <Truck size={15} color={colors.textSecondary} strokeWidth={2} />
              <TextInput
                style={styles.textInput}
                value={vehicleModel}
                onChangeText={setVehicleModel}
                placeholder="Contoh: Daihatsu Gran Max Blind Van"
                placeholderTextColor={colors.textDisabled}
              />
            </View>
          </View>

          {/* Nomor Pelat Nomor */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nomor Pelat Polisi</Text>
            <View style={styles.inputBox}>
              <Truck size={15} color={colors.textSecondary} strokeWidth={2} />
              <TextInput
                style={styles.textInput}
                value={vehiclePlate}
                onChangeText={(t) => setVehiclePlate(t.toUpperCase())}
                placeholder="Contoh: D 8124 FTR"
                placeholderTextColor={colors.textDisabled}
                autoCapitalize="characters"
              />
            </View>
          </View>

          {/* Status Kemitraan RTO */}
          <View style={[styles.vehicleInfoRow, { marginTop: 4, backgroundColor: '#F8FAFC' }]}>
            <View style={styles.vehicleIconCircle}>
              <Truck size={16} color={colors.primary} strokeWidth={2.2} />
            </View>
            <View style={styles.vehicleTextGroup}>
              <Text style={[styles.vehicleModel, { fontSize: 13, fontWeight: '700' }]}>
                {vehicleModel || 'Belum Ada Model Terdaftar'}
              </Text>
              <Text style={[styles.vehiclePlate, { fontSize: 12, color: colors.primary }]}>
                {vehiclePlate || 'Pelat Belum Diisi'}
              </Text>
              <Text style={styles.vehicleContract}>
                {rtoContract
                  ? `Kontrak RTO: #${rtoContract.id.toUpperCase()} (Tenor ${rtoContract.tenureMonths} Bulan)`
                  : 'Program Kemitraan Sewa-Beli FLEETRA'}
              </Text>
            </View>
          </View>
        </View>

        {/* SAVE BUTTON */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.85}
        >
          <Save size={16} color={colors.white} strokeWidth={2.2} style={{ marginRight: 8 }} />
          <Text style={styles.saveButtonText}>Simpan Perubahan</Text>
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
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 18,
  },
  avatarWrapper: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 2.5,
    borderColor: colors.primary,
    position: 'relative',
    marginBottom: 8,
  },
  avatarImage: {
    width: 73,
    height: 73,
    borderRadius: 36.5,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarDriverId: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surface2,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 5,
  },
  verifiedTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.primary,
  },

  card: {
    backgroundColor: colors.surface,
    marginHorizontal: 18,
    marginBottom: 14,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 5,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    gap: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 12.5,
    color: colors.text,
  },

  vehicleInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface2,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  vehicleIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleTextGroup: {
    flex: 1,
  },
  vehicleModel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.text,
  },
  vehiclePlate: {
    fontSize: 11.5,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 2,
  },
  vehicleContract: {
    fontSize: 10.5,
    color: colors.textMuted,
    marginTop: 2,
  },

  saveButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    marginHorizontal: 18,
    marginTop: 4,
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
  saveButtonText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.white,
  },
});

