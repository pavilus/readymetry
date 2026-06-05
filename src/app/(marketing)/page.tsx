import Navbar from "@/components/marketing/Navbar";
import Hero from "@/components/marketing/Hero";
import CertCatalog from "@/components/marketing/CertCatalog";
import HowItWorks from "@/components/marketing/HowItWorks";
import FeatureHighlights from "@/components/marketing/FeatureHighlights";
import ResourcesSection from "@/components/marketing/ResourcesSection";
import CTABanner from "@/components/marketing/CTABanner";
import Footer from "@/components/marketing/Footer";

export const dynamic = "force-dynamic";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <CertCatalog />
        <HowItWorks />
        <FeatureHighlights />
        <ResourcesSection />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
