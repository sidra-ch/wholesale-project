"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ScrollReveal, SectionHeading } from "@/components/motion";
import { Container } from "@/components/layout/Container";
import { motion } from "framer-motion";
import { Package, Globe, Award } from "lucide-react";
import { getRandomImages } from "@/lib/data";

const storyTemplates = [
  {
    badge: "Our Mission",
    title: "Sourcing the World's Finest Confectionery",
    description:
      "We partner directly with premium manufacturers across 15+ countries to bring you the highest quality biscuits, chocolates, and candies at unbeatable wholesale prices. Every product passes our rigorous quality standards.",
    icon: Globe,
    stat: "15+ Countries",
    statLabel: "Global Sourcing Network",
    direction: "left" as const,
    imagePosition: "left" as const,
  },
  {
    badge: "Quality Promise",
    title: "Every Product, Quality Guaranteed",
    description:
      "From temperature-controlled warehousing to careful packaging, we ensure every order arrives in perfect condition. Our quality control team inspects products at multiple stages before they reach you.",
    icon: Award,
    stat: "99.8%",
    statLabel: "Quality Rating",
    direction: "right" as const,
    imagePosition: "right" as const,
  },
  {
    badge: "Logistics",
    title: "Fast, Reliable Nationwide Delivery",
    description:
      "With strategically placed distribution centers and a dedicated logistics fleet, we deliver your wholesale orders within 48 hours. Real-time tracking and dedicated account managers keep you informed every step of the way.",
    icon: Package,
    stat: "48hrs",
    statLabel: "Average Delivery Time",
    direction: "left" as const,
    imagePosition: "left" as const,
  },
];

export function ScrollStory() {
  const [storyImages, setStoryImages] = useState<string[]>(["", "", ""]);

  useEffect(() => {
    setStoryImages(getRandomImages(3));
  }, []);

  const stories = storyTemplates.map((t, i) => ({ ...t, image: storyImages[i] }));

  return (
    <section className="py-24 lg:py-36">
      <Container>
        <SectionHeading
          badge="Our Story"
          title="Built for Wholesale Excellence"
          description="We're not just a supplier — we're your strategic partner in growing your confectionery business."
        />

        <div className="mt-20 space-y-28 lg:space-y-36">
          {stories.map((story, i) => (
            <div
              key={i}
              className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
                story.imagePosition === "right" ? "lg:direction-rtl" : ""
              }`}
            >
              {/* Image Side */}
              <ScrollReveal
                direction={story.direction}
                className={
                  story.imagePosition === "right" ? "lg:order-2" : ""
                }
              >
                <div className="relative group">
                  <div className="relative aspect-[4/3] rounded-3xl overflow-hidden premium-shadow-lg bg-gray-200">
                    {story.image && (
                      <Image
                        src={story.image}
                        alt={story.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        unoptimized
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-chocolate/30 to-transparent" />
                  </div>
                  {/* Floating stat card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className={`absolute -bottom-6 ${
                      story.imagePosition === "right"
                        ? "-left-6"
                        : "-right-6"
                    } glass-card rounded-2xl p-5 z-10`}
                  >
                    <story.icon className="h-6 w-6 text-candy mb-2" />
                    <p className="text-2xl font-bold text-dark-text">
                      {story.stat}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {story.statLabel}
                    </p>
                  </motion.div>
                </div>
              </ScrollReveal>

              {/* Text Side */}
              <ScrollReveal
                direction={
                  story.imagePosition === "right" ? "left" : "right"
                }
                delay={0.2}
                className={
                  story.imagePosition === "right" ? "lg:order-1" : ""
                }
              >
                <span className="text-candy text-sm font-semibold tracking-[0.2em] uppercase">
                  {story.badge}
                </span>
                <h3 className="text-3xl lg:text-4xl font-bold text-dark-text mt-3 mb-5 leading-tight">
                  {story.title}
                </h3>
                <p className="text-gray-500 text-lg leading-relaxed">
                  {story.description}
                </p>
                <div className="h-1 w-16 bg-gradient-to-r from-candy to-red-400 rounded-full mt-8" />
              </ScrollReveal>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
