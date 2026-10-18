// Nama, tanggal, dan lokasi sudah sesuai. Keluarga dan cerita masih contoh.
// FOTO: letakkan file di public/photos/, lalu ubah path di bawah.
// Nama file boleh berbeda, asalkan path di sini sama dengan nama file kamu.
export const wedding = {
  bride: { name: 'Gita', fullName: 'Gita Firanddia Putri Ramadhiany', parents: 'Putri dari Bapak [nama ayah] & Ibu [nama ibu]' },
  groom: { name: 'Haidar', fullName: 'Haidar Syaddad Al Faruqi', parents: 'Putra dari Bapak [nama ayah] & Ibu [nama ibu]' },
  date: '2026-11-12T07:00:00+07:00', // Waktu WIB; ganti tanggal dan jam akad
  endDate: '2026-11-12T14:30:00+07:00',
  dateLabel: 'Kamis, 12 November 2026',
  shortDate: '12 . 11 . 2026',
  locationLabel: 'Jember, Jawa Timur',
  venue: 'Agrowisata Gading Asri',
  address: 'Perumahan Taman Gading, Kabupaten Jember',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Agrowisata+Gading+Asri+Perumahan+Taman+Gading+Kabupaten+Jember',
  events: [
    { title: 'Akad Nikah', time: '07.00 – selesai WIB', note: 'Awal dari janji seumur hidup', icon: 'rings' },
    { title: 'Resepsi', time: '11.00 – 14.30 WIB', note: 'Merayakan cinta bersama Anda', icon: 'glass' },
  ],
  heroPhoto: '/photos/slider1.jpg', // Foto utama dan penutup
  heroSlides: ['/photos/slider1.jpg', '/photos/slider2.jpg', '/photos/slider3.jpg'], // FOTO 01: urutan slider pembuka
  couplePhoto: '/photos/foto_bersama.jpg', // FOTO 02: foto bersama di antara nama Gita dan Haidar
  storyPhoto: '/photos/foto3.jpg', // FOTO 03: foto bersama, vertikal atau persegi
  gallery: [
    { src: '/photos/foto4.jpg', caption: 'Di antara banyak cerita, aku memilih kita.' }, // FOTO 04
    { src: '/photos/foto5.jpg', caption: 'Langkah kecil, menuju selamanya.' }, // FOTO 05
    { src: '/photos/foto6.jpg', caption: 'Rumah adalah di mana kamu berada.' }, // FOTO 06
  ],
  story: [
    { year: '2021', title: 'Sebuah pertemuan', text: 'Dari sebuah pertemuan sederhana, percakapan kecil tumbuh menjadi cerita yang selalu ingin kami lanjutkan.' },
    { year: '2024', title: 'Memilih untuk bersama', text: 'Melalui banyak cerita dan perjalanan, kami menemukan tempat pulang dalam diri satu sama lain.' },
    { year: '2026', title: 'Menuju selamanya', text: 'Dengan restu keluarga, kami memulai babak baru. Satu janji, dua hati, dan perjalanan seumur hidup.' },
  ],
  rsvpPhone: '', // WA penerima RSVP, format internasional: 6281234567890. WA terbuka setelah form diisi.
  gift: { bank: '', account: '', holder: '' }, // Opsional: isi ketiganya untuk menampilkan rekening hadiah
  music: '/audio/lagu.mp3', // Musik mulai setelah tombol Buka Undangan ditekan.
  musicVolume: 0.35, // Volume awal 0–1. Musik mulai sesudah tamu menekan Buka Undangan.
  showPhotoLabels: false, // Label panduan foto disembunyikan dari undangan
  isDemo: false, // Tulisan pratinjau dan link admin disembunyikan dari footer
};
