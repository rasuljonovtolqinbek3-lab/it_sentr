"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, GraduationCap, ArrowRight } from "lucide-react";
import { openRegistrationModal } from "./RegistrationModal";

export const openFreeEducationModal = () => {
  window.dispatchEvent(new CustomEvent("open-free-education-modal"));
};

export default function FreeEducationModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-free-education-modal", handleOpen);
    return () => window.removeEventListener("open-free-education-modal", handleOpen);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  const close = () => setIsOpen(false);

  const handleApply = () => {
    close();
    setTimeout(() => {
      openRegistrationModal();
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-2xl max-h-[90vh] overflow-y-auto z-[101] glass bg-[#0a0c0b] p-6 md:p-8 rounded-2xl border border-white/10 shadow-2xl custom-scrollbar"
          >
            <button 
              onClick={close}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors bg-white/5 rounded-full p-2 hover:bg-white/10"
              aria-label="Yopish"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col gap-6">
              {/* Header */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white">
                  Bepul ta'lim imkoniyati
                </h3>
              </div>

              {/* Resolution Block */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 flex flex-col gap-4">
                <h4 className="text-lg font-medium text-white">
                  Vazirlar Mahkamasining 2025-yil 20-avgustdagi 527-son qarori
                </h4>
                <a 
                  href="https://lex.uz/ru/docs/-7694451" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary-light font-medium transition-colors w-fit"
                >
                  527-son qarorni Lex.uz'da ko'rish
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Description */}
              <div className="text-gray-300 space-y-4 text-base md:text-lg leading-relaxed">
                <p>
                  Vazirlar Mahkamasining 2025-yil 20-avgustdagi 527-son qarori asosida yoshlar va fuqarolarning zamonaviy kasb va ko'nikmalarni egallashi, ta'lim va kasbiy rivojlanish imkoniyatlarini kengaytirishga qaratilgan chora-tadbirlar belgilangan.
                </p>
                <p>
                  Mazkur imkoniyatlar doirasida IT, raqamli texnologiyalar va zamonaviy kasblarni o'rganish uchun ta'lim olish imkoniyatlari yaratiladi.
                </p>
                <p>
                  IT CENTER ushbu imkoniyatlardan foydalanib, zamonaviy IT yo'nalishlarida bilim va amaliy ko'nikmalarni egallashni istagan yoshlar uchun bepul ta'lim imkoniyatlarini taqdim etadi.
                </p>
              </div>

              {/* IT CENTER Education */}
              <div className="border-t border-white/10 pt-6">
                <h4 className="text-xl font-bold text-white mb-3">
                  IT CENTERda bepul ta'lim
                </h4>
                <p className="text-gray-400 mb-8">
                  Bepul ta'lim dasturlari orqali zamonaviy IT yo'nalishlarini o'rganing, amaliy ko'nikmalarga ega bo'ling va kelajakdagi kasbingiz uchun mustahkam poydevor yarating.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  <button 
                    onClick={close}
                    className="px-6 py-3 rounded-xl glass hover:bg-white/10 transition-colors text-white font-medium"
                  >
                    Yopish
                  </button>
                  <button 
                    onClick={handleApply}
                    className="px-8 py-3 rounded-xl bg-primary text-black font-bold hover:bg-primary-dark transition-colors shadow-[0_0_20px_rgba(0,214,84,0.3)] hover:shadow-[0_0_30px_rgba(0,214,84,0.5)] flex items-center justify-center gap-2"
                  >
                    Ariza topshirish
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
