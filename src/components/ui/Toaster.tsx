"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { X, CheckCircle, AlertCircle } from "lucide-react";

type ToastType = "success" | "error" | "whatsapp";

interface Toast {
  id: string;
  message: string;
  subtitle?: string;
  type: ToastType;
}

let addToastFn: ((message: string, type?: ToastType, subtitle?: string) => void) | null = null;

export function toast(message: string, type: ToastType = "success", subtitle?: string) {
  if (addToastFn) addToastFn(message, type, subtitle);
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    addToastFn = (message, type = "success", subtitle) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { id, message, type, subtitle }]);
      setTimeout(() => dismiss(id), 3500);
    };
    return () => {
      addToastFn = null;
    };
  }, []);

  const handleDragEnd = (id: string, _: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 80) dismiss(id);
  };

  const toastStyles: Record<ToastType, string> = {
    success: "bg-green-600 text-white",
    error: "bg-red-600 text-white",
    whatsapp: "bg-white/80 backdrop-blur-xl text-gray-900 border border-gray-200/60",
  };

  return (
    <div className="fixed bottom-20 sm:bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-[340px]">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => handleDragEnd(t.id, _, info)}
            className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 shadow-xl text-sm font-medium cursor-grab active:cursor-grabbing ${toastStyles[t.type]}`}
          >
            {t.type === "whatsapp" ? (
              <div className="w-9 h-9 bg-[#25D366] rounded-full flex items-center justify-center shrink-0">
                <WhatsAppIcon className="h-4.5 w-4.5 text-white" />
              </div>
            ) : t.type === "success" ? (
              <CheckCircle className="h-5 w-5 shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold truncate ${t.type === "whatsapp" ? "text-gray-900" : ""}`}>
                {t.message}
              </p>
              {t.subtitle && (
                <p className={`text-xs mt-0.5 ${t.type === "whatsapp" ? "text-gray-500" : "text-white/70"}`}>
                  {t.subtitle}
                </p>
              )}
            </div>
            <button onClick={() => dismiss(t.id)} className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
