// Intrigued Mutts PayPal/Printful Worker. Production PayPal endpoint.
// Required secrets: PAYPAL_CLIENT_ID, PAYPAL_SECRET, PRINTFUL_API_KEY,
// CART_TOKEN_SECRET, PAYPAL_WEBHOOK_ID. Required KV binding: ORDERS.
// Capture requires the per-order receipt token; public cart tokens only
// authorize estimates and order creation. Prices resolve from Printful.
const PAYPAL_API_BASE = "https://api-m.paypal.com";


/**
 * Point PayPal return/cancel pages at the LIVE domain (front-end).
 * PayPal API still uses sandbox base above.
 */
const SITE_BASE = "https://redavi19-asu.github.io/intriguedmutts-react";
const RETURN_URL = `${SITE_BASE}/#/success`;
const CANCEL_URL = `${SITE_BASE}/#/cancel`;

// IMPORTANT: Origin header is scheme+host+port (NO path)
const ALLOWED_ORIGINS = new Set([
  "https://redavi19-asu.github.io",
  "https://www.intriguedmutts.com",
  "https://intriguedmutts.com",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5500",
  "http://127.0.0.1:5500",
]);

function isAllowedOrigin(origin) {
  if (!origin) return false;
  try {
    const u = new URL(origin);

    // Exact allowlist
    if (ALLOWED_ORIGINS.has(origin)) return true;

    // Codespaces preview e.g. https://xxx.app.github.dev
    if (u.hostname.endsWith(".app.github.dev")) return true;

    return false;
  } catch {
    return false;
  }
}

// CORS for browser calls.
// If Origin is missing (curl/server-to-server), allow "*".
function corsHeaders(origin = "") {
  if (!origin) {
    return {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-API-KEY, Authorization",
    };
  }

  const allowed = isAllowedOrigin(origin) ? origin : "null";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-API-KEY, Authorization",
    "Vary": "Origin",
  };
}

function nowIso() {
  return new Date().toISOString();
}

function safeJsonParse(str) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

function json(data, status = 200, origin = "") {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", ...corsHeaders(origin) },
  });
}

// --- auth helpers ---

function readBearerToken(request) {
  const h = (request.headers.get("Authorization") || "").trim();
  if (!h.toLowerCase().startsWith("bearer ")) return "";
  return h.slice(7).trim();
}

function requireLegacyApiKey(request, env) {
  const expected = (env.API_KEY || "").trim();
  if (!expected) {
    // Legacy not configured — treat as unavailable rather than failing hard
    return { ok: false, status: 401, error: "Unauthorized" };
  }
  const key = (request.headers.get("X-API-KEY") || "").trim();
  if (!key || key !== expected) return { ok: false, status: 401, error: "Unauthorized" };
  return { ok: true };
}

// HMAC signed short-lived token: payloadB64.signatureB64
async function signToken(secret, payloadObj) {
  const enc = new TextEncoder();
  const payload = JSON.stringify(payloadObj);
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
  const payloadB64 = btoa(payload);
  return `${payloadB64}.${sigB64}`;
}

async function verifyToken(secret, token) {
  if (!token || !token.includes(".")) return null;
  const [payloadB64, sigB64] = token.split(".");
  if (!payloadB64 || !sigB64) return null;

  let payloadStr;
  try {
    payloadStr = atob(payloadB64);
  } catch {
    return null;
  }

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );

  let sigBytes;
  try {
    sigBytes = Uint8Array.from(atob(sigB64), (c) => c.charCodeAt(0));
  } catch {
    return null;
  }

  const ok = await crypto.subtle.verify("HMAC", key, sigBytes, enc.encode(payloadStr));
  if (!ok) return null;

  const obj = safeJsonParse(payloadStr);
  if (!obj || !obj.exp) return null;
  if (Date.now() > Number(obj.exp)) return null;
  return obj;
}

// Browser route guard:
// - checks Origin allowlist (including Codespaces preview)
// - enforces JSON + POST
function guardBrowserRequest(request, origin) {
  if (origin && !isAllowedOrigin(origin)) {
    return { ok: false, status: 403, error: "Forbidden (origin not allowed)" };
  }
  if (request.method !== "POST") {
    return { ok: false, status: 405, error: "Method Not Allowed" };
  }
  const ct = request.headers.get("Content-Type") || "";
  if (!ct.includes("application/json")) {
    return { ok: false, status: 415, error: "JSON required" };
  }
  return { ok: true };
}

