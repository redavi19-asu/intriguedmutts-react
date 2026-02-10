import { useEffect } from "react";

export default function Merch() {
  useEffect(() => {
    // 1) Inject legacy CSS once
    if (!document.getElementById("legacy-merch-css")) {
      const base = import.meta.env.BASE_URL;
      const link = document.createElement("link");
      link.id = "legacy-merch-css";
      link.rel = "stylesheet";
      link.href = `${base}legacy/merch.css`;
      document.head.appendChild(link);
    }

    // 2) Inject legacy JS once
    if (!document.getElementById("legacy-merch-script")) {
      const base = import.meta.env.BASE_URL;
      const script = document.createElement("script");
      script.id = "legacy-merch-script";
      script.src = `${base}legacy/merch.js`;
      script.defer = true;
      document.body.appendChild(script);
    }

    // 3) Keep Edit Shipping working even if legacy JS rebuilds the cart DOM
    const bindCartButtons = () => {
      const shipBack = document.getElementById("shipBack");
      const editBtn = document.getElementById("editShippingFromCartBtn");

      // Force a valid country code so Printful estimate works
      const shipCountry = document.getElementById("shipCountry");
      if (shipCountry && shipCountry.value && shipCountry.value.length !== 2) {
        shipCountry.value = "US";
      }
      if (shipCountry && !shipCountry.value) shipCountry.value = "US";

      if (!shipBack || !editBtn) return;

      // prevent duplicate binds
      if (editBtn.dataset.bound === "1") return;
      editBtn.dataset.bound = "1";

      editBtn.addEventListener(
        "click",
        (e) => {
          e.preventDefault();
          e.stopPropagation();
          shipBack.style.display = "flex"; // ✅ SAME as top shipping
        },
        true
      );
    };

    const obs = new MutationObserver(bindCartButtons);
    obs.observe(document.body, { childList: true, subtree: true });

    const t = setTimeout(bindCartButtons, 200);

    return () => {
      clearTimeout(t);
      obs.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="topBar" id="topBar">
        <div className="topActions">
          <button id="refreshBtn" className="btnGlow" type="button">
            Refresh products
          </button>
          <button id="shippingBtn" className="btnGlow" type="button">
            Shipping
          </button>
        </div>
      </div>

      {/* page layout wrapper */}

      <div
        id="merchLayout"
        className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start"
      >
        <div className="min-w-0">
          <div id="statusText" />
          <div id="grid" />
        </div>
      </div>

      {/* Cart Drawer (overlay) */}
      <div id="cartBack">
        <div id="cartItems">
          <button id="closeCartBtn">Close</button>
          <div id="shipStatusPill"></div>

          <div id="cartList"></div>

          <div id="cartProdSubtotal"></div>
          <div id="cartSubtotal"></div>
          <div id="cartShip"></div>
          <div id="cartTax"></div>
          <div id="cartTotal"></div>
          <div id="paypalTotalNote"></div>

          <button id="editShippingFromCartBtn">Edit shipping</button>
          <button id="checkoutBtn">Checkout (PayPal)</button>
        </div>
      </div>

      {/* keep shipping + modal + lightbox EXACTLY as you already have */}
      <div id="modalBack" style={{ display: "none" }}>
        <div id="modal">
          <div id="modalTitle" />
          <img id="modalImg" alt="" />
          <div id="enlargeLabel" />
          <button id="modalBuyBtn" />
          <button id="closeModal" />
          <div id="variantList" />
          <div id="variantNote" />
        </div>
      </div>

      <div id="shipBack" style={{ display: "none" }}>
        <div className="shipTop">
          <h2>Shipping details</h2>

          <div className="shipPills">
            <div id="shipModePill"></div>
            <button id="shipCloseBtn" type="button">Close</button>
          </div>

          <p className="shipNote">
            We store this on your device only (localStorage).
          </p>
        </div>

        <div className="shipForm">
          <label>
            Full name
            <input id="shipName" autoComplete="name" />
          </label>

          <label>
            Phone number
            <input id="shipPhone" autoComplete="tel" />
          </label>

          <label>
            Street address
            <input id="shipAddress1" autoComplete="address-line1" />
          </label>

          <label>
            Apt / Unit (optional)
            <input id="shipAddress2" autoComplete="address-line2" />
          </label>

          <div className="shipRow2">
            <label>
              City
              <input id="shipCity" autoComplete="address-level2" />
            </label>

            <label>
              State
              <input id="shipState" autoComplete="address-level1" />
            </label>
          </div>

          <div className="shipRow2">
            <label>
              ZIP
              <input id="shipZip" autoComplete="postal-code" />
            </label>

            <label>
              Country
              {/* IMPORTANT: value must be ISO2 like "US" */}
              <select id="shipCountry" defaultValue="US">
                <option value="US">US</option>
              </select>
            </label>
          </div>
        </div>

        <div className="shipActions">
          <button id="shipClearBtn" type="button">Clear</button>
          <button id="shipSaveBtn" type="button">Save shipping</button>
          <button id="shipSaveAndCheckoutBtn" type="button">Save + Continue with Cart</button>
        </div>
      </div>

      <div id="lightboxBack" style={{ display: "none" }}>
        <img id="lightboxImg" alt="" />
      </div>
    </div>
  );
}
