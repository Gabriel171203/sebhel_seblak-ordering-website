"use client";

import React from 'react';
import { CartItem } from '@/context/CartContext';
import styles from './PackageSelectorModal.module.css';
import { Package, ChevronRight } from 'lucide-react';

interface PackageSelectorModalProps {
    packages: CartItem[];
    toppingName: string;
    onSelect: (cartId: string) => void;
    onCancel: () => void;
}

export default function PackageSelectorModal({
    packages,
    toppingName,
    onSelect,
    onCancel
}: PackageSelectorModalProps) {
    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h3 className={styles.title}>Pilih Paket Seblak</h3>
                    <p className={styles.subtitle}>Mau masukkan <strong>{toppingName}</strong> ke paket yang mana?</p>
                </div>

                <div className={styles.packageList}>
                    {packages.map((pkg, index) => (
                        <button
                            key={pkg.cartId}
                            className={styles.packageItem}
                            onClick={() => onSelect(pkg.cartId)}
                        >
                            <div className={styles.packageIcon}>
                                <Package size={20} />
                            </div>
                            <div className={styles.packageInfo}>
                                <span className={styles.packageName}>{pkg.name} #{index + 1}</span>
                                <span className={styles.packageMeta}>
                                    Level {pkg.spicinessLevel ?? 0} • {pkg.selectedToppings?.length || 0} Topping
                                </span>
                            </div>
                            <ChevronRight size={18} className={styles.chevron} />
                        </button>
                    ))}
                </div>

                <div className={styles.actions}>
                    <button className={styles.cancelBtn} onClick={onCancel}>
                        Batal
                    </button>
                </div>
            </div>
        </div>
    );
}
