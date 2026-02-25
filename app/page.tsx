"use client";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductList from "@/components/ProductList";
import AboutRachel from "@/components/AboutRachel";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import OnboardingModal from "@/components/OnboardingModal";
import HelpAssistant from "@/components/HelpAssistant";
import { Suspense, useState, useEffect } from "react";

export default function Home() {
  const [onboarding, setOnboarding] = useState({ isOpen: false, step: 0 });

  useEffect(() => {
    const done = localStorage.getItem('sebhel_onboarding_done');
    if (!done) {
      const timer = setTimeout(() => setOnboarding({ isOpen: true, step: 0 }), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const openTutorial = (step = 0) => {
    setOnboarding({ isOpen: true, step });
  };

  return (
    <main>
      <OnboardingModal
        isOpen={onboarding.isOpen}
        initialStep={onboarding.step}
        onClose={() => setOnboarding(prev => ({ ...prev, isOpen: false }))}
      />
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
