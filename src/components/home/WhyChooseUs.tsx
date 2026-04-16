"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import {
  DollarSign,
  ShieldCheck,
  RotateCcw,
  Headphones,
  Star,
  ChevronLeft,
  ChevronRight,
  Quote,
} from "lucide-react";
import { useScrollFadeUp } from "@/hooks/useGSAPScroll";

const features = [
  {
    icon: DollarSign,
    title: "Bulk Pricing",
    desc: "More you buy, more you save",
  },
  {
    icon: ShieldCheck,
    title: "Quality Guarantee",
    desc: "100% original & fresh products",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    desc: "Hassle-free return policy",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    desc: "24/7 customer assistance",
  },
];

const testimonials = [
  {
    name: "Ahmed Khan",
    role: "Retail Store Owner",
    location: "Lahore",
    text: "Arslan Wholesale has transformed our business. Great prices, fast delivery, and amazing quality!",
    rating: 5,
  },
  {
    name: "Fatima Ali",
    role: "Shop Manager",
    location: "Karachi",
    text: "Best wholesale platform in Pakistan. Their product range and pricing can't be matched anywhere.",
    rating: 5,
  },
  {
    name: "Hassan Raza",
    role: "Distributor",
    location: "Islamabad",
    text: "Reliable supply chain and excellent customer support. My go-to partner for wholesale confectionery.",
    rating: 5,
  },
];

export function WhyChooseUs() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const ref = useScrollFadeUp(".gsap-fade-up", 0.12, 30);

  const next = () => setActiveTestimonial((p) => (p + 1) % testimonials.length);
  const prev = () => setActiveTestimonial((p) => (p - 1 + testimonials.length) % testimonials.length);

  const t = testimonials[activeTestimonial];

  return (
    <section className="py-16 lg:py-20">
      <Container>
        {/* Header */}
        <div className="mb-10">
          <p className="text-candy text-xs font-bold tracking-widest uppercase mb-2">
            Why Retailers Trust Arslan Wholesale
          </p>
          <h2 className="text-[28px] sm:text-[34px] font-bold text-[#2E1B12]">
            Your Success is Our Priority!
          </h2>
        </div>

        <div ref={ref} className="grid lg:grid-cols-2 gap-8">
          {/* Left: 2x2 Feature Grid */}
          <div className="grid grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div
                key={i}
                className="gsap-fade-up bg-white border border-[#F2D6D6]/50 rounded-[20px] p-5 hover:shadow-[0_10px_30px_rgba(229,57,53,0.08)] hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FFE2E2] flex items-center justify-center mb-3">
                  <f.icon className="h-5 w-5 text-candy" />
                </div>
                <h3 className="font-bold text-[#2E1B12] text-[16px]">{f.title}</h3>
                <p className="text-xs text-[#9A8B86] mt-1">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Right: Testimonial Card */}
          <div className="gsap-fade-up bg-[#FFF6EF] rounded-[20px] p-8 flex flex-col justify-between relative overflow-hidden border border-[#F2D6D6]/30">
            <div>
              <Quote className="h-10 w-10 text-candy/20 mb-4" />
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeTestimonial}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-[#2E1B12] text-base leading-relaxed"
                >
                  &ldquo;{t.text}&rdquo;
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div>
                <div className="flex gap-0.5 mb-2">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTestimonial}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <p className="font-bold text-[#2E1B12] text-sm">{t.name}</p>
                    <p className="text-xs text-[#6B5B55]">{t.role} &bull; {t.location}</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={prev}
                  className="w-9 h-9 rounded-full border border-[#F2D6D6] flex items-center justify-center hover:bg-candy hover:text-white hover:border-candy transition-all text-[#2E1B12]"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={next}
                  className="w-9 h-9 rounded-full border border-[#F2D6D6] flex items-center justify-center hover:bg-candy hover:text-white hover:border-candy transition-all text-[#2E1B12]"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
