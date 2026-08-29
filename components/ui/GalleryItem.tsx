"use client";

import { Maximize, Play } from "lucide-react";
import { openLightbox, MediaItem } from "./Lightbox";

interface GalleryItemProps {
  item: MediaItem;
  allGalleryItems: MediaItem[];
  className?: string;
}

export default function GalleryItem({ item, allGalleryItems, className = "" }: GalleryItemProps) {
  const handleClick = () => {
    const index = allGalleryItems.findIndex(i => i.id === item.id);
    openLightbox(allGalleryItems, index !== -1 ? index : 0);
  };

  return (
    <div 
      onClick={handleClick}
      className={`relative group overflow-hidden cursor-pointer bg-white/5 border border-white/10 ${className}`}
    >
      {item.type === "image" ? (
        <img 
          src={item.src} 
          alt={item.alt || ""} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <>
          <img 
            src={item.poster || ""} 
            alt={item.alt || ""} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
            <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center shadow-[0_0_20px_rgba(0,214,84,0.5)]">
              <Play className="w-6 h-6 text-black fill-black ml-1" />
            </div>
          </div>
        </>
      )}

      {/* Interactive Sticker */}
      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md border border-white/10 rounded-full p-2.5 shadow-xl transition-all duration-300 md:translate-x-4 md:opacity-0 group-hover:translate-x-0 group-hover:opacity-100 flex items-center gap-2 overflow-hidden">
        <Maximize className="w-4 h-4 text-white" />
        <span className="text-xs font-medium text-white max-w-0 opacity-0 group-hover:max-w-[100px] group-hover:opacity-100 group-hover:ml-1 transition-all duration-300 whitespace-nowrap">
          Ko'rish
        </span>
      </div>
    </div>
  );
}
