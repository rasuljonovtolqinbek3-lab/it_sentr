"use client";

import { motion } from "framer-motion";
import { Monitor, Terminal, Shield, Smartphone, Globe, Languages, Calculator, Cpu, Bot } from "lucide-react";

const courses = [
  { id: 1, title: "Kompyuter savodxonligi", icon: Monitor, level: "Boshlang'ich", desc: "Kompyuterda ishlash, ofis dasturlari va internetdan xavfsiz foydalanish asoslari.", color: "text-blue-400", bg: "bg-blue-400/10" },
  { id: 2, title: "Python", icon: Terminal, level: "Barcha uchun", desc: "Eng mashhur dasturlash tilini o'rganing. Sun'iy intellekt va ma'lumotlar tahlili uchun zamin.", color: "text-yellow-400", bg: "bg-yellow-400/10" },
  { id: 3, title: "C++", icon: Cpu, level: "Barcha uchun", desc: "Dasturlash mantig'ini chuqur tushunish, algoritmlar va ma'lumotlar tuzilmalari.", color: "text-purple-400", bg: "bg-purple-400/10" },
  { id: 4, title: "Kiberxavfsizlik", icon: Shield, level: "O'rta - Kuchli", desc: "Axborot xavfsizligi, tarmoq himoyasi va zamonaviy tahdidlarga qarshi kurash.", color: "text-red-400", bg: "bg-red-400/10" },
  { id: 5, title: "Mobil dasturlash", icon: Smartphone, level: "Barcha uchun", desc: "iOS va Android uchun zamonaviy va tezkor ilovalar yaratishni o'rganing.", color: "text-green-400", bg: "bg-green-400/10" },
  { id: 6, title: "Web dasturlash", icon: Globe, level: "Barcha uchun", desc: "Frontend va Backend texnologiyalari. Zamonaviy veb-saytlar va tizimlar yaratish.", color: "text-cyan-400", bg: "bg-cyan-400/10" },
  { id: 7, title: "Ingliz tili", icon: Languages, level: "Barcha darajalar", desc: "IT mutaxassislari uchun maxsus va umumiy so'zlashuv ingliz tili darslari.", color: "text-indigo-400", bg: "bg-indigo-400/10" },
  { id: 8, title: "Buxgalteriya", icon: Calculator, level: "Barcha uchun", desc: "Zamonaviy buxgalteriya hisobi va 1C dasturida ishlash ko'nikmalari.", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { id: 9, title: "Robototexnika", icon: Bot, level: "Bolalar va O'smirlar", desc: "Elektronika, mikrokontrollerlar va robotlarni yig'ish hamda dasturlash.", color: "text-orange-400", bg: "bg-orange-400/10" },
];

export default function Courses() {
  return (
    <section id="courses" className="py-24 relative bg-white/[0.01]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white"
          >
            Kelajak kasblarini <span className="text-primary">bugundan o'rganing</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg"
          >
            O'zingizga mos yo'nalishni tanlang va yangi ko'nikmalarni amaliyot orqali rivojlantiring.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => {
            const Icon = course.icon;
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card flex flex-col hover:-translate-y-2 transition-all duration-300 group overflow-hidden"
              >
                <div className="p-6 flex-1">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${course.bg} ${course.color} transition-transform group-hover:scale-110`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-medium px-3 py-1 bg-white/5 text-gray-300 rounded-full border border-white/10">
                      {course.level}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    {course.desc}
                  </p>
                </div>
                
                <div className="px-6 pb-6 mt-auto">
                  <button 
                    onClick={() => window.dispatchEvent(new CustomEvent("open-registration-modal"))}
                    className="w-full py-3 rounded-xl bg-white/5 hover:bg-primary text-white hover:text-black font-medium transition-colors flex items-center justify-center gap-2">
                    Kursga yozilish
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
