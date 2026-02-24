import Link from 'next/link';
import styles from './HeroSection.module.css';
import { ArrowRight, Flame, Sparkles, Zap } from 'lucide-react';

export default function HeroSection() {
    return (
        <section className={styles.hero}>
            {/* Decorative Floating Elements */}
            <div className={`${styles.decor} ${styles.decor1}`}><Flame size={40} fill="var(--color-primary)" color="transparent" /></div>
            <div className={`${styles.decor} ${styles.decor2}`}><Sparkles size={30} color="var(--color-primary)" /></div>
            <div className={`${styles.decor} ${styles.decor3}`}><Zap size={35} fill="var(--color-accent)" color="transparent" /></div>

            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.badge}>
                        <Flame size={14} fill="black" />
                        <span>Best Spicy Seblak in Town</span>
                    </div>
                    <h1 className={styles.title}>
                        LEVEL PEDAS <br />
                        YANG BIKIN <span className={styles.highlight}>KANGEN</span>,<br />
                        BUKAN BIKIN <span className={styles.stroke}>DENDAM.</span>
                    </h1>
                    <p className={styles.description}>
                        Racik seblak impianmu dengan topping melimpah dan tingkat kepedasan yang pas di hati. Garansi ketagihan!
                    </p>
                    <div className={styles.actions}>
                        <Link href="#menu" className="btn btn-primary">
                            Mulai Pesan <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                        </Link>
                        <Link href="#menu" className="btn btn-outline">
                            Lihat Menu
                        </Link>
                    </div>
                </div>

                <div className={styles.imageWrapper}>
                    <div className={styles.imageGlow}></div>
                    <div className={styles.heroImageContainer}>
                        <img
                            src="/images/products/hero-seblak.webp"
                            alt="Spicy bowl of Seblak"
                            className={styles.heroImage}
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1596797038530-2c39da01548e?q=80&w=600&auto=format&fit=crop';
                            }}
                        />
                    </div>

                    <div className={styles.floatingBadge}>
                        <div className={styles.badgeInner}>
                            <span className={styles.badgeValue}>100%</span>
                            <span className={styles.badgeLabel}>NAGIH BANGET</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
