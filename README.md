# FLEETRA Mobile Driver App

> **Aplikasi Seluler Mitra Pengemudi — Sistem Manajemen Armada Cerdas FLEETRA**  
> *Kompetisi Inovasi ADIKARA 2026 — Sub-Divisi Software Development*  
> *Fakultas Informatika (FIF), Universitas Telkom Bandung*

---

## 📱 Ringkasan Proyek

**FLEETRA Mobile** adalah aplikasi seluler terdedikasi untuk mitra pengemudi kendaraan niaga ringan (*Light Commercial Vehicles* - LCV). Aplikasi ini dibangun di atas kerangka kerja **React Native** dengan **Expo SDK 58 (TypeScript)**, dirancang secara khusus mengacu pada **Apple Human Interface Guidelines (HIG)** dan pedoman desain resmi FLEETRA (`DESIGN.md`):

- **100% Light Mode**: Antarmuka bersih (*clean high-contrast*), bebas efek gelap atau gradien redup, teroptimasi untuk keterbacaan tinggi di bawah paparan sinar matahari dalam kabin kendaraan.
- **Kenyamanan & Keamanan Mengemudi**: Target sentuh luas ($\ge 44 \times 44\text{ pt}$) untuk meminimalisasi distraksi pengemudi saat pengoperasian.
- **Ikonografi Vektor Presisi**: 100% menggunakan `lucide-react-native` (*strictly no emojis*) untuk integritas estetika perangkat lunak enterprise.
- **Dukungan Multi-Platform**: Siap dijalankan secara nirkabel di **iOS & Android fisik via Expo Go** serta peramban web modern.

---

## 🎯 Pemetaan Layar Prototipe Fungsional (MVP Scope)

Seluruh 7 layar dan modal aplikasi diimplementasikan presisi mengacu pada berkas spesifikasi teknis `spesifikasi-mvp-mobile-web-dashboard.md` dan arsip desain resolusi tinggi:

