import { useEffect, useState } from "react";
import { getQuote } from "../lib/stocksApi";

export default function StockQuoteTest({ symbol = "AAPL" }) {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;

    getQuote(symbol)
      .then((d) => mounted && setData(d))
      .catch((e) => mounted && setErr(e.message));

    return () => {
      mounted = false;
    };
  }, [symbol]);

  return (
    <div style={{ padding: 16 }}>
      <h2>Stock Quote Test</h2>

      {err && <pre>{err}</pre>}
      {!err && !data && <p>Loading...</p>}

      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
