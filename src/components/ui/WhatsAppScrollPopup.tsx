"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useScrollPopup } from "@/hooks/useScrollPopup";
import { openWhatsApp } from "@/lib/whatsapp";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function WhatsAppScrollPopup() {
  const { show, dismiss } = useScrollPopup(0.4, 5000);

  const handleChat = () => {
    openWhatsApp();
    dismiss();
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
          className="fixed bottom-24 right-5 z-[95] w-[calc(100%-2.5rem)] sm:w-[340px] sm:max-w-[340px]"
        >
          <div className="relative bg-white/80 backdrop-blur-2xl rounded-2xl shadow-2xl shadow-[#25D366]/10 border border-white/60 overflow-hidden">
            {/* Green glow accent */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#25D366]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#128C7E]/10 rounded-full blur-2xl pointer-events-none" />

            {/* Close button */}
            <motion.button
              onClick={dismiss}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-3 right-3 z-10 w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              aria-label="Close popup"
            >
              <X className="h-3.5 w-3.5 text-gray-500" />
            </motion.button>

            <div className="relative p-5">
              {/* Top row: icon + text */}
              <div className="flex items-start gap-4 mb-4">
                {/* Animated WhatsApp badge */}
                <div className="relative shrink-0">
                  <motion.div
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="w-14 h-14 bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-2xl flex items-center justify-center shadow-lg shadow-[#25D366]/30"
                  >
                    <WhatsAppIcon className="h-7 w-7 text-white" />
                  </motion.div>
                  {/* Pulse ring */}
                  <span className="absolute inset-0 rounded-2xl bg-[#25D366]/25 animate-wa-pulse" />
                </div>

                {/* Text */}
                <div className="pt-0.5 pr-6">
                  <h4 className="text-[15px] font-bold text-gray-900 leading-tight">
                    Need Wholesale Prices?
                  </h4>
                  <p className="text-[13px] text-gray-500 mt-1 leading-snug">
                    Chat with us instantly on WhatsApp
                  </p>
                </div>
              </div>

              {/* CTA Button */}
              <motion.button
                onClick={handleChat}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full flex items-center justify-center gap-2.5 py-3 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white rounded-xl font-semibold text-sm shadow-md shadow-[#25D366]/25 hover:shadow-lg hover:shadow-[#25D366]/35 transition-shadow duration-300"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Start Chat
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
