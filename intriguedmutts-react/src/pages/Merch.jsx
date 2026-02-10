
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
    <div className="merchPage">
      {/* Top row for injected Cart button + actions */}
      <div className="topActions">
        <button id="refreshBtn" className="btnGhost" type="button">
          Refresh
        </button>

        <button id="shippingBtn" className="btnGhost" type="button">
          Shipping
        </button>

        {/* legacy script injects Cart button here */}
      </div>

      {/* Status + Grid */}
      <div id="statusText" className="statusText" />
      <div id="grid" className="grid" />

      {/* ===== Modal (Product + variants) ===== */}
      <div id="modalBack" className="overlay" style={{ display: "none" }}>
        <div id="modal" className="modal" role="dialog" aria-modal="true">
          <div className="modalHeader">
            <div id="modalTitle" className="modalTitle" />
            <button id="closeModal" className="btnGhost" type="button">
              Close
            </button>
          </div>

          <div className="modalBody">
            <div className="imgWrapModal">
              <img id="modalImg" alt="" />
              <div id="enlargeLabel" className="enlargeLabel">
                Tap image to enlarge
              </div>
              {/* legacy script inserts thumbnail strip after enlargeLabel */}
            </div>

            <div className="variantsBlock">
              <div id="variantNote" className="variantNote" />
              <div id="variantList" className="variantList" />
            </div>
          </div>

          <div className="modalFooter">
            <button id="modalBuyBtn" className="btnPrimary" type="button" disabled>
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* ===== Cart Drawer ===== */}
      <div id="cartBack" className="overlay" style={{ display: "none" }}>
        <div className="cartDrawer">
          <div className="cartHeader">
            <div className="cartTitle">Cart</div>
            <button id="closeCartBtn" className="btnGhost" type="button">
              Close
            </button>
          </div>

          <div id="cartItems" className="cartItems" />

          <div className="cartTotals">
            <div className="row">
              <span>Subtotal</span>
              <span id="cartSubtotal">$0.00</span>
            </div>

            <div className="row">
              <span>Shipping</span>
              <span id="cartShip">$—</span>
            </div>

            <div className="row">
              <span>Tax</span>
              <span id="cartTax">$—</span>
            </div>

            <div className="row total">
              <span>Total</span>
              <span id="cartTotal">$—</span>
            </div>

            <div id="paypalTotalNote" className="paypalNote" style={{ display: "none" }} />
          </div>

          <div className="cartActions">
            <button id="editShippingFromCartBtn" className="btnGhost" type="button">
              Edit shipping
            </button>

            <button id="checkoutBtn" className="btnPrimary" type="button">
              Checkout (PayPal)
            </button>

            <div id="shipStatusPill" className="pill">
              Shipping: Not set
            </div>
          </div>
        </div>
      </div>

      {/* ===== Lightbox ===== */}
      <div id="lightboxBack" className="overlay" style={{ display: "none" }}>
        <div className="lightbox">
          <img id="lightboxImg" alt="" />
        </div>
      </div>

      {/* ===== Shipping Modal ===== */}
      <div id="shipBack" className="overlay" style={{ display: "none" }}>
        <div className="shipModal">
          <div className="shipHeader">
            <div className="shipTitle">Shipping</div>
            <div id="shipModePill" className="pill">
              Saved: No
            </div>
            <button id="shipCloseBtn" className="btnGhost" type="button">
              Close
            </button>
          </div>

          <div className="shipForm">
            <input id="shipName" placeholder="Full name" />
            <input id="shipPhone" placeholder="Phone" />
            <input id="shipAddress1" placeholder="Address line 1" />
            <input id="shipAddress2" placeholder="Address line 2 (optional)" />
            <div className="grid2">
              <input id="shipCity" placeholder="City" />
              <input id="shipState" placeholder="State (e.g. MD)" />
            </div>
            <div className="grid2">
              <input id="shipZip" placeholder="ZIP" />
              <input id="shipCountry" placeholder="Country (US)" defaultValue="US" />
            </div>
          </div>

          <div className="shipActions">
            <button id="shipClearBtn" className="btnGhost" type="button">
              Clear
            </button>
            <button id="shipSaveBtn" className="btnGhost" type="button">
              Save
            </button>
            <button id="shipSaveAndCheckoutBtn" className="btnPrimary" type="button">
              Save & back to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