// Unified auth for locked routes:
// - Prefer cart token (Bearer)
// - Fallback to legacy X-API-KEY (optional)
async function requireAuth(request, env) {
  const token = readBearerToken(request);
  if (token) {
    const secret = (env.CART_TOKEN_SECRET || "").trim();
    if (!secret) return { ok: false, status: 500, error: "Missing CART_TOKEN_SECRET secret on Worker" };
    const session = await verifyToken(secret, token);
    if (session) return { ok: true, mode: "token", session };
    return { ok: false, status: 401, error: "Invalid/expired cart token" };
  }

  const legacy = requireLegacyApiKey(request, env);
  if (legacy.ok) return { ok: true, mode: "apiKey", session: null };

  return legacy;
}

// ------------------ PayPal helpers ------------------

async function getAccessToken(env) {
  const clientId = env.PAYPAL_CLIENT_ID;
  const secret = env.PAYPAL_SECRET;

  if (!clientId || !secret) throw new Error("Missing PAYPAL_CLIENT_ID or PAYPAL_SECRET secret");

  const auth = btoa(`${clientId}:${secret}`);

  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const text = await res.text();
  if (!res.ok) throw new Error(`PayPal token error (${res.status})`);

  const data = JSON.parse(text);
  return data.access_token;
}

// ------------------ KV helpers ------------------

async function kvPut(env, key, obj, ttlSeconds = null) {
  if (!env.ORDERS) return;
  const options = ttlSeconds ? { expirationTtl: ttlSeconds } : undefined;
  await env.ORDERS.put(key, JSON.stringify(obj), options);
}

async function kvGet(env, key) {
  if (!env.ORDERS) return null;
  const val = await env.ORDERS.get(key);
  return val ? safeJsonParse(val) : null;
}

// Normalize incoming cart lines
function normalizeItems(body) {
  const items = body.items || body.cart || [];
  if (!Array.isArray(items)) return [];

  return items
    .map((it) => {
      const qty = Math.max(1, Number(it.qty || 1));
      const unit = Number(it.unitPrice || it.unit_price || 0);

      const syncVariantId = it.syncVariantId ?? it.sync_variant_id ?? null;
      const catalogVariantId =
        it.catalogVariantId ?? it.catalog_variant_id ?? it.variant_id ?? it.variantId ?? null;

      return {
        productId: it.productId || it.product_id || null,

        syncVariantId: syncVariantId != null ? Number(syncVariantId) : null,
        catalogVariantId: catalogVariantId != null ? Number(catalogVariantId) : null,

        productName: it.productName || it.product_name || "Item",
        variantName: it.variantName || it.variant_name || "",
        imageUrl: it.imageUrl || it.image_url || "",
        unitPrice: Number.isFinite(unit) ? unit.toFixed(2) : "0.00",
        qty,
        lineTotal: (Number.isFinite(unit) ? unit * qty : 0).toFixed(2),
      };
    })
    .filter((it) => it.qty > 0);
}

// Resolve every retail price from the authenticated merchant catalog.
async function resolveRetailItems(env, body) {
  const raw = body.items || body.cart;
  if (!Array.isArray(raw) || !raw.length || raw.length > 50) throw new Error("Invalid cart");
  if (body.currency && body.currency !== "USD") throw new Error("Unsupported currency");
  if (raw.some(it => !it || !Number.isSafeInteger(Number(it.qty)) || Number(it.qty) < 1 || Number(it.qty) > 99)) throw new Error("Invalid quantity");
  const items = normalizeItems(body);
  for (const item of items) {
    if (!Number.isSafeInteger(item.qty) || item.qty < 1 || item.qty > 99 ||
        !Number.isSafeInteger(item.syncVariantId) || item.syncVariantId < 1) throw new Error("Invalid cart item");
    const data = await printfulRequest(env, `/store/variants/${item.syncVariantId}`);
    const variant = data?.result;
    const price = Number(variant?.retail_price);
    if (!variant || variant.is_ignored || variant.synced === false || Number(variant.id) !== item.syncVariantId || !Number.isFinite(price) || price <= 0 ||
        (variant.currency && variant.currency !== "USD")) throw new Error("Unavailable retail variant");
    item.unitPrice = price.toFixed(2);
    item.lineTotal = (price * item.qty).toFixed(2);
    item.variantName = variant.name || "";
  }
  return items;
}
function publicRecord(record) {
  const { successToken, ...receipt } = record;
  return receipt;
}

// =======================================================
// SHIPPING NORMALIZATION + VALIDATION
// =======================================================

