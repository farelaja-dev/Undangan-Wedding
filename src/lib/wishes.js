const projectUrl = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
const publicKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';
export const wishesConfigured = Boolean(projectUrl && publicKey);
export const PAGE_SIZE = 5;

async function request(query, options = {}) {
  if (!wishesConfigured) throw new Error('Ucapan belum tersedia. Silakan coba lagi nanti.');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(`${projectUrl}/rest/v1/wedding_wishes${query}`, {
      ...options,
      signal: controller.signal,
      headers: { apikey: publicKey, 'Content-Type': 'application/json', ...options.headers },
    });
    if (!response.ok) throw new Error('Ucapan belum dapat diproses. Silakan coba lagi.');
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError' || error instanceof TypeError) {
      throw new Error('Koneksi terputus. Periksa internet lalu coba lagi.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export function getWishes(offset = 0) {
  // Fetch one extra row to know whether another page exists.
  return request(`?select=id,name,message,created_at&order=created_at.desc,id.desc&limit=${PAGE_SIZE + 1}&offset=${offset}`);
}

export async function sendWish(name, message) {
  name = name.trim();
  message = message.trim();
  if (!name || name.length > 150 || !message || message.length > 1000) {
    throw new Error('Isi nama (maksimal 150 karakter) dan ucapan (maksimal 1.000 karakter).');
  }
  const rows = await request('?select=id,name,message,created_at', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ name, message }),
  });
  return rows[0];
}
