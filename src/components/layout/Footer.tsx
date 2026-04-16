"use client";

import Link from "next/link";
import Image from "next/image";
import { Container } from "./Container";
import { Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#FFF1E8] border-t border-[#F2D6D6]/50">
      <Container className="py-14">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-2xl overflow-hidden">
                <Image
                  src="https://res.cloudinary.com/dfixnhqn0/image/upload/q_auto/f_auto/v1774637471/logo-img_t6qfjg.jpg"
                  alt="Arslan Wholesale"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <span className="text-lg font-bold text-[#2E1B12]">
                Arslan <span className="text-candy">Wholesale</span>
              </span>
            </Link>
            <p className="text-sm text-[#6B5B55] leading-relaxed mb-5">
              Your trusted wholesale partner for premium products. Buy more, save more, grow faster.
            </p>
            <div className="flex gap-2.5">
              {["facebook", "instagram", "whatsapp", "youtube"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-9 h-9 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center hover:bg-candy hover:text-white hover:border-candy transition-all text-gray-400"
                  aria-label={s}
                >
                  {s === "facebook" && (
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                  )}
                  {s === "instagram" && (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" /></svg>
                  )}
                  {s === "whatsapp" && (
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                  )}
                  {s === "youtube" && (
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-[#2E1B12] text-sm uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Home", href: "/" },
                { label: "Products", href: "/products" },
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "Categories", href: "/categories" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[#6B5B55] hover:text-candy transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-bold text-[#2E1B12] text-sm uppercase tracking-wider mb-4">Customer Service</h4>
            <ul className="space-y-2.5">
              {["Help Center", "Shipping Info", "Returns & Refunds", "Terms & Conditions", "Privacy Policy"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-[#6B5B55] hover:text-candy transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-[#2E1B12] text-sm uppercase tracking-wider mb-4">Categories</h4>
            <ul className="space-y-2.5">
              {["Food & Grocery", "Beverages", "Personal Care", "Household", "Electronics"].map((cat) => (
                <li key={cat}>
                  <Link href="/products" className="text-sm text-[#6B5B55] hover:text-candy transition-colors">{cat}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-[#2E1B12] text-sm uppercase tracking-wider mb-4">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <Phone className="h-4 w-4 text-candy mt-0.5 flex-shrink-0" />
                <span className="text-sm text-[#6B5B55]">+92 347 5175875</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="h-4 w-4 text-candy mt-0.5 flex-shrink-0" />
                <span className="text-sm text-[#6B5B55]">info@arslanwholesale.com</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-candy mt-0.5 flex-shrink-0" />
                <span className="text-sm text-[#6B5B55]">Nankari Bazar, Rawalpindi, Pakistan</span>
              </li>
            </ul>
          </div>
        </div>
      </Container>

      {/* Bottom Bar */}
      <div className="border-t border-[#F2D6D6]/50">
        <Container className="py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#9A8B86]">
            &copy; {new Date().getFullYear()} Arslan Wholesale. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {["VISA", "Mastercard", "JazzCash", "Easypaisa"].map((pm) => (
              <span key={pm} className="text-[10px] font-bold text-gray-300 bg-gray-50 px-2.5 py-1 rounded border border-gray-100 uppercase tracking-wide">
                {pm}
              </span>
            ))}
          </div>
        </Container>
      </div>
    </footer>
  );
}
