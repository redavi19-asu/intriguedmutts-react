import { useEffect, useState } from "react";

import "./Merch.css";

export default function Merch() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/store/products"); // or your Worker endpoint
      const data = await res.json();
      const list = data?.result || [];

      setProducts(list);
      if (list.length) setSelected(list[0]);
    })();
  }, []);

  return (
    <div className="merchPage">
      <section className="viewerWrap">
        {selected ? (
          <div className="viewerCard">
            <div className="viewerTop">
              <img
                className={`viewerImg cardImg${selected.name === 'Society Logo Tee (Black)' ? ' firstCardImg' : ''}`}
                src={selected.thumbnail_url}
                alt=""
              />
              <div className="viewerInfo">
                <h2 className="viewerTitle">{selected.name}</h2>
                <div className="viewerSub">Pick a size below</div>
                {/* <VariantPicker productId={selected.id} /> */}
              </div>
            </div>
          </div>
        ) : (
          <div className="viewerCard">Loading…</div>
        )}
      </section>

      <div className="loadedLine">
        Loaded {products.length} products
      </div>

      <section className="gridWrap">
        <div className="productGrid">
          {products.map((p, i) => (
            <button
              key={p.id}
              className="productCard"
              onClick={() => setSelected(p)}
              type="button"
            >
              <img
                className={`cardImg${i === 0 && p.name === 'Society Logo Tee (Black)' ? ' firstThumbImg' : ''}`}
                src={p.thumbnail_url}
                alt=""
              />
              <div className="cardTitle">{p.name}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Support & Info Panel */}
      <section className="supportPanel">
        <div className="supportContent">
          <div className="supportBlock">
            <h3 className="supportHeading">Customer Support</h3>
            <p>For order questions, shipping issues, or refund requests, please contact:</p>
            <p className="supportEmail">
              <a href="mailto:redavi19@asu.edu">redavi19@asu.edu</a>
            </p>
            <p className="supportNote">Please include your PayPal Order ID in your message so we can help you faster.</p>
          </div>

          <div className="supportBlock">
            <h3 className="supportHeading">Refunds & Order Issues</h3>
            <p>Payments are processed securely through PayPal. If you need to request a refund or report an issue with your order, contact us by email first.</p>
            <p>Approved refunds are issued back to the original PayPal payment method. Orders that have already entered production may not be eligible for cancellation.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
