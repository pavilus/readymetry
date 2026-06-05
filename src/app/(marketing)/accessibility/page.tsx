import type { Metadata } from "next";
import InfoPage, { InfoSection } from "@/components/marketing/InfoPage";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description: "Readymetry accessibility statement and support contact.",
};

export default function AccessibilityPage() {
  return (
    <InfoPage
      title="Accessibility Statement"
      intro="Readymetry is built to be usable by certification candidates across devices, browsers, and assistive technologies."
    >
      <InfoSection title="Our approach">
        <p>We aim to keep navigation predictable, text readable, forms labeled, keyboard paths usable, and contrast strong enough for practical study and exam review workflows.</p>
      </InfoSection>
      <InfoSection title="Ongoing improvements">
        <p>As the product grows, we review new pages and controls for accessibility issues during development and testing.</p>
      </InfoSection>
      <InfoSection title="Report a problem">
        <p>If you find an accessibility barrier, email hello@readymetry.com with the page, browser or device used, and a description of the issue.</p>
      </InfoSection>
    </InfoPage>
  );
}
