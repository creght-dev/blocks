import NavbarAiSeo from "../../navbar/navbar-ai-seo/navbar-ai-seo"
import HeroAiSeo from "../../hero/hero-ai-seo/hero-ai-seo"
import LogoWallAiSeo from "../../logoWall/logo-wall-ai-seo/logo-wall-ai-seo"
import FeaturesAiSeo from "../../features/features-ai-seo/features-ai-seo"
import FeatureListAiSeo from "../../features/feature-list-ai-seo/feature-list-ai-seo"
import TestimonialsAiSeo from "../../testimonials/testimonials-ai-seo/testimonials-ai-seo"
import PricingAiSeo from "../../pricing/pricing-ai-seo/pricing-ai-seo"
import CtaAiSeo from "../../cta/cta-ai-seo/cta-ai-seo"
import FooterAiSeo from "../../footer/footer-ai-seo/footer-ai-seo"

export default function LandingAiSeo({ className = "" }: { className?: string }) {
  return (
    <div className={`min-h-dvh overflow-x-clip bg-[#050505] font-sans text-white antialiased selection:bg-[#8c45ff]/50 selection:text-white ${className}`}>
      <NavbarAiSeo />
      <main>
        <HeroAiSeo />
        <LogoWallAiSeo />
        <FeaturesAiSeo />
        <FeatureListAiSeo />
        <TestimonialsAiSeo />
        <PricingAiSeo />
        <CtaAiSeo />
      </main>
      <FooterAiSeo />
    </div>
  )
}
