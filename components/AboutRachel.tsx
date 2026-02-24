import Image from 'next/image';
import styles from './AboutRachel.module.css';
import { Quote } from 'lucide-react';

export default function AboutRachel() {
    return (
        <section id="rachel" className={styles.section}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    {/* Image Side */}
                    <div className={styles.imageCol}>
                        <div className={styles.imageWrapper}>
                            {/* Placeholder for Rachel's Image - User can replace src later */}
                            <div className={styles.placeholderImage}>
                                <img src="/images/products/owner2.jpeg" alt="Rachel" className={styles.ownerImage} />
                            </div>
                            <div className={styles.frameEffect}></div>
                        </div>
                        <div className={styles.nameBadge}>
                            <span>OWNER & CHEF</span>
                        </div>
                    </div>

                    {/* Text Side */}
                    <div className={styles.textCol}>
                        <h2 className={styles.heading}>
                            SIAPA ITU <span className={styles.highlight}>RACHEL?</span>
                        </h2>

                        <div className={styles.bio}>
                            <p>
                                Bukan sekadar nama, tapi jaminan rasa. Rachel memulai perjalanan ini dari dapur kecil dengan satu misi sederhana:
                                <strong> Membuat seblak yang pedasnya nendang, tapi tetap bisa dinikmati manusia.</strong>
                            </p>
                            <p>
                                "Seblak itu seni. Seni meracik kepedasan, kencur, dan kegurihan menjadi satu harmoni yang bikin <span className={styles.redText}>merem melek</span>."
                            </p>
                        </div>

                        <div className={styles.quoteBox}>
                            <Quote size={32} className={styles.quoteIcon} />
                            <p className={styles.quoteText}>
                                Kalau ga pedes, mending makan bubur ayam aja. Hidup butuh tantangan, Bestie!
                            </p>
                            <span className={styles.signature}>- Rachel, 2026</span>
                        </div>

                        <div className={styles.stats}>
                            <div className={styles.statItem}>
                                <span className={styles.statNum}>1+</span>
                                <span className={styles.statLabel}>TAHUN NGERASAIN PEDAS</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statNum}>100</span>
                                <span className={styles.statLabel}>PELANGGAN PUAS</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statNum}>8</span>
                                <span className={styles.statLabel}>LEVEL PEDAS</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
