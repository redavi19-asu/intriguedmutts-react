import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Success() {
  const loc = useLocation();

  const token = useMemo(() => {
    // Works with HashRouter: https://site.com/#/success?token=XYZ
    return new URLSearchParams(loc.search).get("token") || "";
  }, [loc.search]);

  // Prefer env vars, but allow fallback to your legacy key patterns if needed
  const WORKER_BASE = (import.meta.env.VITE_WORKER_BASE ||
    "https://mutts-paypal.ryanedavis.workers.dev"
  ).replace(/\/$/, "");

  const API_KEY =
    import.meta.env.VITE_WORKER_API_KEY ||
    window.MUTTS_WORKER_API_KEY ||
    localStorage.getItem("mutts_worker_api_key") ||
    "";

  const [badge, setBadge] = useState({ kind: "loading", text: "Finalizing your payment..." });
  const [record, setRecord] = useState(null);
  const [capture, setCapture] = useState(null);
  const [err, setErr] = useState("");
  const [debugOpen, setDebugOpen] = useState(false);

  const currency = useMemo(() => {
    const c =
      record?.currency ||
      capture?.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.currency_code ||
      "USD";
    return c || "USD";
  }, [record, capture]);

  function money(v, ccy = currency) {
    const n = Number(v || 0);
    return `${ccy} ${n.toFixed(2)}`;
  }

  function safe(obj, path, fallback = null) {
    try {
      return path.split(".").reduce((o, k) => (o && o[k] != null ? o[k] : null), obj) ?? fallback;
    } catch {
      return fallback;
    }
  }

  function renderAddress(addr) {
    if (!addr) return "—";
    const parts = [
      addr.address_line_1 || addr.address1,
      addr.address_line_2 || addr.address2,
      addr.admin_area_2 || addr.city,
      addr.admin_area_1 || addr.state_code || addr.state,
      addr.postal_code || addr.zip,
      addr.country_code || addr.country,
    ].filter(Boolean);
    return parts.join(", ");
  }

  async function captureOrder(orderId) {
    const res = await fetch(`${WORKER_BASE}/paypal/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(API_KEY ? { "X-API-KEY": API_KEY } : {}),
      },
      body: JSON.stringify({ orderId }),
    });

    const data = await res.json().catch(() => null);
    if (!res.ok || !data || !data.ok) {
      const msg = data?.error ? data.error : `${res.status} ${res.statusText}`;
      throw new Error(msg);
    }
    return data; // { ok:true, record, capture }
  }

  useEffect(() => {
    let alive = true;

    async function boot() {
      setErr("");
      setRecord(null);
      setCapture(null);

      if (!token) {
        setBadge({ kind: "fail", text: "Missing PayPal token in URL" });
        setErr("No token found. Try returning from checkout again.");
        return;
      }

      try {
        setBadge({ kind: "loading", text: "Finalizing your payment..." });
        const data = await captureOrder(token);

        if (!alive) return;

        const rec = data.record || {};
        const cap = data.capture || {};

        setRecord(rec);
        setCapture(cap);

        const ok = String(rec.status || "").toUpperCase().includes("COMPLET");
        setBadge({
          kind: ok ? "ok" : "fail",
          text: ok ? "Payment completed" : `Payment status: ${rec.status || "UNKNOWN"}`,
        });
      } catch (e) {
        if (!alive) return;
        console.error(e);
        setBadge({ kind: "fail", text: "Could not finalize payment (capture failed)" });
        setErr(String(e?.message || e));
      }
    }

    boot();
    return () => {
      alive = false;
    };
  }, [token]); // run when token changes

  const orderId =
    record?.orderId ||
    safe(capture, "id", "") ||
    token ||
    "—";

  const payStatus =
    record?.status ||
    safe(capture, "status", "—") ||
    "—";

  const paidVal =
    safe(record, "totals.paidTotal", null) ||
    safe(capture, "purchase_units.0.payments.captures.0.amount.value", null) ||
    safe(record, "totals.total", null);

  const buyerEmail =
    safe(record, "payer.email", null) ||
    safe(capture, "payer.email_address", null) ||
    safe(capture, "payment_source.paypal.email_address", null) ||
    "—";

  const shipName =
    safe(record, "shipping.name", null) ||
    safe(record, "paypalShipping.name", null) ||
    safe(capture, "purchase_units.0.shipping.name.full_name", null);

  const shipAddr =
    safe(record, "shipping.address", null) ||
    safe(record, "paypalShipping.address", null) ||
    safe(capture, "purchase_units.0.shipping.address", null);

  const shipTo = shipName
    ? `${shipName}\n${renderAddress(shipAddr)}`
    : renderAddress(shipAddr);

  const items = Array.isArray(record?.items) ? record.items : [];

  const subtotal = safe(record, "totals.subtotal", null);
  const ship = safe(record, "totals.shipping", null);
  const tax = safe(record, "totals.tax", null);
  const total = safe(record, "totals.total", null) || paidVal;

  const subtotalLine = useMemo(() => {
    let s = "";
    if (subtotal != null) s += `Subtotal ${money(subtotal)}`;
    if (ship != null) s += `${s ? " • " : ""}Shipping ${money(ship)}`;
    if (tax != null) s += `${s ? " • " : ""}Tax ${money(tax)}`;
    return s || "Subtotal —";
  }, [subtotal, ship, tax, currency]);

  const base = import.meta.env.BASE_URL || "/";
  const bgUrl = `${base}legacy/merchbackground.png`; // change if your file lives elsewhere

  const debugJson = JSON.stringify({ record, capture }, null, 2);

  async function copyOrderId() {
    try {
      await navigator.clipboard.writeText(String(orderId || ""));
      // small UX: temporarily update badge
      setBadge((b) => (b.kind === "ok" ? { ...b, text: "Order ID copied ✅" } : b));
      setTimeout(() => {
        setBadge((b) => (b.kind === "ok" ? { ...b, text: "Payment completed" } : b));
      }, 900);
    } catch {
      alert("Copy failed. Order ID: " + String(orderId || ""));
    }
  }

  return (
    <div className="successRoot" style={{ "--bg-url": `url('${bgUrl}')` }}>
      <style>{css}</style>

      <div className="shell">
        <h1 className="brand">INTRIGUED MUTTS SOCIETY</h1>
        <div className="sub">Payment receipt</div>

        <div className="card">
          <div
            id="statusBadge"
            className={[
              "badge",
              badge.kind === "ok" ? "ok" : "",
              badge.kind === "fail" ? "fail" : "",
            ].join(" ")}
          >
            <span id="badgeIcon">{badge.kind === "ok" ? "✅" : badge.kind === "fail" ? "⚠️" : "⏳"}</span>
            <span id="badgeText">{badge.text}</span>
          </div>

          <div className="hr" />

          <div className="row">
            <div>
              <div className="kv">
                <div>Order ID</div><div id="orderId">{orderId || "—"}</div>
                <div>Payment Status</div><div id="payStatus">{payStatus || "—"}</div>
                <div>Paid Total</div><div id="paidTotal">{paidVal ? money(paidVal) : "—"}</div>
              </div>
            </div>

            <div>
              <div className="kv">
                <div>Buyer Email</div><div id="buyerEmail">{buyerEmail || "—"}</div>
                <div>Ship To</div>
                <div id="shipTo" style={{ whiteSpace: "pre-wrap" }}>
                  {shipTo || "—"}
                </div>
              </div>
            </div>
          </div>

          <div className="hr" />

          <div style={{ fontWeight: 1000, marginBottom: 10 }}>Items</div>
          <div id="items" className="items">
            {badge.kind === "loading" ? (
              <div style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.70)" }}>
                <div className="spinner" />
                <div>Loading receipt details…</div>
              </div>
            ) : err ? (
              <div style={{ color: "rgba(255,255,255,0.75)" }}>
                Something went wrong while finalizing your receipt.<br />
                <span style={{ color: "rgba(255,105,180,0.95)", fontWeight: 900 }}>Error:</span> {err}
              </div>
            ) : !items.length ? (
              <div style={{ color: "rgba(255,255,255,0.75)" }}>No item details found in receipt.</div>
            ) : (
              items.map((it, idx) => {
                const qty = Number(it.qty || 1);
                const unit = Number(it.unitPrice || 0);
                const line = unit * qty;
                return (
                  <div className="item" key={idx}>
                    <img src={it.imageUrl || ""} alt="" />
                    <div>
                      <div className="name">{it.productName || "Item"}</div>
                      <div className="meta">{it.variantName || ""}</div>
                      <div className="meta">
                        Unit: {money(unit)} • Qty: {qty}
                      </div>
                    </div>
                    <div className="price">{money(line)}</div>
                  </div>
                );
              })
            )}
          </div>

          <div className="hr" />

          <div className="totals">
            <div>
              <div className="small" id="subtotalText">{subtotalLine}</div>
            </div>
            <div className="totalBig">
              <div className="label">Total</div>
              <div className="amt" id="totalText">{total != null ? money(total) : "—"}</div>
            </div>
          </div>

          <div className="toggle" id="toggleDebug" onClick={() => setDebugOpen((v) => !v)}>
            {debugOpen ? "▼ Debug details (optional)" : "▶ Debug details (optional)"}
          </div>

          <pre id="debugBox" style={{ display: debugOpen ? "block" : "none" }}>
            {debugJson}
          </pre>

          <div className="btnRow">
            <Link className="btn" to="/merch">← Back to Merch</Link>
            <Link className="btn" to="/society">← Back to Clubhouse</Link>
            <button className="btn secondary" id="copyBtn" onClick={copyOrderId}>
              Copy Order ID
            </button>
          </div>

          <div className="footer">© 2026 Intrigued Mutts Society. All rights reserved.</div>
        </div>
      </div>
    </div>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Luckiest+Guy&display=swap');

:root{
  --blue:#3aa0ff;
  --green:#35d07f;
  --red:#ff4d6d;
  --glass: rgba(17,17,17,0.55);
  --line: rgba(255,255,255,0.10);
  --muted: rgba(255,255,255,0.70);
}

.successRoot{
  min-height:100vh;
  margin:0;
  color:#fff;
  font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;
  background:
    radial-gradient(1200px 900px at 15% 10%, rgba(58,160,255,0.18), transparent 55%),
    linear-gradient(rgba(0,0,0,.70),rgba(0,0,0,.70)),
    var(--bg-url) center/cover no-repeat fixed;
}

.shell{max-width:1100px;margin:0 auto;padding:28px 18px}
.brand{
  font-family:"Luckiest Guy", system-ui;
  font-size:42px;
  letter-spacing:1px;
  margin:0;
  text-transform:uppercase;
}
.sub{margin:6px 0 18px;color:var(--muted)}
.card{
  border:1px solid rgba(58,160,255,0.55);
  border-radius:18px;
  padding:18px;
  background:var(--glass);
  backdrop-filter: blur(12px);
  box-shadow:0 30px 90px rgba(0,0,0,0.75);
}
.row{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:14px}
@media (max-width: 800px){ .row{grid-template-columns:1fr} .brand{font-size:34px} }

.badge{
  display:inline-flex;align-items:center;gap:10px;
  padding:10px 14px;border-radius:999px;
  border:1px solid rgba(58,160,255,0.7);
  box-shadow:0 0 18px rgba(58,160,255,0.28);
  font-weight:900;
  background:rgba(0,0,0,0.35);
}
.badge.ok{border-color: rgba(53,208,127,0.9); box-shadow:0 0 18px rgba(53,208,127,0.22);}
.badge.fail{border-color: rgba(255,77,109,0.9); box-shadow:0 0 18px rgba(255,77,109,0.22);}

.hr{height:1px;background:rgba(255,255,255,0.08);margin:16px 0}
.kv{
  display:grid;grid-template-columns:200px 1fr;gap:8px 12px;
  font-size:14px;
}
.kv div:nth-child(odd){color:var(--muted)}
.kv div:nth-child(even){font-weight:800}
@media (max-width: 520px){ .kv{grid-template-columns:1fr} }

.items{margin-top:10px;display:flex;flex-direction:column;gap:10px;}
.item{
  display:grid;grid-template-columns:72px 1fr auto;gap:12px;
  padding:12px;border:1px solid rgba(255,255,255,0.10);border-radius:14px;
  background:rgba(0,0,0,0.25);
}
.item img{
  width:72px;height:72px;border-radius:14px;object-fit:cover;border:1px solid rgba(255,255,255,0.12);
  background:#111;
}
.name{font-weight:950}
.meta{color:var(--muted);font-size:13px;margin-top:4px}
.price{font-weight:950}

.totals{margin-top:12px;display:flex;justify-content:space-between;align-items:flex-end;gap:10px;flex-wrap:wrap;}
.totalBig{text-align:right;}
.totalBig .label{color:var(--muted);font-size:12px}
.totalBig .amt{font-size:20px;font-weight:1000}
.small{font-size:12px;color:var(--muted);line-height:1.35}

.btnRow{display:flex;gap:12px;flex-wrap:wrap;margin-top:14px}
.btn{
  border:1px solid rgba(58,160,255,0.9);
  background:transparent;
  color:#fff;
  padding:12px 16px;
  border-radius:12px;
  font-weight:900;
  cursor:pointer;
  text-decoration:none;
  box-shadow:0 0 14px rgba(58,160,255,0.28);
  transition:transform .15s ease, box-shadow .15s ease, background .15s ease;
}
.btn:hover{transform:translateY(-2px);box-shadow:0 0 18px rgba(58,160,255,0.42);background:rgba(58,160,255,0.06)}
.btn:active{transform:translateY(0)}
.btn.secondary{border-color: rgba(255,255,255,0.25); box-shadow:none}
.btn.secondary:hover{background:rgba(255,255,255,0.06); box-shadow:none}

.toggle{cursor:pointer;user-select:none;margin-top:12px;color:rgba(58,160,255,0.95);font-weight:900;}
pre{
  margin-top:10px;
  padding:12px;
  border-radius:14px;
  background:rgba(0,0,0,0.35);
  border:1px solid rgba(255,255,255,0.10);
  overflow:auto;
  font-size:12px;
}
.footer{margin-top:14px;color:var(--muted);font-size:12px;}
.spinner{
  width:34px;height:34px;border-radius:50%;
  border:3px solid rgba(58,160,255,0.18);
  border-top-color: var(--blue);
  animation:spin 1s linear infinite;
}
@keyframes spin{to{transform:rotate(360deg)}}
`;
