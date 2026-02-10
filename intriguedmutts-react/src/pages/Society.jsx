import { useNavigate } from "react-router-dom";

export default function Society() {
  const navigate = useNavigate();
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "80px 24px",
        color: "#f8f8f8",
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.85), rgba(0,0,0,0.92))",
      }}
    >
      <button
        onClick={() => {
          if (window.history.length > 1) {
            navigate(-1);
          } else {
            navigate("/home");
          }
        }}
        style={{
          marginBottom: 40,
          padding: "10px 16px",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.18)",
          background: "rgba(0,0,0,0.6)",
          color: "#fff",
          fontWeight: 800,
          cursor: "pointer",
        }}
      >
        ← Back
      </button>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* HERO */}
        <section style={{ marginBottom: 120 }}>
          <h1
            style={{
              fontSize: 56,
              fontWeight: 950,
              letterSpacing: -1,
              marginBottom: 20,
            }}
          >
            The Intrigued Mutts Society
          </h1>

          <p
            style={{
              fontSize: 20,
              maxWidth: 720,
              opacity: 0.9,
              lineHeight: 1.6,
            }}
          >
            Where finance meets fashion — and curiosity becomes a lifestyle.
          </p>

          <p style={{ maxWidth: 720, opacity: 0.85, marginTop: 28 }}>
            The Intrigued Mutts Society is a fictional lifestyle collective built
            at the intersection of markets, mindset, and style. By day, the
            Mutts study charts, dividends, and cycles. By night, they argue
            strategy over espresso and sketch silhouettes in notebooks.
            <br />
            <br />
            It isn’t about hype.
            <br />
            It’s about paying attention — and dressing like you mean it.
          </p>
        </section>

        {/* ORIGIN */}
        <section style={{ marginBottom: 110 }}>
          <h2 style={{ fontSize: 34, fontWeight: 900 }}>How the Society Began</h2>

          <p style={{ maxWidth: 760, opacity: 0.9, marginTop: 18 }}>
            It started quietly.
            <br />
            Two Mutts on a bench.
            One coffee.
            Two notebooks.
            <br />
            <br />
            One page full of numbers.
            The other full of jacket designs and handwritten rules about risk.
            <br />
            <br />
            They realized something:
            <br />
            <strong>Money and style follow the same discipline.</strong>
            <br />
            Precision. Patience. Conviction.
            <br />
            <br />
            Soon more showed up — designers, analysts, quiet builders.
            The benches filled.
            The coats got sharper.
            The notebooks thicker.
            <br />
            The Society was born.
          </p>
        </section>

        {/* PHILOSOPHY */}
        <section style={{ marginBottom: 110 }}>
          <h2 style={{ fontSize: 34, fontWeight: 900 }}>The Rules of the Pack</h2>

          <ul
            style={{
              marginTop: 24,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
              gap: 18,
              listStyle: "none",
              padding: 0,
            }}
          >
            {[
              "Study systems, not noise",
              "Cash flow matters",
              "Tailoring matters",
              "Patience compounds",
              "Risk must be measured",
              "Silhouettes stay clean",
              "Data beats hype",
              "Curiosity never goes out of style",
              "Stay intrigued",
            ].map((rule) => (
              <li
                key={rule}
                style={{
                  padding: 18,
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.14)",
                }}
              >
                {rule}
              </li>
            ))}
          </ul>
        </section>

        {/* MARKETS */}
        <section style={{ marginBottom: 110 }}>
          <h2 style={{ fontSize: 34, fontWeight: 900 }}>
            Why the Society Watches Markets
          </h2>

          <p style={{ maxWidth: 760, opacity: 0.9, marginTop: 18 }}>
            The Mutts don’t chase trends.
            <br />
            They map them.
            <br />
            <br />
            Dividends, cycles, drawdowns, earnings, human psychology — every
            datapoint is another thread in the system.
            <br />
            <br />
            Markets are design problems too.
            <br />
            Numbers instead of fabric.
            Probabilities instead of thread.
            <br />
            <br />
            The dashboard exists for the same reason the jackets do:
            <br />
            <strong>to practice discipline in public.</strong>
          </p>
        </section>

        {/* FASHION */}
        <section style={{ marginBottom: 110 }}>
          <h2 style={{ fontSize: 34, fontWeight: 900 }}>
            Why Fashion Is Part of the Mission
          </h2>

          <p style={{ maxWidth: 760, opacity: 0.9, marginTop: 18 }}>
            Style isn’t decoration.
            <br />
            It’s signaling.
            <br />
            <br />
            A uniform for people who read filings in cafés and sketch portfolio
            ideas on napkins.
            <br />
            <br />
            Every hoodie, coat, patch, or cap is part of the Society’s visual
            language — minimal, deliberate, quietly confident.
            <br />
            <br />
            If you know, you know.
          </p>
        </section>

        {/* DISCLAIMER */}
        <section style={{ marginBottom: 140 }}>
          <h2 style={{ fontSize: 30, fontWeight: 900 }}>Disclaimer</h2>

          <p style={{ maxWidth: 820, opacity: 0.8, marginTop: 18 }}>
            Intrigued Mutts is a fictional lifestyle brand and creative universe.
            Any financial dashboards, watchlists, or commentary are provided for
            educational and entertainment purposes only and do not constitute
            financial advice, investment recommendations, or solicitation to buy
            or sell securities.
            <br />
            <br />
            Always conduct your own research and consult a licensed financial
            professional before making investment decisions.
          </p>
        </section>

        {/* CLOSER */}
        <section style={{ textAlign: "center" }}>
          <h2
            style={{
              fontSize: 42,
              fontWeight: 950,
              letterSpacing: -0.5,
            }}
          >
            Dress sharp. Think long-term. Stay intrigued.
          </h2>
        </section>
      </div>
    </div>
  );
}
