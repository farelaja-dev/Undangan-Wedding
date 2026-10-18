import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, CalendarDays, Camera, Check, ChevronLeft, ChevronRight, Clock3, Copy, Heart, MailOpen, Maximize2, Music2, Pause, Play, Send, Sparkles, Wine, X } from 'lucide-react';
import { wedding as w } from './config';
import { downloadFile, whatsappUrl } from './lib/guests';
import { Floral, Ornament, Petals, Reveal, useReducedMotion } from './components/Motion';
import './luxury.css';
import './readability.css';
import PortraitOrnament from './components/PortraitOrnament';
import GuestWishes from './components/GuestWishes';
import { imageProps, panelSizes } from './lib/images';

const coupleNames = `${w.bride.name} & ${w.groom.name}`;
const heroSlides = (w.heroSlides?.length ? w.heroSlides : [w.heroPhoto]).filter(Boolean);

function Photo({ src, label, className = '', alt, priority = false, sizes = panelSizes }) {
  const [failed, setFailed] = useState(!src);
  useEffect(() => setFailed(!src), [src]);
  return <div className={`photo ${className} ${failed ? 'photo-empty' : ''}`}>
    {!failed && <img {...imageProps(src, sizes)} alt={alt} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} onError={() => setFailed(true)} />}
    {failed && <div className="photo-placeholder"><Camera size={25} strokeWidth={1} /><span>{alt}</span><small>Tempat untuk foto kalian</small></div>}
    {w.showPhotoLabels && label && <span className="photo-label"><Camera size={11} /> {label}</span>}
  </div>;
}

function Names({ className = '' }) {
  return <div className={`wedding-names ${className}`} aria-label={coupleNames}><span>{w.bride.name}</span><i>&</i><span>{w.groom.name}</span></div>;
}

function Cover({ guest, state, onOpen }) {
  return <div className={`invitation-cover cover-${state}`} role="dialog" aria-modal="true" aria-labelledby="cover-title">
    <div className="cover-gate gate-left"><div className="gate-emboss" /><Floral className="cover-floral-left" /></div>
    <div className="cover-gate gate-right"><div className="gate-emboss" /><Floral className="cover-floral-right" /></div>
    <div className="cover-halo" aria-hidden="true" /><div className="cover-arch" aria-hidden="true" />
    <div className="cover-content"><span className="cover-kicker">AN INVITATION TO OUR FOREVER</span><Ornament /><p className="cover-wedding">The Wedding of</p><h1 id="cover-title" className="sr-only">Pernikahan {coupleNames}</h1><Names /><div className="cover-date"><span />{w.shortDate}<span /></div><div className="cover-recipient"><span>Kepada Yth. Bapak/Ibu/Saudara/i</span><strong>{guest}</strong><p>Dengan penuh cinta, kami mengundang Anda{' '}<br />untuk menjadi bagian dari hari bahagia kami.</p></div><button className="open-invitation" onClick={onOpen} disabled={state !== 'closed'}><MailOpen size={16} strokeWidth={1.3} /><span>Buka Undangan</span><span className="button-glint" /></button><span className="cover-footnote">A little moment. A lifetime of love.</span></div>
    <span className="cover-edition">G & H <i /> THE WEDDING CELEBRATION</span>
  </div>;
}

