export function formatDateBR(value?: string | null): string {
  if (!value) return '';
  // Expecting ISO-like date 'YYYY-MM-DD' or full ISO. Fallback to Date parse.
  const iso = value.length >= 10 ? value.substring(0, 10) : value;
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) {
    const dt = new Date(value);
    if (isNaN(dt.getTime())) return value;
    const dd = String(dt.getDate()).padStart(2, '0');
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const yyyy = String(dt.getFullYear());
    return `${dd}/${mm}/${yyyy}`;
  }
  const dd = String(d).padStart(2, '0');
  const mm = String(m).padStart(2, '0');
  const yyyy = String(y);
  return `${dd}/${mm}/${yyyy}`;
}

export function decodeHtmlEntities(value?: string | null): string {
  if (!value) return '';
  let result = value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
  // Numeric entities (decimal and hex)
  result = result.replace(/&#(\d+);/g, (_, d) =>
    String.fromCharCode(Number(d))
  );
  result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, h) =>
    String.fromCharCode(parseInt(h, 16))
  );
  return result;
}

export function normalizeForSearch(value?: string | null): string {
  if (!value) return '';
  return value
    .toString()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}
