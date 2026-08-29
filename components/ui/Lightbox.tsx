"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Maximize, Play, Pause, Volume2, VolumeX } from "lucide-react";

export type MediaItem = {
  id: string;
  type: "image" | "video";
  src: string;
  alt?: string;
  poster?: string;
};

// Global state management for Lightbox
let globalSetLightboxState: any = null;

export const openLightbox = (items: MediaItem[], startIndex = 0) => {
  if (globalSetLightboxState) {
    globalSetLightboxState({ items, startIndex, isOpen: true });
  }
};

export default function Lightbox() {
  const [state, setState] = useState({ items: [] as MediaItem[], startIndex: 0, isOpen: false });
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Zoom state
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    globalSetLightboxState = setState;
    return () => { globalSetLightboxState = null; };
  }, []);

  useEffect(() => {
    if (state.isOpen) {
      setCurrentIndex(state.startIndex);
      setScale(1);
      setPan({ x: 0, y: 0 });
    }
  }, [state]);

  const close = () => {
    setState(s => ({ ...s, isOpen: false }));
    // Stop video if playing
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    if (state.isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [state.isOpen, currentIndex]);

  const next = () => {
    if (scale > 1) return; // Don't navigate while zoomed
    if (currentIndex < state.items.length - 1) {
      setCurrentIndex(c => c + 1);
      setScale(1);
      setPan({ x: 0, y: 0 });
    }
  };

  const prev = () => {
    if (scale > 1) return;
    if (currentIndex > 0) {
      setCurrentIndex(c => c - 1);
      setScale(1);
      setPan({ x: 0, y: 0 });
    }
  };

  // --- Touch & Swipe & Pinch to Zoom ---
  const touchStartRef = useRef<{x: number, y: number, time: number, distance: number}>({ x: 0, y: 0, time: 0, distance: 0 });
  
  const getDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx*dx + dy*dy);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartRef.current = { 
        x: e.touches[0].clientX, 
        y: e.touches[0].clientY, 
        time: Date.now(),
        distance: 0
      };
    } else if (e.touches.length === 2) {
      touchStartRef.current.distance = getDistance(e.touches);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Pinch to zoom
    if (e.touches.length === 2 && currentItem.type === "image") {
      e.preventDefault();
      const dist = getDistance(e.touches);
      const prevDist = touchStartRef.current.distance;
      if (prevDist > 0) {
        const delta = dist / prevDist;
        setScale(s => Math.min(Math.max(1, s * delta), 4));
      }
      touchStartRef.current.distance = dist;
    }
    
    // Pan when zoomed
    if (e.touches.length === 1 && scale > 1 && currentItem.type === "image") {
      const dx = e.touches[0].clientX - touchStartRef.current.x;
      const dy = e.touches[0].clientY - touchStartRef.current.y;
      setPan(p => ({ x: p.x + dx, y: p.y + dy }));
      touchStartRef.current.x = e.touches[0].clientX;
      touchStartRef.current.y = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (scale > 1) {
      // Boundaries reset if needed (simplified pan constraint)
      return;
    }
    
    if (e.changedTouches.length === 1) {
      const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
      const dt = Date.now() - touchStartRef.current.time;
      
      // Double tap to zoom
      if (dt < 300 && Math.abs(dx) < 10) {
        // Implement double tap logic: if tapped twice quickly
        // Actually, preventing default zooming and making a custom double tap is complex here.
        // Let's stick to a simple click handler for double tap.
      }
      
      // Swipe
      if (Math.abs(dx) > 50 && dt < 500) {
        if (dx > 0) prev();
        else next();
      }
    }
  };

  const handleDoubleTap = (e: React.MouseEvent) => {
    if (currentItem.type !== "image") return;
    if (scale > 1) {
      setScale(1);
      setPan({ x: 0, y: 0 });
    } else {
      setScale(2);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (currentItem.type !== "image") return;
    if (e.deltaY < 0) setScale(s => Math.min(s + 0.2, 4));
    else setScale(s => Math.max(s - 0.2, 1));
  };

  if (!state.isOpen || state.items.length === 0) return null;
  const currentItem = state.items[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center touch-none select-none"
      >
        {/* Header / Controls */}
        <div className="absolute top-0 left-0 w-full p-4 flex items-center justify-between z-10 bg-gradient-to-b from-black/60 to-transparent">
          <div className="text-white/70 font-mono text-sm px-3 py-1 bg-white/10 rounded-full">
            {currentIndex + 1} / {state.items.length}
          </div>
          
          <button 
            onClick={close}
            aria-label="Yopish"
            className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Arrows */}
        {currentIndex > 0 && scale === 1 && (
          <button 
            onClick={prev}
            aria-label="Oldingi rasm"
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10 hidden md:block"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
        )}
        
        {currentIndex < state.items.length - 1 && scale === 1 && (
          <button 
            onClick={next}
            aria-label="Keyingi rasm"
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10 hidden md:block"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        )}

        {/* Media Container */}
        <div 
          className="w-full h-full flex items-center justify-center overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onDoubleClick={handleDoubleTap}
          onWheel={handleWheel}
        >
          {currentItem.type === "image" ? (
            <motion.img
              key={currentItem.id}
              ref={imageRef}
              src={currentItem.src}
              alt={currentItem.alt || "Gallery image"}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                scale: scale,
                x: pan.x,
                y: pan.y
              }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="max-w-full max-h-full object-contain cursor-zoom-in"
              style={{ cursor: scale > 1 ? 'grab' : 'zoom-in' }}
              draggable={false}
            />
          ) : (
            <motion.video
              key={currentItem.id}
              ref={videoRef}
              src={currentItem.src}
              poster={currentItem.poster}
              controls
              autoPlay
              playsInline
              className="w-full max-w-5xl max-h-[80vh] object-contain shadow-2xl rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            />
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
