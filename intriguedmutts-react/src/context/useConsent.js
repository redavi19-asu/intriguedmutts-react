import { useContext } from "react";
import { ConsentContext } from "./consentState";
export function useConsent() {
  const context = useContext(ConsentContext);
  if (!context) throw new Error("useConsent must be used inside ConsentProvider");
  return context;
}
