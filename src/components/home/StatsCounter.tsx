"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/layout/Container";
import { motion, useInView } from "framer-motion";
import { Package, Users, Award, TrendingUp } from "lucide-react";

function useCountUp(target: number, duration: number = 2000, inView: boolean) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration]);

  return count;
}

const stats = [
  { icon: Package, value: 2000, suffix: "+", label: "Products Available", color: "from-[#3B82F6] to-[#6366F1]" },
  { icon: Users, value: 500, suffix: "+", label: "Retailers Served", color: "from-[#10B981] to-[#059669]" },
  { icon: Award, value: 50, suffix: "+", label: "Premium Brands", color: "from-[#F59E0B] to-[#D97706]" },
  { icon: TrendingUp, value: 14, suffix: "+", label: "Years Experience", color: "from-[#E53935] to-[#C62828]" },
];

export function StatsCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-14 sm:py-16 lg:py-20 bg-gradient-to-br from-chocolate via-[#2a1509] to-chocolate relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <Container className="relative">
        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, i) => {
            const count = useCountUp(stat.value, 2000 + i * 200, inView);
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">
                  {count.toLocaleString()}{stat.suffix}
                </p>
                <p className="text-sm text-white/50 font-medium">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
