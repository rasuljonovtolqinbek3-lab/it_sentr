"use client";

import { motion } from "framer-motion";
import GalleryItem from "@/components/ui/GalleryItem";
import { MediaItem } from "@/components/ui/Lightbox";

const certificatesMedia: MediaItem[] = [
  {
    id: "cert-1",
    type: "image",
    src: "/images/sertifikat-1.JPG",
    alt: "Sertifikat 1"
  },
  {
    id: "cert-2",
    type: "image",
    src: "/images/sertifikt-2.JPG",
    alt: "Sertifikat 2"
  },
  {
    id: "cert-3",
    type: "image",
    src: "/images/sertifikat-3.JPG",
    alt: "Sertifikat 3"
  },
  {
    id: "cert-4",
    type: "image",
    src: "/images/sertifikat-4.jpg", // Changed to .JPG (User needs to convert HEIC to JPG)
    alt: "Sertifikat 4"
  },
  {
    id: "cert-5",
    type: "image",
    src: "/images/sertifikat-5.jpg",
    alt: "Sertifikat 5"
  },
  {
    id: "cert-6",
    type: "image",
    src: "/images/sertifikat-6.jpg", //tayor
    alt: "Sertifikat 6"
  },
  {
    id: "cert-7",
    type: "image",
    src: "/images/sertifikat-7.jpg",
    alt: "Sertifikat 7"
  },
  {
    id: "cert-8",
    type: "image",
    src: "/images/sertifikat-8.jpg",
    alt: "Sertifikat 8"
  }
];

export default function Achievements() {
  return (
    <section id="achievements" className="py-24 relative bg-white/[0.01]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white"
          >
            Natijalarimiz
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg"
          >
            O'quvchilarimiz kurslarni muvaffaqiyatli tamomlab, sertifikatga ega bo'lishgan.
          </motion.p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-16">
          <div className="glass-card p-8 text-center min-w-[250px]">
            <div className="text-4xl font-bold text-primary mb-2">3000+</div>
            <div className="text-gray-400 font-medium">O'quvchi</div>
          </div>
          <div className="glass-card p-8 text-center min-w-[250px]">
            <div className="text-4xl font-bold text-primary mb-2">3000+</div>
            <div className="text-gray-400 font-medium">Sertifikat</div>
          </div>
        </div>

        {/* Certificate Gallery */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {certificatesMedia.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="rounded-xl overflow-hidden aspect-[3/4] border border-white/10 shadow-lg bg-white/5"
            >
              <GalleryItem 
                item={item} 
                allGalleryItems={certificatesMedia} 
                className="w-full h-full rounded-xl object-cover"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
