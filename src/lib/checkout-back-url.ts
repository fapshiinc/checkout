/** Merchant return URL from initiate-pay — show “back” only for normal web pages. */
export function parseWebBackUrl(raw?: string | null): URL | null {
  const value = raw?.trim();
  if (!value) return null;

  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url;
  } catch {
    return null;
  }
}

export function webBackUrlHost(url: URL): string {
  return url.hostname.replace(/^www\./i, "");
}
