"use client";

import { motion, type Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import type { ReactNode } from "react";

/* ─── Reusable Scroll-Reveal Wrapper ─── */
interface RevealProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
  duration?: number;
  blur?: boolean;
  once?: boolean;
  threshold?: number;
}

const directionMap = {
  up: { y: 60, x: 0 },
  down: { y: -60, x: 0 },
  left: { x: -80, y: 0 },
  right: { x: 80, y: 0 },
  none: { x: 0, y: 0 },
};

export function ScrollReveal({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 0.7,
  blur = false,
  once = true,
  threshold = 0.15,
}: RevealProps) {
  const [ref, inView] = useInView({ triggerOnce: once, threshold });
  const d = directionMap[direction];

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{
        opacity: 0,
        x: d.x,
        y: d.y,
        filter: blur ? "blur(10px)" : "blur(0px)",
      }}
      animate={
        inView
          ? { opacity: 1, x: 0, y: 0, filter: "blur(0px)" }
          : { opacity: 0, x: d.x, y: d.y, filter: blur ? "blur(10px)" : "blur(0px)" }
      }
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Stagger Children Container ─── */
interface StaggerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  once?: boolean;
}

const staggerContainerVariants: Variants = {
  hidden: {},
  visible: (custom: { delay: number; staggerDelay: number }) => ({
    transition: {
      delayChildren: custom.delay,
      staggerChildren: custom.staggerDelay,
    },
  }),
};

const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 40, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export function StaggerContainer({
  children,
  className,
  delay = 0,
  staggerDelay = 0.1,
  once = true,
}: StaggerProps) {
  const [ref, inView] = useInView({ triggerOnce: once, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={staggerContainerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      custom={{ delay, staggerDelay }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={staggerItemVariants}>
      {children}
    </motion.div>
  );
}

/* ─── Parallax Wrapper ─── */
interface ParallaxProps {
  children: ReactNode;
  className?: string;
  speed?: number;
}

export function Parallax({ children, className, speed = 0.5 }: ParallaxProps) {
  return (
    <motion.div
      className={className}
      initial={{ y: 0 }}
      whileInView={{ y: -30 * speed }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Hover Tilt Card ─── */
export function TiltCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      whileHover={{
        scale: 1.03,
        rotateX: -2,
        rotateY: 3,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      whileTap={{ scale: 0.98 }}
      style={{ transformPerspective: 1000 }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Magnetic Button Wrapper ─── */
export function MagneticButton({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Section Heading with Reveal ─── */
export function SectionHeading({
  badge,
  title,
  description,
  center = true,
  light = false,
}: {
  badge: string;
  title: string;
  description?: string;
  center?: boolean;
  light?: boolean;
}) {
  return (
    <ScrollReveal direction="up" blur>
      <div className={center ? "text-center" : ""}>
        <span
          className={`inline-block text-sm font-semibold tracking-[0.2em] uppercase mb-3 ${
            light ? "text-candy/80" : "text-candy"
          }`}
        >
          {badge}
        </span>
        <h2
          className={`text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight ${
            light ? "text-white" : "text-dark-text"
          }`}
        >
          {title}
        </h2>
        {description && (
          <p
            className={`mt-4 text-lg max-w-2xl leading-relaxed ${
              center ? "mx-auto" : ""
            } ${light ? "text-white/60" : "text-gray-500"}`}
          >
            {description}
          </p>
        )}
      </div>
    </ScrollReveal>
  );
}
