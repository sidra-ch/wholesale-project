import { HeroSection } from "@/components/home/HeroSection";
import { BrandMarquee } from "@/components/home/BrandMarquee";
import { TrustBar } from "@/components/home/TrustBar";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { HotDeals } from "@/components/home/HotDeals";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { StatsCounter } from "@/components/home/StatsCounter";
import { ScrollStory } from "@/components/home/ScrollStory";
import { Testimonials } from "@/components/home/Testimonials";
import { CTASection } from "@/components/home/CTASection";
import { Newsletter } from "@/components/home/Newsletter";

export default function Home() {
  return (
    <>
      <HeroSection />
      <BrandMarquee />
      <TrustBar />
      <FeaturedCategories />
      <FeaturedProducts />
      <HotDeals />
      <WhyChooseUs />
      <StatsCounter />
      <ScrollStory />
      <Testimonials />
      <CTASection />
      <Newsletter />
    </>
  );
}
