# FLEETRA Mobile Driver App

Aplikasi seluler mitra pengemudi untuk Sistem Manajemen Armada Cerdas FLEETRA. Aplikasi ini berfungsi sebagai konsol kemudi bagi mitra pengemudi logistik untuk menerima jadwal penugasan ritase harian, menjalankan navigasi titik singgah berurutan, menyerahkan bukti serah terima digital (electronic Proof of Delivery / e-POD), memantau skor keselamatan berkendara (Driver Safety Score), serta memonitor akumulasi ekuitas program kepemilikan armada Sewa-Beli (Rent-to-Own / RTO).

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

### 1. Endpoint Backend yang Dikonsumsi

| Method | Endpoint | Fungsi | Parameter / Payload | Respons / Output |
| --- | --- | --- | --- | --- |
| POST | /api/mobile/auth | Autentikasi kredensial mitra pengemudi | email, password | Status autentikasi, token sesi, driverId, profil mitra |
| POST | /api/mobile/register | Pendaftaran mitra baru ke antrean KYD | nama lengkap, email, nomor HP, SIM, password | Konfirmasi pendaftaran berstatus pending_verification |
| GET | /api/mobile | Polling data real-time berkala | driverId (query parameter) | Status verifikasi akun, unit armada, rute ritase aktif, daftar stop, ekuitas RTO |
| POST | /api/mobile | Pengiriman aksi operasional driver di lapangan | action, payload spesifik | Konfirmasi pembaruan status tugas di server |

### 2. Parameter Aksi Lapangan Pengemudi (POST /api/mobile)

| Action | Fungsi | Parameter Utama |
| --- | --- | --- |
| submit_epod | Mengunggah bukti serah terima digital | tripId, stopId, recipientName, signatureData (SVG string), photoUri, latitude, longitude, completedAt |
| start_trip | Memulai perjalanan rute ritase aktif | tripId, startedAt |
| complete_stop | Memperbarui status penyelesaian titik singgah | tripId, stopId, status |
| complete_trip | Menyelesaikan seluruh rangkaian tugas ritase | tripId, completedAt, totalDistanceKm |
| update_duty | Mengubah status ketersediaan kerja pengemudi | driverId, status (Aktif / Istirahat) |
| sos | Mengirimkan alarm insiden darurat dan lokasi GPS | driverId, emergencyType, latitude, longitude, timestamp |

## Tumpukan Teknologi (Tech Stack)

| Kategori | Teknologi | Keterangan & Penggunaan |
| --- | --- | --- |
| Mobile Framework | React Native v0.88, Expo SDK 58 | Arsitektur lintas platform (iOS dan Android) dengan performa native |
| Bahasa Pemrograman | TypeScript 5 | Validasi tipe data ketat di seluruh komponen antarmuka dan API call |
| Sistem Desain | Apple HIG & Palet FLEETRA | 100% Light Mode mutlak (#FFFFFF, #F8FAFC, aksen utama #2463D8) |
| Komponen Grafis | react-native-svg | Render kanvas interaktif tanda tangan digital e-POD dan lingkaran progres |
| Tata Letak & Area Aman | react-native-safe-area-context | Penanganan responsif notch dan gesture navigation modern |
| Ikonografi | lucide-react-native | Ikonografi antarmuka konsisten dan ringan |
| Lingkungan Eksekusi | Expo Go, iOS Simulator, Web Preview | Pengujian cepat tanpa instalasi SDK kompilasi native yang berat |

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
