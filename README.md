# FLEETRA Mobile Driver App

Aplikasi seluler mitra pengemudi untuk Sistem Manajemen Armada Cerdas FLEETRA pada kompetisi ADIKARA 2026. Aplikasi ini berfungsi sebagai konsol kemudi bagi mitra pengemudi logistik untuk menerima jadwal penugasan rute, menjalankan panduan titik singgah, menyerahkan bukti serah terima digital (e-POD), memantau skor keselamatan berkendara, serta memonitor akumulasi ekuitas program kemitraan Sewa-Beli (Rent-to-Own / RTO).

## Alur Kerja Aplikasi (Flow)

1. Autentikasi dan Registrasi:
   - Pengemudi mendaftar akun baru dengan mengisi data diri, nomor kontak, nomor lisensi SIM, serta informasi armada awal.
   - Akun baru otomatis masuk ke status Menunggu Verifikasi (Pending) dan tersinkronisasi ke dashboard operator pool.

2. Verifikasi dan Alokasi Armada:
   - Selama belum diverifikasi, status tugas terkunci dan beranda menampilkan pemberitahuan verifikasi.
   - Begitu operator menyetujui akun dan memasangkan kendaraan di dashboard, aplikasi secara otomatis memperbarui status menjadi Siaga dan memunculkan data armada yang dialokasikan (motor, mobil, van, atau pick-up).

3. Pelaksanaan Rute dan e-POD:
   - Pengemudi menerima penugasan ritase harian yang telah dioptimasi rutenya.
   - Pengemudi mengonfirmasi Mulai Perjalanan dan mengikuti panduan urutan titik singgah (stop).
   - Pada setiap titik tujuan, pengemudi mengisi formulir bukti digital (e-POD) berupa foto serah terima berstempel digital dan tanda tangan penerima di layar.
   - Konfirmasi e-POD langsung memvalidasi penyelesaian stop ke dashboard dispatcher secara real-time.

4. Pemantauan Keselamatan dan Ekuitas RTO:
   - Menu Profil menampilkan Driver Safety Score (0-100) berbasis rekaman telematika pengereman halus dan kepatuhan kecepatan.
   - Pengemudi pada program RTO dapat memantau saldo ekuitas cicilan unit yang terakumulasi dari potongan ritase Pay-per-Trip.

5. Bantuan Darurat (SOS):
   - Tombol darurat mengambang tersedia di seluruh layar utama untuk mengirim sinyal koordinat GPS dan jenis insiden ke pusat kendali operator.

## Tumpukan Teknologi (Tech Stack)

- Framework: React Native v0.88, Expo SDK 58 (TypeScript)
- Styling dan Sistem Desain: 100% Light Mode mengacu pada Apple Human Interface Guidelines (HIG) dan palet resmi FLEETRA (Biru #2463D8 dan Slate #0F172A)
- Ikonografi: lucide-react-native
- Komponen Visual: react-native-svg (lingkaran progres dan tanda tangan digital)
- Navigasi dan Area Aman: react-native-safe-area-context
- Lingkungan Uji: Expo Go (iOS dan Android), iOS Simulator, serta Web Preview

## Modul Layar

- Beranda: Ringkasan profil driver, status tugas ON/OFF, kartu tugas aktif, kondisi armada (BBM, odometer), skor keselamatan, dan progres RTO.
- Perjalanan: Timeline titik singgah terurut, status pengantaran, jarak tempuh, dan navigasi detail stop.
- e-POD Console: Pengambilan foto dokumentasi serah terima kargo dan kanvas tanda tangan digital.
- Profil dan Ledger RTO: Rincian lisensi SIM, kendaraan kemitraan, riwayat perjalanan selesai, serta mutasi setoran sewa-beli.
- Notifikasi: Pusat pengumuman rute ritase, peringatan kondisi unit, dan audit sistem.
- Bantuan Darurat (SOS): Pelaporan kendala teknis dan insiden darurat langsung ke dispatcher pool.

## Menjalankan Aplikasi

Persyaratan: Node.js 22+, Expo CLI, dan aplikasi Expo Go di smartphone (iOS/Android).

1. Pemasangan dependensi:
```bash
cd Fleetra-Mobile
npm install
```

2. Menjalankan server pengembangan (Port default 8082 agar tidak berbenturan dengan proyek lain di port 8081):
```bash
npm start
```

Perintah di atas menjalankan:
```bash
npx expo start --port 8082
```

3. Pengujian:
- Buka aplikasi Expo Go di smartphone dan pindai QR Code yang tampil di terminal.
- Untuk pratinjau melalui browser web: tekan tombol w di terminal atau buka http://localhost:8082.

Pemeriksaan tipe data:
```bash
npx tsc --noEmit
```
