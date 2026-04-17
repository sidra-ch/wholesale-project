"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { ScrollReveal, MagneticButton } from "@/components/motion";

export function CTASection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-candy via-red-500 to-red-600" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute -top-32 -right-32 w-[400px] h-[400px] bg-white/5 rounded-full"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-48 -left-48 w-[500px] h-[500px] bg-white/3 rounded-full"
      />

      <Container className="relative text-center">
        <ScrollReveal direction="up" blur>
          <motion.div
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white text-sm font-medium px-5 py-2 rounded-full mb-8"
          >
            <Sparkles className="h-4 w-4" />
            Start Growing Your Business Today
          </motion.div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 max-w-3xl mx-auto">
            Ready to Scale Your{" "}
            <span className="text-white/80">Confectionery Business?</span>
          </h2>
          <p className="text-lg text-white/70 max-w-xl mx-auto mb-10 leading-relaxed">
            Join 500+ retailers who trust Arslan Wholesale for premium products,
            competitive pricing, and reliable service.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <MagneticButton>
              <Link
                href="/register"
                className="group inline-flex items-center gap-2.5 px-8 py-4 bg-white text-candy rounded-2xl font-bold text-sm hover:shadow-2xl hover:shadow-white/20 transition-all duration-300"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-2xl font-bold text-sm hover:bg-white/20 transition-all duration-300"
              >
                Contact Sales
              </Link>
            </MagneticButton>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
