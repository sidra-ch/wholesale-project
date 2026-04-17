"use client";

import { Container } from "@/components/layout/Container";
import { Bell, Send } from "lucide-react";
import { useScrollFadeUp } from "@/hooks/useGSAPScroll";

export function Newsletter() {
  const ref = useScrollFadeUp(".gsap-fade-up", 0.1, 20);

  return (
    <section className="py-10 sm:py-12 lg:py-14">
      <Container>
        <div
          ref={ref}
          className="bg-white rounded-[20px] border border-[#F2D6D6]/50 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6"
        >
          {/* Left */}
          <div className="gsap-fade-up flex items-center gap-4 flex-1">
            <div className="w-12 h-12 rounded-2xl bg-[#FFE2E2] flex items-center justify-center flex-shrink-0">
              <Bell className="h-6 w-6 text-candy" />
            </div>
            <div>
              <h3 className="font-bold text-[#2E1B12] text-lg leading-tight">Stay Updated with Latest Deals</h3>
              <p className="text-[#9A8B86] text-sm mt-0.5">Subscribe to get exclusive wholesale offers and new product alerts.</p>
            </div>
          </div>

          {/* Right: Form */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="gsap-fade-up flex flex-col sm:flex-row gap-3 w-full sm:w-auto flex-shrink-0"
          >
            <input
              type="email"
              placeholder="Enter your email address"
              className="px-5 py-3 rounded-[16px] text-sm outline-none text-[#2E1B12] placeholder:text-[#9A8B86] bg-[#FFF6EF] border border-[#F2D6D6]/50 focus:border-candy/30 focus:ring-2 focus:ring-candy/10 transition-all w-full sm:w-[280px] min-w-0"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-candy hover:bg-[#C62828] text-white rounded-[16px] text-[15px] font-medium transition-all duration-300 flex-shrink-0 hover:scale-[1.03] active:scale-[0.97]"
            >
              <Send className="h-3.5 w-3.5" />
              Subscribe
            </button>
          </form>
        </div>
      </Container>
    </section>
  );
}
