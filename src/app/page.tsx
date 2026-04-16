import { HeroSection } from "@/components/home/HeroSection";
import { BrandMarquee } from "@/components/home/BrandMarquee";
import { TrustBar } from "@/components/home/TrustBar";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { HotDeals } from "@/components/home/HotDeals";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Newsletter } from "@/components/home/Newsletter";

export default function Home() {
  return (
    <>
      <HeroSection />
      <BrandMarquee />
      <TrustBar />
      <FeaturedCategories />
      <HotDeals />
      <WhyChooseUs />
      <Newsletter />
    </>
  );
}
