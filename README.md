# FLEETRA Mobile Driver App
> **Aplikasi Seluler Pengemudi — Sistem Manajemen Armada Cerdas FLEETRA**  
> *Kompetisi Inovasi ADIKARA 2026 — Sub-Divisi Software Development (Fakultas Informatika, Universitas Telkom)*

---

## 📱 Ringkasan Proyek
**FLEETRA Mobile** adalah aplikasi seluler terdedikasi untuk mitra pengemudi kendaraan niaga ringan dan menengah (*Light and Medium Commercial Vehicles* - LCV). Aplikasi ini dibangun di atas kerangka kerja **React Native** dengan **Expo SDK** (TypeScript), dirancang secara khusus mengacu pada **Apple Human Interface Guidelines (HIG)** dan sistem desain FLEETRA (`DESIGN.md`):
- **100% Light Mode**: Tampilan jernih, tajam, dan mudah dibaca di dalam kabin kendaraan komersial.
- **Kenyamanan & Keamanan Mengemudi**: Tombol aksi dan kartu berukuran besar ($\ge 44\text{ pt}$) untuk keamanan saat beroperasi.
- **Dukungan Multi-Platform**: Teroptimasi penuh untuk perangkat **iOS** dan **Android** via **Expo Go**.

---

## 🚀 Fitur Utama Prototipe (MVP Scope)
1. **Dashboard Tugas Hari Ini (`HomeScreen`)**:
   - Menampilkan identitas pengemudi, status kendaraan, level BBM/baterai, dan nomor surat perintah jalan aktif (*Trip Code*).
2. **Daftar Perhentian & Panduan Rute (`NavigationScreen`)**:
   - Daftar alamat pengantaran multi-titik (*multi-drop stops*) terurut dengan indikator status dan estimasi waktu tiba (ETA).
3. **Bukti Serah Terima Digital (`e-POD Modal`)**:
   - Pengambilan foto kargo di lokasi penerima dan kanvas tanda tangan sentuh digital (*touchscreen signature pad*).
4. **Profil Driver & Ekuitas Sewa-Beli (`ProfileRtoScreen`)**:
   - Cincin skor keselamatan berkendara (*Driver Safety Score 0–100*) dan kartu visualisasi progres kepemilikan sewa-beli (*Rent-to-Own* - RTO).
5. **Tombol Panik Darurat (`FloatingSosButton`)**:
   * Tombol darurat mengambang dengan perlindungan *long-press* 3 detik untuk memancarkan sinyal darurat prioritas tinggi ke pusat kendali.

---

## 🛠️ Tumpukan Teknologi
- **Framework**: React Native with Expo SDK (TypeScript)
- **Environment**: Expo Go (iOS & Android)
- **Styling**: React Native StyleSheet & Semantic Design Tokens (`#2463D8` Electric Blue, `#0F172A` Deep Slate)
- **Icons**: Lucide Icons (`lucide-react-native`)
- **Digital Signature**: `react-native-signature-canvas`

---

## ⚡ Panduan Menjalankan Aplikasi

### 1. Instalasi Dependensi
```bash
cd Fleetra-Mobile
npm install
```

### 2. Menjalankan Server Pengembangan
```bash
# Menjalankan Expo development server
npx expo start
```

### 3. Menjalankan di Perangkat Fisik (Rekomendasi Cepat)
1. Unduh aplikasi **Expo Go** dari App Store (iOS) atau Google Play Store (Android).
2. Pindai (*scan*) QR Code yang muncul di terminal menggunakan kamera iPhone atau aplikasi Expo Go Android.
3. Aplikasi akan langsung dimuat secara instan di smartphone Anda.

### 4. Menjalankan di Simulator
```bash
# Menjalankan di iOS Simulator (macOS)
npm run ios

# Menjalankan di Android Emulator
npm run android
```

---

## 📄 Lisensi & Tim Pengembang
Dikembangkan oleh **Tim FLEETRA** untuk **ADIKARA 2026** (Universitas Telkom).  
Hak Cipta © 2026 FLEETRA.
