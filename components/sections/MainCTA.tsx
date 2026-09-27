"use client";

import { motion } from "framer-motion";
import { ArrowRight, Send } from "lucide-react";

export default function MainCTA() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white tracking-tight">
            Kelajagingizni <span className="text-primary">bugundan boshlang.</span>
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            O'zingizga mos yo'nalishni tanlang va IT CENTER TO'RTKO'L bilan yangi bilimlar sari qadam qo'ying.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent("open-registration-modal"))}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary text-black font-bold hover:bg-primary-dark transition-colors shadow-[0_0_20px_rgba(0,214,84,0.3)] hover:shadow-[0_0_30px_rgba(0,214,84,0.5)] flex items-center justify-center gap-2 text-lg">
              Kursga yozilish
              <ArrowRight className="w-5 h-5" />
            </button>
            <a href="https://t.me/turtkul_itpark" target="_blank" rel="noreferrer" className="w-full sm:w-auto px-8 py-4 rounded-xl glass hover:bg-white/10 transition-colors text-white font-medium flex items-center justify-center gap-2 text-lg">
              <Send className="w-5 h-5 text-[#0088cc]" />
              Telegram orqali bog'lanish
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
