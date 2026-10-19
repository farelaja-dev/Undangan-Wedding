import { test } from 'node:test';
import assert from 'node:assert/strict';
import { exportGuests, invitationUrl, guestNameFromLocation, mergeGuests, normalizePhone, parseGuests, whatsappUrl } from '../src/lib/guests.js';

test('imports CSV from Excel with BOM, quoted commas, multiline fields and Indonesian phone numbers', () => {
  const result = parseGuests('\uFEFFnama,telepon,grup\r\n"Rizky, S.Kom.",0812-3456-7890,Teman kerja\r\n"Budi\ndan keluarga",,Keluarga');
  assert.deepEqual(result[0], { name: 'Rizky, S.Kom.', phone: '6281234567890', group: 'Teman kerja' });
  assert.equal(result[1].name, 'Budi\ndan keluarga');
});
test('supports semicolon delimiters and ignores blank names', () => {
  const result = parseGuests(' Nama ;Telepon;Grup\nSari;08123456789;Sahabat\n;;\n  ;;');
  assert.equal(result.length, 1);
  assert.equal(result[0].name, 'Sari');
});
test('rejects missing name header, broken quotes, empty data and excessive guest counts', () => {
  assert.throws(() => parseGuests('name,phone\nBudi,0812'), /kolom "nama"/);
  assert.throws(() => parseGuests('nama,telepon\n"Budi,0812'), /tidak valid/);
  assert.throws(() => parseGuests('nama,telepon\n,'), /Tidak ada nama/);
  assert.throws(() => parseGuests('nama,telepon\n' + Array(5001).fill('Budi,0812').join('\n')), /5.000/);
});
test('deduplicates both existing guests and repeated names within an import', () => {
  const existing = [{ id: 'old', name: 'Budi', phone: '62812', group: 'Keluarga' }];
  const result = mergeGuests(existing, [
    { name: 'budi', phone: '62812', group: 'Kerja' },
    { name: 'Sari', phone: '', group: 'Umum' },
    { name: 'Sari', phone: '', group: 'Umum' },
    { name: 'Budi', phone: '62813', group: 'Kerja' },
  ], () => 'new');
  assert.equal(result.added, 2);
  assert.equal(result.skipped, 2);
  assert.equal(result.guests[0].group, 'Keluarga');
  assert.equal(existing.length, 1);
});
test('creates safely encoded personal links without admin path, stale queries or anchors', () => {
  const name = 'Bapak Budi & Ibu Sari + Keluarga / ♥';
  const link = new URL(invitationUrl('https://example.vercel.app/admin?old=1#test', name));
  assert.equal(link.pathname, '/');
  assert.equal(guestNameFromLocation(link), name);
  assert.equal(link.searchParams.get('to'), name);
  assert.equal(link.searchParams.has('old'), false);
  assert.equal(link.hash, '');
  assert.throws(() => invitationUrl('javascript:alert(1)', name), /http/);
});

test('generates query-only links and preserves older path links', () => {
  const link = new URL(invitationUrl('https://example.com/admin?old=1', 'Pak Halim'));
  assert.equal(link.href, 'https://example.com/?to=Pak+Halim');
  assert.equal(guestNameFromLocation(link), 'Pak Halim');
  assert.equal(guestNameFromLocation({ pathname: '/ibu-sari/' }), 'Ibu Sari');
  assert.equal(guestNameFromLocation({ search: '?to=H.%20Halim%2C%20S.T.' }), 'H. Halim, S.T.');
  for (const name of ['Admin', 'Photos', 'Dr. HALIM', 'José', 'Pak Halim & Istri', '王小明']) {
    const url = new URL(invitationUrl('https://example.com', name));
    assert.equal(guestNameFromLocation(url), name);
    assert.notEqual(url.pathname, '/admin');
    assert.notEqual(url.pathname, '/photos');
  }
  assert.equal(guestNameFromLocation({ pathname: '/' }), 'Tamu Undangan');
  assert.equal(guestNameFromLocation({ pathname: '/%E0%A4%A' }), 'Tamu Undangan');
  assert.equal(guestNameFromLocation({ pathname: '/a/b' }), 'Tamu Undangan');
  assert.throws(() => invitationUrl('https://example.com', ' '), /Nama tamu/);
});
test('export round-trips unicode, quotes and commas and contains a usable invitation URL', () => {
  const guests = [{ name: 'Budi "Pak", S.T. ♥', phone: '62812', group: 'Keluarga' }];
  const csv = exportGuests(guests, 'https://example.vercel.app');
  assert.deepEqual(parseGuests(csv), guests);
  assert.ok(csv.includes('https://example.vercel.app/'));
});
test('exports dangerous spreadsheet formulas as text', () => {
  const csv = exportGuests([{ name: '=HYPERLINK("bad")', phone: '', group: '+SUM(1,1)' }], 'https://example.com');
  assert.ok(csv.includes("'=HYPERLINK"));
  assert.ok(csv.includes("'+SUM"));
});
test('normalizes phone numbers and encodes WhatsApp messages', () => {
  assert.equal(normalizePhone('+62 812-3456'), '628123456');
  assert.equal(normalizePhone('0812 3456'), '628123456');
  assert.equal(normalizePhone(''), '');
  const link = new URL(whatsappUrl('08123456789', 'Haidar & Gita\nSelamat!'));
  assert.equal(link.pathname, '/628123456789');
  assert.equal(link.searchParams.get('text'), 'Haidar & Gita\nSelamat!');
});
