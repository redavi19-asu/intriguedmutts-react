// ✅ Close product modal with Escape
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  const modalBackEl = document.getElementById("modalBack");
  if (modalBackEl && getComputedStyle(modalBackEl).display !== "none") {
    modalBackEl.style.display = "none";
  }
});
// ✅ Close product modal when clicking the backdrop (safe: won't redeclare)
(() => {
  const modalBackEl = document.getElementById("modalBack");
  if (!modalBackEl) return;

  modalBackEl.addEventListener("click", (e) => {
    if (e.target === modalBackEl) {
      modalBackEl.style.display = "none";
    }
  });
})();
// ...removed duplicate and broken event handler assignments; all event binding is now handled in bindLegacyButtons() below...
function waitFor(id) {
  return new Promise(resolve => {
    const i = setInterval(() => {
      const el = document.getElementById(id);
      if (el) {
        clearInterval(i);
        resolve(el);
      }
    }, 50);
  });
}
const WORKER_BASE = "https://mutts-paypal.ryanedavis.workers.dev".replace(/\/$/, "");
const STORE_API_BASE = WORKER_BASE;

// ===============================
// 2) PayPal Worker (for payment)
// ===============================
const PAYPAL_WORKER_BASE = WORKER_BASE;

// Token-based auth (no hardcoded secrets)

// ===============================
// CART TOKEN MANAGEMENT
// ===============================
const CART_TOKEN_KEY = "mutts_cart_token_v1";

