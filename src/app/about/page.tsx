"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Award, Users, Globe, TrendingUp } from "lucide-react";
import Image from "next/image";
import { getRandomImage } from "@/lib/data";

const stats = [
  { icon: Users, value: "500+", label: "Retail Partners" },
  { icon: Globe, value: "25+", label: "Brand Partners" },
  { icon: Award, value: "14+", label: "Years Experience" },
  { icon: TrendingUp, value: "98%", label: "Satisfaction Rate" },
];

export default function AboutPage() {
  const [aboutImage, setAboutImage] = useState("");

  useEffect(() => {
    setAboutImage(getRandomImage());
  }, []);

  return (
    <>
      <Breadcrumb items={[{ label: "About Us" }]} />

      {/* Hero */}
      <section className="py-12 lg:py-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="text-candy text-sm font-semibold tracking-wider uppercase">
                Our Story
              </span>
              <h1 className="text-3xl lg:text-4xl font-bold text-dark-text mt-2 mb-6">
                Your Trusted Partner in{" "}
                <span className="text-candy">Wholesale Confectionery</span>
              </h1>
              <p className="text-gray-600 leading-relaxed mb-4">
                Founded in 2010, Arslan Wholesale has grown to become one of the
                leading wholesale distributors of premium biscuits, candies, and
                confectionery products. We connect top international brands with
                retailers across the nation.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Our mission is simple: provide retailers with the highest quality
                confectionery products at competitive wholesale prices, backed by
                exceptional service and reliable delivery.
              </p>
              <p className="text-gray-600 leading-relaxed">
                With a curated catalog of over 200 products from 25+ premium
                brands, we ensure that our retail partners always have access to
                the best-selling and trending confectionery products that their
                customers love.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden"
            >
              <Image
                src={aboutImage || "/images/placeholder.png"}
                alt="Our warehouse"
                fill
                className="object-cover"
                unoptimized
              />
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section className="py-12 bg-chocolate">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="h-7 w-7 text-candy" />
                </div>
                <p className="text-3xl font-bold text-white mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-white/60">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-candy text-sm font-semibold tracking-wider uppercase">
              What Drives Us
            </span>
            <h2 className="text-3xl font-bold text-dark-text mt-1">
              Our Core Values
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Quality First",
                description:
                  "Every product in our catalog undergoes rigorous quality checks. We only partner with certified manufacturers and authorized distributors.",
              },
              {
                title: "Customer Success",
                description:
                  "Your success is our success. We provide dedicated account management, flexible ordering, and tailored solutions for your business needs.",
              },
              {
                title: "Integrity & Trust",
                description:
                  "Transparent pricing, honest communication, and consistent reliability have earned us the trust of retailers nationwide.",
              },
            ].map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-gray-100 p-8 text-center hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-bold text-dark-text mb-3">
                  {value.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
