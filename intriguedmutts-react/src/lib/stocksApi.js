const WORKER_BASE = "https://intriguedmutts-stocks.ryanedavis.workers.dev";

export async function getQuote(symbol = "AAPL") {
  const url = `${WORKER_BASE}/quote?symbol=${encodeURIComponent(symbol)}`;

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Worker error ${res.status}: ${text}`);
  }
  return res.json();
}
