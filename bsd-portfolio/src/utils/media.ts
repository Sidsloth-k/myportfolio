const API_URL = (() => {
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_API_URL) {
      return (import.meta as any).env.VITE_API_URL as string;
    }
  } catch {}
  try {
    if (typeof process !== 'undefined' && (process as any)?.env?.REACT_APP_API_URL) {
      return (process as any).env.REACT_APP_API_URL as string;
    }
  } catch {}
  return '';
})();

export const getBackendOrigin = (): string | null => {
  try {
    if (!API_URL) return null;
    const api = new URL(API_URL);
    return `${api.protocol}//${api.host}`;
  } catch {
    return null;
  }
};

export const resolveMediaUrl = (maybeUrl: string | undefined | null): string => {
  const url = (maybeUrl || '').trim();
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  const origin = getBackendOrigin();
  const cleaned = url.replace(/^\/*/, '').replace(/^uploads\/?/, 'uploads/');
  if (origin) return `${origin}/${cleaned}`;
  return `/uploads/${cleaned.replace(/^uploads\/?/, '')}`;
};


