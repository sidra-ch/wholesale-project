"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const WHATSAPP_URL =
  "https://wa.me/923475175875?text=Hi%20Arslan%20Wholesale%2C%20I%20am%20interested%20in%20your%20products.%20Please%20share%20details.";

export function FloatingWhatsApp() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-5 right-5 z-[90] flex flex-col items-end gap-3">
          {/* Popup card */}
          <AnimatePresence>
            {showPopup && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="w-[320px] bg-white rounded-[20px] shadow-2xl shadow-black/10 border border-[#F2D6D6]/50 overflow-hidden"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-[#25D366] to-[#128C7E] px-5 py-4 relative">
                  <button
                    onClick={() => setShowPopup(false)}
                    className="absolute top-3 right-3 w-7 h-7 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <X className="h-3.5 w-3.5 text-white" />
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center">
                      <WhatsAppIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white text-[15px] font-bold">Need Help?</h4>
                      <p className="text-white/80 text-[12px]">Chat with Arslan Wholesale Support</p>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5">
                  {/* Quick message preview */}
                  <div className="bg-[#FFF6EF] rounded-2xl p-3.5 mb-4">
                    <p className="text-[13px] text-[#2E1B12] leading-relaxed">
                      &ldquo;Hi Arslan Wholesale, I am interested in your products. Please share details.&rdquo;
                    </p>
                  </div>

                  {/* CTA */}
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white rounded-[16px] font-bold text-[14px] shadow-md shadow-[#25D366]/25 hover:shadow-lg hover:shadow-[#25D366]/35 transition-all duration-300"
                  >
                    <WhatsAppIcon className="h-5 w-5" />
                    Start WhatsApp Chat
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main button */}
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={() => setShowPopup((p) => !p)}
            className="relative group w-[60px] h-[60px] sm:w-[64px] sm:h-[64px] rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40 transition-shadow duration-300 flex items-center justify-center"
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.92 }}
            aria-label="Chat on WhatsApp"
          >
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-[#25D366]/30 animate-wa-pulse" />
            <span className="absolute inset-0 rounded-full bg-[#25D366]/15 animate-wa-pulse-delayed" />

            {/* Icon */}
            <motion.span
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <WhatsAppIcon className="h-7 w-7 sm:h-8 sm:w-8 relative z-10" />
            </motion.span>
          </motion.button>
        </div>
      )}
    </AnimatePresence>
  );
}
