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
              <img className="viewerImg" src={selected.thumbnail_url} alt="" />
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
          {products.map((p) => (
            <button
              key={p.id}
              className="productCard"
              onClick={() => setSelected(p)}
              type="button"
            >
              <img className="cardImg" src={p.thumbnail_url} alt="" />
              <div className="cardTitle">{p.name}</div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