function CinematicSlider({ className = '', active = true, initialIndex = 0, desktopOnly = false, children }) {
  const [index, setIndex] = useState(initialIndex % heroSlides.length);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const container = useRef(null);
  const [inView, setInView] = useState(false);
  const [desktop, setDesktop] = useState(() => window.matchMedia('(min-width: 801px)').matches);
  const [loaded, setLoaded] = useState(() => new Set([initialIndex % heroSlides.length]));
  const enabled = !desktopOnly || desktop;
  const running = active && enabled && inView && !paused && !reduced;
  useEffect(() => {
    const media = window.matchMedia('(min-width: 801px)');
    const update = () => setDesktop(media.matches);
    media.addEventListener('change', update);
    const observer = new IntersectionObserver(entries => setInView(entries[0].isIntersecting));
    observer.observe(container.current);
    return () => { media.removeEventListener('change', update); observer.disconnect(); };
  }, []);
  useEffect(() => {
    if (!running) return;
    setLoaded(previous => new Set([...previous, index, (index + 1) % heroSlides.length]));
  }, [running, index]);
  useEffect(() => {
    if (!running || heroSlides.length < 2) return;
    const id = setInterval(() => { if (!document.hidden) setIndex(i => (i + 1) % heroSlides.length); }, 6500);
    return () => clearInterval(id);
  }, [running]);
  return <div ref={container} className={`cinematic-slider ${running ? 'motion-active' : ''} ${className}`} aria-roledescription="carousel" aria-label="Foto perjalanan Gita dan Haidar"><div className="cinematic-images">{heroSlides.map((src, i) => <div key={i} className={`cinematic-slide ${i === index ? 'active' : ''}`} aria-hidden={i !== index}>{enabled && (i === index || loaded.has(i)) && <img {...imageProps(src, desktopOnly ? '(max-width: 1100px) 52vw, (max-width: 1348px) 54vw, calc(100vw - 620px)' : panelSizes)} alt={`Foto bersama ${coupleNames}, ${i + 1}`} fetchPriority={i === initialIndex ? 'high' : 'low'} />}</div>)}</div><div className="cinematic-tint" />{children}<div className="cinematic-controls"><span className="slide-number">0{index + 1}<i />0{heroSlides.length}</span><div className="slide-dots">{heroSlides.map((_, i) => <button key={i} className={i === index ? 'active' : ''} aria-label={`Tampilkan foto pembuka ${i + 1}`} aria-pressed={i === index} onClick={() => { setIndex(i); setPaused(true); }} />)}</div><button className="slide-pause" aria-label={paused || reduced ? 'Putar slideshow' : 'Jeda slideshow'} onClick={() => setPaused(!paused)} disabled={reduced}>{paused || reduced ? <Play size={12} /> : <Pause size={12} />}</button></div></div>;
}

function Countdown() {
  const [remaining, setRemaining] = useState(() => Math.max(0, new Date(w.date) - Date.now()));
  useEffect(() => {
    const updateRemaining = () => setRemaining(Math.max(0, new Date(w.date) - Date.now()));
    const id = setInterval(updateRemaining, 1000);
    window.addEventListener('focus', updateRemaining);
    document.addEventListener('visibilitychange', updateRemaining);
    updateRemaining();
    return () => {
      clearInterval(id);
      window.removeEventListener('focus', updateRemaining);
      document.removeEventListener('visibilitychange', updateRemaining);
    };
  }, []);
  const values = [Math.floor(remaining / 86400000), Math.floor(remaining / 3600000) % 24, Math.floor(remaining / 60000) % 60, Math.floor(remaining / 1000) % 60];
  return <div className="lux-countdown" aria-label={remaining ? 'Hitung mundur menuju pernikahan' : 'Hari bahagia telah tiba'}>{values.map((v, i) => <div key={i}><strong>{String(v).padStart(2, '0')}</strong><span>{['HARI', 'JAM', 'MENIT', 'DETIK'][i]}</span></div>)}</div>;
}

function saveCalendar() {
  const utc = value => new Date(value).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const escape = value => value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Sehidup//Wedding//ID', 'BEGIN:VEVENT', `UID:haidar-gita-${utc(w.date)}@sehidup`, `DTSTAMP:${utc(new Date())}`, `DTSTART:${utc(w.date)}`, `DTEND:${utc(w.endDate)}`, `SUMMARY:${escape(`Pernikahan ${coupleNames}`)}`, `LOCATION:${escape(`${w.venue}, ${w.address}`)}`, 'END:VEVENT', 'END:VCALENDAR'];
  downloadFile(lines.join('\r\n'), 'pernikahan-gita-haidar.ics', 'text/calendar;charset=utf-8');
}

