const API_BASE =
  (import.meta.env.VITE_STOCKS_API_BASE || "https://intriguedmutts-stocks.ryanedavis.workers.dev")
    .replace(/\/+$/, "");

async function safeJson(res) {
  const text = await res.text();
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new Error(`Expected JSON, got ${contentType}. First chars: ${text.slice(0,80)}`);
  }
  return JSON.parse(text);
}
export async function getOptionsHeatmap() {
  const res = await fetch(`${API_BASE}/options-heatmap`);
  const json = await safeJson(res);
  if (!json.ok) throw new Error("Failed to fetch options heatmap");
  return json.optionsHeatmap;
}
export async function getQuote(symbol = "AAPL") {
  const url = `${API_BASE}/quote?symbol=${encodeURIComponent(symbol)}`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Worker error ${res.status}: ${text}`);
  }
  return safeJson(res);
}

export async function getWatchlist() {
  const url = `${API_BASE}/watchlist`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Worker error ${res.status}: ${text}`);
  }
  return safeJson(res);
}

export async function fetchHeatmap() {
  const r = await fetch(`${API_BASE}/heatmap`);
  if (!r.ok) {
    throw new Error("Heatmap fetch failed");
  }
  return safeJson(r);
}
