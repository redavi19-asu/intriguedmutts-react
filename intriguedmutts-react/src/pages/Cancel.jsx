import { Link } from "react-router-dom";

export default function Cancel() {
  const base = import.meta.env.BASE_URL;

  return (
    <div
      className="min-h-screen text-white"
      style={{
        backgroundImage: `
          linear-gradient(rgba(0,0,0,.75), rgba(0,0,0,.75)),
          url('${base}legacy/merchbackground.png')
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="mx-auto max-w-[900px] px-[18px] py-[28px]">
        <div
          className="rounded-[18px] p-[18px]"
          style={{
            border: "1px solid rgba(255,255,255,.16)",
            background: "rgba(17,17,17,.55)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 30px 90px rgba(0,0,0,0.75)",
          }}
        >
          <h1 className="m-0 mb-2 text-[28px] font-extrabold">
            Payment canceled
          </h1>

          <div style={{ opacity: 0.8 }}>
            No worries — your cart is still saved.
          </div>

          <div className="mt-3 flex flex-wrap gap-3">
            <Link
              to="/merch"
              className="inline-block rounded-[12px] px-4 py-3 font-extrabold no-underline"
              style={{
                border: "1px solid rgba(58,160,255,.9)",
                color: "#fff",
              }}
            >
              ← Back to Merch
            </Link>

            <Link
              to="/"
              className="inline-block rounded-[12px] px-4 py-3 font-extrabold no-underline"
              style={{
                border: "1px solid rgba(255,255,255,.25)",
                color: "#fff",
              }}
            >
              ← Back to Clubhouse
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