function Gallery({ active = true }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const dialog = useRef(null);
  const container = useRef(null);
  const touch = useRef(null);
  const reduced = useReducedMotion();
  useEffect(() => { const observer = new IntersectionObserver(entries => setInView(entries[0].isIntersecting)); observer.observe(container.current); return () => observer.disconnect(); }, []);
  useEffect(() => {
    if (!active || paused || reduced || !inView || w.gallery.length < 2) return;
    const timer = setInterval(() => { if (!document.hidden && !dialog.current.open) setIndex(i => (i + 1) % w.gallery.length); }, 5000);
    return () => clearInterval(timer);
  }, [active, paused, reduced, inView]);
  function step(value) { setPaused(true); setIndex(i => (i + value + w.gallery.length) % w.gallery.length); }
  return <section ref={container} id="galeri" className="lux-gallery lux-section">
    <Reveal><span className="lux-kicker">CAPTURED WITH LOVE</span><h2>A little glimpse<br />of <em>our forever.</em></h2><p>Beberapa detik yang ingin kami simpan,<br />untuk waktu yang tak terhingga.</p></Reveal>
    <Reveal direction="zoom" className="gallery-stage"><div className="gallery-carousel" aria-roledescription="carousel" aria-label="Galeri kenangan" onTouchStart={e => { touch.current = e.touches[0].clientX; }} onTouchEnd={e => { if (touch.current !== null) { const delta = touch.current - e.changedTouches[0].clientX; if (Math.abs(delta) > 45) step(delta > 0 ? 1 : -1); touch.current = null; } }}>
      {w.gallery.map((photo, i) => <button className={`gallery-slide ${i === index ? 'active' : ''}`} key={photo.src} aria-hidden={i !== index} tabIndex={i === index ? 0 : -1} onClick={() => { setPaused(true); dialog.current.showModal(); }} aria-label={`Perbesar foto ${i + 1}`}><Photo src={photo.src} alt={photo.caption} label={`FOTO 0${i + 4} · GALERI`} /><span className="expand-image"><Maximize2 size={16} /></span></button>)}
      <button className="gallery-arrow previous" onClick={() => step(-1)} aria-label="Slide sebelumnya"><ChevronLeft size={19} /></button><button className="gallery-arrow next" onClick={() => step(1)} aria-label="Slide berikutnya"><ChevronRight size={19} /></button>
    </div><div className="gallery-progress"><span>0{index + 1}</span><div className="gallery-progress-line"><i style={{ width: `${((index + 1) / w.gallery.length) * 100}%` }} /></div><span>0{w.gallery.length}</span><button aria-label={paused || reduced ? 'Putar galeri otomatis' : 'Jeda galeri otomatis'} onClick={() => setPaused(!paused)} disabled={reduced}>{paused || reduced ? <Play size={13} /> : <Pause size={13} />}</button></div><p className="gallery-quote" key={index}>{w.gallery[index].caption}</p><div className="gallery-thumbnails">{w.gallery.map((photo, i) => <button key={photo.src} onClick={() => { setIndex(i); setPaused(true); }} aria-label={`Pilih foto galeri ${i + 1}`} aria-pressed={index === i} className={index === i ? 'active' : ''}><img {...imageProps(photo.src, "70px")} alt="" loading="lazy" /></button>)}</div></Reveal>
    <dialog ref={dialog} className="lightbox" aria-label="Galeri foto pernikahan" onClick={e => { if (e.target === e.currentTarget) dialog.current.close(); }} onKeyDown={e => { if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); }}><button className="icon-button lightbox-close" aria-label="Tutup foto" onClick={() => dialog.current.close()}><X /></button><Photo sizes="90vw" src={w.gallery[index].src} alt={w.gallery[index].caption} /><div className="lightbox-controls"><button className="icon-button" aria-label="Foto sebelumnya" onClick={() => step(-1)}><ChevronLeft /></button><p>{w.gallery[index].caption}</p><button className="icon-button" aria-label="Foto berikutnya" onClick={() => step(1)}><ChevronRight /></button></div></dialog>
  </section>;
}