function normalizeShipping(shipping) {
  if (!shipping || typeof shipping !== "object") return null;

  const addr = (shipping.address && typeof shipping.address === "object") ? shipping.address : {};

  const address1 =
    addr.address_line_1 ||
    addr.address1 ||
    shipping.address_line_1 ||
    shipping.address1 ||
    "";

  const address2 =
    addr.address_line_2 ||
    addr.address2 ||
    shipping.address_line_2 ||
    shipping.address2 ||
    "";

  const city =
    addr.admin_area_2 ||
    addr.city ||
    shipping.admin_area_2 ||
    shipping.city ||
    "";

  const state =
    addr.admin_area_1 ||
    addr.state_code ||
    addr.state ||
    shipping.admin_area_1 ||
    shipping.state_code ||
    shipping.state ||
    "";

  const zip =
    addr.postal_code ||
    addr.zip ||
    shipping.postal_code ||
    shipping.zip ||
    "";

  const country =
    addr.country_code ||
    addr.country ||
    shipping.country_code ||
    shipping.country ||
    "US";

  const name = (shipping.name || shipping.full_name || "").toString().trim();
  const phone = (shipping.phone || addr.phone || shipping.phone_number || "").toString().trim();

  return {
    ...shipping,
    name,
    phone,
    address: {
      ...addr,
      address_line_1: address1,
      address_line_2: address2,
      admin_area_2: city,
      admin_area_1: state,
      postal_code: zip,
      country_code: country,
    },
  };
}

function missingShippingFields(shipping) {
  const s = normalizeShipping(shipping);
  if (!s) return ["shipping"];

  const a = s.address || {};
  const missing = [];

  if (!String(s.name || "").trim()) missing.push("name");
  if (!String(a.address_line_1 || "").trim()) missing.push("address1");
  if (!String(a.admin_area_2 || "").trim()) missing.push("city");
  if (!String(a.admin_area_1 || "").trim()) missing.push("state");
  if (!String(a.postal_code || "").trim()) missing.push("zip");
  if (!String(a.country_code || "").trim()) missing.push("country");
  if (!String(s.phone || "").trim()) missing.push("phone");

  return missing;
}

// =======================================================
// SUCCESS TOKEN (FOR SUCCESS PAGE)
// =======================================================
function makeSuccessToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
}

// ------------------ Printful helpers ------------------

const PRINTFUL_API_BASE = "https://api.printful.com";

function toPrintfulRecipient(shipping) {
  const normalized = normalizeShipping(shipping) || {};
  const addr = normalized.address || {};

  const fullName = (normalized?.name || "Customer").trim();
  const parts = fullName.split(/\s+/).filter(Boolean);
  const first_name = parts[0] || "Customer";
  const last_name = parts.slice(1).join(" ") || "Customer";

  const phone = (normalized?.phone || addr.phone || "").toString().trim();

  return {
    name: fullName,
    first_name,
    last_name,
    address1: addr.address_line_1 || addr.address1 || "",
    address2: addr.address_line_2 || addr.address2 || "",
    city: addr.admin_area_2 || addr.city || "",
    state_code: addr.admin_area_1 || addr.state_code || addr.state || "",
    country_code: addr.country_code || addr.country || "US",
    zip: addr.postal_code || addr.zip || "",
    phone: phone || undefined,
  };
}

