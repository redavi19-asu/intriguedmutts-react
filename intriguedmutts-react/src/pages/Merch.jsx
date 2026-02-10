import { useEffect } from "react";

export default function Merch() {
  useEffect(() => {
    if (document.getElementById("legacy-merch-script")) return;

    const base = import.meta.env.BASE_URL;

    const script = document.createElement("script");
    script.id = "legacy-merch-script";
    script.src = `${base}legacy/merch.js`;
    script.async = false;

    document.body.appendChild(script);

    return () => script.remove();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header actions area for cart button injection */}
      <div className="topActions" />

      {/* Modal Backdrop and Modal Structure */}

      <div id="modalBack">
        <div id="modal">
          <div id="modalTitle" />
          <img id="modalImg" />
          <button id="modalBuyBtn" />
          <button id="closeModal" />
          <div id="variantList" />
          <div id="variantNote" />
        </div>
      </div>

      {/* Cart Backdrop and Cart Structure */}

      <div id="cartBack">
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

      {/* Shipping Backdrop and Shipping Structure */}

      <div id="shipBack">
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

      {/* Lightbox Backdrop */}

      <div id="lightboxBack">
        <img id="lightboxImg" />
      </div>

      {/* Status Text and Grid Containers */}
      <div id="statusText" />
      <div id="grid" />
    </div>
  );
}
