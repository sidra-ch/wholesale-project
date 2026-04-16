"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import {
  SectionHeading,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Owner, Sweet Corner Store",
    text: "Arslan Wholesale has transformed our sourcing. The quality is consistently excellent and their prices can't be beat. Our customers love the range.",
    rating: 5,
    avatar: "SM",
  },
  {
    name: "James Rodriguez",
    role: "Purchasing Manager, RetailMax",
    text: "Reliable delivery and outstanding product range. They've become our primary confectionery supplier. The account management team is exceptional.",
    rating: 5,
    avatar: "JR",
  },
  {
    name: "Emily Chen",
    role: "Founder, CandyLand Boutique",
    text: "As a boutique retailer, I need unique premium products. Arslan Wholesale delivers exactly that with professional service every single time.",
    rating: 5,
    avatar: "EC",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 lg:py-36 relative overflow-hidden">
      {/* Dark premium background */}
      <div className="absolute inset-0 bg-gradient-to-br from-chocolate via-[#2a1509] to-chocolate" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <motion.div
        animate={{ x: [0, 30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-candy/5 rounded-full blur-[150px]"
      />

      <Container className="relative">
        <SectionHeading
          badge="Testimonials"
          title="What Our Partners Say"
          description="Join hundreds of satisfied retailers who trust us as their wholesale partner."
          light
        />

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-7 mt-16">
          {testimonials.map((t, i) => (
            <StaggerItem key={i}>
              <motion.div
                whileHover={{ y: -6 }}
                className="h-full glass-dark rounded-3xl p-8 flex flex-col"
              >
                <Quote className="h-10 w-10 text-candy/20 mb-5" />
                <p className="text-white/75 text-sm leading-relaxed mb-8 flex-1">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star
                      key={j}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-candy to-red-500 flex items-center justify-center text-white text-xs font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">
                      {t.name}
                    </p>
                    <p className="text-white/40 text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </section>
  );
}
