import styles from './ContactSection.module.css';
import { MapPin, Phone, Instagram, Clock } from 'lucide-react';

export default function ContactSection() {
    return (
        <section id="contact" className={styles.section}>
            <div className={styles.container}>
                <h2 className={styles.heading}>
                    KONTAK <span className={styles.highlight}>& INFORMASI</span>
                </h2>

                <div className={styles.grid}>
                    {/* Contact Info */}
                    <div className={styles.infoCol}>
                        <div className={styles.card}>
                            <h3 className={styles.cardTitle}>LOKASI & KONTAK</h3>

                            <div className={styles.infoItem}>
                                <MapPin className={styles.icon} />
                                <div>
                                    <h4 className={styles.infoLabel}>ALAMAT PENGIRIMAN</h4>
                                    <p>Sekitar Universitas Advent Indonesia<br />(Asrama Boys/Girls)</p>
                                </div>
                            </div   >

                            <div className={styles.infoItem}>
                                <Phone className={styles.icon} />
                                <div>
                                    <h4 className={styles.infoLabel}>WHATSAPP</h4>
                                    <p>+62 812-1416-8584</p>
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <Instagram className={styles.icon} />
                                <div>
                                    <h4 className={styles.infoLabel}>INSTAGRAM</h4>
                                    <p>@rchlrtnsr</p>
                                </div>
                            </div>
                        </div>

                        <div className={`${styles.card} ${styles.hoursCard}`}>
                            <h3 className={styles.cardTitle}>JADWAL PENGANTARAN</h3>
                            <div className={styles.infoItem}>
                                <Clock className={styles.icon} />
                                <div>
                                    <div className={styles.scheduleGrid}>
                                        <div className={styles.dayGroup}>
                                            <h4 className={styles.dayHeading}>SENIN - KAMIS</h4>
                                            <div className={styles.timeSlots}>
                                                <div className={styles.slot}><span>☀️ SIANG</span> <span>12:00 - 13:00</span></div>
                                                <div className={styles.slot}><span>🌙 MALAM</span> <span>18:00 - 21:00</span></div>
                                            </div>
                                        </div>

                                        <div className={styles.dayGroup}>
                                            <h4 className={styles.dayHeading}>JUMAT</h4>
                                            <div className={styles.timeSlots}>
                                                <div className={styles.slot}><span>☀️ SIANG</span> <span>12:00 - 15:00</span></div>
                                            </div>
                                        </div>

                                        <div className={styles.dayGroup}>
                                            <h4 className={styles.dayHeading}>SABTU</h4>
                                            <div className={styles.timeSlots}>
                                                <div className={styles.slot}><span>🌙 MALAM</span> <span>19:00 - 21:00</span></div>
                                            </div>
                                        </div>

                                        <div className={styles.dayGroup}>
                                            <h4 className={styles.dayHeading}>MINGGU</h4>
                                            <div className={styles.timeSlots}>
                                                <div className={styles.slot}><span>☀️ SIANG</span> <span>10:00 - 15:00</span></div>
                                                <div className={styles.slot}><span>🌙 MALAM</span> <span>18:00 - 21:00</span></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map Placeholder */}
                    <div className={styles.mapCol}>
                        <div className={styles.mapFrame}>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126748.56347862248!2d107.57311705249023!3d-6.903444341687889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e6398252477f%3A0x146a1f93d3e815b2!2sBandung%2C%20Bandung%20City%2C%20West%20Java!5e0!3m2!1sen!2sid!4v1708405000000!5m2!1sen!2sid"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className={styles.map}
                            ></iframe>
                            <div className={styles.mapOverlay}></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
