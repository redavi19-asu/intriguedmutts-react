import { useConsent } from "../context/ConsentContext";

export default function CookieBanner() {
  const {
    showBanner,
    acceptAll,
    rejectNonEssential,
    openPreferences,
  } = useConsent();

  if (!showBanner) return null;

  return (
    <section className="consentBanner" aria-live="polite" aria-label="Cookie consent banner">
      <div className="consentBannerGlow" aria-hidden="true" />
      <div className="consentBannerContent">
        <p className="consentBannerTitle">Your privacy, your choice</p>
        <p className="consentBannerText">
          We use necessary cookies to keep Intrigued Mutts running, and optional cookies to improve
          analytics, personalization, and marketing.
        </p>
      </div>

      <div className="consentBannerActions">
        <button type="button" className="consentBtn consentBtnGhost" onClick={rejectNonEssential}>
          Reject Non-Essential
        </button>
        <button type="button" className="consentBtn consentBtnSecondary" onClick={openPreferences}>
          Manage Preferences
        </button>
        <button type="button" className="consentBtn consentBtnPrimary" onClick={acceptAll}>
          Accept All
        </button>
      </div>
    </section>
  );
}
