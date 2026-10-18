# Haidar & Gita — Undangan Pernikahan

Undangan floral sinematik berwarna dusty blue, ivory, dan champagne, menggunakan React, Vite, dan JavaScript. Siap di-host sebagai website statis di Vercel. Nama mempelai sudah sesuai: **Haidar Syaddad Al Faruqi** dan **Gita Firanddia Putri Ramadhiany**.

Pengalaman dimulai dengan cover personal dan tombol **Buka Undangan**. Dua pintu terbuka dengan animasi, diikuti slider foto dengan zoom pelan, ornamen bunga bergerak, partikel kelopak dan cahaya, serta teks/foto yang muncul bertahap saat di-scroll. Tidak ada navbar. Pada desktop, foto sinematik menetap di kiri sementara undangan mengalir di kanan; pada HP, undangan memenuhi layar.

Galeri mendukung pergantian otomatis, panah, thumbnail, swipe, dan lightbox. Tombol kilau di kanan bawah menjeda efek dan slideshow. Preferensi sistem `prefers-reduced-motion` mematikan efek otomatis. Browser yang sedang di background tidak menggambar partikel; semua event listener dan timer dibersihkan ketika komponen dilepas.

## Jalankan

```sh
npm install
npm run dev
```

Buka alamat yang ditampilkan Vite. Halaman undangan berada di `/`; pengelola tamu ada di `/admin`. Contoh undangan personal: `/?to=Bapak%20Budi%20dan%20Ibu%20Sari`.

## Ubah isi undangan

Semua pengaturan utama berada di **`src/config.js`**. Tanggal, waktu, lokasi, orang tua, dan cerita masih contoh; jangan langsung membagikannya sebagai data acara asli.

- `bride` / `groom`: nama lengkap, panggilan, keluarga, foto.
- `date` / `endDate`: waktu acara dengan zona WIB (`+07:00`), untuk hitung mundur dan kalender.
- `dateLabel` / `shortDate`: teks tanggal yang ditampilkan. Sesuaikan dengan `date`.
- `events`: nama acara dan teks jam. Sesuaikan dengan tanggal dan waktu sebenarnya.
- `venue`, `address`, `locationLabel`, `mapsUrl`: tempat dan link Google Maps.
- `story`: tahun, judul, dan narasi perjalanan kalian.
- `rsvpPhone`: nomor WhatsApp penerima, misalnya `6281234567890`. Jika kosong, RSVP dinonaktifkan dengan keterangan yang jelas. Pengunjung mengisi form, membuka WhatsApp, lalu menekan Kirim sendiri. Tidak ada database RSVP atau daftar ucapan publik.
- `gift`: rekening opsional. Bagian hadiah muncul setelah `bank`, `account`, dan `holder` terisi.
- `music`: opsional, misalnya `/audio/our-song.mp3`. Simpan file audio yang boleh digunakan di `public/audio/`. Jika diisi, musik mulai setelah pengunjung menekan **Buka Undangan** dan dapat dijeda lewat tombol musik. Tidak ada autoplay sebelum interaksi tamu.
- `isDemo`: ubah menjadi `false` setelah informasi asli lengkap. Pemberitahuan contoh dan link admin di footer akan disembunyikan; `/admin` tetap dapat dibuka langsung.

Jika kelak mengganti nama pasangan, sesuaikan juga judul dan metadata awal di `index.html`.

## Di mana foto diganti?

Penanda **FOTO 01–07** ditampilkan di undangan. Panduan visual juga ada di `/admin` → **Panduan foto**.

| Penanda | Bagian | File di `public/photos/` | Saran ukuran |
| --- | --- | --- | --- |
| 01 | Foto utama | `hero.jpg` | 1800 × 1400 px |
| 02 | Foto Haidar | `groom.jpg` | 900 × 1200 px |
| 03 | Foto Gita | `bride.jpg` | 900 × 1200 px |
| 04 | Cerita kita | `story.jpg` | 1000 × 1200 px |
| 05 | Galeri pertama | `gallery-1.jpg` | 1200 × 900 px |
| 06 | Galeri kedua | `gallery-2.jpg` | 900 × 1200 px |
| 07 | Galeri ketiga | `gallery-3.jpg` | 1200 × 900 px |

1. Ganti foto contoh dengan foto kalian. JPG, PNG, atau WebP dapat dipakai, asalkan path dan ekstensi di `src/config.js` sesuai.
2. Foto Haidar dan Gita saat ini sengaja berupa placeholder. Setelah menambahkan file, isi `groom.photo` dengan `/photos/groom.jpg` dan `bride.photo` dengan `/photos/bride.jpg`.
3. Path di konfigurasi diawali `/photos/`, **bukan** `/public/photos/`.
4. Setelah selesai, ubah `showPhotoLabels` menjadi `false` untuk menyembunyikan penanda.
5. Jalankan build dan deploy ulang agar perubahan tampil online.

Slider pembuka memakai `heroPhoto`, foto galeri pertama, dan `storyPhoto`. Mengganti ketiganya juga memperbarui foto slideshow. Foto penutup menggunakan `heroPhoto`. Ornamen bunga adalah aset terpisah di `public/decor/floral-bouquet.png`, sehingga tidak perlu diganti dengan foto pasangan.

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
