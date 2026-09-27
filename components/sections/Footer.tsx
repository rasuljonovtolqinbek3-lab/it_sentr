"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Phone, MessageCircle, MapPin, Link2 } from "lucide-react";
import { IT_CENTER_ADDRESS } from "@/lib/constants";

export default function Footer() {
  const pathname = usePathname();
  
  // Hide footer on admin and verification pages as requested
  if (pathname.startsWith("/admin") || pathname.startsWith("/verify")) return null;

  return (
    <footer className="border-t border-white/10 bg-black/50 backdrop-blur-md pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center font-bold text-black text-xl shadow-[0_0_15px_rgba(0,214,84,0.3)]">
                IT
              </div>
              <span className="font-bold text-xl tracking-tight text-white group-hover:text-primary transition-colors">
                CENTER TO'RTKO'L
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Dunyoni siyosatchilar emas, IT mutaxassislari o'zgartirmoqda. Kelajak kasblarini biz bilan o'rganing.
            </p>

            <div className="pt-6 mt-6 border-t border-white/5">
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-3">Hamkorimiz</p>
              <div className="flex items-center gap-3 group cursor-default">
                <div className="relative w-11 h-11 rounded-lg overflow-hidden border border-white/10 group-hover:border-primary/40 transition-colors bg-black shadow-sm">
                  <Image 
                    src="/images/mt-root-logo.jpg" 
                    alt="MT_ROOT Logo" 
                    fill 
                    className="object-cover"
                    sizes="44px"
                  />
                </div>
                <span className="text-gray-300 font-bold tracking-wide text-lg group-hover:text-white transition-colors">MT_ROOT</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-5 text-white tracking-wide">Markaz haqida</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/#why-us" className="text-gray-400 hover:text-primary text-sm transition-colors">
                  Biz haqimizda
                </Link>
              </li>
              <li>
                <Link href="/#courses" className="text-gray-400 hover:text-primary text-sm transition-colors">
                  Kurslar
                </Link>
              </li>
              <li>
                <Link href="/verify" className="text-gray-400 hover:text-primary text-sm transition-colors">
                  Sertifikatni tekshirish
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-gray-400 hover:text-primary text-sm transition-colors">
                  Bog‘lanish
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-5 text-white tracking-wide">Aloqa</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>{IT_CENTER_ADDRESS}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <a href="tel:+998950470670" className="hover:text-primary transition-colors">+998 95 047 06 70</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <MessageCircle className="w-5 h-5 text-primary shrink-0" />
                <a href="https://t.me/turtkul_itpark" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">Telegram</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Link2 className="w-5 h-5 text-primary shrink-0" />
                <a href="https://instagram.com/itpark.turtkull" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">Instagram</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left">
            © {new Date().getFullYear()} IT CENTER TO'RTKO'L. Barcha huquqlar himoyalangan.
          </p>
          <div className="text-gray-500 text-xs font-medium tracking-wide">
            Designed & Developed by <span className="text-gray-400">Rasuljonov To'lqinbek</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
