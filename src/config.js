// Nama mempelai sudah sesuai. Tanggal, lokasi, keluarga, dan cerita masih contoh.
// FOTO: letakkan file di public/photos/, lalu ubah path di bawah.
// Nama file boleh berbeda, asalkan path di sini sama dengan nama file kamu.
export const wedding = {
  bride: { name: 'Gita', fullName: 'Gita Firanddia Putri Ramadhiany', parents: 'Putri dari Bapak [nama ayah] & Ibu [nama ibu]', photo: '' }, // FOTO 03: isi '/photos/bride.jpg' setelah foto Gita ditambahkan, vertikal 3:4
  groom: { name: 'Haidar', fullName: 'Haidar Syaddad Al Faruqi', parents: 'Putra dari Bapak [nama ayah] & Ibu [nama ibu]', photo: '' }, // FOTO 02: isi '/photos/groom.jpg' setelah foto Haidar ditambahkan, vertikal 3:4
  date: '2027-06-20T08:00:00+07:00', // Waktu WIB; ganti tanggal dan jam akad
  endDate: '2027-06-20T14:00:00+07:00',
  dateLabel: 'Minggu, 20 Juni 2027',
  shortDate: '20 . 06 . 2027',
  locationLabel: 'Bandung, Jawa Barat',
  venue: 'The Green Forest Resort',
  address: 'Jl. Sersan Bajuri No. 102, Cihideung, Bandung Barat',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=The+Green+Forest+Resort+Bandung',
  events: [
    { title: 'Akad Nikah', time: '08.00 – 09.00 WIB', note: 'Awal dari janji seumur hidup', icon: 'rings' },
    { title: 'Resepsi', time: '11.00 – 14.00 WIB', note: 'Merayakan cinta bersama Anda', icon: 'glass' },
  ],
  heroPhoto: '/photos/hero.jpg', // FOTO 01: foto bersama, landscape minimal 1600px
  storyPhoto: '/photos/story.jpg', // FOTO 04: foto bersama, vertikal atau persegi
  gallery: [
    { src: '/photos/gallery-1.jpg', caption: 'Di antara banyak cerita, aku memilih kita.' }, // FOTO 05
    { src: '/photos/gallery-2.jpg', caption: 'Langkah kecil, menuju selamanya.' }, // FOTO 06
    { src: '/photos/gallery-3.jpg', caption: 'Rumah adalah di mana kamu berada.' }, // FOTO 07
  ],
  story: [
    { year: '2021', title: 'Sebuah pertemuan', text: 'Dari sebuah pertemuan sederhana, percakapan kecil tumbuh menjadi cerita yang selalu ingin kami lanjutkan.' },
    { year: '2024', title: 'Memilih untuk bersama', text: 'Melalui banyak cerita dan perjalanan, kami menemukan tempat pulang dalam diri satu sama lain.' },
    { year: '2027', title: 'Menuju selamanya', text: 'Dengan restu keluarga, kami memulai babak baru. Satu janji, dua hati, dan perjalanan seumur hidup.' },
  ],
  rsvpPhone: '', // WA penerima RSVP, format internasional: 6281234567890. WA terbuka setelah form diisi.
  gift: { bank: '', account: '', holder: '' }, // Opsional: isi ketiganya untuk menampilkan rekening hadiah
  music: '', // Opsional: path musik milikmu, misalnya /audio/our-song.mp3
  showPhotoLabels: true, // Ubah ke false setelah semua foto contoh diganti
  isDemo: true, // Ubah ke false setelah tanggal, tempat, keluarga, dan cerita sudah benar
};
