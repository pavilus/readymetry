import type { Metadata } from "next";
import InfoPage, { InfoSection } from "@/components/marketing/InfoPage";

export const metadata: Metadata = { title: "Privacy Policy", description: "How Readymetry handles account, exam, and payment information." };

export default function PrivacyPage() {
  return (
    <InfoPage title="Privacy Policy" intro="Effective June 4, 2026. This policy explains the information Readymetry collects and how it is used.">
      <InfoSection title="Information we collect">
        <p>We collect account details, certification selections, exam activity, performance results, and support communications needed to provide the service.</p>
        <p>Payment details are processed by Stripe. Readymetry does not store full payment card numbers.</p>
      </InfoSection>
      <InfoSection title="How information is used">
        <p>Information is used to operate accounts, deliver practice exams, calculate readiness analytics, fulfill purchases, prevent abuse, and improve the product.</p>
      </InfoSection>
      <InfoSection title="Service providers and retention">
        <p>Readymetry uses providers including Supabase, Stripe, and infrastructure hosting services. Information is retained only as long as needed for the service, legal obligations, and security.</p>
      </InfoSection>
      <InfoSection title="Your choices">
        <p>You may request access, correction, or deletion of your personal information by emailing hello@readymetry.com.</p>
      </InfoSection>
    </InfoPage>
  );
}
