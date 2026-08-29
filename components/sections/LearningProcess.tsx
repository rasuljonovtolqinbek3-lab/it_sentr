"use client";

import { motion } from "framer-motion";

const steps = [
  { id: "01", title: "Yo'nalishni tanlang" },
  { id: "02", title: "Kursga yoziling" },
  { id: "03", title: "Ta'limni boshlang" },
  { id: "04", title: "Amaliy ko'nikmalarni egallang" },
  { id: "05", title: "Kursni muvaffaqiyatli tamomlang" },
  { id: "06", title: "Sertifikatga ega bo'ling" },
];

export default function LearningProcess() {
  return (
    <section className="py-24 relative overflow-hidden bg-white/[0.01]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white"
          >
            Ta'lim jarayoni
          </motion.h2>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Main Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2 hidden md:block" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative flex flex-col items-center text-center group"
              >
                {/* Connector line for mobile */}
                {index !== steps.length - 1 && (
                  <div className="absolute top-8 left-1/2 w-0.5 h-16 bg-white/10 md:hidden" />
                )}
                
                <div className="w-16 h-16 rounded-2xl bg-black border border-white/10 flex items-center justify-center relative z-10 mb-6 group-hover:border-primary group-hover:shadow-[0_0_15px_rgba(0,214,84,0.3)] transition-all duration-300">
                  <span className="text-xl font-bold text-gray-400 group-hover:text-primary transition-colors">
                    {step.id}
                  </span>
                </div>
                
                <h3 className="text-white font-medium text-sm md:text-base px-2">
                  {step.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
