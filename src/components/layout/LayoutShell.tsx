"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import { WhatsAppScrollPopup } from "@/components/ui/WhatsAppScrollPopup";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isDashboard = pathname.startsWith("/dashboard");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      {!isDashboard && <Footer />}
      <FloatingWhatsApp />
      <WhatsAppScrollPopup />
    </>
  );
}
