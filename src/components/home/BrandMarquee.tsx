"use client";

import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { useScrollFadeUp } from "@/hooks/useGSAPScroll";

const brands = [
  { name: "Hilal Foods", logo: "/images/brands/hilal-foods.svg" },
  { name: "Jojo Candy", logo: "/images/brands/jojo-candy.svg" },
  { name: "Kim's", logo: "/images/brands/kims.svg" },
  { name: "LuLu Wafer", logo: "/images/brands/lulu-wafer.svg" },
  { name: "Candyland", logo: "/images/brands/candyland.svg" },
  { name: "Fair", logo: "/images/brands/fair.svg" },
  { name: "Giggly", logo: "/images/brands/giggly.svg" },
  { name: "Mayfair", logo: "/images/brands/mayfair.svg" },
  { name: "Gala", logo: "/images/brands/gala.svg" },
  { name: "Fruity Pops", logo: "/images/brands/fruity-pops.svg" },
  { name: "Kolson", logo: "/images/brands/kolson.svg" },
  { name: "Mitchell's", logo: "/images/brands/mitchells.svg" },
  { name: "LU", logo: "/images/brands/lu.svg" },
  { name: "Peek Freans", logo: "/images/brands/peek-freans.svg" },
  { name: "Prince", logo: "/images/brands/prince.svg" },
  { name: "Rio", logo: "/images/brands/rio.svg" },
  { name: "TUC", logo: "/images/brands/tuc.svg" },
  { name: "Cocomo", logo: "/images/brands/cocomo.svg" },
  { name: "Bisconni", logo: "/images/brands/bisconni.svg" },
  { name: "Sooper", logo: "/images/brands/sooper.svg" },
];

function BrandLogo({ name, logo }: { name: string; logo: string }) {
  return (
    <div className="group flex-shrink-0 flex items-center justify-center px-5 sm:px-7">
      <div className="w-[100px] h-[40px] sm:w-[130px] sm:h-[48px] relative grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
        <Image
          src={logo}
          alt={name}
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
}

export function BrandMarquee() {
  const sectionRef = useScrollFadeUp(".gsap-fade-up", 0.1, 20);

  return (
    <section className="py-8 sm:py-10 mt-6 sm:mt-10" ref={sectionRef}>
      <Container>
        <p className="gsap-fade-up text-center text-xs font-bold tracking-widest uppercase text-candy mb-5">
          Trusted Pakistani Brands
        </p>
      </Container>

      {/* Marquee wrapper */}
      <div className="gsap-fade-up relative border-y border-[#F2D6D6]/50 bg-white/60 backdrop-blur-sm overflow-hidden">
        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 z-10 bg-gradient-to-r from-[#FFF6EF] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 z-10 bg-gradient-to-l from-[#FFF6EF] to-transparent" />

        {/* Scrolling track */}
        <div className="flex items-center h-[70px] sm:h-[84px] marquee-track group">
          {/* First copy */}
          <div className="flex items-center animate-marquee group-hover:[animation-play-state:paused]">
            {brands.map((b) => (
              <BrandLogo key={b.name} name={b.name} logo={b.logo} />
            ))}
          </div>
          {/* Duplicate for seamless loop */}
          <div className="flex items-center animate-marquee group-hover:[animation-play-state:paused]" aria-hidden>
            {brands.map((b) => (
              <BrandLogo key={`dup-${b.name}`} name={b.name} logo={b.logo} />
            ))}
          </div>
        </div>
      </div>

      {/* Inline keyframes — scoped to this component */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          animation: marquee 120s linear infinite;
          will-change: transform;
        }
      `}</style>
    </section>
  );
}
