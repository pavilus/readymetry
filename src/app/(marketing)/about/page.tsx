import type { Metadata } from "next";
import InfoPage, { InfoSection } from "@/components/marketing/InfoPage";

export const metadata: Metadata = { title: "About", description: "About Readymetry and its certification readiness mission." };

export default function AboutPage() {
  return (
    <InfoPage title="About Readymetry" intro="Readymetry helps inspection professionals replace guesswork with measurable certification readiness.">
      <InfoSection title="What we are building">
        <p>Our practice environment combines realistic exam sessions, detailed answer review, and performance analytics so candidates can focus their study time where it matters most.</p>
      </InfoSection>
      <InfoSection title="Content principles">
        <p>Question banks are organized around certification domains and referenced industry material. Readymetry is an independent preparation platform and does not reproduce official certification examinations.</p>
      </InfoSection>
    </InfoPage>
  );
}
