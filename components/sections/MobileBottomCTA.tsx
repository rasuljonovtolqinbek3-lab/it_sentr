"use client";

import { useEffect, useState } from "react";
import { Phone, MessageCircle, PenSquare } from "lucide-react";

export default function MobileBottomCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show only when scrolled down a bit to not conflict with hero initial view
      setIsVisible(window.scrollY > 300);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div 
      className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="glass bg-black/80 backdrop-blur-xl border-t border-white/10 px-2 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
          <a href="tel:+998950470670" className="flex flex-col items-center justify-center flex-1 py-1 text-gray-400 hover:text-primary transition-colors">
            <Phone className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">Qo'ng'iroq</span>
          </a>
          <a href="https://t.me/turtkul_itpark" target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center flex-1 py-1 text-gray-400 hover:text-[#0088cc] transition-colors">
            <MessageCircle className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">Telegram</span>
          </a>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent("open-registration-modal"))}
            className="flex flex-col items-center justify-center flex-1 py-2 px-4 rounded-xl bg-primary text-black font-semibold hover:bg-primary-dark transition-colors mx-1 shadow-[0_0_15px_rgba(0,214,84,0.3)]">
            <PenSquare className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Kursga yozilish</span>
          </button>
        </div>
      </div>
    </div>
  );
}