async function getCartToken() {
  const res = await fetchWithTimeout(`${PAYPAL_WORKER_BASE}/cart/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  }, 10000);

  const data = await res.json();
  if (!data.ok || !data.cartToken) throw new Error(data.error || "Failed to start cart session");

  localStorage.setItem(CART_TOKEN_KEY, data.cartToken);
  return data.cartToken;
}

async function authHeaders() {
  let token = localStorage.getItem(CART_TOKEN_KEY);
  if (!token) token = await getCartToken();

  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };
}

// Timeout helper
function fetchWithTimeout(url, options = {}, timeoutMs = 10000) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), timeoutMs)
    )
  ]);
}

const USE_MOCK_DATA = false; // Set true for offline testing

const grid = document.getElementById("grid");
const statusText = document.getElementById("statusText");
const refreshBtn = document.getElementById("refreshBtn");
const shippingBtn = document.getElementById("shippingBtn");

const modalBack = document.getElementById("modalBack");
const modalTitle = document.getElementById("modalTitle");
const modalImg = document.getElementById("modalImg");
const modalBuyBtn = document.getElementById("modalBuyBtn");
const closeModal = document.getElementById("closeModal");
const variantList = document.getElementById("variantList");
const variantNote = document.getElementById("variantNote");

// Cart drawer DOM
const cartBack = document.getElementById("cartBack");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartItemsEl = document.getElementById("cartItems");
const cartSubtotalEl = document.getElementById("cartSubtotal");
const cartProdSubtotalEl = document.getElementById("cartProdSubtotal");
const cartShipEl = document.getElementById("cartShip");
const cartTaxEl = document.getElementById("cartTax");
const cartTotalEl = document.getElementById("cartTotal");
const paypalTotalNote = document.getElementById("paypalTotalNote");
const checkoutBtn = document.getElementById("checkoutBtn");
const editShippingFromCartBtn = document.getElementById("editShippingFromCartBtn");
const shipStatusPill = document.getElementById("shipStatusPill");

// Lightbox elements
const lightboxBack = document.getElementById("lightboxBack");
const lightboxImg = document.getElementById("lightboxImg");

// Shipping modal elements
const shipBack = document.getElementById("shipBack");
const shipCloseBtn = document.getElementById("shipCloseBtn");
const shipClearBtn = document.getElementById("shipClearBtn");
const shipSaveBtn = document.getElementById("shipSaveBtn");
const shipSaveAndCheckoutBtn = document.getElementById("shipSaveAndCheckoutBtn");
const shipModePill = document.getElementById("shipModePill");

const shipName = document.getElementById("shipName");
const shipPhone = document.getElementById("shipPhone");
const shipAddress1 = document.getElementById("shipAddress1");
const shipAddress2 = document.getElementById("shipAddress2");
const shipCity = document.getElementById("shipCity");
const shipState = document.getElementById("shipState");
const shipZip = document.getElementById("shipZip");
const shipCountry = document.getElementById("shipCountry");

// We will inject a Cart button into the header actions container
const headerRight = document.querySelector(".topActions") || document.querySelector(".topBar");
let cartBtn;

// Ensure browser back navigates to clubhouse landing
function redirectToClubhouse(){
  window.location.href = "./index.html#mancave";
}
history.pushState({ page: "merch" }, "", window.location.href);
window.addEventListener("popstate", () => redirectToClubhouse());

// ===============================
// State
// ===============================
let allProducts = [];
let activeProduct = null;
const variantCache = {}; // Cache variants by product ID

// ===============================
// CART (localStorage)
// ===============================
const CART_KEY = "mutts_cart_v1";

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
  updateShippingPills();
}

function cartCount(cart = getCart()) {
  return cart.reduce((sum, it) => sum + (Number(it.qty) || 0), 0);
}

function money(n) {
  const v = Number(n || 0);
  return "$" + v.toFixed(2);
}

function calcSubtotal(cart = getCart()) {
  return cart.reduce((sum, it) => {
    const unit = Number(it.unitPrice || 0);
    const qty = Number(it.qty || 0);
    return sum + unit * qty;
  }, 0);
}

function makeLineId(productId, variantId) {
  return `${productId}::${variantId}`;
}

function addToCart(item) {
  const cart = getCart();
  const id = item.lineId;

  const existing = cart.find(x => x.lineId === id);
  if (existing) existing.qty += item.qty;
  else cart.push(item);

  saveCart(cart);
  renderCart();
  openCart();
}

function changeQty(lineId, delta) {
  const cart = getCart();
  const it = cart.find(x => x.lineId === lineId);
  if (!it) return;
  it.qty = Math.max(1, (Number(it.qty) || 1) + delta);
  saveCart(cart);
  renderCart();
}

function openProductFromCart(cartItem) {
  const prod = allProducts.find(p => String(p.id) === String(cartItem.productId));
  const fallbackProd = prod || {
    id: cartItem.productId,
    name: cartItem.productName || "Item",
    thumbnail_url: cartItem.imageUrl,
  };

  closeCart();
  openModal(fallbackProd);
}

function removeFromCart(lineId) {
  let cart = getCart();
  cart = cart.filter(x => x.lineId !== lineId);
  saveCart(cart);
  renderCart();
}

function ensureCartButton() {
  if (!headerRight) return;
  if (cartBtn) return;

  cartBtn = document.createElement("button");
  cartBtn.className = "cartBtn";
  cartBtn.id = "cartBtn";
  cartBtn.innerHTML = `Cart <span class="cartBadge" id="cartBadge">0</span>`;
  cartBtn.onclick = openCart;

  headerRight.insertBefore(cartBtn, headerRight.firstChild);
  updateCartBadge();
}

function updateCartBadge() {
  const badge = document.getElementById("cartBadge");
  if (!badge) return;
  badge.textContent = String(cartCount());
}

function openCart() {
  renderCart();
  cartBack.style.display = "flex";
  estimateCartTotals();
}

function closeCart() {
  cartBack.style.display = "none";
}

function renderCart() {
  const cart = getCart();
  cartItemsEl.innerHTML = "";

  if (!cart.length) {
    cartItemsEl.innerHTML = `
      <div style="padding:14px;border:1px dashed #444;border-radius:12px;color:#aaa">
        Your cart is empty. Add a size from any product.
      </div>
    `;
    cartSubtotalEl.textContent = "$0.00";
    checkoutBtn.disabled = true;
    return;
  }

  cart.forEach(it => {
    const row = document.createElement("div");
    row.className = "cartItem";

    row.innerHTML = `
      <img src="${it.imageUrl || ""}" alt="" loading="lazy" data-act="openItem" style="cursor:pointer">
      <div>
        <div class="cartName" data-act="openItem" style="cursor:pointer;text-decoration:underline;">
          ${it.productName || "Item"}
        </div>
        <div class="cartMeta">${it.variantName || ""}</div>
        <div class="cartMeta">Unit: ${money(it.unitPrice)}</div>

        <div class="cartQtyRow">
          <button class="qtyBtn" data-act="dec">−</button>
          <div class="qtyNum">${it.qty}</div>
          <button class="qtyBtn" data-act="inc">+</button>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:10px">
        <div style="font-weight:900">${money(Number(it.unitPrice) * Number(it.qty))}</div>
        <button class="removeBtn" data-act="remove">Remove</button>
      </div>
    `;

    row.querySelector("[data-act='dec']").onclick = () => changeQty(it.lineId, -1);
    row.querySelector("[data-act='inc']").onclick = () => changeQty(it.lineId, +1);
    row.querySelector("[data-act='remove']").onclick = () => removeFromCart(it.lineId);
    row.querySelectorAll("[data-act='openItem']").forEach(el => {
      el.onclick = () => openProductFromCart(it);
    });

    cartItemsEl.appendChild(row);
  });

  const subtotal = calcSubtotal(cart);
  cartSubtotalEl.textContent = money(subtotal);
  checkoutBtn.disabled = false;

  estimateCartTotals();
}

// ===============================
// SHIPPING (Option A) - Pretty modal (no prompts)
// ===============================
const SHIPPING_KEY = "mutts_shipping_v1";

function getShipping() {
  try { return JSON.parse(localStorage.getItem(SHIPPING_KEY) || "null"); }
  catch { return null; }
}

function saveShipping(shipping) {
  localStorage.setItem(SHIPPING_KEY, JSON.stringify(shipping));
  updateShippingPills();
  estimateCartTotals();
}

function clearShipping() {
  localStorage.removeItem(SHIPPING_KEY);
  updateShippingPills();
}

function normalizeShippingForWorker(formObj) {
  return {
    name: String(formObj.name || "").trim(),
    phone: String(formObj.phone || "").trim(),
    address: {
      address1: String(formObj.address1 || "").trim(),
      address2: String(formObj.address2 || "").trim(),
      city: String(formObj.city || "").trim(),
      state_code: String(formObj.state_code || "").trim().toUpperCase(),
      zip: String(formObj.zip || "").trim(),
      country_code: String(formObj.country_code || "US").trim().toUpperCase(),
    },
  };
}

function validateShipping(shipping) {
  const required = ["name", "address1", "city", "state", "zip", "country", "phone"];
  const missing = required.filter((k) => !String(shipping?.[k] ?? "").trim());
  return { ok: missing.length === 0, missing };
}

function shippingLooksValid(shipping) {
  if (!shipping || !shipping.address) return false;
  const a = shipping.address;
  return Boolean(
    (shipping.name || "").trim() &&
    (a.address1 || "").trim() &&
    (a.city || "").trim() &&
    (a.state_code || "").trim() &&
    (a.zip || "").trim() &&
    (a.country_code || "").trim() &&
    (shipping.phone || "").trim()
  );
}

function fillShippingFormFromSaved() {
  const s = getShipping();
  if (!s || !s.address) {
    shipName.value = "";
    shipAddress1.value = "";
    shipAddress2.value = "";
    shipCity.value = "";
    shipState.value = "";
    shipZip.value = "";
    shipCountry.value = "US";
    shipModePill.textContent = "Saved: No";
    return;
  }

  shipName.value = s.name || "";
  shipAddress1.value = s.address.address1 || s.address.address_line_1 || "";
  shipAddress2.value = s.address.address2 || s.address.address_line_2 || "";
  shipCity.value = s.address.city || s.address.admin_area_2 || "";
  shipState.value = s.address.state_code || s.address.admin_area_1 || "";
  shipZip.value = s.address.zip || s.address.postal_code || "";
  shipCountry.value = (s.address.country_code || "US").toUpperCase();

  shipModePill.textContent = "Saved: Yes";
}

function openShippingModal() {
  fillShippingFormFromSaved();
  shipBack.style.display = "flex";
}

function closeShippingModal() {
  shipBack.style.display = "none";
}

function readShippingForm() {
  return normalizeShippingForWorker({
    name: shipName.value,
    phone: shipPhone.value,
    address1: shipAddress1.value,
    address2: shipAddress2.value,
    city: shipCity.value,
    state_code: shipState.value,
    zip: shipZip.value,
    country_code: shipCountry.value,
  });
}

function validateAndSaveShipping(showAlerts = true) {
  const shipping = readShippingForm();

  // Use comprehensive validation
  const flatShipping = {
    name: shipping.name,
    address1: shipping.address?.address1,
    city: shipping.address?.city,
    state: shipping.address?.state_code,
    zip: shipping.address?.zip,
    country: shipping.address?.country_code,
    phone: shipping.phone,
  };

  const { ok, missing } = validateShipping(flatShipping);

  if (!ok) {
    if (showAlerts) alert("Please complete shipping: " + missing.join(", "));
    return null;
  }

  // Normalize to the Worker's expected custom-shape keys
  saveShipping(shipping);
  shipModePill.textContent = "Saved: Yes";
  return shipping;
}

function updateShippingPills() {
  const s = getShipping();
  const ok = shippingLooksValid(s);
  if (shipStatusPill) shipStatusPill.textContent = ok ? "Shipping: Saved" : "Shipping: Not set";
  if (shippingBtn) shippingBtn.textContent = ok ? "Shipping (Saved)" : "Shipping";
}

// ensures we either have saved shipping or we open the modal
async function ensureShippingOrOpenModal() {
  const shipping = getShipping();
  if (shippingLooksValid(shipping)) return shipping;
  openShippingModal();
  return null;
}

// Estimate shipping/tax/total via Worker to preview costs before PayPal
async function estimateCartTotals() {
  const cart = getCart();
  cartShipEl.textContent = "$—";
  cartTaxEl.textContent = "$—";
  cartTotalEl.textContent = "$—";
  paypalTotalNote.style.display = "none";

  if (!cart.length) return;

  const shipping = getShipping();
  if (!shipping || !shipping.address) {
    cartShipEl.textContent = "Add shipping";
    cartTaxEl.textContent = "Add shipping";
    return;
  }

  try {
    // call Worker for Printful estimate
    const url = `${PAYPAL_WORKER_BASE}/paypal/estimate`;
    const options = {
      method: "POST",
      headers: await authHeaders(),
      body: JSON.stringify({
        currency: "USD",
        shipping,
        items: cart.map(it => ({
          syncVariantId: it.syncVariantId,
          qty: Number(it.qty || 1),
          unitPrice: String(Number(it.unitPrice || 0).toFixed(2)),
          productName: it.productName,
          variantName: it.variantName,
          imageUrl: it.imageUrl,
          productId: it.productId,
          catalogVariantId: it.catalogVariantId,
        })),
      }),
    };
    let res = await fetchWithTimeout(url, options, 12000);
    let data = await res.json();

    // Auto-refresh token if expired
    if (res.status === 401) {
      await getCartToken();
      res = await fetchWithTimeout(url, { ...options, headers: await authHeaders() }, 12000);
      data = await res.json();
    }
    if (!data.ok) throw new Error(data.error || "Estimate failed");

    const pf = data.totals;

    cartShipEl.textContent = money(Number(pf.shipping));
    cartTaxEl.textContent = money(Number(pf.tax));

    const retailSubtotal = calcSubtotal(getCart());
    const finalTotal =
      retailSubtotal +
      Number(pf.shipping) +
      Number(pf.tax);

    cartTotalEl.textContent = money(finalTotal);

  } catch (e) {
    console.log("estimateCartTotals error:", e);
  }
}

// ===============================
// PAYPAL CHECKOUT FOR WHOLE CART
// ===============================
async function checkoutCartWithPayPal() {
  const cart = getCart();
  if (!cart.length) return;

  // Ensure shipping exists; if not, open modal and stop
  const shipping = await ensureShippingOrOpenModal();
  if (!shipping) return;

  // Validate shipping before calling backend
  const flatShipping = {
    name: shipping.name,
    address1: shipping.address?.address1,
    city: shipping.address?.city,
    state: shipping.address?.state_code,
    zip: shipping.address?.zip,
    country: shipping.address?.country_code,
    phone: shipping.phone,
  };

  const { ok, missing } = validateShipping(flatShipping);

  if (!ok) {
    // Minimal UI: one alert (fastest / simplest)
    alert("Please complete shipping: " + missing.join(", "));
    return; // ✅ stops checkout before calling backend
  }

  checkoutBtn.disabled = true;
  checkoutBtn.textContent = "Creating PayPal order...";

  // ✅ only runs if shipping is valid
  try {
    const url = `${PAYPAL_WORKER_BASE}/paypal/order`;
    const options = {
      method: "POST",
      headers: await authHeaders(),
      body: JSON.stringify({
        currency: "USD",
        shipping,
        items: cart.map(it => ({
          productId: it.productId,
          productName: it.productName,
          variantName: it.variantName,
          imageUrl: it.imageUrl,
          unitPrice: String(Number(it.unitPrice).toFixed(2)),
          qty: Number(it.qty),

          // required by your Worker for Printful estimate + fulfillment
          syncVariantId: it.syncVariantId,
          catalogVariantId: it.catalogVariantId,
        })),
      }),
    };
    let res = await fetchWithTimeout(url, options, 15000);

    // Auto-refresh token if expired
    if (res.status === 401) {
      await getCartToken();
      res = await fetchWithTimeout(url, { ...options, headers: await authHeaders() }, 15000);
    }

    const data = await res.json().catch(() => ({}));

    // ✅ If shipping is incomplete, Worker returns 400 with missingFields
    if (!res.ok) {
      if (res.status === 400 && data?.missingFields?.length) {
        alert("Please complete shipping: " + data.missingFields.join(", "));
        return; // stop checkout
      }
      alert(data?.error || "Checkout failed. Please try again.");
      return;
    }

    // success - ensure we have approveUrl
    if (!data.ok || !data.approveUrl) {
      console.error("❌ PayPal order failed:", data);
      alert("PayPal order failed. Please try again.");
      return;
    }

    if (paypalTotalNote && data.totals && data.totals.total != null) {
      paypalTotalNote.textContent = `PayPal total: ${money(Number(data.totals.total))}`;
      paypalTotalNote.style.display = "block";
    }

    // straight to PayPal
    window.location.href = data.approveUrl;
  } catch (err) {
    console.error("❌ checkout error:", err);
    if (err.message === "Request timeout") {
      alert("Checkout timed out. Try again.");
    } else if (String(err.message || "").includes("Failed to fetch")) {
      alert("Cannot connect to payment service. Check your internet and try again.");
    } else {
      alert("Checkout failed: " + err.message);
    }
  } finally {
    checkoutBtn.disabled = false;
    checkoutBtn.textContent = "Checkout (PayPal)";
  }
}

// ===============================
// PRODUCTS
// ===============================
async function loadProducts() {
  statusText.innerHTML = '<div class="spinner"></div> Loading products...';
  statusText.style.color = "#3aa0ff";
  grid.innerHTML = "";

  try {
    const res = await fetchWithTimeout(`${STORE_API_BASE}/api/store/products`, {}, 10000);
    if (!res.ok) throw new Error(`Server error: ${res.status}`);

    const data = await res.json();
    allProducts = data?.result || [];
    renderProducts();
  } catch (err) {
    console.error("❌ Load products error:", err);
    statusText.style.color = "#ff4d6d";

    if (err.message === "Request timeout") {
      statusText.innerHTML = `⚠️ <strong>Loading timed out.</strong><br>
        The product service at <code style="font-size:11px">${STORE_API_BASE}</code> is not responding.<br>
        <button onclick="location.reload()" class="btnGlow" style="margin-top:10px">Retry</button>`;
    } else if (String(err.message || "").includes("Failed to fetch")) {
      statusText.innerHTML = `⚠️ <strong>Cannot connect to product service.</strong><br>
        Please check your internet connection or the API may be down.<br>
        <button onclick="location.reload()" class="btnGlow" style="margin-top:10px">Retry</button>`;
    } else {
      statusText.innerHTML = `⚠️ <strong>Failed to load products:</strong> ${err.message}<br>
        <button onclick="location.reload()" class="btnGlow" style="margin-top:10px">Retry</button>`;
    }
  }
}

function getProductImages(prod) {
  const bestByKey = new Map(); // key -> { url, score }

  const normalizeKey = (url, fileObj) => {
    if (fileObj?.hash) return `hash:${fileObj.hash}`;
    const noQuery = (url || '').split('?')[0];
    const filename = (fileObj?.filename || noQuery.substring(noQuery.lastIndexOf('/') + 1))
      .replace(/(_preview|_thumb)/ig, '');
    return filename ? `file:${filename}` : noQuery || url;
  };

  // higher score wins for a given key
  const scoreFor = (url, fileObj) => {
    if (!url) return -Infinity;
    if (fileObj?.preview_url === url) return 3;
    if (fileObj?.thumbnail_url === url) return 2;
    return 1; // fallback raw url
  };

  const add = (url, fileObj) => {
    if (!url) return;
    const key = normalizeKey(url, fileObj);
    const score = scoreFor(url, fileObj);
    const current = bestByKey.get(key);
    if (!current || score > current.score) {
      bestByKey.set(key, { url, score });
    }
  };

  add(prod?.thumbnail_url, null);
  add(prod?.sync_product?.thumbnail_url, null);

  if (Array.isArray(prod?.sync_variants)) {
    prod.sync_variants.forEach(v => {
      add(v?.product?.image, { filename: 'product_image' });

      if (Array.isArray(v.files)) {
        v.files.forEach(f => {
          add(f.preview_url, f);
          add(f.thumbnail_url, f);
          add(f.url, f);
        });
      }
    });
  }

  return [...bestByKey.values()].map(x => x.url);
}

function renderProducts() {
  statusText.textContent = `Loaded ${allProducts.length} products`;
  statusText.style.color = "#cfe9ff";
  grid.innerHTML = "";

  allProducts.forEach(prod => {
    const card = document.createElement("div");
    card.className = "card";

    const thumb = prod.thumbnail_url || getProductImages(prod)[0] || "";

    card.innerHTML = `
      <div class="imgWrap">
        <img src="${thumb}" loading="lazy" onload="this.classList.add('loaded')">
      </div>
      <h3 style="margin:12px 0 10px">${prod.name}</h3>
      <button class="buyBtn">View sizes</button>
    `;

    card.querySelector(".buyBtn").onclick = (e) => {
      e.stopPropagation();
      openModal(prod);
    };

    card.onclick = () => openModal(prod);
    grid.appendChild(card);
  });
}

// ===============================
// MODAL + VARIANTS
// ===============================
async function openModal(prod){
  activeProduct = prod;

  // detail endpoint (more complete)
  try {
    const res = await fetchWithTimeout(`${STORE_API_BASE}/api/store/products/${prod.id}`, {}, 8000);
    if (res.ok) {
      const data = await res.json();
      activeProduct = { ...prod, ...(data?.result || {}) };
    }
  } catch (e) {
    console.log("Product detail fetch failed, using list data only.");
  }

  modalTitle.textContent = activeProduct.name;

  const images = getProductImages(activeProduct);
  activeProduct._images = images;

  modalImg.src = images[0] || activeProduct.thumbnail_url || "";
  modalImg.loading = "lazy";

  modalImg.onclick = () => {
    lightboxImg.src = modalImg.src;
    lightboxBack.style.display = "flex";
  };

  // thumbnails strip
  const oldStrip = document.getElementById("mockupStrip");
  if (oldStrip) oldStrip.remove();

  const strip = document.createElement("div");
  strip.id = "mockupStrip";
  strip.style.display = "flex";
  strip.style.gap = "8px";
  strip.style.justifyContent = "center";
  strip.style.flexWrap = "wrap";
  strip.style.margin = "10px 0 6px";

  images.forEach((url, idx) => {
    const t = document.createElement("img");
    t.src = url;
    t.loading = "lazy";
    t.style.width = "64px";
    t.style.height = "64px";
    t.style.objectFit = "cover";
    t.style.borderRadius = "10px";
    t.style.border = idx === 0 ? "2px solid rgba(58,160,255,.85)" : "1px solid #333";
    t.style.cursor = "pointer";
    t.onclick = () => {
      modalImg.src = url;
      [...strip.querySelectorAll("img")].forEach(im => im.style.border = "1px solid #333");
      t.style.border = "2px solid rgba(58,160,255,.85)";
    };
    strip.appendChild(t);
  });

  const enlargeLabel = document.getElementById("enlargeLabel");
  const imgContainer = modalImg.parentElement;
  if (enlargeLabel && imgContainer) {
    imgContainer.insertAdjacentElement("afterend", enlargeLabel);
    enlargeLabel.insertAdjacentElement("afterend", strip);
  } else {
    imgContainer.insertAdjacentElement("afterend", strip);
  }

  variantList.innerHTML = "";
  variantNote.textContent = "Loading sizes...";
  modalBack.style.display = "flex";

  await loadVariants();
}

async function loadVariants() {
  if (!activeProduct) return;

  try {
    let variants;

    if (variantCache[activeProduct.id]) {
      variants = variantCache[activeProduct.id];
    } else {
      const res = await fetchWithTimeout(`${STORE_API_BASE}/api/store/products/${activeProduct.id}`, {}, 8000);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      variants = data?.result?.sync_variants || [];
      variantCache[activeProduct.id] = variants;
    }

    variantList.innerHTML = "";

    if (!variants.length) {
      variantNote.textContent = "No sizes available for this product.";
      return;
    }

    variantNote.textContent = "Pick your size:";
    modalBuyBtn.textContent = "Add to Cart";
    modalBuyBtn.disabled = true;

    variants.forEach(v => {
      const row = document.createElement("div");
      row.className = "variantRow";

      const price = Number(v.retail_price || 0).toFixed(2);

      row.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px">
          <div>
            <div style="font-weight:900">${v.name}</div>
            <div style="font-size:13px;color:#aaa">$${price}</div>
          </div>
          <div style="font-size:12px;color:#aaa">Tap to select</div>
        </div>
      `;

      row.onclick = () => {
        [...variantList.children].forEach(el => el.style.outline = "none");
        row.style.outline = "2px solid rgba(58,160,255,.7)";

        modalBuyBtn.disabled = false;
        modalBuyBtn.textContent = `Add to Cart - $${price}`;

        modalBuyBtn.onclick = () => {
          const item = {
            lineId: makeLineId(activeProduct.id, v.id),
            productId: activeProduct.id,

            // SAVE BOTH:
            syncVariantId: Number(v.id),              // Printful sync variant id
            catalogVariantId: Number(v.variant_id),   // Printful catalog variant id

            productName: activeProduct.name,
            variantName: v.name,
            imageUrl: modalImg.src,
            unitPrice: Number(price),
            qty: 1,
          };
          addToCart(item);
        };
      };

      variantList.appendChild(row);
    });

  } catch (e) {
    console.error(e);
    if (e.message === "Request timeout") {
      variantNote.textContent = "⚠️ Loading sizes timed out. Please close and try again.";
    } else if (String(e.message || "").includes("Failed to fetch")) {
      variantNote.textContent = "⚠️ Cannot connect to service. Check your internet connection.";
    } else {
      variantNote.textContent = "⚠️ Could not load sizes: " + e.message;
    }
  }
}


