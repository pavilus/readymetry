import Navbar from "@/components/marketing/Navbar";
import Hero from "@/components/marketing/Hero";
import CertCatalog from "@/components/marketing/CertCatalog";
import HowItWorks from "@/components/marketing/HowItWorks";
import CTABanner from "@/components/marketing/CTABanner";
import Footer from "@/components/marketing/Footer";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <CertCatalog />
        <HowItWorks />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
