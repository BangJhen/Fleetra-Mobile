# FLEETRA Mobile Driver App

Aplikasi seluler mitra pengemudi untuk Sistem Manajemen Armada Cerdas FLEETRA pada kompetisi ADIKARA 2026. Aplikasi ini berfungsi sebagai konsol kemudi bagi mitra pengemudi logistik untuk menerima jadwal penugasan ritase harian, menjalankan navigasi titik singgah berurutan, menyerahkan bukti serah terima digital (electronic Proof of Delivery / e-POD), memantau skor keselamatan berkendara (Driver Safety Score), serta memonitor akumulasi ekuitas program kepemilikan armada Sewa-Beli (Rent-to-Own / RTO).

## Alur Kerja Operasional Pengemudi (Driver Workflow)

1. Registrasi Mandiri dan Peninjauan KYD:
   - Pengemudi mendaftar akun baru dengan mengisi nama lengkap, alamat email, nomor telepon, serta nomor lisensi SIM.
   - Akun baru otomatis masuk ke status Menunggu Verifikasi (Pending) dan tersinkronisasi ke dashboard operator pool.
   - Tampilan beranda pengemudi menampilkan kartu status pengajuan terstruktur dengan tahapan validasi berkas dan alokasi armada.

2. Verifikasi dan Alokasi Armada:
   - Selama akun dalam peninjauan, status tugas berada dalam mode siaga terkunci (Pending) guna mencegah pengoperasian tanpa lisensi terverifikasi.
   - Begitu dispatcher menyetujui akun dan memasangkan kendaraan (motor, mobil MPV, van, atau pick-up), aplikasi mobile secara otomatis menyinkronkan data armada terpasang dan membuka akses tugas penuh.

3. Pelaksanaan Rute dan Bukti Serah Terima Digital (e-POD):
   - Pengemudi menerima rute penugasan ritase harian yang telah dioptimasi urutannya oleh sistem OSRM.
   - Pengemudi mengonfirmasi inisiasi ritase dan mengikuti panduan timeline titik singgah (stop demi stop).
   - Pada setiap titik tujuan, pengemudi mendokumentasikan serah terima kargo melalui kamera foto berstempel koordinat GPS dan meminta tanda tangan digital penerima pada kanvas interaktif.
   - Data e-POD langsung terunggah dan mengupdate progres ritase secara real-time ke pusat kendali operator.

4. Pemantauan Keselamatan Berkendara dan Ekuitas RTO:
   - Skor keselamatan (0-100) dihitung secara objektif berdasarkan kepatuhan batas kecepatan dan kehalusan pengereman.
   - Mitra pengemudi dalam skema Sewa-Beli (RTO) dapat melihat buku rekening ekuitas yang mencatat akumulasi setoran cicilan unit dari setiap ritase yang diselesaikan via skema Pay-per-Trip.

5. Pelaporan Darurat Cepat (SOS):
   - Tombol darurat mengambang (Floating SOS Button) aktif di seluruh layar utama untuk mentransmisikan sinyal marabahaya, koordinat lokasi GPS, dan kategori insiden langsung ke dispatcher dalam waktu kurang dari 3 detik.

## Fitur Utama Aplikasi

- Status Pendaftaran & KYD Tracker: Pelacak progres verifikasi akun pengemudi dengan tahapan yang jelas dan indikator status mitra.
- Konsol Kemudi & Kontrol Siaga: Tombol saklar status tugas (ON/OFF Duty), ringkasan metrik kendaraan (BBM, odometer, kondisi rem), serta notifikasi ritase aktif.
- Timeline Perjalanan Multi-Drop: Rincian jadwal penugasan harian, urutan titik singgah terstruktur, estimasi jarak dan durasi tempuh, serta panduan navigasi ke alamat penerima.
- Modul e-POD (Electronic Proof of Delivery): Pengambilan foto dokumentasi serah terima kargo, penangkapan tanda tangan digital penerima via kanvas vektor SVG, dan perekaman otomatis metadata waktu serta GPS.
- Buku Rekening Ekuitas Sewa-Beli (RTO): Visualisasi persentase ekuitas kepemilikan unit, nilai sisa pokok cicilan, estimasi tenor serah terima BPKB, dan mutasi setoran per ritase.
- Evaluasi Driver Safety Score: Kartu analitik skor keselamatan harian dan bulanan dengan catatan evaluasi perilaku berkendara.
- Tombol Panik Darurat (SOS): Tombol darurat mengambang dengan konfirmasi cepat untuk pelaporan insiden darurat, kecelakaan, atau kendala mekanis.

