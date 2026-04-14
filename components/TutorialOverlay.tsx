"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './TutorialOverlay.module.css';
import { ArrowDown, Check, ArrowRight } from 'lucide-react';

export interface TutorialStep {
    targetId: string;
    title: string;
    description: string;
    position: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface TutorialOverlayProps {
    steps: TutorialStep[];
    isOpen: boolean;
    onClose: () => void;
    initialStep?: number;
    isSingleStep?: boolean;
}

interface Rect {
    top: number;
    left: number;
    width: number;
    height: number;
    bottom: number;
    right: number;
}

export default function TutorialOverlay({
    steps,
    isOpen,
    onClose,
    initialStep = 0,
    isSingleStep = false,
}: TutorialOverlayProps) {
    const [currentStep, setCurrentStep] = useState(initialStep);
    const [spotlightRect, setSpotlightRect] = useState<Rect | null>(null);
    const isScrollingRef = useRef(false);
    const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const rafRef = useRef<number | null>(null);

    // Sync step when tutorial is opened with a specific starting step
    useEffect(() => {
        if (isOpen) {
            setCurrentStep(initialStep);
        }
    }, [initialStep, isOpen]);

    // Recalculate spotlight position for current step
    const measureSpotlight = useCallback(() => {
        const step = steps[currentStep];
        if (!step || step.targetId === 'screen') {
            setSpotlightRect(null);
            return;
        }

        const el = document.getElementById(step.targetId);
        if (!el) {
            setSpotlightRect(null);
            return;
        }

        const r = el.getBoundingClientRect();
        setSpotlightRect({
            top: r.top,
            left: r.left,
            width: r.width,
            height: r.height,
            bottom: r.bottom,
            right: r.right,
        });
    }, [currentStep, steps]);

    // Scroll target into view, then remeasure; suppress scroll-driven recalculations during scroll
    const scrollAndMeasure = useCallback(() => {
        const step = steps[currentStep];
        if (!step || step.targetId === 'screen') {
            setSpotlightRect(null);
            return;
        }

        const el = document.getElementById(step.targetId);
        if (!el) {
            setSpotlightRect(null);
            return;
        }

        // Mark scrolling = true so the scroll listener doesn't fight us
        isScrollingRef.current = true;
        if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);

        el.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // After scroll animation ends (~600ms), re-measure and re-enable scroll tracking
        scrollTimerRef.current = setTimeout(() => {
            isScrollingRef.current = false;
            measureSpotlight();
        }, 650);
    }, [currentStep, steps, measureSpotlight]);

    // Debounced scroll handler — only re-measures when user scrolls (not our programmatic scroll)
    const handleScroll = useCallback(() => {
        if (isScrollingRef.current) return;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(measureSpotlight);
    }, [measureSpotlight]);

    useEffect(() => {
        if (!isOpen) return;

        scrollAndMeasure();

        window.addEventListener('resize', measureSpotlight);
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('resize', measureSpotlight);
            window.removeEventListener('scroll', handleScroll);
            if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [isOpen, scrollAndMeasure, measureSpotlight, handleScroll]);

    if (!isOpen) return null;

    const step = steps[currentStep];
    if (!step) return null;

    const isLastStep = isSingleStep || currentStep === steps.length - 1;

    const handleNext = () => {
        if (isLastStep) {
            onClose();
        } else {
            setCurrentStep((prev) => prev + 1);
        }
    };

    // ── Tooltip position calculation ──────────────────────────────────────────
    const PADDING = 16;
    const TOOLTIP_W = 320;

    const getTooltipStyle = (): React.CSSProperties => {
        if (!spotlightRect || step.targetId === 'screen') {
            return { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
        }

        const vw = window.innerWidth;
        const vh = window.innerHeight;

        let top: number;
        let left: number;

        switch (step.position) {
            case 'bottom':
                top = spotlightRect.bottom + PADDING;
                left = spotlightRect.left + spotlightRect.width / 2 - TOOLTIP_W / 2;
                break;
            case 'top':
                top = spotlightRect.top - PADDING;
                left = spotlightRect.left + spotlightRect.width / 2 - TOOLTIP_W / 2;
                break;
            case 'left':
                top = spotlightRect.top + spotlightRect.height / 2;
                left = spotlightRect.left - PADDING - TOOLTIP_W;
                break;
            case 'right':
                top = spotlightRect.top + spotlightRect.height / 2;
                left = spotlightRect.right + PADDING;
                break;
            default:
                return { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
        }

        // Clamp horizontally
        left = Math.max(PADDING, Math.min(left, vw - TOOLTIP_W - PADDING));
        // Clamp vertically (rough estimate)
        top = Math.max(PADDING, Math.min(top, vh - 200));

        return {
            position: 'fixed',
            top: `${top}px`,
            left: `${left}px`,
            ...(step.position === 'top' ? { transform: 'translateY(-100%)' } : {}),
            ...(step.position === 'left' || step.position === 'right' ? { transform: 'translateY(-50%)' } : {}),
        };
    };

    const spotlightStyle: React.CSSProperties = spotlightRect
        ? {
            position: 'fixed',
            top: `${spotlightRect.top}px`,
            left: `${spotlightRect.left}px`,
            width: `${spotlightRect.width}px`,
            height: `${spotlightRect.height}px`,
        }
        : { display: 'none' };

    const arrowClass = styles[`arrow${step.position.charAt(0).toUpperCase() + step.position.slice(1)}`];
    const showArrow = step.targetId !== 'screen' && step.position !== 'center';
    const arrowAbove = step.position === 'top' || step.position === 'left';

    return (
        <div className={styles.overlay}>
            {/* Spotlight hole */}
            <div className={styles.spotlight} style={spotlightStyle} />

            {/* Tooltip */}
            <div className={styles.content} style={getTooltipStyle()}>
                {/* Arrow above tooltip (when target is below) */}
                {showArrow && !arrowAbove && (
                    <div className={styles.arrow}>
                        <ArrowDown size={36} className={arrowClass} />
                    </div>
                )}

                <div className={styles.tooltip}>
                    <h3 className={styles.title}>{step.title}</h3>
                    <p className={styles.description}>{step.description}</p>

                    <div className={styles.footer}>
                        <button className={styles.skipBtn} onClick={onClose}>
                            {isSingleStep ? 'TUTUP' : 'LEWATI'}
                        </button>
                        <button className={styles.nextBtn} onClick={handleNext}>
                            {isLastStep ? (
                                <>MENGERTI! <Check size={16} /></>
                            ) : (
                                <>LANJUT <ArrowRight size={16} /></>
                            )}
                        </button>
                    </div>
                </div>

                {/* Arrow below tooltip (when target is above) */}
                {showArrow && arrowAbove && (
                    <div className={styles.arrow}>
                        <ArrowDown size={36} className={arrowClass} />
                    </div>
                )}
            </div>
        </div>
    );
}
