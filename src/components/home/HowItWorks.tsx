"use client";

import { useRef } from "react";
import { Container } from "@/components/layout/Container";
import { motion, useInView } from "framer-motion";
import { Search, ShoppingCart, Truck, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Browse & Select",
    desc: "Explore 2,000+ products from 50+ trusted Pakistani brands at wholesale prices.",
    color: "from-blue-500 to-indigo-500",
    shadow: "shadow-blue-500/20",
  },
  {
    icon: ShoppingCart,
    step: "02",
    title: "Place Bulk Order",
    desc: "Add items to cart, set quantities, and checkout with secure payment options.",
    color: "from-candy to-red-500",
    shadow: "shadow-candy/20",
  },
  {
    icon: Truck,
    step: "03",
    title: "Fast Delivery",
    desc: "We pack and ship within 48 hours. Track your order in real-time nationwide.",
    color: "from-emerald-500 to-teal-500",
    shadow: "shadow-emerald-500/20",
  },
  {
    icon: TrendingUp,
    step: "04",
    title: "Grow Business",
    desc: "Stock your shelves, delight customers, and watch your retail business scale.",
    color: "from-amber-500 to-orange-500",
    shadow: "shadow-amber-500/20",
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#FFFAF6] to-white" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-candy/10 to-transparent" />

      <Container className="relative">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-[#FFE2E2] text-candy text-xs font-bold tracking-widest uppercase px-5 py-2.5 rounded-full border border-candy/10 mb-5"
          >
            Simple Process
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[28px] sm:text-[36px] lg:text-[40px] font-bold text-[#2E1B12] leading-tight"
          >
            How It Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#6B5B55] text-base lg:text-lg mt-4"
          >
            Start ordering wholesale in 4 simple steps. No minimum hassle, just great products at unbeatable prices.
          </motion.p>
        </div>

        {/* Steps */}
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5 relative">
          {/* Connecting line — desktop only */}
          <div className="hidden lg:block absolute top-[60px] left-[12%] right-[12%] h-[2px]">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: "easeInOut" }}
              className="w-full h-full bg-gradient-to-r from-blue-200 via-candy/30 via-emerald-200 to-amber-200 origin-left rounded-full"
            />
          </div>

          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.6, delay: 0.15 * i + 0.2 }}
              className="relative group"
            >
              <div className="flex flex-col items-center text-center">
                {/* Icon circle */}
                <div className={`relative w-[100px] h-[100px] lg:w-[120px] lg:h-[120px] rounded-[28px] bg-gradient-to-br ${step.color} ${step.shadow} shadow-xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-2`}>
                  <step.icon className="h-10 w-10 lg:h-12 lg:w-12 text-white" strokeWidth={1.5} />
                  {/* Step number badge */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                    <span className="text-xs font-extrabold text-[#2E1B12]">{step.step}</span>
                  </div>
                  {/* Glow ring on hover */}
                  <div className={`absolute inset-0 rounded-[28px] bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
                </div>

                {/* Text */}
                <h3 className="font-bold text-[#2E1B12] text-lg mb-2">{step.title}</h3>
                <p className="text-[#9A8B86] text-sm leading-relaxed max-w-[240px]">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
