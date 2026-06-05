import type { Metadata } from "next";
import InfoPage, { InfoSection } from "@/components/marketing/InfoPage";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Refund and support policy for Readymetry purchases.",
};

export default function RefundPage() {
  return (
    <InfoPage
      title="Refund Policy"
      intro="Effective June 5, 2026. This policy explains how Readymetry handles refund requests for paid exam credits and readiness access."
    >
      <InfoSection title="Free access">
        <p>The Free Trial does not require payment and is not eligible for a refund because no purchase is made.</p>
      </InfoSection>
      <InfoSection title="Paid exam credits">
        <p>If a technical issue caused by Readymetry prevents you from starting or completing a purchased exam, contact hello@readymetry.com within 7 days of the purchase or affected exam attempt.</p>
        <p>Depending on the issue, we may restore the exam credit, provide replacement access, or issue a refund.</p>
      </InfoSection>
      <InfoSection title="Completed exams">
        <p>Completed exam sessions and delivered readiness analytics are generally not refundable unless a platform error materially affected the exam experience.</p>
      </InfoSection>
      <InfoSection title="How to request help">
        <p>Email hello@readymetry.com with your account email, purchase date, and a short description of what happened.</p>
      </InfoSection>
    </InfoPage>
  );
}
