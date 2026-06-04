import type { Metadata } from "next";
import InfoPage, { InfoSection } from "@/components/marketing/InfoPage";

export const metadata: Metadata = { title: "Terms of Service", description: "Terms governing use of Readymetry." };

export default function TermsPage() {
  return (
    <InfoPage title="Terms of Service" intro="Effective June 4, 2026. By using Readymetry, you agree to these terms.">
      <InfoSection title="Service purpose">
        <p>Readymetry provides independent practice exams and readiness analytics. It is not affiliated with or endorsed by certification bodies unless explicitly stated.</p>
      </InfoSection>
      <InfoSection title="Accounts and acceptable use">
        <p>You are responsible for your account credentials and activity. You may not copy question banks, interfere with the service, share paid access, or attempt to bypass access controls.</p>
      </InfoSection>
      <InfoSection title="Results and availability">
        <p>Readiness scores are estimates and do not guarantee certification exam results. We may update content, features, or availability as the product develops.</p>
      </InfoSection>
      <InfoSection title="Contact">
        <p>Questions about these terms may be sent to hello@readymetry.com.</p>
      </InfoSection>
    </InfoPage>
  );
}
