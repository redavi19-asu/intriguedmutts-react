
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
    <div className="imMerchPage">
      {/* top right container legacy JS injects Cart button into */}
      <div className="topBar">
        <div className="topActions" />
      </div>

      {/* status + products */}
      <div className="imContainer">
        <div id="statusText" className="imStatus" />
        <div id="grid" className="imGrid" />
      </div>

      {/* MODAL */}
      <div id="modalBack" className="imOverlay" style={{ display: "none" }}>
        <div id="modal" className="imModal">
          <div className="imModalTop">
            <div id="modalTitle" className="imModalTitle" />
            <button id="closeModal" className="imBtn imBtnGhost" type="button">
              Close
            </button>
          </div>

          <div className="imModalBody">
            <div className="imModalImgWrap">
              <img id="modalImg" className="imModalImg" alt="" />
              <div id="enlargeLabel" className="imHint">
                Tap image to enlarge
              </div>
            </div>

            <div id="variantNote" className="imNote" />
            <div id="variantList" className="imVariantList" />

            <button id="modalBuyBtn" className="imBtn imBtnPrimary" type="button" disabled>
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* CART DRAWER */}
      <div id="cartBack" className="imOverlay" style={{ display: "none" }}>
        <div className="imCartDrawer">
          <div className="imCartHeader">
            <div className="imCartTitle">
              Cart <span id="cartBadgeInline" className="imBadge" />
            </div>
            <button id="closeCartBtn" className="imBtn imBtnGhost" type="button">
              Close
            </button>
          </div>

          <div id="cartItems" className="imCartItems" />

          <div className="imTotals">
            <div className="imRow">
              <span>Subtotal</span>
              <span id="cartSubtotal">$0.00</span>
            </div>

            {/* optional but keeps your ids alive */}
            <div style={{ display: "none" }} id="cartProdSubtotal" />

            <div className="imRow">
              <span>Shipping</span>
              <span id="cartShip">$—</span>
            </div>
            <div className="imRow">
              <span>Tax</span>
              <span id="cartTax">$—</span>
            </div>
            <div className="imRow imRowTotal">
              <span>Total</span>
              <span id="cartTotal">$—</span>
            </div>

            <div id="paypalTotalNote" className="imHint" style={{ display: "none" }} />
            <div id="shipStatusPill" className="imPill" />
          </div>

          <div className="imCartActions">
            <button id="editShippingFromCartBtn" className="imBtn imBtnSecondary" type="button">
              Edit shipping
            </button>
            <button id="checkoutBtn" className="imBtn imBtnPrimary" type="button">
              Checkout (PayPal)
            </button>
          </div>
        </div>
      </div>

      {/* SHIPPING MODAL */}
      <div id="shipBack" className="imOverlay" style={{ display: "none" }}>
        <div className="imShipModal">
          <div className="imModalTop">
            <div className="imModalTitle">Shipping</div>
            <button id="shipCloseBtn" className="imBtn imBtnGhost" type="button">
              Close
            </button>
          </div>

          {/* IMPORTANT: legacy script references this id */}
          <div id="shipModePill" className="imPill" />

          <div className="imShipGrid">
            <input id="shipName" placeholder="Full name" />
            <input id="shipPhone" placeholder="Phone" />
            <input id="shipAddress1" placeholder="Address line 1" />
            <input id="shipAddress2" placeholder="Address line 2 (optional)" />
            <input id="shipCity" placeholder="City" />
            <input id="shipState" placeholder="State (e.g. MD)" />
            <input id="shipZip" placeholder="ZIP" />
            <input id="shipCountry" placeholder="Country (US)" />
          </div>

          <div className="imCartActions">
            <button id="shipClearBtn" className="imBtn imBtnGhost" type="button">
              Clear
            </button>
            <button id="shipSaveBtn" className="imBtn imBtnSecondary" type="button">
              Save
            </button>
            <button id="shipSaveAndCheckoutBtn" className="imBtn imBtnPrimary" type="button">
              Save & Return to Cart
            </button>
          </div>
        </div>
      </div>

      {/* LIGHTBOX */}
      <div id="lightboxBack" className="imOverlay" style={{ display: "none" }}>
        <img id="lightboxImg" className="imLightboxImg" alt="" />
      </div>
    </div>
  );
}
