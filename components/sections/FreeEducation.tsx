"use client";

import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight, Info } from "lucide-react";

export default function FreeEducation() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-primary/5 pattern-dots pattern-white/5 pattern-size-4 pattern-opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] opacity-70 pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto glass-card border-primary/30 p-8 md:p-12 lg:p-16 text-center relative overflow-hidden"
        >
          {/* Shine effect */}
          <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[45deg] animate-[shine_4s_ease-in-out_infinite]" />

          <div className="w-20 h-20 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-6">
            <ShieldCheck className="w-10 h-10 text-primary" />
          </div>

          <h2 className="text-2xl md:text-3xl font-medium text-gray-300 mb-4">
            18 yoshdan kattamisiz? Vaqtincha ishsizmisiz?
          </h2>
          
          <div className="inline-block px-6 py-3 bg-primary text-black font-black text-3xl md:text-5xl lg:text-6xl rounded-2xl mb-8 tracking-tight shadow-[0_0_30px_rgba(0,214,84,0.4)] transform -rotate-1 hover:rotate-0 transition-transform">
            100% BEPUL O'QISH IMKONIYATI
          </div>
          
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Ayrim 18 yoshdan yuqori, vaqtincha ishsiz fuqarolar uchun ta'lim xarajatlari davlat tomonidan qoplanadi. Kelajak kasblarini mutlaqo bepul o'rganing!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent("open-registration-modal"))}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary text-black font-bold hover:bg-primary-dark transition-colors shadow-[0_0_20px_rgba(0,214,84,0.3)] hover:shadow-[0_0_30px_rgba(0,214,84,0.5)] flex items-center justify-center gap-2 text-lg">
              Kursga yozilish
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent("open-free-education-modal"))}
              className="w-full sm:w-auto px-8 py-4 rounded-xl glass hover:bg-white/10 transition-colors text-white font-medium flex items-center justify-center gap-2 text-lg">
              <Info className="w-5 h-5 text-gray-400" />
              Batafsil ma'lumot
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
