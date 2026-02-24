import styles from './Footer.module.css';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.top}>
                    <div className={styles.brand}>
                        <h2 className={styles.logo}>SEBHEL</h2>
                        <p className={styles.tagline}>Pedasnya Bikin Nagih, Rasanya Bikin Kangen.</p>
                    </div>

                    <div className={styles.links}>
                        <Link href="#menu">Menu</Link>
                        <Link href="#rachel">Tentang Rachel</Link>
                        <Link href="#contact">Lokasi</Link>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>&copy; {new Date().getFullYear()} Seblak Rachel. All Rights Reserved.</p>
                    <p className={styles.credit}>Made by Gabrach7</p>
                </div>
            </div>
        </footer>
    );
}
