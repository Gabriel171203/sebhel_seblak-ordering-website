"use client";

import { useState } from 'react';
import { Product, products } from '@/data/products';
import { X, Flame, Beaker, Plus, Minus } from 'lucide-react';
import { useCart, SelectedTopping } from '@/context/CartContext';
import styles from './ProductModal.module.css';

type ProductModalProps = {
    product: Product;
    onClose: () => void;
    // Edit mode props
    editCartId?: string;
    initialSpiciness?: number;
    initialToppingNames?: string[]; // Kept for backward compatibility or initial simple list
    initialToppings?: SelectedTopping[];
};

export default function ProductModal({ product, onClose, editCartId, initialSpiciness, initialToppingNames, initialToppings }: ProductModalProps) {
    const { addToCart, updateCartItem } = useCart();
    const isEditMode = !!editCartId;

    // Pre-fill toppings from names or full objects when in edit mode
    const availableToppings = products.filter(p => p.category === 'Topping');

    let preselectedToppings: SelectedTopping[] = [];
    if (isEditMode) {
        if (initialToppings) {
            preselectedToppings = initialToppings;
        } else if (initialToppingNames) {
            preselectedToppings = availableToppings
                .filter(t => initialToppingNames.includes(t.name))
                .map(t => ({ id: t.id, name: t.name, price: t.price, quantity: 1 }));
        }
    }

    const [spiciness, setSpiciness] = useState(initialSpiciness ?? 0);
    const [selectedToppings, setSelectedToppings] = useState<SelectedTopping[]>(preselectedToppings);

    const updateToppingQuantity = (topping: Product, delta: number) => {
        const existing = selectedToppings.find(t => t.id === topping.id);

        if (existing) {
            const newQuantity = Math.max(0, existing.quantity + delta);
            if (newQuantity === 0) {
                setSelectedToppings(selectedToppings.filter(t => t.id !== topping.id));
            } else {
                setSelectedToppings(selectedToppings.map(t =>
                    t.id === topping.id ? { ...t, quantity: newQuantity } : t
                ));
            }
        } else if (delta > 0) {
            setSelectedToppings([...selectedToppings, {
                id: topping.id,
                name: topping.name,
                price: topping.price,
                quantity: 1
            }]);
        }
    };

    const getSpicinessPrice = (level: number) => {
        if (level === 0) return 0;
        if (level <= 3) return 1000;
        if (level <= 5) return 2000;
        return 3000;
    };

    const handleSubmit = () => {
        const spicinessCost = product.customizable ? getSpicinessPrice(spiciness) : 0;
        if (isEditMode && editCartId) {
            updateCartItem(editCartId, {
                spiciness,
                toppings: selectedToppings,
                spicinessCost,
            });
        } else {
            addToCart(product, {
                spiciness: product.customizable ? spiciness : undefined,
                toppings: selectedToppings,
                spicinessCost,
            });
        }
        onClose();
    };

    const spicinessPrice = getSpicinessPrice(spiciness);
    const totalPrice = product.price + selectedToppings.reduce((a, b) => a + (b.price * b.quantity), 0) + spicinessPrice;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose}>
                    <X size={24} />
                </button>

                <div className={styles.modalContent}>
                    {/* Left Column: Customization */}
                    <div className={styles.leftCol}>
                        <div className={styles.modalHero}>
                            <img
                                src={product.image}
                                alt={product.name}
                                className={styles.modalHeroImage}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/1a1a1a/ffffff?text=Seblak+Juara';
                                }}
                            />
                            <div className={styles.modalHeroOverlay}>
                                <div className={styles.labHeader}>
                                    <Beaker size={20} className={styles.labIcon} />
                                    <span className={styles.labTitle}>THE SEBLAK LAB</span>
                                </div>
                                <h2 className={styles.productTitle}>{product.name}</h2>
                                <p className={styles.description}>Eksperimen rasa seblak paling liar cuma di sini.</p>
                            </div>
                        </div>

                        {product.customizable && (
                            <div className={styles.section}>
                                <h3 className={styles.sectionTitle}>
                                    <Flame size={16} fill="#FFC107" color="#FFC107" style={{ marginRight: '8px' }} />
                                    LEVEL KEPEDASAN (0 - 8)
                                </h3>
                                <div className={styles.spicinessOptions}>
                                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(level => {
                                        const isActive = spiciness === level;
                                        let activeColor = '#FFC107';
                                        if (level > 3) activeColor = '#ff6b6b';
                                        if (level > 5) activeColor = '#D32F2F';

                                        // Price label
                                        let priceLabel = 'Free';
                                        if (level >= 1 && level <= 3) priceLabel = '+1K';
                                        if (level >= 4 && level <= 5) priceLabel = '+2K';
                                        if (level >= 6) priceLabel = '+3K';

                                        return (
                                            <button
                                                key={level}
                                                className={`${styles.levelBtn} ${isActive ? styles.selectedLevel : ''}`}
                                                onClick={() => setSpiciness(level)}
                                            >
                                                <div className={styles.levelIndicator} style={{
                                                    height: `${15 + (level * 10)}%`,
                                                    backgroundColor: isActive ? activeColor : '#333'
                                                }}></div>
                                                <span className={styles.levelNum} style={{ color: isActive ? activeColor : '#666' }}>{level}</span>
                                                <span style={{ fontSize: '0.6rem', color: '#555' }}>{priceLabel}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className={styles.levelLabel}>
                                    <span>Level 0 (Gratis)</span>
                                    <span>Level 8 (+3K)</span>
                                </div>
                            </div>
                        )}

                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>PILIH TOPPING (WAJIB ?)</h3>
                            <div className={styles.toppingsGrid}>
                                {availableToppings.map(topping => {
                                    const selected = selectedToppings.find(t => t.id === topping.id);
                                    const quantity = selected?.quantity || 0;

                                    return (
                                        <div
                                            key={topping.id}
                                            className={`${styles.toppingItem} ${quantity > 0 ? styles.activeTopping : ''}`}
                                        >
                                            <div className={styles.toppingInfo}>
                                                <span className={styles.toppingName}>{topping.name}</span>
                                                <span className={styles.toppingPrice}>Rp {topping.price.toLocaleString('id-ID')}</span>
                                            </div>
                                            <div className={styles.toppingControls}>
                                                <button
                                                    className={styles.qtyBtn}
                                                    onClick={() => updateToppingQuantity(topping, -1)}
                                                    disabled={quantity === 0}
                                                >
                                                    <Minus size={12} />
                                                </button>
                                                <span className={styles.qtyDisplay}>{quantity}</span>
                                                <button
                                                    className={styles.qtyBtn}
                                                    onClick={() => updateToppingQuantity(topping, 1)}
                                                >
                                                    <Plus size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Receipt / Summary */}
                    <div className={styles.rightCol}>
                        <div className={styles.receipt}>
                            <h3 className={styles.receiptTitle}>RINGKASAN RACIKAN</h3>

                            <div className={styles.receiptItem}>
                                <span>{product.name}</span>
                                <span>Rp {product.price.toLocaleString('id-ID')}</span>
                            </div>

                            {product.customizable && spiciness > 0 && (
                                <div className={styles.receiptItem}>
                                    <span>Level {spiciness}</span>
                                    <span>+ Rp {spicinessPrice.toLocaleString('id-ID')}</span>
                                </div>
                            )}

                            {selectedToppings.map(t => (
                                <div key={t.id} className={styles.receiptItem}>
                                    <span>+ {t.name} (x{t.quantity})</span>
                                    <span>Rp {(t.price * t.quantity).toLocaleString('id-ID')}</span>
                                </div>
                            ))}

                            <div className={styles.receiptDivider}></div>

                            <div className={styles.receiptTotal}>
                                <span>TOTAL</span>
                                <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
                            </div>

                            <button className={styles.confirmButton} onClick={handleSubmit}>
                                {isEditMode ? '✏️ SIMPAN PERUBAHAN' : 'MASUKKAN KERANJANG'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
