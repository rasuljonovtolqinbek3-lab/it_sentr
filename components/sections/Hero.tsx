"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, MessageCircle } from "lucide-react";
import dynamic from "next/dynamic";

const RobotScene = dynamic(() => import("@/components/3d/RobotScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] lg:h-[600px] flex items-center justify-center">
      <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
    </div>
  ),
});

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-24 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 -left-64 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-50 pointer-events-none" />
      <div className="absolute bottom-1/4 -right-64 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] opacity-50 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-start gap-6 pt-12 lg:pt-0"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              IT CENTER TO'RTKO'L
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-white">
              <span className="block">Dunyoni siyosatchilar emas,</span>
              <span className="text-gradient-primary">IT mutaxassislari</span>
              <span className="block">o'zgartirmoqda.</span>
              <span className="block mt-2 text-3xl md:text-4xl lg:text-5xl text-gray-300 font-bold">
                Siz qaysi tomondasiz?
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-xl leading-relaxed">
              Zamonaviy kasblarni o'rganing, amaliy ko'nikmalarni egallang va kelajagingizni bugundan boshlang.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 w-full mt-4">
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent("open-registration-modal"))}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary text-black font-bold hover:bg-primary-dark transition-colors shadow-[0_0_20px_rgba(0,214,84,0.3)] hover:shadow-[0_0_30px_rgba(0,214,84,0.5)] flex items-center justify-center gap-2">
                Kursga yozilish
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button className="w-full sm:w-auto px-8 py-4 rounded-xl glass hover:bg-white/10 transition-colors text-white font-medium flex items-center justify-center gap-2">
                <Play className="w-5 h-5 text-primary" />
                Bepul sinov darsi
              </button>
              
              <a href="https://t.me/turtkul_itpark" target="_blank" rel="noreferrer" className="w-full sm:w-auto px-6 py-4 rounded-xl text-gray-300 hover:text-white transition-colors font-medium flex items-center justify-center gap-2">
                <MessageCircle className="w-5 h-5 text-[#0088cc]" />
                Telegram
              </a>
            </div>
          </motion.div>

          {/* 3D Robot Scene */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative w-full h-[400px] lg:h-[650px] flex items-center justify-center"
          >
            <RobotScene />
            {/* Interaction hint */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass px-4 py-2 rounded-full text-xs text-gray-300 flex items-center gap-2 pointer-events-none">
              <div className="w-4 h-4 rounded-full border border-primary/50 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              </div>
              Tegib ko'ring
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
