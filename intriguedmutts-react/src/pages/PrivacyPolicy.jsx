export default function PrivacyPolicy() {
  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-12 text-white">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-orange-300/80">Intrigued Mutts</p>
        <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight">Privacy Policy</h1>
        <p className="mt-3 text-sm text-white/70">Last updated: March 12, 2026</p>
      </header>

      <div className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 shadow-[0_20px_70px_rgba(0,0,0,0.45)]">
        <section>
          <h2 className="text-xl font-bold">Information We Collect</h2>
          <p className="mt-3 text-white/80 leading-relaxed">
            We collect information you provide directly, such as contact details when you submit a
            support message or complete a purchase flow. We may also collect basic technical
            information like browser type, device details, and interaction patterns to keep the site
            secure and reliable.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold">Cookies And Tracking Technologies</h2>
          <p className="mt-3 text-white/80 leading-relaxed">
            Intrigued Mutts uses cookies and similar technologies for core features, site
            preferences, analytics, and marketing where allowed. Necessary cookies are always active
            because they support essential operations. Optional categories are controlled by your
            cookie choices.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold">How We Use Information</h2>
          <p className="mt-3 text-white/80 leading-relaxed">
            We use information to provide products and services, process transactions, communicate
            updates, troubleshoot issues, and improve the user experience. Where consent is required,
            we only use optional data for analytics or marketing after you opt in.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold">Third-Party Services</h2>
          <p className="mt-3 text-white/80 leading-relaxed">
            Some site features may rely on third-party providers such as payment processors,
            embedded content services, or commerce integrations. These providers may process data
            under their own privacy terms when their tools are enabled.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold">Your Choices And Opt-Out Options</h2>
          <p className="mt-3 text-white/80 leading-relaxed">
            You can update cookie preferences anytime through the Manage Preferences controls and use
            browser settings to manage cookies directly. You may also request data access, updates,
            or deletion where applicable by contacting us.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold">Contact Information</h2>
          <p className="mt-3 text-white/80 leading-relaxed">
            For privacy questions, email us at
            <a className="ml-1 font-semibold text-orange-300 hover:text-orange-200" href="mailto:redavi19@asu.edu">
              redavi19@asu.edu
            </a>
            .
          </p>
        </section>
      </div>
    </section>
  );
}