// ===============================
// UI EVENTS (now bound via helper)
// ===============================

function bindLegacyButtons() {
  // Re-query (DON'T rely on old consts if DOM changed)
  const refreshBtn = document.getElementById("refreshBtn");
  const shippingBtn = document.getElementById("shippingBtn");

  const cartBack = document.getElementById("cartBack");
  const closeCartBtn = document.getElementById("closeCartBtn");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const editShippingFromCartBtn = document.getElementById("editShippingFromCartBtn");

  const shipBack = document.getElementById("shipBack");
  const shipCloseBtn = document.getElementById("shipCloseBtn");
  const shipClearBtn = document.getElementById("shipClearBtn");
  const shipSaveBtn = document.getElementById("shipSaveBtn");
  const shipSaveAndCheckoutBtn = document.getElementById("shipSaveAndCheckoutBtn");

  if (refreshBtn) refreshBtn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); loadProducts(); };
  if (shippingBtn) shippingBtn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); openShippingModal(); };

  // Backdrop click closes ONLY when you click the backdrop, not the panel/buttons
  if (cartBack) cartBack.onclick = (e) => { if (e.target === cartBack) closeCart(); };

  if (closeCartBtn) closeCartBtn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); closeCart(); };

  if (editShippingFromCartBtn) editShippingFromCartBtn.onclick = (e) => {
    e.preventDefault(); e.stopPropagation(); openShippingModal();
  };

  if (checkoutBtn) checkoutBtn.onclick = (e) => {
    e.preventDefault(); e.stopPropagation(); checkoutCartWithPayPal();
  };

  // Shipping modal
  if (shipBack) shipBack.onclick = (e) => { if (e.target === shipBack) closeShippingModal(); };
  if (shipCloseBtn) shipCloseBtn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); closeShippingModal(); };

  if (shipClearBtn) shipClearBtn.onclick = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (confirm("Clear saved shipping info on this device?")) {
      clearShipping();
      fillShippingFormFromSaved();
    }
  };

  if (shipSaveBtn) shipSaveBtn.onclick = (e) => {
    e.preventDefault(); e.stopPropagation();
    const saved = validateAndSaveShipping(true);
    if (saved) { alert("Shipping saved."); closeShippingModal(); }
  };

  if (shipSaveAndCheckoutBtn) shipSaveAndCheckoutBtn.onclick = (e) => {
    e.preventDefault(); e.stopPropagation();
    const saved = validateAndSaveShipping(true);
    if (!saved) return;
    closeShippingModal();
    openCart();
  };


  console.log("✅ Legacy merch buttons bound");

  // ✅ HARD RESET: cart must be CLOSED on load + open as RIGHT drawer
  (() => {
    const cartBack = document.getElementById("cartBack");
    const cartItems = document.getElementById("cartItems");
    const cartBtn = document.querySelector(".cartBtn");

    if (!cartBack || !cartItems || !cartBtn) return;

    // Force the overlay to behave like a right-side drawer
    cartBack.style.position = "fixed";
    cartBack.style.inset = "0";
    cartBack.style.display = "none";          // <-- KEY: closed on load
    cartBack.style.flexDirection = "row";     // <-- prevent row-reverse surprises
    cartBack.style.justifyContent = "flex-end";
    cartBack.style.alignItems = "stretch";
    cartBack.style.zIndex = "50";

    // Force drawer panel to sit on the RIGHT inside the flex overlay
    cartItems.style.marginLeft = "auto";


    // Toggle open/close on Cart button (capture phase + stopImmediatePropagation)
    cartBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation(); // <-- blocks the legacy "always open" handler

      const open = getComputedStyle(cartBack).display !== "none";
      cartBack.style.display = open ? "none" : "flex";
    }, true); // <-- CAPTURE phase so we intercept first

    // Click outside the drawer closes it
    cartBack.addEventListener("click", (e) => {
      if (e.target === cartBack) cartBack.style.display = "none";
    });
  })();
}


// ===============================
// Boot
// ===============================
(async function bootMerch() {
  console.log("🧵 Merch boot starting...");

  await waitFor("grid");
  await waitFor("modalBack");
  await waitFor("cartBack");
  await waitFor("checkoutBtn");

  console.log("✅ Merch DOM ready — starting app");

  ensureCartButton();
  bindLegacyButtons();
  renderCart();
  updateShippingPills();
  loadProducts();

  // Safety: bind again 1 tick later (sometimes React paints after script)
  setTimeout(bindLegacyButtons, 0);
})();