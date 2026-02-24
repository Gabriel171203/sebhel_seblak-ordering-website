"use client";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductList from "@/components/ProductList";
import AboutRachel from "@/components/AboutRachel";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import OnboardingModal from "@/components/OnboardingModal";
import { Suspense } from "react";

export default function Home() {
  return (
    <main>
      <OnboardingModal />
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
