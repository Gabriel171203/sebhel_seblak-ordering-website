"use client";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductList from "@/components/ProductList";
import AboutRachel from "@/components/AboutRachel";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import HelpAssistant from "@/components/HelpAssistant";
import TutorialOverlay, { TutorialStep } from "@/components/TutorialOverlay";
import { Suspense, useState, useEffect } from "react";

export default function Home() {
  const [tutorial, setTutorial] = useState({ isOpen: false, step: 0, isSingleStep: false });

  const tutorialSteps: TutorialStep[] = [
    {
      targetId: 'screen',
      title: 'Selamat Datang di SEBHEL!',
      description: 'Halo! Aku Si Cabai, asisten pedasmu. Yuk, aku tunjukkan cara meracik seblak paling mantap!',
      position: 'center'
    },
    {
      targetId: 'navbar-search',
      title: 'Cari Menu Favorit',
      description: 'Bingung mau makan apa? Cari menu kesukaanmu di sini dengan cepat!',
      position: 'bottom'
    },
    {
      targetId: 'menu-section',
      title: 'Varian Menu Seblak',
      description: 'Pilih paket seblak favoritmu. Mulai dari Paket Ori sampai Paket Komplit yang melimpah!',
      position: 'top'
    },
    {
      targetId: 'menu-section',
      title: 'Syarat Tambah Topping',
      description: 'Mau nambah topping? Pastikan kamu pilih minimal 1 paket dulu ke dalam keranjang untuk membuka pilihan topping lainnya!',
      position: 'top'
    },
    {
      targetId: 'hero-actions',
      title: 'Mulai Pesan Sekarang',
      description: 'Klik tombol ini untuk langsung menuju menu dan mulai petualangan pedasmu!',
      position: 'bottom'
    },
    {
      targetId: 'cart-button',
      title: 'Keranjang Belanjamu',
      description: 'Setelah memilih, cek pesananmu di sini sebelum checkout. Jangan lupa tambahkan topping di Lab ya!',
      position: 'bottom'
    }
  ];

  /*
    useEffect(() => {
      const done = localStorage.getItem('sebhel_tutorial_done');
      if (!done) {
        const timer = setTimeout(() => setTutorial({ isOpen: true, step: 0, isSingleStep: false }), 1500);
        return () => clearTimeout(timer);
      }
    }, []);
  */

  const openTutorial = (step = 0, isSingleStep = false) => {
    setTutorial({ isOpen: true, step, isSingleStep });
  };

  return (
    <main>
      {/* 
      <TutorialOverlay
        isOpen={tutorial.isOpen}
        steps={tutorialSteps}
        initialStep={tutorial.step}
        isSingleStep={tutorial.isSingleStep}
        onClose={() => {
          setTutorial(prev => ({ ...prev, isOpen: false }));
          localStorage.setItem('sebhel_tutorial_done', 'true');
        }}
      />
      */}
      <HelpAssistant onOpenTutorial={openTutorial} />
      <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
        <Navbar />
      </Suspense>
      <HeroSection />
      <Suspense fallback={<div className="p-4 text-center">Loading Menu...</div>}>
        <ProductList />
      </Suspense>
      <AboutRachel />
      <ContactSection />
      <Footer />
    </main>
  );
}
