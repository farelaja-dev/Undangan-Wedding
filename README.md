# Gita & Haidar — Undangan Pernikahan

## Mengaktifkan ucapan bersama (Supabase)

1. Di proyek Supabase milikmu, buka SQL Editor dan jalankan `supabase/wedding-wishes.sql`.
2. Salin `.env.example` menjadi `.env.local`. Isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_PUBLISHABLE_KEY` dari Project Settings → API Keys. Gunakan **publishable key**, bukan secret/service_role key.
3. Restart `npm run dev`. Untuk website online, isi kedua environment variable yang sama di Vercel lalu deploy ulang.
4. Coba kirim ucapan dan buka undangan di perangkat lain. Komentar terbaru tampil lebih dulu, maksimal **5 ucapan per halaman**. Tombol **Sebelumnya / Berikutnya** mengganti halaman tanpa menambah panjang daftar. Ucapan panjang bisa dibuka lewat **Baca selengkapnya**. **Perbarui** dan pengiriman ucapan baru mengembalikan daftar ke halaman pertama.

Tamu dapat membaca dan mengirim ucapan tanpa login. Nama dan ucapan bersifat publik bagi siapa pun yang membuka undangan; nama tamu tidak diverifikasi. Detail RSVP dan nomor telepon tidak disimpan di tabel komentar. Pemilik proyek bisa menghapus komentar melalui Table Editor Supabase. Kebijakan database melarang tamu mengubah atau menghapus komentar; belum ada CAPTCHA atau pembatasan spam di server.

Saat konfigurasi belum diisi, formulir menampilkan “Kolom ucapan segera dibuka”; tidak ada komentar palsu atau penyimpanan lokal pengganti database. RSVP WhatsApp tetap aktif ke `6285706314694`.

Referensi: [Supabase API keys](https://supabase.com/docs/guides/getting-started/api-keys) dan [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security).

Undangan floral sinematik berwarna dusty blue, ivory, dan champagne, menggunakan React, Vite, dan JavaScript. Siap di-host sebagai website statis di Vercel. Nama mempelai sudah sesuai: **Gita Firanddia Putri Ramadhiany** dan **Haidar Syaddad Al Faruqi**.

Pengalaman dimulai dengan cover personal dan tombol **Buka Undangan**. Dua pintu terbuka dengan animasi, diikuti slider foto dengan zoom pelan, ornamen bunga bergerak, partikel kelopak dan cahaya, serta teks/foto yang muncul bertahap saat di-scroll. Tidak ada navbar. Pada desktop, foto sinematik menetap di kiri sementara undangan mengalir di kanan; pada HP, undangan memenuhi layar.

Galeri mendukung pergantian otomatis, panah, thumbnail, swipe, dan lightbox. Tombol kilau di kanan bawah menjeda efek dan slideshow. Preferensi sistem `prefers-reduced-motion` mematikan efek otomatis. Browser yang sedang di background tidak menggambar partikel; semua event listener dan timer dibersihkan ketika komponen dilepas.

## Jalankan

```sh
npm install
npm run dev
```

Buka alamat yang ditampilkan Vite. Halaman undangan berada di `/`; pengelola tamu ada di `/admin`. Contoh undangan personal: `/?to=Bapak%20Budi%20dan%20Ibu%20Sari`.

## Ubah isi undangan

Semua pengaturan utama berada di **`src/config.js`**. Tanggal dan lokasi sudah diatur untuk Kamis, 12 November 2026 di Agrowisata Gading Asri, Perumahan Taman Gading, Kabupaten Jember, Jawa Timur. Akad pukul 07.00 WIB sampai selesai; resepsi pukul 11.00 sampai 14.30 WIB. Data orang tua masih perlu diisi.

- `bride` / `groom`: nama lengkap, panggilan, keluarga.
- `date` / `endDate`: waktu acara dengan zona WIB (`+07:00`), untuk hitung mundur dan kalender.
- `dateLabel` / `shortDate`: teks tanggal yang ditampilkan. Sesuaikan dengan `date`.
- `events`: nama acara dan teks jam. Sesuaikan dengan tanggal dan waktu sebenarnya.
- `venue`, `address`, `locationLabel`, `mapsUrl`: tempat dan link Google Maps.
- `story`: judul dan narasi Awal Cerita, Lamaran, dan Pernikahan.
- `rsvpPhone`: nomor WhatsApp penerima, misalnya `6281234567890`. Jika kosong, RSVP dinonaktifkan dengan keterangan yang jelas. Pengunjung mengisi form, membuka WhatsApp, lalu menekan Kirim sendiri. RSVP dikirim melalui WhatsApp; ucapan publik disimpan terpisah di Supabase.
- `gift`: rekening opsional. Bagian hadiah muncul setelah `bank`, `account`, dan `holder` terisi.
- `music`: sudah diisi `/audio/lagu.mp3`, menggunakan lagu dari `public/audio/lagu.mp3` dan diputar berulang. Musik mulai sesudah **Buka Undangan** ditekan. Ikon piringan berputar mengikuti pemutaran audio; ketuk untuk jeda/melanjutkan. Ganti dengan file yang boleh kamu gunakan di `public/audio/`, misalnya `/audio/our-song.mp3`, atau kosongkan untuk menonaktifkan musik. Tidak ada autoplay sebelum interaksi tamu.
- `musicVolume`: volume awal antara 0–1, default `0.35` agar musik tetap lembut. Sumber pembuatan instrumental ada di `scripts/generate_music.py` (Python standard library, tidak diperlukan untuk menjalankan/deploy website).
- `isDemo`: ubah menjadi `false` setelah informasi asli lengkap. Pemberitahuan contoh dan link admin di footer akan disembunyikan; `/admin` tetap dapat dibuka langsung.

Jika kelak mengganti nama pasangan, sesuaikan juga judul dan metadata awal di `index.html`.

## Di mana foto diganti?

Foto asli tetap berada di `public/photos/`. Saat `npm run dev` atau `npm run build`, Sharp otomatis membuat WebP responsif (160, 480, 800, 1280, dan 1800 px) ke `public/optimized/`, beserta manifest di `src/generated/`. Ornamen bunga juga dibuat versi WebP dengan transparansi. Kedua hasil generasi tidak perlu di-commit; Vercel membuatnya saat build. Jangan memakai instalasi yang menghapus devDependencies pada tahap build.

Saat mengganti file foto ketika Vite berjalan, versi ringan dibuat ulang otomatis. Nama hasil memakai hash isi foto sehingga foto baru tidak tertahan cache lama. Path foto dalam `src/config.js` tetap menunjuk file asli. Thumbnail memakai versi kecil; browser memilih resolusi sesuai lebar layar. Slider hanya memuat foto awal dan menyiapkan foto berikutnya saat berjalan, serta berhenti beranimasi ketika keluar layar. Panel foto desktop tidak memuat gambar pada HP. Referensi: [gambar responsif web.dev](https://web.dev/learn/design/responsive-images?hl=en).

Penanda **FOTO 01–06** ditampilkan di undangan. Panduan visual juga ada di `/admin` → **Panduan foto**.

| Penanda | Bagian | File di `public/photos/` | Saran ukuran |
| --- | --- | --- | --- |
| 01 | Slider pembuka | `slider1.jpg`, `slider2.jpg`, `slider3.jpg` | Portrait 2:3 |
| 02 | Foto bersama Gita dan Haidar | `foto_bersama.jpg` | 900 × 1200 px |
| 03 | Cerita kita | `foto3.jpg` | 1000 × 1200 px |
| 04 | Galeri pertama | `foto4.jpg` | 1200 × 900 px |
| 05 | Galeri kedua | `foto5.jpg` | 900 × 1200 px |
| 06 | Galeri ketiga | `foto6.jpg` | 1200 × 900 px |

1. Ganti foto contoh dengan foto kalian. JPG, PNG, atau WebP dapat dipakai, asalkan path dan ekstensi di `src/config.js` sesuai.
2. Bagian "We found our forever" memakai satu foto bersama, dengan nama Gita di atas dan Haidar di bawah. Foto sudah terpasang dari `public/photos/foto_bersama.jpg` melalui `couplePhoto` di `src/config.js`.
3. Path di konfigurasi diawali `/photos/`, **bukan** `/public/photos/`.
4. Setelah selesai, ubah `showPhotoLabels` menjadi `false` untuk menyembunyikan penanda.
5. Jalankan build dan deploy ulang agar perubahan tampil online.

Slider pembuka memakai daftar `heroSlides` di `src/config.js`, berurutan `slider1.jpg`, `slider2.jpg`, dan `slider3.jpg`. Foto penutup menggunakan `heroPhoto`, saat ini `slider1.jpg`. Ornamen bunga adalah aset terpisah di `public/decor/floral-bouquet.png`, sehingga tidak perlu diganti dengan foto pasangan.

Foto contoh diunduh dari Unsplash: [foto utama](https://unsplash.com/photos/photo-1519741497674-611481863552), [cerita](https://images.unsplash.com/photo-1511285560929-80b456fea0bc), [galeri 1](https://images.unsplash.com/photo-1532712938310-34cb3982ef74), [galeri 2](https://images.unsplash.com/photo-1523438885200-e635ba2c371e), [galeri 3](https://images.unsplash.com/photo-1511795409834-ef04bbd61622). Foto-foto ini hanya ilustrasi, bukan dokumentasi pasangan. Google Fonts memuat DM Sans, Cormorant Garamond, dan Italianno; tersedia font sistem sebagai fallback.

## Tamu dari CSV

1. Buka `/admin` dan unduh template, atau gunakan `public/contoh-tamu.csv`.
2. Isi kolom `nama` (wajib), `telepon` dan `grup` (opsional). Kolom nomor sebaiknya berformat teks di Excel agar digitnya tidak berubah.
3. Impor CSV (maksimal 2 MB / 5.000 tamu per impor), periksa pratinjau, lalu klik **Impor**.
4. Tamu dengan pasangan nama + nomor yang sama otomatis dilewati. Nama yang sama dengan nomor berbeda tetap dianggap tamu berbeda.
5. Isi alamat website undangan dengan URL Vercel final. Tombol salin membuat link `?to=Nama+Tamu`; tombol WhatsApp menyiapkan pesan untuk dikirim secara manual. Tamu tanpa nomor akan membuka pemilih percakapan WhatsApp.
6. Cari/filter tamu, tambah manual, hapus, atau **Ekspor CSV** lengkap dengan link personal.

CSV dengan koma di dalam nama harus menggunakan tanda kutip, misalnya `"Rizky, S.Kom."`. CSV UTF-8 dengan delimiter koma maupun titik koma didukung. Export melindungi sel yang berpotensi dibaca sebagai formula spreadsheet.

**Penyimpanan:** data tamu hanya ada di `localStorage` browser/perangkat yang dipakai. Tidak ada login, backend, sinkronisasi lintas perangkat, atau daftar tamu yang dikirim ke server. Halaman `/admin` adalah alat lokal yang dapat diakses publik; pengunjung lain hanya melihat daftar di browser mereka sendiri. Ekspor CSV untuk backup/pindah perangkat. Jangan commit file CSV tamu pribadi ke repo publik.

## Deploy ke Vercel

1. Push project ke repository GitHub milikmu.
2. Di Vercel, import repository tersebut sebagai project baru.
3. Gunakan preset **Vite**, build command **`npm run build`**, dan output directory **`dist`**. Tidak memerlukan environment variable.
4. Deploy. `vercel.json` sudah menyiapkan rewrite agar `/admin` bisa dibuka langsung.
5. Masukkan URL deployment pada kolom alamat website di pengelola tamu sebelum mengekspor atau membagikan link.

Project ini disiapkan secara lokal untuk Vercel; tidak otomatis dipublikasikan atau dihubungkan ke akun hosting.

## Referensi visual & aset

Palet awal mengikuti referensi Punakawan yang diberikan pengguna. Arah pembukaan floral dan kelopak terinspirasi [Royal Garden — InviteCraze](https://invitecraze.in/templates/royal-garden); palet floral biru juga ditinjau dari [Blossom Blue — Undanganta](https://www.undanganta.online/). Implementasi animasi, layout, dan ornamen dibuat untuk project ini; tidak menyalin kode template.

Aset bunga dibuat dengan tool imagegen bawaan, transparan, lalu disimpan di `public/decor/floral-bouquet.png`. Prompt lengkap dan detail aset ada di `public/decor/ASSET-NOTES.md`.

## Pemeriksaan

```sh
npm test
npm run build
npm run test:browser
```

Tes browser menggunakan Playwright dengan Google Chrome terpasang (`channel: 'chrome'`). Jika belum ada Chrome, pasang browser yang sesuai atau ubah channel pada `playwright.config.js`. Tes mencakup desktop dan mobile, impor CSV, duplikat, tambah tamu, pencarian, persistensi browser, ekspor, link WhatsApp, personalisasi, galeri, kalender, dan overflow layout. Hasil screenshot ada di folder `test-results/` yang diabaikan Git.
