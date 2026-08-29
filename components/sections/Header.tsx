"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Bosh sahifa", href: "/" },
    { name: "Kurslar", href: "#courses" },
    { name: "Nega biz?", href: "#why-us" },
    { name: "Natijalar", href: "#achievements" },
    { name: "Muhitimiz", href: "#environment" },
    { name: "Aloqa", href: "#contact" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "glass py-4" : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center font-bold text-black text-xl shadow-[0_0_15px_rgba(0,214,84,0.5)] group-hover:scale-105 transition-transform">
            IT
          </div>
          <span className="font-bold text-lg hidden sm:block tracking-tight">CENTER TO'RTO'L</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-gray-300 hover:text-primary transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-300 hover:text-white cursor-pointer">
            <Globe className="w-4 h-4" />
            <span>UZ</span>
          </div>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent("open-registration-modal"))}
            className="hidden sm:inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-primary text-black font-semibold text-sm hover:bg-primary-dark transition-colors shadow-[0_0_15px_rgba(0,214,84,0.3)] hover:shadow-[0_0_25px_rgba(0,214,84,0.5)]">
            Kursga yozilish
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-gray-300 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 glass border-t border-white/5 flex flex-col p-4 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="py-3 px-4 text-base font-medium text-gray-300 hover:text-primary hover:bg-white/5 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-4">
            <div className="flex items-center gap-2 px-4 py-2 text-gray-300">
              <Globe className="w-5 h-5" />
              <span>O'zbekcha</span>
            </div>
            <button 
              onClick={() => {
                setMobileMenuOpen(false);
                window.dispatchEvent(new CustomEvent("open-registration-modal"));
              }}
              className="w-full py-3 rounded-xl bg-primary text-black font-semibold hover:bg-primary-dark transition-colors">
              Kursga yozilish
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