function RSVP({ guest, notify }) {
  const [attendance, setAttendance] = useState('Hadir');
  function submit(event) {
    event.preventDefault(); if (!w.rsvpPhone) return;
    const form = new FormData(event.currentTarget);
    const message = `Assalamu’alaikum ${coupleNames}.\n\nNama: ${form.get('name')}\nKonfirmasi: ${attendance}\nJumlah tamu: ${attendance === 'Hadir' ? form.get('count') : '0'}\n\n${form.get('wish') || 'Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.'}`;
    window.open(whatsappUrl(w.rsvpPhone, message), '_blank', 'noopener,noreferrer');
    notify('Pesan disiapkan di WhatsApp. Tekan Kirim di WhatsApp untuk mengonfirmasi.');
  }
  return <section id="rsvp" className="lux-rsvp lux-section"><Floral className="rsvp-floral" /><Reveal><Ornament /><span className="lux-kicker">THE JOY IS IN SHARING IT</span><h2>Lengkapi<br /><em>bahagia kami.</em></h2><p>Satu doa darimu, sejuta arti untuk kami.<br />Kami menantikan kehadiran dan doa baik Anda.</p></Reveal><Reveal delay={150}><form className="lux-rsvp-form" onSubmit={submit}><h3>Konfirmasi kehadiran</h3><p>Kabar baikmu akan dikirim melalui WhatsApp.</p><label>Nama lengkap<input name="name" defaultValue={guest === 'Tamu Undangan' ? '' : guest} placeholder="Tulis nama Anda" required maxLength={150} /></label><fieldset><legend>Apakah Anda akan hadir?</legend><div className="attendance-options">{['Hadir', 'Belum bisa hadir'].map(option => <label key={option} className={attendance === option ? 'selected' : ''}><input type="radio" name="attendance" value={option} checked={attendance === option} onChange={() => setAttendance(option)} />{option === 'Hadir' ? <Check size={16} /> : <Heart size={16} />}{option}</label>)}</div></fieldset>{attendance === 'Hadir' && <label>Jumlah tamu<select name="count" defaultValue="1">{[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} orang</option>)}</select></label>}<label>Ucapan & doa<textarea name="wish" placeholder="Titipkan doa baik untuk Gita & Haidar…" rows={3} maxLength={1000} /></label><button className="lux-button" type="submit" disabled={!w.rsvpPhone}>Kirim konfirmasi <Send size={15} /></button>{!w.rsvpPhone && <small className="setup-note">RSVP belum dibuka. Nomor WhatsApp penerima belum diatur.</small>}</form></Reveal><Reveal><GuestWishes guest={guest} /></Reveal></section>;
}

