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

/**
 * Formata uma string de dígitos NCM inserindo pontos.
 * Padrão principal adotado: 4-2-2 (NNNN.NN.NN). Alternativo: 2-2-2-2 (NN.NN.NN.NN)
 * Aceita comprimentos parciais (vai inserindo pontos conforme disponível) e limita a 8 dígitos.
 */
export function formatNCMCodeByPattern(
  raw?: string | null,
  pattern: '4-2-2' | '2-2-2-2' = '4-2-2'
): string {
  if (!raw) return '';
  const digits = raw.toString().replace(/\D/g, '').slice(0, 8);
  if (!digits) return '';

  if (pattern === '4-2-2') {
    const a = digits.slice(0, 4);
    const b = digits.slice(4, 6);
    const c = digits.slice(6, 8);
    return [a, b, c].filter(Boolean).join('.');
  }

  // pattern === '2-2-2-2'
  const p1 = digits.slice(0, 2);
  const p2 = digits.slice(2, 4);
  const p3 = digits.slice(4, 6);
  const p4 = digits.slice(6, 8);
  return [p1, p2, p3, p4].filter(Boolean).join('.');
}

/**
 * Gera termos de busca a partir do input do usuário, considerando variações com e sem pontos.
 * Retorna uma lista única de termos relevantes (lowercase, sem acentos já é tratado em normalizeForSearch se for texto).
 */
export function buildCodeSearchTerms(input?: string | null): string[] {
  if (!input) return [];
  const trimmed = input.toString().trim();
  if (!trimmed) return [];

  const hasLetter = /[a-zA-Z]/.test(trimmed);
  const hasDot = /\./.test(trimmed);
  const onlyDigits = /^\d+$/.test(trimmed);

  const terms = new Set<string>();

  // Sempre considerar o próprio input
  terms.add(trimmed);

  if (onlyDigits || (!hasLetter && !hasDot)) {
    const t422 = formatNCMCodeByPattern(trimmed, '4-2-2');
    const t2222 = formatNCMCodeByPattern(trimmed, '2-2-2-2');
    if (t422) terms.add(t422);
    if (t2222) terms.add(t2222);
  }

  return Array.from(terms);
}
