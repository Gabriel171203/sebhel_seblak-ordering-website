"use client";

import { useState, useEffect } from 'react';
import styles from './OnboardingModal.module.css';
import { X, Search, ShoppingCart, ChefHat, CreditCard, ArrowRight, Flame } from 'lucide-react';

const STORAGE_KEY = 'sebhel_onboarding_done';

const steps = [
    {
        icon: <Flame size={48} color="#D32F2F" fill="#D32F2F" />,
        title: 'SELAMAT DATANG DI SEBHEL!',
        description: 'Seblak Rachel siap membakar lidahmu! 🌶️ Ikuti panduan singkat ini biar kamu langsung bisa order kayak pro.',
        tag: 'HALO, BESTIE!',
    },
    {
        icon: <Search size={48} color="#FFC107" />,
        title: 'CARI MENU DENGAN MUDAH',
        description: 'Gunakan kotak pencarian di Navbar untuk menemukan menu favoritmu. Ketik "Paket", "Es", atau nama topping apapun!',
        tag: 'FITUR SEARCH',
    },
    {
        icon: <ChefHat size={48} color="#FFC107" />,
        title: 'RACIK SEBLAKMU SENDIRI',
        description: 'Klik kartu menu manapun untuk masuk ke "THE SEBLAK LAB" — pilih level pedas (0-8) dan pilih topping favoritmu!',
        tag: 'KUSTOMISASI',
    },
    {
        icon: <ShoppingCart size={48} color="#D32F2F" />,
        title: 'CEK KERANJANGMU',
        description: 'Klik tombol "PESAN SEKARANG" di Navbar untuk melihat pesananmu. Kamu bisa hapus item sebelum checkout.',
        tag: 'KERANJANG',
    },
    {
        icon: <CreditCard size={48} color="#FFC107" />,
        title: 'BAYAR & NIKMATI',
        description: 'Bayar via QRIS atau Transfer Bank. Isi nama, WhatsApp, dan alamat pengiriman. Tim Rachel akan segera kontak kamu!',
        tag: 'PEMBAYARAN',
    },
];

export default function OnboardingModal() {
    const [isVisible, setIsVisible] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const done = localStorage.getItem(STORAGE_KEY);
        if (!done) {
            // Small delay so it doesn't flash immediately
            const timer = setTimeout(() => setIsVisible(true), 800);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        localStorage.setItem(STORAGE_KEY, 'true');
        setIsVisible(false);
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleClose();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    if (!isVisible) return null;

    const step = steps[currentStep];
    const isLastStep = currentStep === steps.length - 1;

    return (
        <div className={styles.overlay} onClick={handleClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

                {/* Close button */}
                <button className={styles.closeBtn} onClick={handleClose} aria-label="Tutup">
                    <X size={20} />
                </button>

                {/* Tag */}
                <div className={styles.tag}>{step.tag}</div>

                {/* Icon */}
                <div className={styles.iconWrapper}>
                    {step.icon}
                </div>

                {/* Content */}
                <h2 className={styles.title}>{step.title}</h2>
                <p className={styles.description}>{step.description}</p>

                {/* Step Dots */}
                <div className={styles.dots}>
                    {steps.map((_, i) => (
                        <button
                            key={i}
                            className={`${styles.dot} ${i === currentStep ? styles.activeDot : ''}`}
                            onClick={() => setCurrentStep(i)}
                            aria-label={`Langkah ${i + 1}`}
                        />
                    ))}
                </div>

                {/* Navigation */}
                <div className={styles.navButtons}>
                    {currentStep > 0 ? (
                        <button className={styles.prevBtn} onClick={handlePrev}>
                            ← Kembali
                        </button>
                    ) : (
                        <button className={styles.skipBtn} onClick={handleClose}>
                            Lewati
                        </button>
                    )}
                    <button className={styles.nextBtn} onClick={handleNext}>
                        {isLastStep ? 'MULAI ORDER! 🔥' : <>Lanjut <ArrowRight size={16} /></>}
                    </button>
                </div>
            </div>
        </div>
    );
}
