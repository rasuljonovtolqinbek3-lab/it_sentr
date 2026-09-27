"use client";

import { motion } from "framer-motion";
import GalleryItem from "@/components/ui/GalleryItem";
import { MediaItem } from "@/components/ui/Lightbox";

const environmentMedia: MediaItem[] = [
  {
    id: "env-1",
    type: "video",
    src: "/videos/rolik-2.mp4",
    poster: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=2128&auto=format&fit=crop",
    alt: "Asosiy vidyo 1"
  },
  {
    id: "env-2",
    type: "video",
    src: "/videos/rolik-1.mp4",
    poster: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",
    alt: "Vidyo 2"
  },
  {
    id: "env-3",
    type: "video",
    src: "/videos/rolik-3.mp4",
    poster: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop", 
    alt: "Vidyo 3"
  },
  {
    id: "env-4",
    type: "video",
    src: "/videos/rolik-4.mp4",
    poster: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop", //ohirgisi qoyildi
    alt: "Vidyo 4"
  },


];

export default function Environment() {
  return (
    <section id="environment" className="py-24 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white"
          >
            IT CENTER TO'RTKO'L <span className="text-primary">muhiti</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg"
          >
            Markazimizdagi haqiqiy dars jarayonlari, o'quvchilar va tadbirlarni o'zingiz ko'ring.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {environmentMedia.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-2xl overflow-hidden aspect-video ${
                index === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              <GalleryItem item={item} allGalleryItems={environmentMedia} className="w-full h-full rounded-2xl" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
