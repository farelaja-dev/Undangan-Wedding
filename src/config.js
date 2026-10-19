// Nama, orang tua, tanggal, lokasi, dan cerita sudah sesuai data pasangan.
// FOTO: letakkan file di public/photos/, lalu ubah path di bawah.
// Nama file boleh berbeda, asalkan path di sini sama dengan nama file kamu.
export const wedding = {
  bride: { name: 'Gita', fullName: 'Gita Firanddia Putri Ramadhiany', parents: 'Putri dari Bapak Firman Suhestiyono & Ibu Dyah Wigatiningtyas' },
  groom: { name: 'Haidar', fullName: 'Haidar Syaddad Al Faruqi', parents: 'Putra dari Bapak Moch. Afifi & Ibu Siti Rohma' },
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
    { title: 'Awal Cerita', text: 'Berawal dari sapaan singkat dan obrolan tanpa arah, kami perlahan menemukan ruang di hati satu sama lain. Setiap cerita yang terbagi membuat jarak di antara kami makin terkikis. Tanpa disadari, kebersamaan demi kebersamaan melahirkan rasa nyaman yang terus berakar. Hari demi hari berlalu, dan perasaan itu tak sekadar tinggal, melainkan tumbuh menjadi fondasi yang kian kuat untuk mengarungi masa depan bersama.' },
    { title: 'Lamaran', text: 'Berbekal niat tulus dan hangatnya restu keluarga besar, kami mantap melangkah ke jenjang yang lebih serius. Momen lamaran ini menjadi saksi awal ikatan suci kami—sebuah titik mula untuk melangkah bersama, saling melengkapi, dan menyongsong masa depan yang penuh doa serta keberkahan.' },
    { title: 'Pernikahan', text: 'Hari yang kami impikan kini nyata di depan mata, sebuah puncak dari segala cerita dan komitmen yang telah kami bangun. Dalam ikatan suci pernikahan ini, kami menyatukan niat dan langkah untuk mengarungi masa depan bersama. Semoga rumah tangga yang kami bina menjadi tempat paling aman untuk pulang, tumbuh dalam balutan kasih sayang yang tulus, serta senantiasa diliputi doa-doa baik dan keberkahan yang melimpah.' },
  ],
  rsvpPhone: '6285706314694', // WhatsApp penerima konfirmasi kehadiran
  gift: { bank: '', account: '', holder: '' }, // Opsional: isi ketiganya untuk menampilkan rekening hadiah
  music: '/audio/lagu.mp3', // Musik mulai setelah tombol Buka Undangan ditekan.
  musicVolume: 0.35, // Volume awal 0–1. Musik mulai sesudah tamu menekan Buka Undangan.
  showPhotoLabels: false, // Label panduan foto disembunyikan dari undangan
  isDemo: false, // Tulisan pratinjau dan link admin disembunyikan dari footer
};
