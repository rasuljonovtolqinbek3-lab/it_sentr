"use client";

import { motion } from "framer-motion";
import { Laptop, Briefcase, Zap, Compass, Users, TrendingUp, Award, ShieldCheck } from "lucide-react";

const features = [
  { id: 1, title: "Zamonaviy ta'lim", icon: Laptop, desc: "Eng so'nggi dasturlash tillari va texnologiyalari." },
  { id: 2, title: "Amaliy ko'nikmalar", icon: Briefcase, desc: "Faqat nazariya emas, real loyihalar ustida ishlash." },
  { id: 3, title: "Zamonaviy texnologiyalar", icon: Zap, desc: "Kuchli kompyuterlar va qulay o'quv xonalari." },
  { id: 4, title: "Turli yo'nalishlar", icon: Compass, desc: "Dasturlashdan tortib buxgalteriyagacha." },
  { id: 5, title: "Barcha yoshdagilar uchun", icon: Users, desc: "Maktab o'quvchisidan tortib kattalargacha." },
  { id: 6, title: "Real natijalar", icon: TrendingUp, desc: "Bitiruvchilarimiz muvaffaqiyatli mutaxassislar." },
  { id: 7, title: "Sertifikat", icon: Award, desc: "Kurs yakunida rasmiy sertifikat beriladi." },
  { id: 8, title: "18+ vaqtincha ishsizlar uchun 100% bepul ta'lim", icon: ShieldCheck, desc: "Davlat tomonidan qoplanadigan ta'lim xarajatlari." },
];

export default function WhyUs() {
  return (
    <section id="why-us" className="py-24 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white"
          >
            Nega aynan <span className="text-primary">IT CENTER TO'RTKO'L?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg"
          >
            Sifatli ta'lim, amaliyot va qulay muhit - kelajak kasblarini o'rganishingiz uchun barcha sharoitlar yaratilgan.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isSpecial = feature.id === 8;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`glass-card p-6 flex flex-col items-start gap-4 hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden group ${
                  isSpecial ? "border-primary/50 shadow-[0_0_20px_rgba(0,214,84,0.15)]" : ""
                }`}
              >
                {isSpecial && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                )}
                
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 ${
                  isSpecial ? "bg-primary text-black shadow-[0_0_15px_rgba(0,214,84,0.5)]" : "bg-white/5 text-primary group-hover:bg-primary/20 transition-colors"
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                
                <h3 className={`text-xl font-bold ${isSpecial ? "text-primary" : "text-white"}`}>
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
