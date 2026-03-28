const CONSENT_STORAGE_KEY = "im_cookie_consent_v1";
const DO_NOT_SELL_STORAGE_KEY = "im_do_not_sell_opt_out_v1";

const DEFAULT_PREFERENCES = {
  necessary: true,
  analytics: false,
  marketing: false,
  preferences: false,
};

function parseConsent(rawValue) {
  if (!rawValue) return null;

  try {
    const parsed = JSON.parse(rawValue);
    if (!parsed || typeof parsed !== "object") return null;

    return {
      ...DEFAULT_PREFERENCES,
      necessary: true,
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
      preferences: Boolean(parsed.preferences),
      method: parsed.method || "custom",
      updatedAt: parsed.updatedAt || null,
    };
  } catch {
    return null;
  }
}

export function getDefaultConsent() {
  return { ...DEFAULT_PREFERENCES };
}

export function getStoredConsent() {
  if (typeof window === "undefined") return null;
  return parseConsent(window.localStorage.getItem(CONSENT_STORAGE_KEY));
}

export function hasSavedConsentChoice() {
  return getStoredConsent() !== null;
}

export function saveConsent(preferences, method = "custom") {
  if (typeof window === "undefined") return;

  const payload = {
    ...DEFAULT_PREFERENCES,
    necessary: true,
    analytics: Boolean(preferences.analytics),
    marketing: Boolean(preferences.marketing),
    preferences: Boolean(preferences.preferences),
    method,
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(payload));
}

export function clearConsent() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CONSENT_STORAGE_KEY);
}

function readConsentFlag(key) {
  const stored = getStoredConsent();
  if (!stored) return false;
  return Boolean(stored[key]);
}

export function canUseAnalytics() {
  return readConsentFlag("analytics");
}

export function canUseMarketing() {
  return readConsentFlag("marketing");
}

export function canUsePreferences() {
  return readConsentFlag("preferences");
}

export function getConsentStorageKey() {
  return CONSENT_STORAGE_KEY;
}

export function getDoNotSellOptOut() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(DO_NOT_SELL_STORAGE_KEY) === "true";
}

export function setDoNotSellOptOut(value) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DO_NOT_SELL_STORAGE_KEY, value ? "true" : "false");
}
