"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export function PageLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-[#FFF6EF] flex flex-col items-center justify-center"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-6"
          >
            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg shadow-candy/10">
              <Image
                src="/images/logo.jpg"
                alt="Arslan Wholesale"
                width={64}
                height={64}
                className="object-cover"
                priority
              />
            </div>
          </motion.div>

          {/* Brand name */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-[#2E1B12] font-bold text-lg tracking-wide mb-8"
          >
            Arslan <span className="text-candy">Wholesale</span>
          </motion.p>

          {/* Spinner */}
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-[3px] border-[#F2D6D6]" />
            <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-candy animate-spin" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
