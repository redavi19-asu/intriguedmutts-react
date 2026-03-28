export default function CookiePolicy() {
  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-12 text-white">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-orange-300/80">Intrigued Mutts</p>
        <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight">Cookie Policy</h1>
        <p className="mt-3 text-sm text-white/70">Last updated: March 12, 2026</p>
      </header>

      <div className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 shadow-[0_20px_70px_rgba(0,0,0,0.45)]">
        <section>
          <h2 className="text-xl font-bold">What Cookies Are</h2>
          <p className="mt-3 text-white/80 leading-relaxed">
            Cookies are small files stored on your device that help websites remember useful
            information, like your preferences and session details.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold">Types Of Cookies We May Use</h2>
          <p className="mt-3 text-white/80 leading-relaxed">
            We may use four categories: necessary, analytics, marketing, and preferences cookies.
            Necessary cookies keep core features working. Optional categories are only enabled if you
            allow them.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold">Necessary Vs Optional Cookies</h2>
          <div className="mt-3 space-y-2 text-white/80 leading-relaxed">
            <p><span className="font-semibold text-white">Necessary:</span> Required for security, checkout, and basic navigation.</p>
            <p><span className="font-semibold text-white">Analytics:</span> Help us understand what content performs well.</p>
            <p><span className="font-semibold text-white">Marketing:</span> Support campaign measurement and promotions.</p>
            <p><span className="font-semibold text-white">Preferences:</span> Remember your non-essential display settings.</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold">How To Change Consent Choices</h2>
          <p className="mt-3 text-white/80 leading-relaxed">
            You can reopen cookie controls at any time from the site footer and update your consent
            preferences. Your latest selection is saved locally in your browser.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold">Browser-Level Cookie Controls</h2>
          <p className="mt-3 text-white/80 leading-relaxed">
            Most browsers let you block or remove cookies globally. If you disable all cookies, some
            site features may not function as expected.
          </p>
        </section>
      </div>
    </section>
  );
}