async function printfulRequest(env, path, method = "GET", body = null) {
  const token = (env.PRINTFUL_API_KEY || "").trim();
  if (!token) throw new Error("Missing PRINTFUL_API_KEY secret");

  const res = await fetch(`${PRINTFUL_API_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : null,
  });

  const text = await res.text();
  const data = safeJsonParse(text);

  if (!res.ok) throw new Error(`Printful request failed (${res.status})`);
  return data ?? { raw: text };
}

async function estimatePrintfulCosts(env, items, shipping) {
  const pfItems = items.map((it, idx) => {
    if (!it.syncVariantId) throw new Error(`Item ${idx} missing syncVariantId for Printful estimate`);
    return { sync_variant_id: Number(it.syncVariantId), quantity: Number(it.qty || 1) };
  });

  const payload = { recipient: toPrintfulRecipient(shipping), items: pfItems };
  const res = await printfulRequest(env, "/orders/estimate-costs", "POST", payload);

  const costs = res?.result?.costs;
  if (!costs) throw new Error("Printful estimate missing costs");

  return {
    subtotal: Number(costs.subtotal || 0).toFixed(2),
    shipping: Number(costs.shipping || 0).toFixed(2),
    tax: Number(costs.tax || 0).toFixed(2),
    total: Number(costs.total || 0).toFixed(2),
    currency: costs.currency || "USD",
    raw: costs,
  };
}


// Retail sales tax belongs to the storefront sale, not Printful's
// separate fulfillment transaction. Shipping is separately stated.
const RETAIL_SALES_TAX_RATES = Object.freeze({
  MD: 0.06,
});

function calculateRetailSalesTax(retailSubtotal, shipping) {
  const normalized = normalizeShipping(shipping);
  const country = String(normalized?.address?.country_code || "US").trim().toUpperCase();
  const state = String(normalized?.address?.admin_area_1 || "").trim().toUpperCase();

  if (country !== "US") return "0.00";

  const rate = Number(RETAIL_SALES_TAX_RATES[state] || 0);
  const subtotalCents = Math.max(0, Math.round(Number(retailSubtotal || 0) * 100));
  const taxCents = Math.round(subtotalCents * rate);
  return (taxCents / 100).toFixed(2);
}

async function createPrintfulOrderFromRecord(env, record) {
  const rawItems = record.items || [];

  const items = rawItems.map((it, idx) => {
    const syncId = Number(it.syncVariantId);
    if (!syncId || !Number.isFinite(syncId)) {
      throw new Error(`Item ${idx}: Missing syncVariantId. Cart must include syncVariantId.`);
    }
    return { sync_variant_id: syncId, quantity: Number(it.qty || 1) };
  });

  if (!items.length) throw new Error("No items to fulfill");

  const recipient = toPrintfulRecipient(record.shipping);
  const autoConfirm = String(env.PRINTFUL_AUTO_CONFIRM || "").toLowerCase() === "true";

  const payload = {
    recipient,
    items,
    external_id: `mutts-${record.orderId}`,
    confirm: autoConfirm,
  };

  return await printfulRequest(env, "/orders", "POST", payload);
}

// ------------------ PayPal webhook verification ------------------

async function verifyPayPalWebhookSignature(request, env, webhookEventObj) {
  const webhookId = (env.PAYPAL_WEBHOOK_ID || "").trim();
  if (!webhookId) return { ok: false, error: "Missing PAYPAL_WEBHOOK_ID" };

  const transmissionId = request.headers.get("PayPal-Transmission-Id");
  const transmissionTime = request.headers.get("PayPal-Transmission-Time");
  const certUrl = request.headers.get("PayPal-Cert-Url");
  const authAlgo = request.headers.get("PayPal-Auth-Algo");
  const transmissionSig = request.headers.get("PayPal-Transmission-Sig");

  if (!transmissionId || !transmissionTime || !certUrl || !authAlgo || !transmissionSig) {
    return { ok: false, error: "Missing PayPal signature headers" };
  }

  const accessToken = await getAccessToken(env);

  const payload = {
    auth_algo: authAlgo,
    cert_url: certUrl,
    transmission_id: transmissionId,
    transmission_sig: transmissionSig,
    transmission_time: transmissionTime,
    webhook_id: webhookId,
    webhook_event: webhookEventObj,
  };

  const res = await fetch(`${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  if (!res.ok) return { ok: false, error: `Verify call failed (${res.status}): ${text}` };

  const data = safeJsonParse(text) || {};
  const status = data.verification_status || "UNKNOWN";
  return { ok: status === "SUCCESS", status, raw: data };
}

function extractOrderIdFromWebhook(event) {
  const related = event?.resource?.supplementary_data?.related_ids;
  return related?.order_id || related?.checkout_order_id || null;
}

function extractCustomIdFromWebhook(event) {
  return event?.resource?.custom_id || null;
}

// =======================================================
// WORKER
// =======================================================

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";

    // --------- OPTIONS ----------
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    // ---------- HEALTH ----------
    if (request.method === "GET" && url.pathname === "/health") {
      return json(
        {
          ok: true,
          worker: "mutts-paypal",
          sandbox: PAYPAL_API_BASE.includes("sandbox"),
          hasKV: Boolean(env.ORDERS),
          returnUrl: RETURN_URL,
          cancelUrl: CANCEL_URL,
          time: nowIso(),
          printfulAutoConfirm: String(env.PRINTFUL_AUTO_CONFIRM || "").toLowerCase() === "true",
        },
        200,
        origin
      );
    }

    // =======================================================
    // CART TOKEN (BROWSER)
    // POST /cart/start
    // =======================================================
    if (request.method === "POST" && url.pathname === "/cart/start") {
      const guard = guardBrowserRequest(request, origin);
      if (!guard.ok) return json({ ok: false, error: guard.error }, guard.status, origin);

      const secret = (env.CART_TOKEN_SECRET || "").trim();
      if (!secret) return json({ ok: false, error: "Missing CART_TOKEN_SECRET" }, 500, origin);

      const cartToken = await signToken(secret, {
        iat: Date.now(),
        exp: Date.now() + 10 * 60 * 1000, // 10 minutes
      });

      return json({ ok: true, cartToken }, 200, origin);
    }

    // =======================================================
    // PAYPAL CLIENT ID (BROWSER)
    // GET /paypal/client-id
    // GET /paypal/client_id (alias)
    // =======================================================
    if (
      request.method === "GET" &&
      (url.pathname === "/paypal/client-id" || url.pathname === "/paypal/client_id")
    ) {
      if (origin && !isAllowedOrigin(origin)) {
        return json({ ok: false, error: "Forbidden (origin not allowed)" }, 403, origin);
      }

      const clientId = (env.PAYPAL_CLIENT_ID || "").trim();
      if (!clientId) return json({ ok: false, error: "Missing PAYPAL_CLIENT_ID" }, 500, origin);

      return json({ ok: true, clientId }, 200, origin);
    }

    // =======================================================
    // PAYPAL WEBHOOK (PUBLIC)
    // POST /api/paypal/webhook
    // =======================================================
    if (request.method === "POST" && url.pathname === "/api/paypal/webhook") {
      const rawBody = await request.text();
      const event = safeJsonParse(rawBody);
      if (!event) return new Response("Invalid JSON", { status: 400 });

      try {
        const verify = await verifyPayPalWebhookSignature(request, env, event);
        if (!verify.ok) return new Response(`Invalid signature: ${verify.status || verify.error}`, { status: 401 });
      } catch (err) {
        return new Response(`Verify error: ${String(err.message || err)}`, { status: 401 });
      }

      const eventId = event.id;
      if (!eventId) return new Response("Missing event id", { status: 400 });

      // de-dupe webhooks
      if (env.ORDERS) {
        const seen = await env.ORDERS.get(`pp:event:${eventId}`);
        if (seen) return new Response("OK (duplicate)", { status: 200 });
        await env.ORDERS.put(`pp:event:${eventId}`, "1", { expirationTtl: 60 * 60 * 24 * 14 });
      }

      const type = event.event_type || "UNKNOWN";
      const resource = event.resource || {};

      ctx?.waitUntil?.(
        (async () => {
          try {
            if (!env.ORDERS) return;

            if (type === "PAYMENT.CAPTURE.COMPLETED") {
              const captureId = resource.id || null;
              const captureStatus = resource.status || "COMPLETED";
              const orderId = extractOrderIdFromWebhook(event);
              const customId = extractCustomIdFromWebhook(event);

              if (orderId) {
                const existing = (await kvGet(env, `order:${orderId}`)) || {};
                const updated = {
                  ...existing,
                  orderId,
                  updatedAt: nowIso(),
                  webhook: {
                    lastEventId: eventId,
                    lastEventType: type,
                    lastEventTime: event.create_time || nowIso(),
                  },
                  captureId: existing.captureId || captureId,
                  captureStatus: existing.captureStatus || captureStatus,
                  status: "COMPLETED",
                };

                await kvPut(env, `order:${orderId}`, updated);
                if (customId) await kvPut(env, `internal:${customId}`, updated);

                // Auto-fulfill in Printful if not yet created
                if (!updated.printfulOrderId) {
                  try {
                    const pf = await createPrintfulOrderFromRecord(env, updated);
                    const printfulOrderId = pf?.result?.id || null;
                    const printfulStatus = pf?.result?.status || null;

                    const merged = {
                      ...updated,
                      printfulOrderId,
                      printful: {
                        createdAt: nowIso(),
                        orderId: printfulOrderId,
                        status: printfulStatus,
                        confirm: String(env.PRINTFUL_AUTO_CONFIRM || "").toLowerCase() === "true",
                      },
                      printfulError: null,
                    };

                    await kvPut(env, `order:${orderId}`, merged);
                    if (customId) await kvPut(env, `internal:${customId}`, merged);
                  } catch (e) {
                    const msg = String(e.message || e);
                    console.log("Printful create order error:", msg);

                    const merged = { ...updated, printfulOrderId: null, printful: null, printfulError: msg };
                    await kvPut(env, `order:${orderId}`, merged);
                    if (customId) await kvPut(env, `internal:${customId}`, merged);
                  }
                }
              }

              if (captureId) {
                await kvPut(env, `pp:capture:${captureId}`, {
                  eventId,
                  type,
                  captureId,
                  captureStatus,
                  orderId: orderId || null,
                  customId: customId || null,
                  receivedAt: nowIso(),
                  raw: event,
                });
              }
            } else {
              await kvPut(env, `pp:eventlog:${eventId}`, {
                eventId,
                type,
                receivedAt: nowIso(),
                raw: event,
              });
            }
          } catch (e) {
            console.log("Webhook processing error:", String(e.message || e));
          }
        })()
      );

      return new Response("OK", { status: 200 });
    }

    // =======================================================
    // STORE API (PUBLIC)
    // =======================================================

    if (request.method === "GET" && url.pathname === "/api/health") {
      return json({ ok: true, service: "mutts-paypal", storeApi: true, time: nowIso() }, 200, origin);
    }

    if (request.method === "GET" && url.pathname === "/api/store/stores") {
      try {
        const data = await printfulRequest(env, "/stores", "GET");
        return json(data, 200, origin);
      } catch (e) {
        return json({ ok: false, error: String(e.message || e) }, 500, origin);
      }
    }

    if (request.method === "GET" && url.pathname === "/api/store/products") {
      try {
        const data = await printfulRequest(env, "/store/products", "GET");
        return json(data, 200, origin);
      } catch (e) {
        return json({ ok: false, error: String(e.message || e) }, 500, origin);
      }
    }

    if (request.method === "GET" && url.pathname.startsWith("/api/store/products/")) {
      try {
        const id = url.pathname.split("/").pop();
        if (!id) return json({ ok: false, error: "Missing product id" }, 400, origin);

        const data = await printfulRequest(env, `/store/products/${id}`, "GET");
        return json(data, 200, origin);
      } catch (e) {
        return json({ ok: false, error: String(e.message || e) }, 500, origin);
      }
    }

    // =======================================================
    // ESTIMATE TOTALS (BROWSER, AUTH)
    // POST /paypal/estimate
    // =======================================================
    if (request.method === "POST" && url.pathname === "/paypal/estimate") {
      const guard = guardBrowserRequest(request, origin);
      if (!guard.ok) return json({ ok: false, error: guard.error }, guard.status, origin);

      const auth = await requireAuth(request, env);
      if (!auth.ok) return json({ ok: false, error: auth.error }, auth.status, origin);

      try {
        const body = await request.json().catch(() => ({}));
        const currency = (body.currency || "USD").toString();

        const items = await resolveRetailItems(env, body);
        if (!items.length) return json({ ok: false, error: "Cart is empty (items[] missing)" }, 400, origin);

        const badIdx = items.findIndex((it) => !it.syncVariantId);
        if (badIdx !== -1) {
          return json(
            {
              ok: false,
              error: `Item ${badIdx} missing syncVariantId.`,
              itemsPreview: items.map((x) => ({
                productId: x.productId,
                syncVariantId: x.syncVariantId,
                catalogVariantId: x.catalogVariantId,
                variantName: x.variantName,
              })),
            },
            400,
            origin
          );
        }

        const shipping = normalizeShipping(body.shipping || null);
        const missing = missingShippingFields(shipping);
        if (missing.length) {
          return json({ ok: false, error: "Shipping incomplete", missingFields: missing }, 400, origin);
        }

        const pfTotals = await estimatePrintfulCosts(env, items, shipping);

        const retailSubtotal = items.reduce((sum, it) => sum + Number(it.unitPrice) * it.qty, 0);
        const shippingCost = Number(pfTotals.shipping);
        const taxCost = Number(calculateRetailSalesTax(retailSubtotal, shipping));
        const computedTotal = (retailSubtotal + shippingCost + taxCost).toFixed(2);

        const totals = {
          subtotal: retailSubtotal.toFixed(2),
          shipping: shippingCost.toFixed(2),
          tax: taxCost.toFixed(2),
          total: computedTotal,
          currency: pfTotals.currency || currency,
        };

        return json({ ok: true, totals, printfulEstimate: pfTotals }, 200, origin);
      } catch (err) {
        return json({ ok: false, error: String(err.message || err) }, 500, origin);
      }
    }

    // =======================================================
    // CREATE ORDER (BROWSER, AUTH)
    // POST /paypal/order
    // =======================================================
    if (request.method === "POST" && url.pathname === "/paypal/order") {
      const guard = guardBrowserRequest(request, origin);
      if (!guard.ok) return json({ ok: false, error: guard.error }, guard.status, origin);

      const auth = await requireAuth(request, env);
      if (!auth.ok) return json({ ok: false, error: auth.error }, auth.status, origin);

      try {
        const body = await request.json().catch(() => ({}));
        const currency = (body.currency || "USD").toString();

        const items = await resolveRetailItems(env, body);
        if (!items.length) return json({ ok: false, error: "Cart is empty (items[] missing)" }, 400, origin);

        const badIdx = items.findIndex((it) => !it.syncVariantId);
        if (badIdx !== -1) {
          return json(
            {
              ok: false,
              error: `Item ${badIdx} missing syncVariantId.`,
              itemsPreview: items.map((x) => ({
                productId: x.productId,
                syncVariantId: x.syncVariantId,
                catalogVariantId: x.catalogVariantId,
                variantName: x.variantName,
              })),
            },
            400,
            origin
          );
        }

        const shipping = normalizeShipping(body.shipping || null);
        const missing = missingShippingFields(shipping);
        if (missing.length) {
          return json({ ok: false, error: "Shipping incomplete", missingFields: missing }, 400, origin);
        }

        const pfTotals = await estimatePrintfulCosts(env, items, shipping);

        // Retail subtotal from cart (what customer sees)
        const retailSubtotal = items.reduce((sum, it) => sum + Number(it.unitPrice) * it.qty, 0);

        // Printful supplies shipping only. Retail tax is calculated on the storefront sale.
        const shippingCost = Number(pfTotals.shipping);
        const taxCost = Number(calculateRetailSalesTax(retailSubtotal, shipping));

        const finalTotal = (retailSubtotal + shippingCost + taxCost).toFixed(2);

        const totals = {
          subtotal: retailSubtotal.toFixed(2),
          shipping: shippingCost.toFixed(2),
          tax: taxCost.toFixed(2),
          total: finalTotal,
        };

        if (!env.ORDERS) throw new Error("Order storage unavailable");
        const internalId = crypto.randomUUID();

        // ✅ success token stored in KV; sent back in return_url as ?st=
        const successToken = makeSuccessToken();
        const returnUrlWithToken = `${RETURN_URL}?st=${encodeURIComponent(successToken)}`;

        const accessToken = await getAccessToken(env);

        const orderRes = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            intent: "CAPTURE",
            purchase_units: [
              {
                custom_id: internalId,
                amount: { currency_code: currency, value: totals.total },
              },
            ],
            application_context: {
              return_url: returnUrlWithToken,
              cancel_url: CANCEL_URL,
            },
          }),
        });

        const text = await orderRes.text();
        if (!orderRes.ok) throw new Error(`Order create error (${orderRes.status})`);

        const order = JSON.parse(text);
        const approve = (order.links || []).find((l) => l.rel === "approve");

        const record = {
          orderId: order.id,
          internalId,
          successToken,
          createdAt: nowIso(),
          updatedAt: nowIso(),
          status: order.status || "CREATED",
          currency,
          totals,
          items,
          payer: null,
          shipping,
          captureId: null,
          captureStatus: null,
          webhook: { lastEventId: null, lastEventType: null, lastEventTime: null },
          printfulOrderId: null,
          printful: null,
          printfulError: null,
          printfulEstimate: pfTotals,
        };

        if (order?.id) {
          await kvPut(env, `order:${order.id}`, record, 60 * 60 * 24 * 14);
          await kvPut(env, `internal:${internalId}`, record, 60 * 60 * 24 * 14);
        }

        return json(
          {
            ok: true,
            id: order.id,
            status: order.status,
            approveUrl: approve?.href || null,
            returnUrl: returnUrlWithToken,
            cancelUrl: CANCEL_URL,
            totals,
            internalId,
            // Receipt token is carried only by the PayPal return URL.
          },
          200,
          origin
        );
      } catch (err) {
        return json({ ok: false, error: String(err.message || err) }, 500, origin);
      }
    }

    // =======================================================
    // SUCCESS PAGE CAPTURE (TOKEN-LOCKED)
    // POST /paypal/success-capture
    // Body: { orderId, token }
    // - No Authorization header required
    // - Requires matching successToken stored in KV
    // =======================================================
    if (request.method === "POST" && url.pathname === "/paypal/success-capture") {
      const guard = guardBrowserRequest(request, origin);
      if (!guard.ok) return json({ ok: false, error: guard.error }, guard.status, origin);

      try {
        const body = await request.json().catch(() => ({}));
        const orderId = String(body.orderId || "").trim();
        const token = String(body.token || "").trim();

        if (!orderId) return json({ ok: false, error: "Missing orderId" }, 400, origin);
        if (!token) return json({ ok: false, error: "Missing token" }, 400, origin);

        const existing = await kvGet(env, `order:${orderId}`);
        if (!existing) return json({ ok: false, error: "Unknown orderId" }, 404, origin);

        if (!existing.successToken || existing.successToken !== token) {
          return json({ ok: false, error: "Invalid success token" }, 401, origin);
        }

        if (existing.status === "COMPLETED") return json({ ok: true, record: publicRecord(existing) }, 200, origin);
        // Perform capture
        const accessToken = await getAccessToken(env);

        const captureRes = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json", "PayPal-Request-Id": `capture-${orderId}` },
        });

        const text = await captureRes.text();
        if (!captureRes.ok) throw new Error(`Capture error (${captureRes.status})`);

        const capture = JSON.parse(text);
        const pu = capture.purchase_units?.[0];
        const capObj = pu?.payments?.captures?.[0];

        const payer = {
          email: capture?.payer?.email_address || capture?.payment_source?.paypal?.email_address || null,
          name: capture?.payer?.name
            ? `${capture.payer.name.given_name || ""} ${capture.payer.name.surname || ""}`.trim()
            : null,
          payerId: capture?.payer?.payer_id || capture?.payment_source?.paypal?.account_id || null,
        };

        const paypalShipping = {
          name: pu?.shipping?.name?.full_name || null,
          address: pu?.shipping?.address || null,
        };

        const record = {
          ...existing,
          orderId,
          updatedAt: nowIso(),
          status: capObj?.status === "COMPLETED" ? "COMPLETED" : (capObj?.status || capture.status || "UNKNOWN"),
          payer,
          shipping: existing.shipping?.address ? existing.shipping : paypalShipping,
          paypalShipping,
          captureId: capObj?.id || null,
          captureStatus: capObj?.status || null,
          currency: capObj?.amount?.currency_code || existing.currency || null,
          totals: { ...(existing.totals || {}), paidTotal: capObj?.amount?.value || existing?.totals?.total || null },
        };

        await kvPut(env, `order:${orderId}`, record, 60 * 60 * 24 * 14);
        if (record?.internalId) await kvPut(env, `internal:${record.internalId}`, record, 60 * 60 * 24 * 14);

        return json({ ok: true, status: record.status, record: publicRecord(record) }, 200, origin);
      } catch (err) {
        return json({ ok: false, error: String(err.message || err) }, 500, origin);
      }
    }

    // =======================================================
    // CAPTURE ORDER (BROWSER)
    // POST /paypal/capture
    //
    // Accepts either:
    //  A) Authorization: Bearer <cartToken> or X-API-KEY
    //  B) Success-token body { orderId, token } (for success page redirect)
    // =======================================================
    if (request.method === "POST" && url.pathname === "/paypal/capture") {
      const guard = guardBrowserRequest(request, origin);
      if (!guard.ok) return json({ ok: false, error: guard.error }, guard.status, origin);

      const body = await request.json().catch(() => ({}));
      const orderId = String(body.orderId || "").trim();
      const successToken = String(body.token || "").trim();

      if (!orderId) return json({ ok: false, error: "Missing orderId" }, 400, origin);

      const existing = await kvGet(env, `order:${orderId}`);
      if (!existing || !successToken || existing.successToken !== successToken) {
        return json({ ok: false, error: "Unauthorized" }, 401, origin);
      }
      if (existing.status === "COMPLETED") return json({ ok: true, record: publicRecord(existing) }, 200, origin);

      try {
        const accessToken = await getAccessToken(env);

        const captureRes = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json", "PayPal-Request-Id": `capture-${orderId}` },
        });

        const text = await captureRes.text();
        if (!captureRes.ok) throw new Error(`Capture error (${captureRes.status})`);

        const capture = JSON.parse(text);
        const pu = capture.purchase_units?.[0];
        const capObj = pu?.payments?.captures?.[0];

        const existing = (await kvGet(env, `order:${orderId}`)) || {};

        const payer = {
          email: capture?.payer?.email_address || capture?.payment_source?.paypal?.email_address || null,
          name: capture?.payer?.name
            ? `${capture.payer.name.given_name || ""} ${capture.payer.name.surname || ""}`.trim()
            : null,
          payerId: capture?.payer?.payer_id || capture?.payment_source?.paypal?.account_id || null,
        };

        const paypalShipping = {
          name: pu?.shipping?.name?.full_name || null,
          address: pu?.shipping?.address || null,
        };

        const record = {
          ...existing,
          orderId,
          updatedAt: nowIso(),
          status: capObj?.status === "COMPLETED" ? "COMPLETED" : (capObj?.status || capture.status || "UNKNOWN"),
          payer,
          shipping: existing.shipping?.address ? existing.shipping : paypalShipping,
          paypalShipping,
          captureId: capObj?.id || null,
          captureStatus: capObj?.status || null,
          currency: capObj?.amount?.currency_code || existing.currency || null,
          totals: { ...(existing.totals || {}), paidTotal: capObj?.amount?.value || existing?.totals?.total || null },
        };

        await kvPut(env, `order:${orderId}`, record, 60 * 60 * 24 * 14);
        if (record?.internalId) await kvPut(env, `internal:${record.internalId}`, record, 60 * 60 * 24 * 14);

        return json({ ok: true, status: record.status, record: publicRecord(record) }, 200, origin);
      } catch (err) {
        return json({ ok: false, error: String(err.message || err) }, 500, origin);
      }
    }

    // ---------- 404 ----------
    return json({ ok: false, error: "Not Found" }, 404, origin);
  },
};

