"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Fade-up animation triggered on scroll for a container's children
 */
export function useScrollFadeUp(
  selector = ".gsap-fade-up",
  stagger = 0.12,
  distance = 40,
) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const els = ref.current.querySelectorAll(selector);
    if (els.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        els,
        { opacity: 0, y: distance },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );
    }, ref);

    return () => ctx.revert();
  }, [selector, stagger, distance]);

  return ref;
}

/**
 * Parallax effect — element moves slower than scroll
 */
export function useParallax(speed = 0.3) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        y: () => speed * 100,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [speed]);

  return ref;
}

/**
 * Slide-in animation from a direction
 */
export function useScrollSlideIn(
  direction: "left" | "right" | "up" | "down" = "up",
  distance = 60,
) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const fromVars: gsap.TweenVars = { opacity: 0 };
    if (direction === "left") fromVars.x = -distance;
    if (direction === "right") fromVars.x = distance;
    if (direction === "up") fromVars.y = distance;
    if (direction === "down") fromVars.y = -distance;

    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current, fromVars, {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [direction, distance]);

  return ref;
}
