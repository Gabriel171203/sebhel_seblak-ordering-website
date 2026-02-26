"use client";

import { useCart } from '@/context/CartContext';
import styles from './checkout.module.css';
import Navbar from '@/components/Navbar';
import { useState } from 'react';
import { ArrowLeft, CheckCircle, X as CloseIcon, ZoomIn } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

export default function CheckoutPage() {
    const { items, total, clearCart } = useCart();
    const [paymentMethod] = useState<'qris'>('qris');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isQrisZoomed, setIsQrisZoomed] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        note: '',
    });
    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [proofPreview, setProofPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPaymentProof(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProofPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadToCloudinary = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        // Using unsigned upload preset for simplicity
        // USER needs to set these in .env
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'sebhel-temp';
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'unsigned_preset';

        formData.append('upload_preset', uploadPreset);

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Upload failed');
            const data = await response.json();
            return data.secure_url;
        } catch (error) {
            console.error('Cloudinary Upload Error:', error);
            return null;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);

        let proofUrl = '';
        if (paymentProof) {
            proofUrl = await uploadToCloudinary(paymentProof);
        }

        // Build order lines
        const orderLines = items.map(item => {
            const toppings = item.selectedToppings && item.selectedToppings.length > 0
                ? `\n  Topping: ${item.selectedToppings.map(t => `${t.name} (x${t.quantity})`).join(', ')}`
                : '';
            const level = item.spicinessLevel !== undefined ? ` (Level ${item.spicinessLevel})` : '';
            const bonus = item.bonusDrink ? `\n  🎁 Bonus Minuman: ${item.bonusDrink}` : '';
            return `- ${item.name}${level}: Rp ${item.totalPrice.toLocaleString('id-ID')}${toppings}${bonus}`;
        }).join('\n');

        const separator = '--------------------------------';
        const message = [
            `*PESANAN BARU - SEBHEL*`,
            separator,
            `*RINCIAN PESANAN*`,
            orderLines,
            separator,
            `*TOTAL PEMBAYARAN: Rp ${total.toLocaleString('id-ID')}*`,
            separator,
            `*DATA PENGIRIMAN*`,
            `- Nama: ${formData.name}`,
            `- WhatsApp: ${formData.phone}`,
            `- Alamat: ${formData.address}`,
            formData.note ? `- Catatan: ${formData.note}` : '',
            separator,
            `*METODE PEMBAYARAN: QRIS*`,
            separator,
            proofUrl ? `✅ *BUKTI BAYAR DISINI:*` : `⚠️ *BUKTI BAYAR BELUM DILAMPIRKAN*`,
            proofUrl ? proofUrl : `_(Mohon lampirkan manual ya Kak!)_`,
            separator,
        ].join('\n');

        const rachelNumber = process.env.NEXT_PUBLIC_RACHEL_WHATSAPP || '62';
        const waUrl = `https://wa.me/${rachelNumber}?text=${encodeURIComponent(message)}`;

        // Open WA in new tab
        window.open(waUrl, '_blank');

        // Clear cart
        clearCart();

        // Show success screen
        setIsSuccess(true);
        setIsUploading(false);
    };

    if (isSuccess) {
        return (
            <div className={styles.successContainer}>
                <div className={styles.confetti}>🎉</div>
                <CheckCircle size={80} color="#4CAF50" />
                <h1 className={styles.successTitle}>TERIMA KASIH! ❤️</h1>

                <div className={styles.thankYouCard}>
                    <p className={styles.successText}>
                        Pesananmu sudah Rachel terima dan sedang diproses!
                    </p>
                    <p className={styles.subSuccessText}>
                        Bukti bayar sudah terkirim otomatis. Rachel akan segera menghubungimu via WhatsApp untuk konfirmasi pengiriman. 🌶️
                    </p>
                </div>

                <div className={styles.shareSection}>
                    <h3 className={styles.shareTitle}>Senang dengan SEBHEL?</h3>
                    <p className={styles.shareSubtitle}>Bantu Rachel sebarkan pedasnya ke teman-temanmu!</p>
                    <div className={styles.shareButtons}>
                        <a
                            href={`https://wa.me/?text=${encodeURIComponent('Eh, cobain deh Seblak SEBHEL! Pedasnya nendang banget dan bisa custom topping sesukamu. Cek menunya di sini: ' + window.location.origin)}`}
                            target="_blank"
                            rel="noreferrer"
                            className={styles.shareButtonWA}
                        >
                            Bagikan ke WhatsApp 📲
                        </a>
                    </div>
                </div>

                <div className={styles.actionButtons}>
                    <Link href="/" className="btn btn-primary">Kembali ke Menu</Link>
                    <a
                        href={`https://wa.me/${process.env.NEXT_PUBLIC_RACHEL_WHATSAPP || '62'}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline"
                    >
                        Chat Rachel
                    </a>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <>
                <Suspense fallback={<div className={styles.loadingNav}>Loading...</div>}>
                    <Navbar />
                </Suspense>
                <div className={styles.emptyContainer}>
                    <h1>Keranjang Kosong</h1>
                    <Link href="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>Belanja Dulu Yuk</Link>
                </div>
            </>
        );
    }

    return (
        <>
            <Suspense fallback={<div className={styles.loadingNav}>Loading...</div>}>
                <Navbar />
            </Suspense>
            <div className={styles.pageContainer}>
                <div className={styles.header}>
                    <Link href="/" className={styles.backLink}>
                        <ArrowLeft size={20} /> Kembali
                    </Link>
                    <h1 className={styles.pageTitle}>Checkout</h1>
                </div>

                <div className={styles.grid}>
                    {/* Order Summary */}
                    <div className={styles.column}>
                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>Ringkasan Pesanan</h2>
                            <div className={styles.itemList}>
                                {items.map((item) => (
                                    <div key={item.cartId} className={styles.item}>
                                        <div style={{ width: '100%' }}>
                                            <div className={styles.itemNameRow}>
                                                <div className={styles.itemName}>{item.name}</div>
                                                <div className={styles.itemPrice}>Rp {item.totalPrice.toLocaleString('id-ID')}</div>
                                            </div>
                                            <div className={styles.itemMeta}>
                                                <span className={styles.spicinessDetail}>🌶️ Level {item.spicinessLevel}</span>
                                                {item.selectedToppings && item.selectedToppings.length > 0 && (
                                                    <div className={styles.toppingsBreakdown}>
                                                        {item.selectedToppings.map(t => (
                                                            <div key={t.id} className={styles.toppingLine}>
                                                                + {t.name} (x{t.quantity})
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {item.bonusDrink && (
                                                    <div className={styles.bonusLine}>
                                                        🎁 Bonus: {item.bonusDrink}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className={styles.totalRow}>
                                <span>Total</span>
                                <span className={styles.grandTotal}>Rp {total.toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment & Details Form */}
                    <div className={styles.column}>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.card}>
                                <h2 className={styles.cardTitle}>Data Pengiriman</h2>
                                <div className={styles.formGroup}>
                                    <label>Nama Lengkap</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Contoh: Budi Santoso"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>WhatsApp</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="08123456789"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Alamat Lengkap</label>
                                    <textarea
                                        name="address"
                                        required
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="Nama asrama dan no kamar/tempat tinggal..."
                                        rows={3}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Catatan</label>
                                    <textarea
                                        name="note"
                                        value={formData.note}
                                        onChange={handleInputChange}
                                        placeholder="Tulis sesuatu..."
                                        rows={3}
                                    />
                                </div>
                            </div>

                            <div className={styles.card}>
                                <h2 className={styles.cardTitle}>Pembayaran</h2>

                                <div className={styles.paymentDetails}>
                                    <p className={styles.instruction}>Scan QR Code di bawah ini: <span className={styles.zoomHint}>(klik untuk perbesar)</span></p>
                                    <div className={styles.qrPlaceholder} onClick={() => setIsQrisZoomed(true)} style={{ cursor: 'zoom-in' }}>
                                        <img src="/qris.jpeg" alt="QRIS Code" className={styles.qrImage} />
                                        <div className={styles.zoomIcon}><ZoomIn size={20} /></div>
                                    </div>
                                </div>

                                <div className={styles.separator}></div>

                                <h3 className={styles.subTitle}>Upload Bukti Bayar</h3>
                                <div className={styles.uploadArea}>
                                    <input
                                        type="file"
                                        id="proof-upload"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className={styles.fileInput}
                                        required
                                    />
                                    <label htmlFor="proof-upload" className={styles.uploadLabel}>
                                        {proofPreview ? (
                                            <div className={styles.previewContainer}>
                                                <img src={proofPreview} alt="Bukti Bayar" className={styles.previewImage} />
                                                <div className={styles.changeHint}>Klik untuk ganti foto</div>
                                            </div>
                                        ) : (
                                            <div className={styles.uploadPlaceholder}>
                                                <div className={styles.uploadIcon}>📸</div>
                                                <span>Pilih atau Ambil Foto Bukti Bayar</span>
                                                <p className={styles.uploadNote}>Pastikan nominal & tanggal terlihat jelas</p>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '15px' }}
                                disabled={isUploading}
                            >
                                {isUploading ? 'Sedang Mengirim...' : 'Konfirmasi Pesanan'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* QRIS Lightbox */}
            {isQrisZoomed && (
                <div className={styles.lightboxOverlay} onClick={() => setIsQrisZoomed(false)}>
                    <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.lightboxClose} onClick={() => setIsQrisZoomed(false)}>
                            <CloseIcon size={24} />
                        </button>
                        <img src="/qris.jpeg" alt="QRIS Code Full" className={styles.lightboxImage} />
                        <p className={styles.lightboxCaption}>Scan untuk membayar • Klik di luar untuk tutup</p>
                    </div>
                </div>
            )}
        </>
    );
}
