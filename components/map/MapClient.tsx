"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import { Navigation } from "lucide-react";
import { IT_CENTER_COORDS } from "@/lib/constants";

// Fix leaflet icon issues in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface MapClientProps {
  onRouteCalculated: (distance: string, time: string) => void;
  onError: (error: string) => void;
}

export default function MapClient({ onRouteCalculated, onError }: MapClientProps) {
  const mapRef = useRef<L.Map | null>(null);
  const routingControlRef = useRef<any>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  
  useEffect(() => {
    if (!mapRef.current) {
      // Initialize map
      const map = L.map("map-container", {
        center: IT_CENTER_COORDS,
        zoom: 15,
        zoomControl: false,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Destination Marker
      const customIcon = L.divIcon({
        className: "bg-transparent",
        html: `<div class="w-10 h-10 -ml-5 -mt-10 bg-primary/20 rounded-full flex items-center justify-center animate-pulse"><div class="w-4 h-4 bg-primary rounded-full shadow-[0_0_10px_#00d654]"></div></div>`,
      });

      L.marker(IT_CENTER_COORDS, { icon: customIcon })
        .addTo(map)
        .bindPopup("<div class='font-bold text-black'>IT CENTER TO'RTKO'L</div>", {
          closeButton: false,
        })
        .openPopup();

      mapRef.current = map;
    }

    return () => {
      // Cleanup
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const handleCreateRoute = () => {
    if (!navigator.geolocation) {
      onError("Brauzeringiz geolokatsiyani qo'llab-quvvatlamaydi.");
      return;
    }

    setIsLoadingRoute(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        if (mapRef.current) {
          // Remove existing routing if any
          if (routingControlRef.current) {
            mapRef.current.removeControl(routingControlRef.current);
          }

          // Add user marker
          const userIcon = L.divIcon({
            className: "bg-transparent",
            html: `<div class="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg"></div>`,
          });
          L.marker([userLat, userLng], { icon: userIcon })
            .addTo(mapRef.current)
            .bindPopup("Sizning joylashuvingiz");

          // @ts-ignore
          routingControlRef.current = L.Routing.control({
            waypoints: [
              L.latLng(userLat, userLng),
              L.latLng(IT_CENTER_COORDS[0], IT_CENTER_COORDS[1]),
            ],
            routeWhileDragging: false,
            addWaypoints: false,
            show: false, // Don't show the text itinerary
            fitSelectedRoutes: true,
            lineOptions: {
              styles: [{ color: "#ff3333", weight: 5, opacity: 0.8 }], // RED LINE
              extendToWaypoints: true,
              missingRouteTolerance: 0,
            },
            // @ts-ignore: leaflet-routing-machine typings are sometimes missing createMarker
            createMarker: function() { return null; } // We handle markers ourselves
          }).addTo(mapRef.current);

          routingControlRef.current.on("routesfound", function (e: any) {
            const routes = e.routes;
            if (routes && routes.length > 0) {
              const summary = routes[0].summary;
              // distance is in meters, time is in seconds
              const distanceKm = (summary.totalDistance / 1000).toFixed(1) + " km";
              const timeMin = Math.round(summary.totalTime / 60) + " daqiqa";
              
              onRouteCalculated(distanceKm, timeMin);
              setIsLoadingRoute(false);
            }
          });

          routingControlRef.current.on("routingerror", function() {
            onError("Yo'nalish tuzishda xatolik yuz berdi. Iltimos, keyinroq urinib ko'ring.");
            setIsLoadingRoute(false);
          });
        }
      },
      (error) => {
        setIsLoadingRoute(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            onError("Geolokatsiyadan foydalanishga ruxsat berilmadi.");
            break;
          case error.POSITION_UNAVAILABLE:
            onError("Joylashuv ma'lumotlarini olish imkonsiz.");
            break;
          case error.TIMEOUT:
            onError("Joylashuvni aniqlash vaqti tugadi.");
            break;
          default:
            onError("Noma'lum xatolik yuz berdi.");
            break;
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="w-full h-full relative">
      <div id="map-container" className="w-full h-full z-0" style={{ background: "#111" }} />
      
      {/* Absolute overlay button */}
      <button 
        onClick={handleCreateRoute}
        disabled={isLoadingRoute}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] px-6 py-3 rounded-full bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-xl flex items-center gap-2"
      >
        <Navigation className={`w-5 h-5 ${isLoadingRoute ? "animate-spin" : ""}`} />
        {isLoadingRoute ? "Yo'nalish izlanmoqda..." : "Yo'nalish tuzish"}
      </button>
    </div>
  );
}
