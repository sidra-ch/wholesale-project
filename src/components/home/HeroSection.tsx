"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Star,
  Play,
  Package,
  TrendingUp,
  ShoppingBag,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { VIDEO_POOL, IMAGE_POOL } from "@/lib/data";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function HeroSection() {
  const [mainVideo, setMainVideo] = useState("");
  const [gridImages, setGridImages] = useState<string[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [bottomSlides, setBottomSlides] = useState([0, 0, 0]);
  const [bottomDotActive, setBottomDotActive] = useState([0, 0, 0]);
  const [hoverPaused, setHoverPaused] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);
  const heroRightRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMainVideo(VIDEO_POOL[Math.floor(Math.random() * VIDEO_POOL.length)]);
    const shuffled = [...IMAGE_POOL].sort(() => Math.random() - 0.5);
    setGridImages(shuffled.slice(0, 15));
  }, []);

  // GSAP hero entrance animation
  useEffect(() => {
    if (gridImages.length === 0) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      badgeRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6 },
    )
      .fromTo(
        headingRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7 },
        "-=0.3",
      )
      .fromTo(
        paraRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.3",
      )
      .fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.2",
      )
      .fromTo(
        statsRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.2",
      )
      .fromTo(
        trustRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4 },
        "-=0.1",
      )
      .fromTo(
        heroRightRef.current,
        { opacity: 0, x: 80, scale: 0.95 },
        { opacity: 1, x: 0, scale: 1, duration: 1, ease: "power2.out" },
        "-=0.8",
      );

    return () => {
      tl.kill();
    };
  }, [gridImages]);

  // Parallax on mouse move for hero right
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!heroRightRef.current || !sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(heroRightRef.current, {
        x: x * 15,
        y: y * 10,
        duration: 0.8,
        ease: "power2.out",
      });

      // Cursor glow
      if (cursorGlowRef.current) {
        cursorGlowRef.current.style.left = `${e.clientX}px`;
        cursorGlowRef.current.style.top = `${e.clientY}px`;
        cursorGlowRef.current.style.opacity = "1";
      }
    },
    [],
  );

  const handleMouseLeave = useCallback(() => {
    if (heroRightRef.current) {
      gsap.to(heroRightRef.current, { x: 0, y: 0, duration: 0.6 });
    }
    if (cursorGlowRef.current) {
      cursorGlowRef.current.style.opacity = "0";
    }
  }, []);

  // Auto-rotate top-right carousel
  useEffect(() => {
    if (gridImages.length === 0) return;
    const timer = setInterval(() => {
      setActiveSlide((p) => (p + 1) % 3);
    }, 3000);
    return () => clearInterval(timer);
  }, [gridImages]);

  // Auto-rotate bottom 3 tiles (staggered) with pause on hover
  useEffect(() => {
    if (gridImages.length === 0 || hoverPaused) return;
    const timers = [
      setInterval(() => {
        setBottomSlides((p) => [p[0] === 0 ? 1 : 0, p[1], p[2]]);
        setBottomDotActive((p) => [p[0] === 0 ? 1 : 0, p[1], p[2]]);
      }, 3000),
      setInterval(() => {
        setBottomSlides((p) => [p[0], p[1] === 0 ? 1 : 0, p[2]]);
        setBottomDotActive((p) => [p[0], p[1] === 0 ? 1 : 0, p[2]]);
      }, 3000),
      setInterval(() => {
        setBottomSlides((p) => [p[0], p[1], p[2] === 0 ? 1 : 0]);
        setBottomDotActive((p) => [p[0], p[1], p[2] === 0 ? 1 : 0]);
      }, 3000),
    ];
    return () => timers.forEach(clearInterval);
  }, [gridImages, hoverPaused]);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[90vh] bg-[#FFF6EF] overflow-hidden"
    >
      {/* Cursor glow — hero only */}
      <div ref={cursorGlowRef} className="cursor-glow hidden lg:block" style={{ opacity: 0 }} />

      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-candy/[0.08] to-transparent blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-candy/[0.04] to-orange-300/[0.03] blur-3xl" />
        {/* Dotted pattern */}
        <div className="dotted-pattern absolute inset-0" />
      </div>

      <Container className="relative z-10">
        <div className="flex flex-col lg:flex-row gap-10 xl:gap-16 items-center min-h-[90vh] py-20 lg:py-0">
          {/* ─── LEFT: Text Content ─── */}
          <div className="w-full lg:w-[48%] lg:flex-shrink-0">
            {/* Badge */}
            <div ref={badgeRef} style={{ opacity: 0 }}>
              <span className="inline-flex items-center gap-2 bg-[#FFECEC] text-candy text-xs font-bold tracking-widest uppercase px-5 py-2.5 rounded-full border border-candy/20">
                ⭐ Pakistan&apos;s #1 Wholesale Platform
              </span>
            </div>

            {/* Main Heading */}
            <h1
              ref={headingRef}
              style={{ opacity: 0 }}
              className="mt-8 text-[36px] sm:text-[44px] lg:text-[48px] xl:text-[52px] font-extrabold leading-[1.08] tracking-tight text-[#2E1B12]"
            >
              Grow Your Store
              <br />
              <span className="relative inline-block my-1">
                <span className="relative z-10 text-white px-3 py-1">
                  With The Best
                </span>
                <span className="absolute inset-0 bg-candy rounded-xl -skew-x-2" />
              </span>
              <br />
              Wholesale Deals!
            </h1>

            {/* Subheading */}
            <p
              ref={paraRef}
              style={{ opacity: 0 }}
              className="mt-6 text-[16px] lg:text-[18px] text-[#6B5B55] leading-relaxed max-w-lg"
            >
              Premium biscuits, candies &amp; snacks from{" "}
              <span className="text-[#2E1B12] font-semibold">50+ top brands</span>.
              Unbeatable prices. Free delivery. Trusted by{" "}
              <span className="text-[#2E1B12] font-semibold">500+ retailers</span> nationwide.
            </p>

            {/* CTA */}
            <div ref={ctaRef} style={{ opacity: 0 }} className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/products"
                className="group relative inline-flex items-center gap-2.5 px-8 py-4 bg-candy hover:bg-[#C62828] text-white rounded-[16px] font-medium text-[15px] transition-all duration-300 shadow-[0_10px_30px_rgba(229,57,53,0.08)] hover:shadow-[0_12px_35px_rgba(229,57,53,0.2)] hover:-translate-y-0.5"
              >
                Explore Products
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/products"
                className="group inline-flex items-center gap-2.5 px-8 py-4 bg-white hover:bg-[#FFE2E2] text-[#2E1B12] rounded-[16px] font-medium text-[15px] transition-all duration-300 shadow-[0_12px_35px_rgba(0,0,0,0.06)] border border-[#F2D6D6] hover:-translate-y-0.5"
              >
                <ShoppingBag className="h-4 w-4 text-candy" />
                Order Now
              </Link>
            </div>

            {/* Trust row */}
            <div ref={trustRef} style={{ opacity: 0 }} className="mt-10 flex items-center gap-3">
              <div className="flex -space-x-2">
                {gridImages.slice(0, 4).map((src, i) => (
                  <div key={i} className="relative w-9 h-9 rounded-full border-2 border-white overflow-hidden shadow-sm">
                    <Image src={src} alt="" fill className="object-cover" unoptimized />
                  </div>
                ))}
              </div>
              <div className="ml-2">
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[12px] font-bold text-[#2E1B12]">4.9</span>
                  <span className="text-[11px] text-[#9A8B86]">(2.3k reviews)</span>
                </div>
                <p className="text-[12px] text-[#6B5B55] font-medium mt-0.5">500+ Retailers Trust Us</p>
              </div>
            </div>

            {/* Stats Row */}
            <div ref={statsRef} style={{ opacity: 0 }} className="mt-8 flex items-center gap-8 lg:gap-10">
              {[
                { value: "2K+", label: "Products", icon: Package },
                { value: "500+", label: "Retailers", icon: TrendingUp },
                { value: "50+", label: "Brands", icon: ShieldCheck },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-candy/[0.08]">
                    <stat.icon className="h-4.5 w-4.5 text-candy" />
                  </div>
                  <div>
                    <p className="text-lg font-extrabold text-[#2E1B12] leading-none">{stat.value}</p>
                    <p className="text-xs text-[#9A8B86] font-medium mt-0.5">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ─── RIGHT: Bento Media Grid ─── */}
          <div
            ref={heroRightRef}
            style={{ opacity: 0 }}
            className="relative hidden lg:flex flex-col gap-3 w-full lg:w-[52%] lg:flex-shrink-0"
          >
            {/* Top row: Video + Image carousel */}
            <div className="flex gap-3" style={{ height: "380px" }}>
              {/* Main video — large tile */}
              <div className="flex-[2] rounded-[28px] overflow-hidden relative group shadow-[0_12px_35px_rgba(0,0,0,0.06)] min-w-0">
                {mainVideo && (
                  <video
                    src={mainVideo}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
                {/* NEW ARRIVALS floating card */}
                <div className="absolute top-4 left-4 z-10 bg-white rounded-[20px] px-4 py-3 shadow-[0_12px_35px_rgba(0,0,0,0.06)] border border-[#F2D6D6]">
                  <p className="text-candy text-[10px] font-bold uppercase tracking-widest">New Arrivals</p>
                  <p className="text-[#2E1B12] text-lg font-extrabold leading-tight mt-0.5">1,200+</p>
                  <p className="text-[#9A8B86] text-[10px]">Products This Week</p>
                  {/* Mini chart line in red */}
                  <svg viewBox="0 0 60 20" className="w-14 h-4 mt-1">
                    <polyline
                      points="0,18 8,14 16,16 24,10 32,12 40,6 48,8 56,2 60,4"
                      fill="none"
                      stroke="#E53935"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                {/* Bottom info */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-white/70 text-[11px] font-medium">Our Collection</p>
                      <p className="text-white text-xl font-bold mt-0.5">2,000+ Products</p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-xl px-3 py-2 rounded-xl border border-white/20">
                      <Play className="h-3.5 w-3.5 text-white fill-white" />
                      <span className="text-white text-xs font-semibold">Watch</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right column: image carousel */}
              <div className="w-[180px] flex-shrink-0 rounded-[28px] overflow-hidden relative shadow-[0_12px_35px_rgba(0,0,0,0.06)] bg-white">
                <AnimatePresence mode="wait">
                  {gridImages[activeSlide] && (
                    <motion.div
                      key={activeSlide}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={gridImages[activeSlide]}
                        alt="Product"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white text-xs font-bold">Best Sellers</p>
                  <div className="flex gap-1 mt-2">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          i === activeSlide ? "w-5 bg-candy" : "w-2 bg-white/40"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom row: 3 auto-rotating image tiles with dot indicators */}
            <div
              className="flex gap-3"
              style={{ height: "140px" }}
              onMouseEnter={() => setHoverPaused(true)}
              onMouseLeave={() => setHoverPaused(false)}
            >
              {[
                { label: "New Arrival", badge: "Hot", badgeColor: "bg-candy text-white", imgA: 3, imgB: 6, imgC: 9 },
                { label: "Top Rated", badge: "5★", badgeColor: "bg-amber-400 text-amber-900", imgA: 4, imgB: 7, imgC: 10 },
                { label: "Popular", badge: "Popular", badgeColor: "bg-emerald-400 text-emerald-900", imgA: 5, imgB: 8, imgC: 11 },
              ].map((card, idx) => {
                const currentImg = gridImages[bottomSlides[idx] === 0 ? card.imgA : card.imgB];
                return (
                  <div key={idx} className="flex-1 rounded-[18px] overflow-hidden relative shadow-[0_12px_35px_rgba(0,0,0,0.06)] border border-[#F2D6D6]/50 group min-w-0">
                    <AnimatePresence mode="wait">
                      {currentImg && (
                        <motion.div
                          key={`bottom-${idx}-${bottomSlides[idx]}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.6 }}
                          className="absolute inset-0"
                        >
                          <Image
                            src={currentImg}
                            alt={card.label}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="flex items-center gap-1.5">
                        <div className={`px-2 py-0.5 rounded-md ${card.badgeColor}`}>
                          <span className="text-[9px] font-bold uppercase tracking-wide">{card.badge}</span>
                        </div>
                        <span className="text-white text-[10px] font-semibold">{card.label}</span>
                      </div>
                      {/* Dot indicators */}
                      <div className="flex gap-1 mt-1.5">
                        {[0, 1].map((i) => (
                          <div
                            key={i}
                            className={`h-1 rounded-full transition-all duration-300 ${
                              i === bottomDotActive[idx] ? "w-4 bg-candy" : "w-1.5 bg-white/40"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Floating accent glow */}
            <div className="absolute -inset-8 -z-10 bg-gradient-to-br from-candy/[0.06] via-transparent to-amber-400/[0.06] rounded-[3rem] blur-3xl" />
          </div>
        </div>
      </Container>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#FFF6EF] to-transparent pointer-events-none" />
    </section>
  );
}
