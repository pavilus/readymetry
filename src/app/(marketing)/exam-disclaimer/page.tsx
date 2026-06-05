import type { Metadata } from "next";
import InfoPage, { InfoSection } from "@/components/marketing/InfoPage";

export const metadata: Metadata = {
  title: "Exam Disclaimer",
  description: "Independent exam-preparation disclaimer for Readymetry.",
};

export default function ExamDisclaimerPage() {
  return (
    <InfoPage
      title="Exam Disclaimer"
      intro="Readymetry provides independent practice exams and readiness analytics. It does not provide official certification exams."
    >
      <InfoSection title="Independent preparation">
        <p>Readymetry is not affiliated with, sponsored by, or endorsed by certification bodies unless a page explicitly says otherwise.</p>
        <p>Question banks are original practice material organized around certification domains and referenced industry material. They are not official exam questions.</p>
      </InfoSection>
      <InfoSection title="Readiness scores">
        <p>Scores, pass-probability indicators, weak-area analysis, and recommendations are preparation tools. They do not guarantee that a candidate will pass an official certification exam.</p>
      </InfoSection>
      <InfoSection title="User responsibility">
        <p>Candidates should review the official exam body of knowledge, eligibility rules, reference materials, and current certification-body requirements before scheduling an exam.</p>
      </InfoSection>
    </InfoPage>
  );
}
