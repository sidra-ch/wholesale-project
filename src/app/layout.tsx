import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Toaster } from "@/components/ui/Toaster";
import { LayoutShell } from "@/components/layout/LayoutShell";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Arslan Wholesale | Premium Biscuits & Candies Wholesale",
  description:
    "Your trusted wholesale partner for premium biscuits, candies, chocolates and snacks. Competitive prices, reliable delivery, and quality guaranteed.",
};

const faviconUrl =
  "https://res.cloudinary.com/dfixnhqn0/image/upload/q_auto/f_auto/v1774637471/logo-img_t6qfjg.jpg";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <link rel="icon" href={faviconUrl} />
        <link rel="apple-touch-icon" href={faviconUrl} />
      </head>
      <body className="min-h-full flex flex-col font-sans overflow-x-hidden">
        <LayoutShell>{children}</LayoutShell>
        <CartDrawer />
        <Toaster />
      </body>
    </html>
  );
}
