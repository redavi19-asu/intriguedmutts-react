import { useEffect, useState } from "react";
import { useConsent } from "../context/ConsentContext";

function ToggleRow({ id, label, description, checked, onChange, disabled = false }) {
  return (
    <label className={`consentToggleRow ${disabled ? "isDisabled" : ""}`} htmlFor={id}>
      <div className="consentToggleCopy">
        <span className="consentToggleTitle">{label}</span>
        <span className="consentToggleDescription">{description}</span>
      </div>
      <span className="consentToggleControl">
        <input
          id={id}
          type="checkbox"
          className="consentToggleInput"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          disabled={disabled}
        />
        <span className="consentToggleTrack" aria-hidden="true">
          <span className="consentToggleThumb" />
        </span>
      </span>
    </label>
  );
}

export default function PreferencesModal() {
  const {
    consent,
    isPreferencesOpen,
    closePreferences,
    savePreferences,
  } = useConsent();

  const [draft, setDraft] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
    setDraft({
      necessary: true,
      analytics: Boolean(consent.analytics),
      marketing: Boolean(consent.marketing),
      preferences: Boolean(consent.preferences),
    });
  }, [consent, isPreferencesOpen]);

  useEffect(() => {
    if (!isPreferencesOpen) return undefined;

    const handleEscape = (event) => {
      if (event.key === "Escape") closePreferences();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isPreferencesOpen, closePreferences]);

  if (!isPreferencesOpen) return null;

  const handleSave = () => {
    savePreferences(draft);
  };

  return (
    <div className="consentModalBackdrop" role="presentation" onClick={closePreferences}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="consent-modal-title"
        className="consentModal"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="consentModalHeader">
          <h2 id="consent-modal-title">Cookie Preferences</h2>
          <p>Choose which optional cookies Intrigued Mutts can use.</p>
        </header>

        <div className="consentModalBody">
          <ToggleRow
            id="consent-necessary"
            label="Necessary Cookies"
            description="Required for security, checkout, and core site functionality."
            checked
            onChange={() => {}}
            disabled
          />
          <ToggleRow
            id="consent-analytics"
            label="Analytics Cookies"
            description="Help us understand traffic and improve site performance."
            checked={draft.analytics}
            onChange={(checked) => setDraft((prev) => ({ ...prev, analytics: checked }))}
          />
          <ToggleRow
            id="consent-marketing"
            label="Marketing Cookies"
            description="Used to measure campaign performance and relevant promotions."
            checked={draft.marketing}
            onChange={(checked) => setDraft((prev) => ({ ...prev, marketing: checked }))}
          />
          <ToggleRow
            id="consent-preferences"
            label="Preferences Cookies"
            description="Remember display and content preferences for future visits."
            checked={draft.preferences}
            onChange={(checked) => setDraft((prev) => ({ ...prev, preferences: checked }))}
          />
        </div>

        <footer className="consentModalFooter">
          <button type="button" className="consentBtn consentBtnGhost" onClick={closePreferences}>
            Cancel
          </button>
          <button type="button" className="consentBtn consentBtnPrimary" onClick={handleSave}>
            Save Preferences
          </button>
        </footer>
      </section>
    </div>
  );
}
