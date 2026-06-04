import type { Metadata } from "next";
import InfoPage, { InfoSection } from "@/components/marketing/InfoPage";

export const metadata: Metadata = { title: "Cookie Policy", description: "How Readymetry uses cookies and browser storage." };

export default function CookiesPage() {
  return (
    <InfoPage title="Cookie Policy" intro="Readymetry uses essential browser storage to keep accounts secure and preserve exam progress.">
      <InfoSection title="Essential storage">
        <p>Authentication cookies keep you signed in securely. Session storage preserves active exam questions, answers, flags, and remaining time when a page is refreshed.</p>
      </InfoSection>
      <InfoSection title="Payments and third parties">
        <p>Payment providers may use their own essential cookies while processing checkout. Readymetry does not currently use advertising cookies.</p>
      </InfoSection>
      <InfoSection title="Managing storage">
        <p>Blocking essential cookies or clearing browser storage may sign you out or remove locally saved exam progress.</p>
      </InfoSection>
    </InfoPage>
  );
}
