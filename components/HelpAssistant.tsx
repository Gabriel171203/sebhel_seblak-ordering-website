"use client";

import React, { useState } from 'react';
import styles from './HelpAssistant.module.css';
import { HelpCircle, X, ChevronRight, MessageSquare, Info, Smartphone } from 'lucide-react';

const helpTopics = [
    {
        icon: <Info size={18} />,
        title: "Cara Order",
        description: "Pilih paket seblak, masuk Lab untuk kustomisasi, lalu checkout!"
    },
    {
        icon: <Smartphone size={18} />,
        title: "Kustomisasi (Lab)",
        description: "Pilih level pedas 0-8. Makin tinggi angkanya, makin membara!"
    },
    {
        icon: <MessageSquare size={18} />,
        title: "Bantuan WhatsApp",
        description: "Butuh bantuan langsung? Admin Rachel siap di WA!",
        link: "https://wa.me/628123456789" // Placeholder
    }
];

interface HelpAssistantProps {
    onOpenTutorial: (stepIndex?: number) => void;
}

export default function HelpAssistant({ onOpenTutorial }: HelpAssistantProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleTopicClick = (topic: typeof helpTopics[0]) => {
        if (topic.link) return;

        if (topic.title === "Cara Order") {
            onOpenTutorial(0);
        } else if (topic.title === "Kustomisasi (Lab)") {
            onOpenTutorial(1);
        }
        setIsOpen(false);
    };

    return (
        <div className={styles.wrapper}>
            {/* The Floating Button */}
            <button
                className={`${styles.floatingBtn} ${isOpen ? styles.hidden : ''}`}
                onClick={() => setIsOpen(true)}
            >
                <div className={styles.mascotBadge}>🌶️</div>
                <span className={styles.btnText}>Butuh Bantuan?</span>
            </button>

            {/* The Help Panel */}
            <div className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`}>
                <div className={styles.header}>
                    <div className={styles.headerTitle}>
                        <span className={styles.headerEmoji}>🌶️</span>
                        <div>
                            <h3>SI CABAI</h3>
                            <p>Asisten Pedasmu</p>
                        </div>
                    </div>
                    <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.content}>
                    <p className={styles.intro}>Ada yang bisa aku bantu meracik seblakmu hari ini?</p>

                    <div className={styles.topicList}>
                        {helpTopics.map((topic, idx) => (
                            <div
                                key={idx}
                                className={styles.topicItem}
                                onClick={() => handleTopicClick(topic)}
                                style={{ cursor: topic.link ? 'default' : 'pointer' }}
                            >
                                <div className={styles.topicIcon}>{topic.icon}</div>
                                <div className={topic.link ? styles.topicLink : styles.topicInfo}>
                                    {topic.link ? (
                                        <a href={topic.link} target="_blank" rel="noopener noreferrer">
                                            <h4>{topic.title}</h4>
                                            <p>{topic.description}</p>
                                        </a>
                                    ) : (
                                        <>
                                            <h4>{topic.title}</h4>
                                            <p>{topic.description}</p>
                                        </>
                                    )}
                                </div>
                                <ChevronRight size={14} className={styles.chevron} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.footer}>
                    <button className={styles.tutorialBtn} onClick={() => {
                        onOpenTutorial(0);
                        setIsOpen(false);
                    }}>
                        Ulang Tutorial
                    </button>
                </div>
            </div>

            {/* Backdrop for mobile */}
            {isOpen && <div className={styles.backdrop} onClick={() => setIsOpen(false)} />}
        </div>
    );
}
