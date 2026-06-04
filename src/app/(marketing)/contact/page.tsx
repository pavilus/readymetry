import type { Metadata } from "next";
import InfoPage, { InfoSection } from "@/components/marketing/InfoPage";

export const metadata: Metadata = { title: "Contact", description: "Contact Readymetry support and sales." };

export default function ContactPage() {
  return (
    <InfoPage title="Contact Readymetry" intro="Questions about your account, exam access, or workforce readiness? Reach out directly.">
      <InfoSection title="Support">
        <p>Email <a className="font-semibold text-brand-700 underline" href="mailto:hello@readymetry.com">hello@readymetry.com</a>. Include the email address on your account and a short description of the issue.</p>
      </InfoSection>
      <InfoSection title="Workforce inquiries">
        <p>For team preparation and organizational readiness, email us with your certification goals and expected number of learners.</p>
      </InfoSection>
    </InfoPage>
  );
}
