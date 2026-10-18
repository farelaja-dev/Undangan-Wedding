# Musik undangan

Musik aktif menggunakan `lagu.mp3` melalui pengaturan `music` di `src/config.js`.

`wedding-piano.wav` adalah loop instrumental piano sintetis asli untuk project ini (32 detik), dibuat oleh `scripts/generate_music.py`, tanpa sampel atau rekaman lagu pihak lain.

Musik diputar setelah tamu menekan **Buka Undangan**. Piringan berputar ketika audio diputar; ketuk untuk jeda atau melanjutkan. Volume awal diatur lewat `musicVolume` dalam `src/config.js`.

Untuk mengganti lagu, letakkan file audio yang boleh kamu gunakan di folder ini dan ubah `music` di `src/config.js`, misalnya `/audio/our-song.mp3`. Isi `music: ''` untuk menonaktifkan musik beserta tombolnya.
