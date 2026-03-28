import { useState } from "react";
import { getDoNotSellOptOut, setDoNotSellOptOut } from "../lib/consent";

export default function DoNotSell() {
  const [optedOut, setOptedOut] = useState(getDoNotSellOptOut());

  const handleToggle = () => {
    const next = !optedOut;
    setDoNotSellOptOut(next);
    setOptedOut(next);
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-12 text-white">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-orange-300/80">Intrigued Mutts</p>
        <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight">
          Do Not Sell Or Share My Personal Information
        </h1>
        <p className="mt-3 text-sm text-white/70">Last updated: March 12, 2026</p>
      </header>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 shadow-[0_20px_70px_rgba(0,0,0,0.45)]">
        <p className="text-white/80 leading-relaxed">
          Where applicable, you can opt out of the sale or sharing of personal information for
          advertising or related marketing activities. This control currently stores your preference
          on this device so we can respect your request in future updates.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <button
            type="button"
            onClick={handleToggle}
            className="inline-flex items-center justify-center rounded-xl px-4 h-11 text-sm font-bold bg-orange-400 text-black hover:bg-orange-300 transition"
          >
            {optedOut ? "You Have Opted Out" : "Opt Out Of Sale/Sharing"}
          </button>

          <p className="text-sm text-white/70">
            Current setting:
            <span className="ml-2 font-semibold text-white">
              {optedOut ? "Opt-out enabled" : "No opt-out saved"}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
