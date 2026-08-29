import Link from "next/link";
import { Phone, MessageCircle, MapPin, Link2 } from "lucide-react";

import { IT_CENTER_ADDRESS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/50 backdrop-blur-md pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center font-bold text-black text-xl">
                IT
              </div>
              <span className="font-bold text-lg tracking-tight">CENTER TO'RTO'L</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Dunyoni siyosatchilar emas, IT mutaxassislari o'zgartirmoqda. Kelajak kasblarini biz bilan o'rganing.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Navigatsiya</h4>
            <ul className="space-y-2">
              {["Bosh sahifa", "Kurslar", "Nega biz?", "Natijalar", "Aloqa"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-gray-400 hover:text-primary text-sm transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Yo'nalishlar</h4>
            <ul className="space-y-2">
              {["Web dasturlash", "Python", "C++", "Kiberxavfsizlik", "Mobil dasturlash"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-gray-400 hover:text-primary text-sm transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Aloqa</h4>
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
                <a href="https://t.me/turtkul_itpark" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">@turtkul_itpark</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Link2 className="w-5 h-5 text-primary shrink-0" />
                <a href="https://instagram.com/itpark.turtkull" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">@itpark.turtkull</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            Â© {new Date().getFullYear()} IT CENTER TO'RTO'L. Barcha huquqlar himoyalangan.
          </p>
          <div className="text-gray-500 text-sm">
            Ish vaqti: Dushanba â€“ Shanba 08:00â€“20:00
          </div>
        </div>
      </div>
    </footer>
  );
}
