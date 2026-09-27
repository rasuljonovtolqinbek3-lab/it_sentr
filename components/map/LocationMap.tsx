"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useState } from "react";
import { MapPin, Navigation, Map } from "lucide-react";

import { IT_CENTER_ADDRESS } from "@/lib/constants";

// Dynamically import the actual map component to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import("./MapClient"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
      <div className="flex flex-col items-center gap-4 text-gray-400">
        <Map className="w-8 h-8 animate-pulse" />
        <span>Xarita yuklanmoqda...</span>
      </div>
    </div>
  ),
});

export default function LocationMap() {
  const [routeData, setRouteData] = useState<{ distance: string; time: string; error?: string } | null>(null);

  return (
    <section id="contact" className="py-24 relative bg-black border-t border-white/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white"
          >
            Bizni <span className="text-primary">toping</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Location Info & Actions */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="glass-card p-6 flex flex-col gap-6 h-full">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">IT CENTER TO'RTKO'L</h3>
                <p className="text-gray-400 text-sm">
                  {IT_CENTER_ADDRESS}
                </p>
              </div>

              <div className="space-y-4 flex-1">
                <div className="flex items-center justify-between py-3 border-b border-white/5 text-sm">
                  <span className="text-gray-400">Ish vaqti:</span>
                  <span className="text-white font-medium">Dushanba - Shanba<br/>08:00 - 20:00</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-white/5 text-sm">
                  <span className="text-gray-400">Dam olish:</span>
                  <span className="text-red-400 font-medium">Yakshanba</span>
                </div>
              </div>

              {/* Route Data Display */}
              {routeData && !routeData.error && (
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mt-auto">
                  <div className="text-xs text-primary font-medium mb-2">Sizdan markazgacha</div>
                  <div className="text-2xl font-bold text-white">{routeData.distance}</div>
                  <div className="text-sm text-gray-300">Taxminan {routeData.time}</div>
                </div>
              )}
              {routeData?.error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mt-auto text-sm text-red-400">
                  {routeData.error}
                </div>
              )}

              <a 
                href="https://www.google.com/maps/search/?api=1&query=Turtkul+hokimiyati"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <MapPin className="w-4 h-4" />
                Google Maps'da ochish
              </a>
            </div>
          </div>

          {/* Map Container */}
          <div className="lg:col-span-2 h-[400px] lg:h-[600px] rounded-2xl overflow-hidden relative border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <MapComponent onRouteCalculated={(dist: string, time: string) => setRouteData({ distance: dist, time: time })} onError={(err: string) => setRouteData({ error: err, distance: "", time: "" })} />
          </div>
        </div>
      </div>
    </section>
  );
}
