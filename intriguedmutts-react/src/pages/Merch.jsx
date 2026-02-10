
import { useEffect } from "react";
import "./merchLegacy.css";

export default function Merch() {
  useEffect(() => {
    if (document.getElementById("legacy-merch-script")) return;

    const base = import.meta.env.BASE_URL;

    const script = document.createElement("script");
    script.id = "legacy-merch-script";
    script.src = `${base}legacy/merch.js`;
    script.defer = true;

    document.body.appendChild(script);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* top right actions area for cart button injection */}
      <div className="topActions" style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: "10px 16px" }}>
        {/* Optional: script uses refreshBtn + shippingBtn if present */}
        <button id="refreshBtn" style={{ display: "none" }} />
        <button id="shippingBtn" style={{ display: "none" }} />
      </div>

      {/* Modal */}
      <div id="modalBack">
        <div id="modal">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <div id="modalTitle" />
            <button id="closeModal">Close</button>
          </div>

          <img id="modalImg" alt="" />
          <div id="variantNote" style={{ marginTop: 12, color: "#cfe9ff" }} />
          <div id="variantList" />

          <button id="modalBuyBtn" style={{ marginTop: 12 }}>Add to Cart</button>
        </div>
      </div>

      {/* Cart Backdrop + Drawer */}
      <div id="cartBack">
        <div id="cartDrawer">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong>Cart</strong>
            <button id="closeCartBtn">Close</button>
          </div>

          <div id="shipStatusPill" style={{ marginTop: 8, opacity: 0.9 }} />
          <div id="cartItems" />
          <hr style={{ opacity: 0.15 }} />

          <div style={{ display: "grid", gap: 6 }}>
            <div>Subtotal: <span id="cartSubtotal" /></div>
            <div>Shipping: <span id="cartShip" /></div>
            <div>Tax: <span id="cartTax" /></div>
            <div style={{ fontWeight: 900 }}>Total: <span id="cartTotal" /></div>
            <div id="paypalTotalNote" style={{ display: "none", marginTop: 6 }} />
          </div>

          <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
            <button id="editShippingFromCartBtn">Edit shipping</button>
            <button id="checkoutBtn">Checkout (PayPal)</button>
          </div>
        </div>
      </div>

      {/* Shipping Modal */}
      <div id="shipBack">
        <div style={{ width: "min(720px, 92vw)", background: "rgba(20,20,20,.96)", border: "1px solid rgba(255,255,255,.10)", borderRadius: 16, padding: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong>Shipping</strong>
            <button id="shipCloseBtn">Close</button>
          </div>

          <div id="shipModePill" style={{ marginTop: 8, opacity: 0.9 }} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
            <input id="shipName" placeholder="Full name" />
            <input id="shipPhone" placeholder="Phone" />
            <input id="shipAddress1" placeholder="Address line 1" />
            <input id="shipAddress2" placeholder="Address line 2 (optional)" />
            <input id="shipCity" placeholder="City" />
            <input id="shipState" placeholder="State (e.g., MD)" />
            <input id="shipZip" placeholder="ZIP" />
            <input id="shipCountry" placeholder="Country (US)" />
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 12, justifyContent: "flex-end" }}>
            <button id="shipClearBtn">Clear</button>
            <button id="shipSaveBtn">Save</button>
            <button id="shipSaveAndCheckoutBtn">Save & return</button>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <div id="lightboxBack">
        <img id="lightboxImg" alt="" />
      </div>

      {/* Status + Grid */}
      <div id="statusText" />
      <div id="grid" />
    </div>
  );
}
