"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";

const questions = [
  {
    id: 1,
    question: "Yoshingiz nechida?",
    options: ["10-14 yosh", "15-18 yosh", "19-25 yosh", "26 yosh va undan yuqori"],
  },
  {
    id: 2,
    question: "Nimalarga ko'proq qiziqasiz?",
    options: ["Dizayn va ijodkorlik", "Mantiqiy masalalar yechish", "Texnika va elektronika", "Hisob-kitob va tahlil"],
  },
  {
    id: 3,
    question: "Kompyuter bilan ishlash tajribangiz qanday?",
    options: ["Endi o'rganyapman", "Foydalanuvchi darajasida", "Yaxshi tushunaman", "Dasturlashdan xabarim bor"],
  },
  {
    id: 4,
    question: "Kelajakda kim bo'lmoqchisiz?",
    options: ["Veb-saytlar yaratuvchisi", "Mobil ilovalar dasturchisi", "Kiberxavfsizlik mutaxassisi", "Boshqa/Hali bir qarorga kelmadim"],
  },
];

export default function CourseQuiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (option: string) => {
    setAnswers({ ...answers, [currentStep]: option });
  };

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResult(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResult(false);
  };

  // Dummy recommendation logic based on random factors or specific answers
  const getRecommendation = () => {
    const q2 = answers[1]; // Nimalarga ko'proq qiziqasiz
    if (q2 === "Dizayn va ijodkorlik") return "Web dasturlash (Frontend)";
    if (q2 === "Texnika va elektronika") return "Robototexnika";
    if (q2 === "Hisob-kitob va tahlil") return "Python / Buxgalteriya";
    return "C++ / Mobil dasturlash";
  };

  return (
    <section className="py-24 relative bg-black">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
            Sizga qaysi kurs <span className="text-primary">mos keladi?</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Qisqa savollarga javob bering va siz uchun eng mos yo'nalishni bilib oling.
          </p>
        </div>

        <div className="max-w-2xl mx-auto glass-card p-6 md:p-10 min-h-[400px] flex flex-col relative overflow-hidden">
          {/* Progress bar */}
          {!showResult && (
            <div className="w-full bg-white/5 h-1.5 rounded-full mb-8 overflow-hidden">
              <motion.div 
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep) / questions.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}

          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col"
              >
                <span className="text-primary text-sm font-medium mb-2">
                  Savol {currentStep + 1} / {questions.length}
                </span>
                <h3 className="text-2xl font-bold text-white mb-6">
                  {questions[currentStep].question}
                </h3>
                
                <div className="space-y-3 flex-1">
                  {questions[currentStep].options.map((option, idx) => {
                    const isSelected = answers[currentStep] === option;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelect(option)}
                        className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between ${
                          isSelected 
                            ? "bg-primary/10 border-primary text-white" 
                            : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                        }`}
                      >
                        <span>{option}</span>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-primary" />}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      currentStep === 0 ? "text-gray-600 cursor-not-allowed" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Orqaga
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={!answers[currentStep]}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-colors ${
                      !answers[currentStep] 
                        ? "bg-white/5 text-gray-500 cursor-not-allowed" 
                        : "bg-primary text-black hover:bg-primary-dark"
                    }`}
                  >
                    {currentStep === questions.length - 1 ? "Natijani ko'rish" : "Keyingisi"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center py-8"
              >
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-primary" />
                </div>
                <p className="text-gray-400 mb-2">Test natijasiga ko'ra sizga quyidagi kurs mos keladi:</p>
                <h3 className="text-3xl font-bold text-white mb-8 text-gradient-primary">
                  {getRecommendation()}
                </h3>
                
                <div className="flex flex-col w-full sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => window.dispatchEvent(new CustomEvent("open-registration-modal"))}
                    className="px-6 py-3 rounded-xl bg-primary text-black font-bold hover:bg-primary-dark transition-colors">
                    Kursga yozilish
                  </button>
                  <button className="px-6 py-3 rounded-xl glass text-white font-medium hover:bg-white/10 transition-colors">
                    Kurs haqida batafsil
                  </button>
                </div>
                <button onClick={resetQuiz} className="mt-8 text-sm text-gray-500 hover:text-white transition-colors underline decoration-white/20">
                  Testni qaytadan ishlash
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
