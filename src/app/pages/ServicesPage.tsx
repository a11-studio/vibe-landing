import { FooterSection } from "@/app/components/FooterSection";
import { ServicesManifestoSection } from "@/app/components/ServicesManifestoSection";
import { ServicesPageHero } from "@/app/components/ServicesPageHero";
import { ServicesSection } from "@/app/components/ServicesSection";

export function ServicesPage() {
  return (
    <div className="relative w-full bg-white">
      <ServicesPageHero />
      <ServicesManifestoSection />
      <ServicesSection variant="spacious" />
      <FooterSection />
    </div>
  );
}
