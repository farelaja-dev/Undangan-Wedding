import Papa from 'papaparse';

export function normalizePhone(value = '') {
  const digits = String(value).replace(/\D/g, '');
  if (!digits) return '';
  return digits.startsWith('0') ? `62${digits.slice(1)}` : digits;
}

const reservedPaths = new Set(['admin', 'assets', 'photos', 'optimized', 'audio', 'decor', 'api']);

export function guestNameFromLocation({ pathname = '/', search = '' } = {}) {
  // Keep previously shared ?to= links working and preserve unusual spelling.
  const explicit = new URLSearchParams(search).get('to')?.trim().slice(0, 150);
  if (explicit) return explicit;
  let slug;
  try { slug = decodeURIComponent(pathname).replace(/^\/|\/$/g, ''); }
  catch { return 'Tamu Undangan'; }
  if (!slug || reservedPaths.has(slug.toLowerCase()) || !/^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u.test(slug)) return 'Tamu Undangan';
  return slug.split('-').map(word => word.charAt(0).toLocaleUpperCase('id') + word.slice(1).toLocaleLowerCase('id')).join(' ').slice(0, 150);
}

export function invitationUrl(base, name) {
  const url = new URL(base);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Gunakan alamat website http atau https.');
  const displayName = name.trim().slice(0, 150);
  if (!displayName) throw new Error('Nama tamu wajib diisi.');
  let slug = displayName.normalize('NFKD').replace(/\p{M}/gu, '').toLocaleLowerCase('id').replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '') || 'tamu';
  if (reservedPaths.has(slug)) slug = `tamu-${slug}`;
  url.pathname = `/${slug}`;
  url.search = '';
  url.hash = '';
  if (guestNameFromLocation(url) !== displayName) url.searchParams.set('to', displayName);
  return url.toString();
}

export function parseGuests(csv) {
  const result = Papa.parse(csv.replace(/^\uFEFF/, ''), {
    header: true, skipEmptyLines: 'greedy', transformHeader: h => h.trim().toLowerCase(),
  });
  if (!result.meta.fields?.includes('nama')) throw new Error('CSV harus memiliki kolom "nama". Gunakan template yang tersedia.');
  if (result.errors.length) throw new Error(`CSV tidak valid pada baris ${(result.errors[0].row ?? 0) + 2}: pastikan tanda kutip dan jumlah kolom sesuai.`);
  const guests = result.data.map(row => ({
    name: String(row.nama || '').trim().slice(0, 150),
    phone: normalizePhone(row.telepon || ''),
    group: String(row.grup || 'Umum').trim().slice(0, 80) || 'Umum',
  })).filter(row => row.name);
  if (!guests.length) throw new Error('Tidak ada nama tamu di dalam CSV.');
  if (guests.length > 5000) throw new Error('Maksimal 5.000 tamu untuk sekali impor.');
  return guests;
}

export function mergeGuests(existing, incoming, idFactory = () => crypto.randomUUID()) {
  const key = guest => `${guest.name.toLocaleLowerCase('id')}|${guest.phone}`;
  const seen = new Set(existing.map(key));
  const added = incoming.filter(guest => {
    if (seen.has(key(guest))) return false;
    seen.add(key(guest));
    return true;
  }).map(guest => ({ ...guest, id: idFactory() }));
  return { guests: [...existing, ...added], added: added.length, skipped: incoming.length - added.length };
}

export function exportGuests(guests, base) {
  return '\uFEFF' + Papa.unparse(guests.map(guest => ({
    nama: guest.name, telepon: guest.phone, grup: guest.group, link: invitationUrl(base, guest.name),
  })), { escapeFormulae: true });
}

export function whatsappUrl(phone, text) {
  return `https://wa.me/${normalizePhone(phone)}?text=${encodeURIComponent(text)}`;
}

export function downloadFile(content, filename, type = 'text/csv;charset=utf-8;') {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
