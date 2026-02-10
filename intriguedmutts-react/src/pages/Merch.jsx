
import { useEffect } from "react";

export default function Merch() {
  useEffect(() => {
    // 1) Inject legacy CSS once
    if (!document.getElementById("legacy-merch-css")) {
      const base = import.meta.env.BASE_URL;
      const link = document.createElement("link");
      link.id = "legacy-merch-css";
      link.rel = "stylesheet";
      link.href = `${base}legacy/merchLegacy.css`;
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
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="topActions" />
      <div id="topBar" />

      {/* page layout wrapper */}
      <div id="merchLayout">
        {/* LEFT column */}
        <div id="merchMain">
          <div id="statusText" />
          <div id="grid" />
        </div>

        {/* RIGHT column (cart stays here) */}
        <div id="merchSide">
          <div id="cartBack" style={{ display: "block" }}>
            <button id="closeCartBtn" />
            <div id="cartItems" />
            <div id="cartSubtotal" />
            <div id="cartProdSubtotal" />
            <div id="cartShip" />
            <div id="cartTax" />
            <div id="cartTotal" />
            <div id="paypalTotalNote" />
            <button id="checkoutBtn" />
            <button id="editShippingFromCartBtn" />
            <div id="shipStatusPill" />
          </div>
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
        <div id="shipModePill" />
        <button id="shipCloseBtn" />
        <button id="shipClearBtn" />
        <button id="shipSaveBtn" />
        <button id="shipSaveAndCheckoutBtn" />

        <input id="shipName" />
        <input id="shipPhone" />
        <input id="shipAddress1" />
        <input id="shipAddress2" />
        <input id="shipCity" />
        <input id="shipState" />
        <input id="shipZip" />
        <input id="shipCountry" />
      </div>

      <div id="lightboxBack" style={{ display: "none" }}>
        <img id="lightboxImg" alt="" />
      </div>
    </div>
  );
}
