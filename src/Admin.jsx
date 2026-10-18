import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Check, Clipboard, Download, ExternalLink, FileSpreadsheet, Image, Link2, Plus, Search, Send, Trash2, Upload, Users, X } from 'lucide-react';
import { wedding as w } from './config';
import { downloadFile, exportGuests, invitationUrl, mergeGuests, normalizePhone, parseGuests, whatsappUrl } from './lib/guests';

const STORAGE_KEY = 'sehidup-guests-v1';
function readGuests() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(value) || !value.every(g => typeof g.id === 'string' && typeof g.name === 'string' && typeof g.phone === 'string' && typeof g.group === 'string')) throw new Error();
    return { guests: value, error: '' };
  } catch { return { guests: [], error: 'Data tamu tersimpan tidak dapat dibaca. Impor kembali cadangan CSV Anda.' }; }
}

export default function Admin() {
  const [initial] = useState(readGuests);
  const [guests, setGuests] = useState(initial.guests);
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('Semua grup');
  const [base, setBase] = useState(window.location.origin);
  const [notice, setNotice] = useState(initial.error);
  const [storageError, setStorageError] = useState('');
  const [pending, setPending] = useState([]);
  const [importName, setImportName] = useState('');
  const [dragging, setDragging] = useState(false);
  const [activeTab, setActiveTab] = useState('guests');
  const importDialog = useRef(null);
  const addDialog = useRef(null);
  const input = useRef(null);
  useEffect(() => { document.title = `Kelola Tamu — ${w.bride.name} & ${w.groom.name}`; }, []);
  function updateGuests(next) {
    setGuests(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); setStorageError(''); }
    catch { setStorageError('Browser tidak dapat menyimpan data. Unduh CSV sebagai cadangan sebelum meninggalkan halaman.'); }
  }
  const groups = [...new Set(guests.map(g => g.group))];
  const filtered = guests.filter(g => `${g.name} ${g.phone} ${g.group}`.toLowerCase().includes(query.toLowerCase()) && (group === 'Semua grup' || g.group === group));
  let validBase = true;
  try { invitationUrl(base, 'test'); } catch { validBase = false; }

  async function importFile(file) {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.csv')) { setNotice('Pilih file dengan format .csv.'); return; }
    if (file.size > 2 * 1024 * 1024) { setNotice('Ukuran CSV maksimal 2 MB.'); return; }
    try { const parsed = parseGuests(await file.text()); setPending(parsed); setImportName(file.name); importDialog.current.showModal(); }
    catch (error) { setNotice(error.message); }
  }
  function commitImport() {
    const result = mergeGuests(guests, pending);
    updateGuests(result.guests);
    setNotice(`${result.added} tamu ditambahkan${result.skipped ? `; ${result.skipped} duplikat dilewati` : ''}.`);
    importDialog.current.close(); setPending([]);
  }
  function addGuest(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get('name').trim();
    if (!name) return;
    const result = mergeGuests(guests, [{ name, phone: normalizePhone(data.get('phone')), group: data.get('group').trim() || 'Umum' }]);
    updateGuests(result.guests); setNotice(result.added ? `${name} ditambahkan.` : 'Tamu dengan nama dan nomor tersebut sudah ada.');
    event.currentTarget.reset(); addDialog.current.close();
  }
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); setNotice('Link undangan berhasil disalin.'); }
    catch { setNotice('Tidak dapat menyalin otomatis. Buka pratinjau undangan lalu salin alamat dari browser.'); }
  }
  function share(guest) {
    const message = `Kepada Yth. ${guest.name},\n\nDengan penuh kebahagiaan, kami mengundang Anda dalam pernikahan:\n${w.bride.fullName}\n& ${w.groom.fullName}\n\n${w.dateLabel}\n${w.venue}\n\nUndangan selengkapnya:\n${invitationUrl(base, guest.name)}\n\nMerupakan kehormatan bagi kami apabila Anda berkenan hadir dan memberikan doa restu.\n\nSalam hangat,\n${w.bride.name} & ${w.groom.name}`;
    window.open(whatsappUrl(guest.phone, message), '_blank', 'noopener,noreferrer');
  }
  const photoGuide = [
    ['01', 'Slider pembuka', 'slider1.jpg', 'Slider 1-3: slider1.jpg, slider2.jpg, slider3.jpg'],
    ['02', 'Foto bersama', 'foto_bersama.jpg', 'Gita dan Haidar · portrait · 900 × 1200 px'],
    ['03', 'Cerita kita', 'foto3.jpg', 'Foto bersama · portrait · 1000 × 1200 px'],
    ['04', 'Galeri pertama', 'foto4.jpg', 'Landscape · 1200 × 900 px'],
    ['05', 'Galeri kedua', 'foto5.jpg', 'Portrait · 900 × 1200 px'],
    ['06', 'Galeri ketiga', 'foto6.jpg', 'Landscape · 1200 × 900 px'],
  ];
  return <div className="admin-layout">
    <aside className="admin-sidebar"><a className="admin-brand" href="/">G<span>&</span>H<span>.</span></a><span className="eyebrow">YOUR WEDDING SPACE</span><div className="admin-nav"><button className={activeTab === 'guests' ? 'active' : ''} onClick={() => setActiveTab('guests')}><Users size={18} />Daftar tamu<span>{guests.length}</span></button><button className={activeTab === 'photos' ? 'active' : ''} onClick={() => setActiveTab('photos')}><Image size={18} />Panduan foto</button></div><div className="sidebar-wedding"><HeartMark /><strong>{w.bride.name} & {w.groom.name}</strong><span>{w.dateLabel}</span><a href="/" target="_blank" rel="noreferrer">Lihat undangan <ArrowUpRight size={14} /></a></div><p className="sidebar-note">Dibuat dengan cinta.<br />Dikelola dengan mudah.</p></aside>
    <div className="admin-main"><header className="admin-topbar"><span>WEDDING INVITATION MANAGER</span><a href="/" target="_blank" rel="noreferrer">Pratinjau undangan <ExternalLink size={14} /></a></header>
      <main className="admin-content"><div className="admin-heading"><div><span className="eyebrow">A LITTLE PLANNING, A LOT OF LOVE</span><h1>{activeTab === 'guests' ? 'Orang-orang tersayang.' : 'Ruang untuk cerita kalian.'}</h1><p>{activeTab === 'guests' ? 'Satu daftar tamu. Undangan personal untuk setiap nama.' : 'Enam tempat foto yang siap diisi dengan kenangan kalian.'}</p></div>{activeTab === 'guests' && <button className="button button-blue" onClick={() => addDialog.current.showModal()}><Plus size={17} /> Tambah tamu</button>}</div>
      {notice && <div role="status" className="admin-notice">{notice}<button aria-label="Tutup pemberitahuan" onClick={() => setNotice('')}><X size={16} /></button></div>}
      {storageError && <p className="error-note" role="alert">{storageError}</p>}
      {activeTab === 'guests' ? <>
        <div className="admin-stats"><div><span>Total tamu</span><strong>{guests.length}<Users size={23} /></strong><small>Nama di dalam daftar undangan</small></div><div><span>Grup undangan</span><strong>{groups.length}<span className="stat-spark">✧</span></strong><small>Keluarga, sahabat, dan lainnya</small></div><div><span>Dengan nomor WhatsApp</span><strong>{guests.filter(g => g.phone).length}<Send size={22} /></strong><small>Siap dibuka dalam WhatsApp</small></div></div>
        <div className="admin-import-row"><div className={`import-zone ${dragging ? 'dragging' : ''}`} onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={e => { e.preventDefault(); setDragging(false); importFile(e.dataTransfer.files[0]); }}><span className="upload-icon"><Upload size={23} /></span><div><h2>Daftar panjang? Impor saja.</h2><p>Impor CSV untuk membuat link personal setiap tamu secara otomatis.</p><a href="/contoh-tamu.csv" download><Download size={13} /> Unduh template CSV</a></div><button className="button button-outline" onClick={() => input.current.click()}>Pilih CSV</button><input ref={input} type="file" accept=".csv,text/csv" hidden onChange={e => { importFile(e.target.files[0]); e.target.value = ''; }} /></div><div className="base-url-box"><label htmlFor="base-url"><Link2 size={16} /> Alamat website undangan</label><input id="base-url" type="url" value={base} onChange={e => setBase(e.target.value)} placeholder="https://undangan-kalian.vercel.app" /><small>{validBase ? 'Isi domain online. Contoh: Pak Halim otomatis mendapat link /pak-halim.' : 'Masukkan alamat yang valid, diawali https://.'}</small></div></div>
        <section className="guest-table-panel"><div className="table-toolbar"><h2>Daftar tamu <span>{filtered.length}</span></h2><div className="table-filters"><div className="search-input"><Search size={16} /><input aria-label="Cari tamu" placeholder="Cari nama atau nomor…" value={query} onChange={e => setQuery(e.target.value)} /></div><select aria-label="Filter grup" value={group} onChange={e => setGroup(e.target.value)}><option>Semua grup</option>{groups.map(g => <option key={g}>{g}</option>)}</select><button className="button button-outline" disabled={!guests.length || !validBase} onClick={() => { downloadFile(exportGuests(guests, base), 'tamu-gita-haidar.csv'); setNotice(`${guests.length} tamu beserta link diunduh sebagai CSV.`); }}><Download size={15} /> Ekspor CSV</button></div></div>
          <div className="table-scroll"><table><thead><tr><th>NAMA TAMU</th><th>GRUP</th><th>WHATSAPP</th><th>UNDANGAN</th><th><span className="sr-only">Hapus</span></th></tr></thead><tbody>{filtered.map(g => <tr key={g.id}><td><span className="guest-avatar">{g.name.charAt(0).toUpperCase()}</span><strong>{g.name}</strong></td><td><span className="group-badge">{g.group}</span></td><td className="phone-cell">{g.phone ? `+${g.phone}` : 'Belum ditambahkan'}</td><td><div className="row-actions"><button title="Salin link" aria-label={`Salin link untuk ${g.name}`} disabled={!validBase} onClick={() => copy(invitationUrl(base, g.name))}><Clipboard size={16} /></button><button title="Buka WhatsApp" aria-label={`Buka WhatsApp untuk ${g.name}`} disabled={!validBase} onClick={() => share(g)}><Send size={16} /></button><a href={validBase ? invitationUrl(base, g.name) : undefined} target="_blank" rel="noreferrer" aria-label={`Pratinjau undangan ${g.name}`} aria-disabled={!validBase}><ArrowUpRight size={17} /></a></div></td><td><button className="delete-button" title="Hapus tamu" aria-label={`Hapus ${g.name}`} onClick={() => { if (window.confirm(`Hapus ${g.name} dari daftar tamu?`)) { updateGuests(guests.filter(item => item.id !== g.id)); setNotice(`${g.name} dihapus.`); } }}><Trash2 size={15} /></button></td></tr>)}</tbody></table></div>
          {!filtered.length && <div className="empty-state"><Users size={30} strokeWidth={1} /><h3>{guests.length ? 'Nama belum ditemukan' : 'Cerita bahagia dimulai dari mereka.'}</h3><p>{guests.length ? 'Coba kata pencarian atau grup lain.' : 'Tambahkan tamu pertama, atau impor seluruh daftar lewat CSV.'}</p>{!guests.length && <button className="text-link" onClick={() => addDialog.current.showModal()}>Tambah tamu pertama <Plus size={15} /></button>}</div>}
          <div className="table-bottom"><span>{filtered.length} dari {guests.length} tamu ditampilkan</span><span>Tamu duplikat otomatis dilewati saat impor</span></div>
        </section><div className="local-info"><span>ⓘ</span><p>Daftar tamu hanya disimpan di browser perangkat ini, tanpa akun atau server. Unduh CSV untuk cadangan atau pindah perangkat. Link personal tetap dapat dibuka siapa saja tanpa mengakses daftar ini.</p></div>
      </> : <section className="photo-guide"><div className="guide-intro"><Image size={25} /><div><h2>Ganti file, langsung jadi milik kalian.</h2><p>Simpan foto di <code>public/photos/</code> dengan nama di bawah. Lokasi foto juga ditandai langsung pada undangan.</p></div></div><div className="photo-guide-grid">{photoGuide.map(([number, name, file, tip]) => <article key={number}><span>{number}</span><CameraMark /><h3>{name}</h3><code>public/photos/{file}</code><p>{tip}</p></article>)}</div><div className="guide-footer"><h3>Sentuhan terakhir sebelum dibagikan</h3><p>Edit <code>src/config.js</code> untuk tanggal, lokasi, keluarga, cerita, nomor WhatsApp RSVP, hadiah, dan musik. Foto galeri dan utama yang sudah ada adalah foto contoh.</p><p>Setelah semua siap, atur <code>showPhotoLabels: false</code> dan <code>isDemo: false</code> untuk menyembunyikan penanda foto dan pemberitahuan contoh. Jalankan build lalu deploy ulang ke Vercel.</p></div></section>}
      <footer className="admin-footer"><span>G & H · A love to last a lifetime</span><a href="/">Kembali ke undangan <ArrowUpRight size={13} /></a></footer></main>
    </div>
    <dialog ref={addDialog} className="admin-dialog"><div className="dialog-heading"><div><span className="eyebrow">ONE MORE SPECIAL PERSON</span><h2>Tambah tamu</h2></div><button className="icon-button" aria-label="Tutup" onClick={() => addDialog.current.close()}><X size={20} /></button></div><form onSubmit={addGuest}><label>Nama tamu<input name="name" placeholder="Bapak Budi dan Ibu Sari" required maxLength={150} /></label><label>Nomor WhatsApp <span>(opsional)</span><input name="phone" type="tel" placeholder="081234567890" maxLength={20} /></label><label>Grup<input name="group" placeholder="Keluarga / Sahabat / Teman kerja" maxLength={80} /></label><button type="submit" className="button button-blue"><Plus size={16} /> Tambahkan tamu</button></form></dialog>
    <dialog ref={importDialog} className="admin-dialog import-dialog"><div className="dialog-heading"><div><span className="eyebrow">A QUICK CHECK</span><h2>Pratinjau impor</h2></div><button className="icon-button" aria-label="Tutup" onClick={() => importDialog.current.close()}><X size={20} /></button></div><p><FileSpreadsheet size={16} /> {importName} · {pending.length} tamu ditemukan</p><div className="import-preview">{pending.slice(0, 5).map((g, i) => <div key={i}><strong>{g.name}</strong><span>{g.group}</span></div>)}</div>{pending.length > 5 && <p>Dan {pending.length - 5} tamu lainnya.</p>}<small>Nama dan nomor yang sama akan dilewati. Daftar lama tetap tersimpan.</small><button className="button button-blue" onClick={commitImport}><Check size={16} /> Impor {pending.length} tamu</button></dialog>
  </div>;
}

function HeartMark() { return <span className="heart-mark" aria-hidden="true">♡</span>; }
function CameraMark() { return <Image size={26} strokeWidth={1} />; }
