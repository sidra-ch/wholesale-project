"use client";

import { Container } from "@/components/layout/Container";
import { Truck, ShieldCheck, Tag, Headphones } from "lucide-react";
import { useScrollFadeUp } from "@/hooks/useGSAPScroll";

const features = [
  {
    icon: Truck,
    title: "Fast & Reliable Delivery",
    desc: "Quick shipping across Pakistan",
  },
  {
    icon: ShieldCheck,
    title: "100% Original Products",
    desc: "Direct from trusted brands",
  },
  {
    icon: Tag,
    title: "Best Wholesale Prices",
    desc: "Save more on bulk orders",
  },
  {
    icon: Headphones,
    title: "24/7 Customer Support",
    desc: "We're always here to help",
  },
];

export function TrustBar() {
  const ref = useScrollFadeUp(".gsap-fade-up", 0.1, 30);

  return (
    <section className="py-8 border-y border-[#F2D6D6]/50 bg-white">
      <Container>
        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="gsap-fade-up flex items-center gap-3 p-4 rounded-[20px] cursor-default transition-all duration-300 hover:shadow-[0_10px_30px_rgba(229,57,53,0.08)] hover:-translate-y-1"
            >
              <div className="w-11 h-11 rounded-xl bg-[#FFE2E2] flex items-center justify-center flex-shrink-0">
                <f.icon className="h-5 w-5 text-candy" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#2E1B12] leading-tight">{f.title}</p>
                <p className="text-xs text-[#9A8B86] mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