| No | Layar / Modul | Berkas Komponen | Deskripsi Fungsionalitas & Elemen Antarmuka |
| :---: | :--- | :--- | :--- |
| **1** | **Beranda Utama**<br>*(Home Dashboard)* | [`src/screens/HomeScreen.tsx`](src/screens/HomeScreen.tsx) | • Header logo resmi FLEETRA + ikon lonceng notifikasi (indikator dot merah).<br>• Hero card pengemudi: Avatar Budi Santoso + Gran Max `B 9821 KCE` + ilustrasi van.<br>• Kartu Tugas Hari Ini: `#TRIP-2026-089` (3 metrik: 08.00 WIB, 4 Stop, 1j 15m) + CTA Mulai Perjalanan.<br>• Kartu Status Armada: Siap Digunakan, BBM 74%, Odometer 128 km.<br>• Twin Cards: Safety Score 94/100 (*Sangat Baik*) & Progres RTO 64,8% (*Bulan ke-23 dari 36*). |
| **2** | **Perjalanan Aktif**<br>*(Trip Dashboard)* | [`src/screens/PerjalananScreen.tsx`](src/screens/PerjalananScreen.tsx) | • Segmented control: *Tugas Aktif* vs *Riwayat*.<br>• Ringkasan rute: Cimahi ke 4 titik Bandung Kota, progres 1/4 stop selesai dengan bar horizontal dinamis.<br>• Tombol CTA *Lanjutkan Perjalanan*.<br>• Timeline interaktif 4 titik singgah bertahap (Gudang Cimahi, Toko Sumber Rejeki, Minimarket Sejahtera, Toko Makmur Jaya) dengan badge status (*Selesai, Tujuan Saat Ini, Berikutnya, Menunggu*). |
| **3** | **Detail Stop Singgah**<br>*(Stop Console)* | [`src/screens/DetailStopScreen.tsx`](src/screens/DetailStopScreen.tsx) | • Top banner jarak & ETA: `+ 4,2 km • ± 12 menit`.<br>• Kartu Stop 2: Toko Sumber Rejeki (Jl. Sudirman No. 45).<br>• 4 Tombol aksi cepat: *Navigasi*, *Telepon PIC*, *Pesan*, dan *Detail Lokasi Loading Dock*.<br>• Rincian paket pengantaran: Kode order `ORD-2026-7741`, 12 Paket.<br>• Tombol aksi primer: **Tiba di Lokasi** (memicu pembukaan bukti kirim e-POD).<br>• Kartu pratinjau stop berikutnya (*Minimarket Sejahtera + 6,8 km*). |
| **4** | **Bukti Kirim Digital**<br>*(e-POD Screen)* | [`src/screens/EpodScreen.tsx`](src/screens/EpodScreen.tsx) | • Ringkasan stop & identitas penerima kargo.<br>• Slot foto bukti serah terima dengan stempel *watermark* digital FLEETRA VERIFIED (waktu & plat nopol).<br>• Form nama perwakilan penerima (*Budi Setiawan*).<br>• Kanvas tanda tangan digital interaktif dengan kurva tanda tangan SVG dan tombol hapus/ulang.<br>• Pernyataan kepatuhan integritas pengiriman + Tombol **Konfirmasi Serah Terima** yang otomatis menyinkronkan status stop ke Web Dispatcher. |
| **5** | **Profil & Ekuitas RTO**<br>*(Profile & RTO)* | [`src/screens/ProfilScreen.tsx`](src/screens/ProfilScreen.tsx) | • Kartu profil mitra pengemudi Budi Santoso + tombol edit profil.<br>• Twin metrics: Driver Safety Score 94/100 dan Kondisi Armada Normal (128.430 km).<br>• Kartu Progres Sewa-Beli RTO: Cincin kemajuan 64,8% (Bulan 23 dari 36), Setoran Terkumpul Rp 194.400.000, Sisa Setoran Rp 105.600.000.<br>• Menu navigasi: Riwayat Perjalanan, Riwayat Setoran RTO, Pengaturan Akun.<br>• Tombol keluar akun aman (*destructive alert confirmation*). |
| **6** | **Pusat Notifikasi**<br>*(Notifications)* | [`src/screens/NotificationsScreen.tsx`](src/screens/NotificationsScreen.tsx) | • Kategori filter chips: *Semua*, *Perjalanan*, *Armada*, dan *Sistem*.<br>• Kelompok *Hari Ini* (fitur tandai semua telah dibaca): Perjalanan Dimulai, Bukti Pengantaran Diterima, Peringatan Tekanan Ban Rendah.<br>• Kelompok *Kemarin*: Pengingat Servis Berkala & Laporan Ekuitas RTO Siap Unduh. |
| **7** | **Bantuan Darurat**<br>*(SOS Assistance)* | [`src/screens/SosScreen.tsx`](src/screens/SosScreen.tsx) | • Tombol aktivasi darurat merah pekat (*Aktifkan SOS / Hubungi Tim Fleetra Sekarang*).<br>• 4 Tombol kategori insiden: *Masalah Kendaraan*, *Kecelakaan*, *Keamanan*, dan *Lainnya*.<br>• Kartu koordinat GPS waktu nyata (*Jl. Pasteur No. 142, Bandung*).<br>• Alur SOP penanganan 3 tahap: Terhubung ke tim → Bantuan diproses → Pendampingan hingga selesai.<br>• Kotak mitigasi keselamatan berkendara. |

---

## 🧭 Alur Navigasi Aplikasi

```
                   +------------------------+
                   |  HomeScreen (Beranda)  |
                   +------------------------+
                     /         |          \
           (Bell)   /          | (Trip)    \ (Profile/RTO)
                   v           v            v
  +--------------------+  +------------+  +--------------+
  | NotificationsScreen|  | Perjalanan |  | ProfilScreen |
  +--------------------+  +------------+  +--------------+
                               |
                        (Select Stop 2 /
                       Lanjutkan Jalan)
                               v
                    +--------------------+
                    |  DetailStopScreen  |
                    +--------------------+
                               |
                        (Tiba di Lokasi)
                               v
                    +--------------------+
                    |     EpodScreen     |
                    +--------------------+
                               |
                     (Konfirmasi e-POD)
                               v
                     [Stop 2 Marked Done]
                     -> Kembali ke Rute

  * Floating SOS Panic Button dapat diakses langsung dari seluruh tab utama.
```

---

## 🛠️ Tumpukan Teknologi

