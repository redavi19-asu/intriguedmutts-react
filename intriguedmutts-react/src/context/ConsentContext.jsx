import { createContext, useCallback, useContext, useMemo, useState } from "react";
import {
  getDefaultConsent,
  getStoredConsent,
  hasSavedConsentChoice,
  saveConsent,
} from "../lib/consent";

const ConsentContext = createContext(null);

export function ConsentProvider({ children }) {
  const initialConsent = getStoredConsent() || getDefaultConsent();
  const initialHasChoice = hasSavedConsentChoice();

  const [consent, setConsent] = useState(initialConsent);
  const [hasChoice, setHasChoice] = useState(initialHasChoice);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  const acceptAll = useCallback(() => {
    const nextConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };

    saveConsent(nextConsent, "accept_all");
    setConsent(nextConsent);
    setHasChoice(true);
    setIsPreferencesOpen(false);
  }, []);

  const rejectNonEssential = useCallback(() => {
    const nextConsent = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };

    saveConsent(nextConsent, "reject_non_essential");
    setConsent(nextConsent);
    setHasChoice(true);
    setIsPreferencesOpen(false);
  }, []);

  const savePreferences = useCallback((nextPreferences) => {
    const nextConsent = {
      necessary: true,
      analytics: Boolean(nextPreferences.analytics),
      marketing: Boolean(nextPreferences.marketing),
      preferences: Boolean(nextPreferences.preferences),
    };

    saveConsent(nextConsent, "custom");
    setConsent(nextConsent);
    setHasChoice(true);
    setIsPreferencesOpen(false);
  }, []);

  const openPreferences = useCallback(() => {
    setIsPreferencesOpen(true);
  }, []);

  const closePreferences = useCallback(() => {
    setIsPreferencesOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      consent,
      hasChoice,
      showBanner: !hasChoice,
      isPreferencesOpen,
      acceptAll,
      rejectNonEssential,
      savePreferences,
      openPreferences,
      closePreferences,
    }),
    [
      consent,
      hasChoice,
      isPreferencesOpen,
      acceptAll,
      rejectNonEssential,
      savePreferences,
      openPreferences,
      closePreferences,
    ]
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent() {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error("useConsent must be used inside ConsentProvider");
  }
  return context;
}
