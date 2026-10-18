import { useEffect, useRef, useState } from 'react';
import { Heart, Send } from 'lucide-react';
import { getWishes, sendWish, wishesConfigured, PAGE_SIZE } from '../lib/wishes';

const dateFormat = new Intl.DateTimeFormat('id-ID', {
  dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Jakarta',
});

function WishMessage({ message }) {
  const [expanded, setExpanded] = useState(false);
  const canCollapse = message.length > 140 || message.split('\n').length > 3;
  return <>
    <p className={canCollapse && !expanded ? 'wish-message-collapsed' : ''}>{message}</p>
    {canCollapse && <button className="wish-read-more" type="button" aria-expanded={expanded} onClick={() => setExpanded(value => !value)}>{expanded ? 'Ringkas ucapan' : 'Baca selengkapnya'}</button>}
  </>;
}

export default function GuestWishes({ guest }) {
  const [wishes, setWishes] = useState([]);
  const [name, setName] = useState(guest === 'Tamu Undangan' ? '' : guest);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);
  const listHeading = useRef(null);
  const busy = useRef(false);
  const submitting = useRef(false);
  const alive = useRef(false);

  function showPage(rows, nextPage) {
    setPage(nextPage);
    setHasMore(rows.length > PAGE_SIZE);
    setWishes(rows.slice(0, PAGE_SIZE));
  }

  async function load(nextPage = 0, scroll = false) {
    if (!wishesConfigured || busy.current || submitting.current) return;
    busy.current = true;
    setLoading(true);
    setError('');
    try {
      const rows = await getWishes(nextPage * PAGE_SIZE);
      if (!alive.current) return;
      showPage(rows, nextPage);
      if (scroll) listHeading.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
    } catch (err) {
      if (alive.current) setError(err.message);
    } finally {
      busy.current = false;
      if (alive.current) setLoading(false);
    }
  }

  useEffect(() => {
    alive.current = true;
    load();
    return () => { alive.current = false; };
  }, []);

  async function submit(event) {
    event.preventDefault();
    if (submitting.current || busy.current) return;
    submitting.current = true;
    setSending(true);
    setFormError('');
    setSuccess('');
    try {
      const wish = await sendWish(name, message);
      if (!alive.current) return;
      // A successful insert stays successful even if refreshing the list fails.
      showPage([wish], 0);
      setError('');
      setMessage('');
      setSuccess('Terima kasih! Ucapanmu sudah tampil untuk semua tamu.');
      try {
        const rows = await getWishes();
        if (alive.current) showPage(rows, 0);
      } catch {
        if (alive.current) setError('Ucapanmu tersimpan. Daftar ucapan lain belum dapat dimuat; tekan Perbarui.');
      }
    } catch (err) {
      if (alive.current) setFormError(err.message);
    } finally {
      submitting.current = false;
      if (alive.current) setSending(false);
    }
  }

  return <div className="guest-wishes" aria-labelledby="wishes-title">
    <Heart size={24} strokeWidth={1.3} aria-hidden="true" />
    <h3 id="wishes-title">Ucapan & doa</h3>
    <p>Rangkai doa baik untuk perjalanan kami.<br />Ucapanmu dapat dibaca oleh semua tamu.</p>
    <form className="lux-rsvp-form wishes-form" onSubmit={submit}>
      <label>Nama untuk ucapan<input value={name} onChange={e => setName(e.target.value)} autoComplete="name" required maxLength={150} disabled={!wishesConfigured || sending} /></label>
      <label>Tulis ucapan<textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Semoga selalu berbahagia, Gita & Haidar..." required maxLength={1000} rows={4} disabled={!wishesConfigured || sending} /></label>
      <small>Nama dan ucapan akan tampil di undangan. Tidak perlu login.</small>
      <button className="lux-button" disabled={!wishesConfigured || sending || loading} type="submit"><Send size={15} />{sending ? 'Mengirim ucapan...' : 'Kirim ucapan'}</button>
      {!wishesConfigured && <p role="status">Kolom ucapan segera dibuka.</p>}
      {formError && <p role="alert">{formError}</p>}
      {success && <p role="status">{success}</p>}
    </form>
    {wishesConfigured && <>
      <div className="wishes-toolbar" ref={listHeading}><h4>Doa dari orang tersayang</h4><button type="button" disabled={loading || sending} onClick={() => load()}>Perbarui</button></div>
      {error && <p role="alert">{error} <button type="button" disabled={loading || sending} onClick={() => load(page)}>Coba lagi</button></p>}
      {loading && <p role="status">Memuat ucapan...</p>}
      {!loading && !error && !wishes.length && <p>{page === 0 ? 'Jadilah yang pertama menitipkan doa untuk kami.' : 'Tidak ada ucapan di halaman ini. Kembali ke halaman sebelumnya.'}</p>}
      <ul className="wishes-list" aria-busy={loading}>{wishes.map(wish => <li key={wish.id}>
        <strong>{wish.name}</strong>
        <time dateTime={wish.created_at}>{dateFormat.format(new Date(wish.created_at))} WIB</time>
        <WishMessage message={wish.message} />
      </li>)}</ul>
      {(hasMore || page > 0) && <div className="wishes-pagination" role="group" aria-label="Halaman ucapan">
        <button type="button" disabled={loading || sending || page === 0} onClick={() => load(page - 1, true)}>Sebelumnya</button>
        <span role="status">Halaman {page + 1}</span>
        <button type="button" disabled={loading || sending || !hasMore} onClick={() => load(page + 1, true)}>Berikutnya</button>
      </div>}
    </>}
  </div>;
}
