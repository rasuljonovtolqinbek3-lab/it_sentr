"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCircle2, AlertCircle, MessageCircle } from "lucide-react";

export const openRegistrationModal = () => {
  window.dispatchEvent(new CustomEvent("open-registration-modal"));
};

export default function RegistrationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    phone: "+998",
    age: "",
    course: "",
  });
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-registration-modal", handleOpen);
    return () => window.removeEventListener("open-registration-modal", handleOpen);
  }, []);

  const validatePhone = (phone: string) => {
    // Basic validation for +998XXXXXXXXX (exactly +998 followed by 9 digits)
    const regex = /^\+998\d{9}$/;
    return regex.test(phone.replace(/\s/g, ''));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith("+998")) {
      val = "+998";
    }
    // Only allow numbers and plus
    val = val.replace(/[^\d+]/g, '');
    
    // Max length: +998 (4) + 9 digits = 13 characters
    if (val.length > 13) {
      val = val.slice(0, 13);
    }
    
    setFormData({ ...formData, phone: val });
    if (phoneError) setPhoneError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePhone(formData.phone)) {
      setPhoneError("To'g'ri raqam kiriting (masalan: +998901234567)");
      return;
    }

    setStatus("loading");
    
    try {
      const response = await fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          age: formData.age,
          course: formData.course
        }),
      });

      if (response.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  const close = () => {
    setIsOpen(false);
    setTimeout(() => {
      setStatus("idle");
      setFormData({ name: "", phone: "+998", age: "", course: "" });
      setPhoneError("");
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
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md z-[101] glass bg-[#0a0c0b] p-6 rounded-2xl border border-white/10 shadow-2xl"
          >
            <button 
              onClick={close}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {status === "success" ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Arizangiz qabul qilindi!</h3>
                <p className="text-gray-400">Tez orada siz bilan bog'lanamiz.</p>
                <button 
                  onClick={close}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
                >
                  Yopish
                </button>
              </div>
            ) : status === "error" ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Xatolik yuz berdi</h3>
                <p className="text-gray-400 mb-6 text-sm">
                  Ariza yuborishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring yoki Telegram orqali bevosita bog'laning.
                </p>
                
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => setStatus("idle")}
                    className="w-full px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
                  >
                    Qayta urinib ko'rish
                  </button>
                  <a 
                    href="https://t.me/turtkul_itpark"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full px-6 py-3 rounded-xl bg-[#0088cc] hover:bg-[#0077b3] text-white font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Telegram orqali bog'lanish
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="text-center mb-2">
                  <h3 className="text-2xl font-bold text-white mb-1">Kursga yozilish</h3>
                  <p className="text-gray-400 text-sm">Ma'lumotlaringizni kiriting va o'z joyingizni band qiling</p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-300">Ism</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ismingiz"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary text-white outline-none transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-300">Telefon</label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    placeholder="+998"
                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${phoneError ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-primary'} text-white outline-none transition-colors`}
                  />
                  {phoneError && <span className="text-xs text-red-500 font-medium">{phoneError}</span>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-300">Yosh</label>
                    <input
                      required
                      type="number"
                      min="10"
                      max="80"
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                      placeholder="Yoshingiz"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary text-white outline-none transition-colors"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-300">Kurs</label>
                    <select
                      required
                      value={formData.course}
                      onChange={(e) => setFormData({...formData, course: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary text-white outline-none transition-colors appearance-none"
                    >
                      <option value="" disabled className="text-gray-500">Tanlang...</option>
                      <option value="Web dasturlash" className="bg-[#0a0c0b]">Web dasturlash</option>
                      <option value="Python" className="bg-[#0a0c0b]">Python</option>
                      <option value="C++" className="bg-[#0a0c0b]">C++</option>
                      <option value="Kiberxavfsizlik" className="bg-[#0a0c0b]">Kiberxavfsizlik</option>
                      <option value="Mobil dasturlash" className="bg-[#0a0c0b]">Mobil dasturlash</option>
                      <option value="Ingliz tili" className="bg-[#0a0c0b]">Ingliz tili</option>
                      <option value="Buxgalteriya" className="bg-[#0a0c0b]">Buxgalteriya</option>
                      <option value="Robototexnika" className="bg-[#0a0c0b]">Robototexnika</option>
                      <option value="Kompyuter savodxonligi" className="bg-[#0a0c0b]">Kompyuter savodxonligi</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full mt-4 py-3.5 rounded-xl bg-primary text-black font-bold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {status === "loading" ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Yuborilmoqda...
                    </>
                  ) : (
                    <>
                      Yuborish
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
