"use client";

import { useState, useEffect } from 'react';
import styles from './OnboardingModal.module.css';
import { X, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'sebhel_onboarding_done';

const steps = [
    {
        icon: "🌶️",
        title: "HALO, AKU SI CABAI!",
        description: "Aku asisten pedasmu di SEBHEL! Siap meracik seblak paling mantap hari ini?",
        tag: "WELCOME!",
    },
    {
        icon: "🧪",
        title: "THE SEBLAK LAB",
        description: "Pilih paket favoritmu untuk masuk ke Lab. Atur level pedas (0-8) dan tambahkan toping pilihanmu di sini!",
        tag: "KREASI TANPA BATAS",
    },
    {
        icon: "🛒",
        title: "TOPING TAMBAHAN",
        description: "Mau nambah toping dari menu? Masukkan minimal 1 paket ke keranjang dulu ya, baru semua toping akan terbuka!",
        tag: "INFO PENTING",
    },
    {
        icon: "🔥",
        title: "SIAP MEMBARA?",
        description: "Nikmati pengalaman makan seblak yang beda dari yang lain. Yuk, mulai order!",
        tag: "LETS GO!",
    },
];

interface OnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialStep?: number;
}

export default function OnboardingModal({ isOpen, onClose, initialStep = 0 }: OnboardingModalProps) {
    const [currentStep, setCurrentStep] = useState(initialStep);

    useEffect(() => {
        setCurrentStep(initialStep);
    }, [initialStep, isOpen]);

    const handleClose = () => {
        localStorage.setItem(STORAGE_KEY, 'true');
        onClose();
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

    if (!isOpen) return null;

    const step = steps[currentStep];
    const isLastStep = currentStep === steps.length - 1;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.mascotContainer}>
                    <div className={styles.mascotEmoji}>{step.icon}</div>
                    <div className={styles.speechBubble}>
                        <div className={styles.tag}>{step.tag}</div>
                        <p className={styles.description}>{step.description}</p>
                    </div>
                </div>

                <div className={styles.content}>
                    <h2 className={styles.title}>{step.title}</h2>

                    <div className={styles.dots}>
                        {steps.map((_, i) => (
                            <div
                                key={i}
                                className={`${styles.dot} ${i === currentStep ? styles.activeDot : ''} ${i < currentStep ? styles.completedDot : ''}`}
                            />
                        ))}
                    </div>

                    <div className={styles.navButtons}>
                        {currentStep > 0 && (
                            <button className={styles.prevBtn} onClick={handlePrev}>
                                <ArrowLeft size={18} />
                            </button>
                        )}
                        <button className={styles.nextBtn} onClick={handleNext}>
                            {isLastStep ? 'COBA SEKARANG!' : <ArrowRight size={24} />}
                        </button>
                    </div>
                </div>

                <button className={styles.skipBtn} onClick={handleClose}>LEWATI TUTORIAL</button>
            </div>
        </div>
    );
}