- **Framework**: [React Native](https://reactnative.dev/) v0.88 + [Expo SDK](https://expo.dev/) 58 (TypeScript 5.3+)
- **Prinsip Desain**: Apple Human Interface Guidelines (HIG) & FLEETRA Design System (`#2463D8` Primary, `#0F172A` Slate)
- **Komponen Geometris & Visual**: `react-native-svg` (High-precision circular progress rings & digital signature curves)
- **Ikonografi Enterprise**: `lucide-react-native`
- **Area Aman**: `react-native-safe-area-context`
- **Lingkungan Pengujian**: Expo Go (iOS / Android), iOS Simulator (macOS), dan Web Browser Preview (`react-dom`, `react-native-web`)

---

## ⚡ Panduan Menjalankan Aplikasi

### 1. Kloning & Pemasangan Dependensi
```bash
git clone https://github.com/BangJhen/Fleetra-Mobile.git
cd Fleetra-Mobile
npm install
```

### 2. Pengujian di Smartphone Fisik via Expo Go (Sangat Direkomendasikan)
1. Unduh aplikasi **Expo Go** secara gratis di ponsel:
   - [Expo Go di Apple App Store (iOS)](https://apps.apple.com/app/expo-go/id982107779)
   - [Expo Go di Google Play Store (Android)](https://play.google.com/store/apps/details?id=host.exp.exponent)
2. Jalankan perintah server pengembangan di terminal laptop:
   ```bash
   npx expo start
   ```
3. Pindai (*scan*) QR Code yang muncul di terminal:
   - **Di iPhone**: Buka aplikasi **Kamera**, arahkan ke QR code terminal, lalu ketuk pop-up banner "Open in Expo Go".
   - **Di Android**: Buka aplikasi **Expo Go**, pilih menu *"Scan QR code"*.

### 3. Pengujian Cepat di Web Browser
```bash
npx expo start --web
```
Peramban secara otomatis akan membuka aplikasi di `http://localhost:8081`.

### 4. Verifikasi Tipe Data TypeScript
```bash
npx tsc --noEmit
```

---

## 📄 Struktur Direktori Proyek

```
Fleetra-Mobile/
├── App.tsx                     # Entry point & perutean layar dinamis
├── assets/                     # Aset ilustrasi, avatar & logo pita biru resmi
│   ├── Fleetra Blue Ribbon Logo.png
│   ├── driver-avatar.png
│   ├── package-sample.png
│   └── van-illustration.png
├── src/
│   ├── components/             # Komponen visual modular
│   │   ├── CircularProgress.tsx# SVG ring progress gauge presisi tinggi
│   │   ├── FloatingBottomBar.tsx# Floating capsule navigation bar
│   │   ├── FloatingSosButton.tsx# Red circular panic button
│   │   └── SosModal.tsx        # Modal konfirmasi darurat cepat
│   ├── screens/                # Layar antarmuka sesuai 7 mockup resmi
│   │   ├── HomeScreen.tsx      # Dashboard beranda driver & status armada
│   │   ├── PerjalananScreen.tsx# Daftar rute multi-stop & kartu tugas
│   │   ├── DetailStopScreen.tsx# Detail stop singgah & quick actions
│   │   ├── EpodScreen.tsx      # Bukti serah terima digital, foto & tanda tangan
│   │   ├── ProfilScreen.tsx    # Profil, skor keselamatan & progres RTO
│   │   ├── NotificationsScreen.tsx# Pusat notifikasi & filter operasional
│   │   └── SosScreen.tsx       # Layar bantuan darurat & dispatcher link
│   └── theme/
│       └── colors.ts           # Token warna resmi 100% Light Mode FLEETRA
├── app.json                    # Konfigurasi metadata Expo
├── package.json                # Dependensi pustaka
└── tsconfig.json               # Konfigurasi compiler TypeScript
```

---

## 🏆 Kualifikasi Lomba ADIKARA 2026
Dokumentasi dan kode sumber ini merupakan bagian integral dari submission inovasi perangkat lunak **FLEETRA** untuk cabang **Inovasi - Sub-Divisi Software Development (Softdev)**, Fakultas Informatika Universitas Telkom.  
*Hak Cipta © 2026 Tim FLEETRA. All rights reserved.*