export default function Invitation() {
  const guest = new URLSearchParams(window.location.search).get('to')?.trim().slice(0, 150) || 'Tamu Undangan';
  const [cover, setCover] = useState('closed');
  const [toast, setToast] = useState('');
  const [playing, setPlaying] = useState(false);
  const [effects, setEffects] = useState(true);
  const audio = useRef(null);
  const main = useRef(null);
  const reduced = useReducedMotion();
  useEffect(() => { document.title = `${coupleNames} — Undangan Pernikahan`; }, []);
  useEffect(() => { if (cover === 'open') { document.body.style.overflow = ''; main.current?.focus({ preventScroll: true }); return; } document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = ''; }; }, [cover]);
  useEffect(() => { if (cover !== 'opening') return; const timer = setTimeout(() => setCover('open'), reduced ? 50 : 1800); return () => clearTimeout(timer); }, [cover, reduced]);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(''), 5500); return () => clearTimeout(timer); }, [toast]);
  useEffect(() => {
    if (cover !== 'open' || reduced || !effects) return;
    let frame;
    const onScroll = () => { if (frame) return; frame = requestAnimationFrame(() => { document.documentElement.style.setProperty('--scroll-parallax', `${Math.min(window.scrollY * .15, 150)}px`); frame = null; }); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); document.documentElement.style.removeProperty('--scroll-parallax'); };
  }, [cover, reduced, effects]);
  function openInvitation() { if (cover !== 'closed') return; window.scrollTo({ top: 0, behavior: 'instant' }); setCover('opening'); if (audio.current) { audio.current.volume = Math.min(1, Math.max(0, w.musicVolume ?? 0.35)); audio.current.play().catch(() => setToast('Ketuk ikon piringan untuk mulai memutar musik.')); } }
  async function toggleMusic() { if (playing) { audio.current.pause(); setPlaying(false); } else { try { await audio.current.play(); setPlaying(true); } catch { setToast('Musik belum dapat diputar. Periksa file audio.'); } } }
  return <div data-cover-state={cover} className={`luxury ${cover === 'open' ? 'invitation-open' : ''} ${!effects ? 'effects-paused' : ''}`}>
    <Petals active={effects} />
    {cover !== 'open' && <Cover guest={guest} state={cover} onOpen={openInvitation} />}
    <div className="invitation-shell" inert={cover !== 'open' ? true : undefined} aria-hidden={cover !== 'open'}>
      <aside className="wedding-backdrop"><CinematicSlider desktopOnly initialIndex={1} active={cover === 'open' && effects}><div className="backdrop-frame" /><div className="backdrop-copy"><span className="lux-kicker">TOGETHER IS A BEAUTIFUL PLACE TO BE</span><Names /><Ornament /><p>Two souls, one beautiful journey.</p><span className="backdrop-date">{w.shortDate}</span></div><Floral className="backdrop-floral" /><span className="backdrop-vertical">THE WEDDING CELEBRATION OF HAIDAR & GITA</span></CinematicSlider></aside>
      <main ref={main} tabIndex={-1} className="invitation-scroll" aria-label="Isi undangan pernikahan">
        <section id="home" className="lux-hero"><CinematicSlider active={cover === 'open' && effects}><div className="hero-arch-line" /><div className="lux-hero-copy"><span className="lux-kicker">THE WEDDING OF</span><Names /><Ornament /><p>{w.dateLabel}</p><span className="hero-location">{w.locationLabel}</span></div><a className="scroll-invitation" href="#doa"><span>OUR FOREVER BEGINS HERE</span><span className="scroll-line" /><ArrowDown size={13} /></a>{w.showPhotoLabels && <span className="hero-photo-marker"><Camera size={10} /> FOTO 01 · FOTO UTAMA</span>}</CinematicSlider><Floral className="hero-bottom-floral" /></section>
        <section id="doa" className="lux-prayer lux-section"><Floral className="prayer-floral" /><Reveal><span className="arabic-bismillah" lang="ar" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span></Reveal><Reveal delay={100}><span className="lux-kicker">IN THE NAME OF ALLAH, THE MOST MERCIFUL</span><h2>Ditulis oleh takdir.<br /><em>Disatukan oleh cinta.</em></h2></Reveal><Reveal delay={200}><p>“Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.”</p><span className="verse">QS. Ar-Rum: 21</span><Ornament /></Reveal></section>
        <section id="mempelai" className="lux-couple lux-section">
          <Reveal><span className="lux-script">by the grace of God</span><h2>We found<br /><em>our forever.</em></h2><p>Dengan memohon rahmat dan rida Allah SWT,<br />kami bermaksud menyelenggarakan pernikahan kami.</p></Reveal>
          <Reveal direction="left" className="lux-person">
            <span className="lux-script person-nickname">{w.bride.name}</span><h3>{w.bride.fullName}</h3><span className="person-rule" /><p>{w.bride.parents}</p>
          </Reveal>
          <Reveal direction="zoom" className="couple-shared-photo">
            <div className="portrait-frame"><Photo sizes="(max-width: 800px) 245px, 270px" src={w.couplePhoto} alt="Foto bersama Gita dan Haidar" label="FOTO 02 · FOTO BERSAMA" /><PortraitOrnament /></div>
          </Reveal>
          <Reveal direction="right" className="lux-person">
            <span className="lux-script person-nickname">{w.groom.name}</span><h3>{w.groom.fullName}</h3><span className="person-rule" /><p>{w.groom.parents}</p>
          </Reveal>
        </section>
        <section id="acara" className="lux-events lux-section"><Floral className="events-floral" /><Reveal><Ornament /><span className="lux-kicker">A DAY TO REMEMBER</span><h2>The beginning<br />of <em>always.</em></h2><p>Setiap detik membawa kami lebih dekat<br />pada janji untuk selamanya.</p></Reveal><Reveal delay={150}><Countdown /></Reveal>{w.events.map((event, i) => <Reveal key={event.title} delay={100} direction={i ? 'right' : 'left'} className="lux-event-card"><span className="event-script">{i ? 'the celebration' : 'the sacred promise'}</span>{event.icon === 'glass' ? <Wine size={24} strokeWidth={1} /> : <span className="lux-rings">○○</span>}<h3>{event.title}</h3><span className="event-fine-line" /><div className="lux-event-date"><CalendarDays size={14} />{w.dateLabel}</div><div className="lux-event-date"><Clock3 size={14} />{event.time}</div><strong>{w.venue}</strong><p>{w.address}</p><a className="lux-button lux-button-light" href={w.mapsUrl} target="_blank" rel="noreferrer">Petunjuk lokasi <ArrowUpRight size={14} /></a></Reveal>)}<Reveal><button className="lux-calendar" onClick={saveCalendar}><CalendarDays size={15} /> Simpan ke kalender</button></Reveal></section>
        <section id="cerita" className="lux-story"><Reveal direction="zoom" className="story-film"><Photo src={w.storyPhoto} alt="Foto perjalanan cinta Gita dan Haidar" label="FOTO 03 · CERITA KITA" /><div className="story-film-shade" /><span className="story-film-script">It was always you.</span></Reveal><div className="lux-section story-words"><Floral className="story-floral" /><Reveal><span className="lux-kicker">EVERY LOVE HAS A STORY</span><h2>And this<br />is <em>ours.</em></h2></Reveal><div className="lux-timeline">{w.story.map((item, i) => <Reveal key={item.title} delay={i * 60} className="story-moment"><span className="story-dot" /><h3>{item.title}</h3><p>{item.text}</p></Reveal>)}</div><Reveal><Ornament /></Reveal></div></section>
        <Gallery active={effects} />
        <RSVP guest={guest} notify={setToast} />
        {w.gift.bank && w.gift.account && w.gift.holder && <section className="lux-gift lux-section"><Reveal><span className="lux-kicker">A LITTLE TOKEN OF LOVE</span><h2>Tanda <em>kasih.</em></h2><p>Doa dan kehadiran Anda adalah hadiah terindah bagi kami. Jika ingin memberikan tanda kasih, kami menerimanya dengan sepenuh hati.</p><div className="gift-account"><span>{w.gift.bank}</span><strong>{w.gift.account}</strong><span>a.n. {w.gift.holder}</span><button className="text-link" onClick={async () => { try { await navigator.clipboard.writeText(w.gift.account); setToast('Nomor rekening disalin.'); } catch { setToast('Silakan salin nomor rekening secara manual.'); } }}><Copy size={14} /> Salin rekening</button></div></Reveal></section>}
        <footer className="lux-closing"><Photo src={w.heroPhoto} alt="" className="closing-photo" /><div className="closing-wash" /><Floral className="closing-floral" /><Reveal><Ornament /><span className="lux-kicker">WITH ALL OUR LOVE</span><p>Suatu kehormatan dan kebahagiaan bagi kami<br />apabila Anda berkenan hadir dan memberikan doa restu.</p><span className="lux-script">See you on our special day</span><Names /><span className="closing-signature">{w.shortDate}</span><Heart size={16} strokeWidth={1} /></Reveal><div className="lux-footer-note"><span>Made with love, for a lifetime.</span>{w.isDemo && <><p>Pratinjau · Data keluarga, cerita, dan sebagian foto masih contoh.</p><a href="/admin">Kelola tamu & panduan foto <ArrowUpRight size={11} /></a></>}</div></footer>
      </main>
    </div>
    {w.music && <audio ref={audio} src={w.music} loop preload="none" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} onError={() => { setPlaying(false); setToast('File musik tidak dapat dibuka.'); }} />}
    {cover === 'open' && <div className="lux-floating-controls">{w.music && <button onClick={toggleMusic} aria-label={playing ? 'Jeda musik' : 'Putar musik'} aria-pressed={playing} title={playing ? 'Jeda musik' : 'Putar musik'} className={`music-toggle ${playing ? 'playing' : ''}`}><span className="record-disc" aria-hidden="true"><span className="record-label"><Music2 size={12} /></span></span><span className="record-status" aria-hidden="true">{playing ? <Pause size={10} /> : <Play size={10} />}</span></button>}<button onClick={() => setEffects(!effects)} aria-label={effects ? 'Jeda efek animasi' : 'Aktifkan efek animasi'} aria-pressed={effects}><Sparkles size={16} /><span>{effects ? 'ON' : 'OFF'}</span></button></div>}
    {toast && <div className="toast" role="status">{toast}<button aria-label="Tutup notifikasi" onClick={() => setToast('')}><X size={16} /></button></div>}
  </div>;
}