## Komunikasi Data dan Integrasi Backend API

Aplikasi mobile berkomunikasi dengan FLEETRA Dispatcher Dashboard (port default 3000) melalui protokol HTTP RESTful API. Aplikasi secara adaptif mendeteksi IP jaringan lokal (LAN) maupun localhost untuk kebutuhan pengujian di perangkat fisik:

### Endpoint yang Dikonsumsi

- POST /api/mobile/auth
  Melakukan autentikasi kredensial mitra pengemudi.
  Payload: email, password.
  Response: status autentikasi, token sesi, driverId, dan data profil pengemudi.

- POST /api/mobile/register
  Mengirimkan formulir pendaftaran mitra baru ke antrean verifikasi KYD.
  Payload: nama lengkap, email, nomor telepon, nomor SIM, password.
  Response: konfirmasi pendaftaran berstatus pending_verification.

- GET /api/mobile?driverId={id}
  Melakukan polling sinkronisasi berkala untuk memperbarui status lokal aplikasi:
  - Status verifikasi akun (pending, verified, rejected)
  - Data kendaraan yang dialokasikan (tipe, nomor plat, model, level BBM, kondisi rem)
  - Detail tugas ritase aktif beserta seluruh daftar titik singgah (stops)
  - Statistik ringkasan (ritase selesai, safety score, akumulasi ekuitas RTO)

- POST /api/mobile (Action: submit_epod)
  Mengirimkan bukti serah terima digital ke konsol dispatcher.
  Payload: tripId, stopId, recipientName, signatureData (SVG string), photoUri, latitude, longitude, completedAt.

- POST /api/mobile (Action: start_trip)
  Mengonfirmasi pengemudi telah memulai perjalanan rute ritase aktif.
  Payload: tripId, startedAt.

- POST /api/mobile (Action: complete_stop)
  Memperbarui status penyelesaian titik singgah tertentu.
  Payload: tripId, stopId, status.

- POST /api/mobile (Action: complete_trip)
  Menyelesaikan seluruh rangkaian tugas ritase yang telah diserahterimakan.
  Payload: tripId, completedAt, totalDistanceKm.

- POST /api/mobile (Action: update_duty)
  Mengubah status ketersediaan kerja pengemudi di lapangan.
  Payload: driverId, status (Aktif / Istirahat).

- POST /api/mobile (Action: sos)
  Mengirimkan alarm darurat ke layar peringatan dispatcher.
  Payload: driverId, emergencyType, latitude, longitude, timestamp.

## Tumpukan Teknologi (Tech Stack)

- Framework: React Native v0.88, Expo SDK 58 (TypeScript)
- Styling dan Sistem Desain: 100% Light Mode mutlak mengacu pada Apple Human Interface Guidelines (HIG) dan panduan DESIGN.md
- Ikonografi: lucide-react-native
- Komponen Grafis: react-native-svg (lingkaran progres dan kanvas tanda tangan digital)
- Navigasi dan Area Aman: react-native-safe-area-context
- Lingkungan Eksekusi: Expo Go (iOS dan Android), iOS Simulator (macOS), dan Web Preview

## Panduan Menjalankan Aplikasi

Persyaratan:
- Node.js versi 22 atau lebih baru
- npm versi 10 atau lebih baru
- Aplikasi Expo Go pada smartphone fisik (tersedia di Google Play Store dan Apple App Store), atau emulator lokal

Langkah Instalasi:

```bash
cd Fleetra-Mobile
npm install
```

Menjalankan Server Pengembangan:
Aplikasi dikonfigurasi untuk berjalan pada port 8082 guna menghindari benturan dengan proyek lain yang menggunakan port default 8081.

```bash
npm start
```

Perintah di atas secara otomatis mengeksekusi:

```bash
npx expo start --port 8082
```

Menghubungkan Aplikasi:
1. Perangkat Fisik (Expo Go): Buka aplikasi Expo Go pada ponsel yang terhubung dalam satu jaringan Wi-Fi, lalu pindai QR Code yang tampil pada terminal.
2. Emulator iOS: Tekan tombol i pada terminal untuk meluncurkan iOS Simulator secara otomatis.
3. Web Preview: Tekan tombol w pada terminal atau akses langsung http://localhost:8082 melalui peramban web.

Pemeriksaan Tipe Data (Type Check):

```bash
npx tsc --noEmit
```
