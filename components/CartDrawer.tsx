"use client";

import { useCart, CartItem } from '@/context/CartContext';
import styles from './CartDrawer.module.css';
import { X, Trash2, ArrowRight, Pencil, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ProductModal from './ProductModal';
import { products } from '@/data/products';

type CartDrawerProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { items, removeFromCart, updateQuantity, total } = useCart();
    const [isVisible, setIsVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<CartItem | null>(null);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            document.body.style.overflow = 'unset';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible && !isOpen) return null;

    return (
        <>
            <div
                className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
                onClick={onClose}
            />
            <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Keranjang ({items.length})</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className={styles.itemList}>
                    {items.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>Keranjangmu masih kosong nih.</p>
                            <button className={styles.shopBtn} onClick={onClose}>
                                Pesan Sekarang
                            </button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.cartId} className={styles.item}>
                                <div className={styles.itemImageWrapper}>
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className={styles.itemImage}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/1a1a1a/ffffff?text=Seblak';
                                        }}
                                    />
                                </div>
                                <div className={styles.itemInfo}>
                                    <h3 className={styles.itemName}>{item.name}</h3>
                                    <div className={styles.itemMeta}>
                                        {item.spicinessLevel !== undefined && (
                                            <span className={styles.tag}>Level {item.spicinessLevel}</span>
                                        )}
                                        {item.selectedToppings && item.selectedToppings.length > 0 && (
                                            <div className={styles.toppingList}>
                                                <span className={styles.toppingLabel}>Topping:</span>
                                                <div className={styles.toppings}>
                                                    {item.selectedToppings.map(t => `${t.name} (x${t.quantity})`).join(', ')}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.itemPrice}>
                                        Rp {item.totalPrice.toLocaleString('id-ID')}
                                    </div>
                                </div>

                                <div className={styles.itemActions}>
                                    <div className={styles.quantityControl}>
                                        <button
                                            className={styles.qtyBtn}
                                            onClick={() => updateQuantity(item.cartId, -1)}
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className={styles.qtyValue}>{item.quantity}</span>
                                        <button
                                            className={styles.qtyBtn}
                                            onClick={() => updateQuantity(item.cartId, 1)}
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                    <div className={styles.actionGroup}>
                                        {item.customizable && (
                                            <button
                                                className={styles.editBtn}
                                                onClick={() => setEditingItem(item)}
                                                title="Edit pesanan"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                        )}
                                        <button
                                            className={styles.removeBtn}
                                            onClick={() => removeFromCart(item.cartId)}
                                            title="Hapus item"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {items.length > 0 && (
                    <div className={styles.footer}>
                        <div className={styles.subtotal}>
                            <span>Subtotal</span>
                            <span className={styles.totalAmount}>Rp {total.toLocaleString('id-ID')}</span>
                        </div>
                        <Link href="/checkout" className="btn btn-primary" style={{ width: '100%', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                            Checkout <ArrowRight size={18} />
                        </Link>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {editingItem && (
                <ProductModal
                    product={products.find(p => p.id === editingItem.id) ?? editingItem}
                    onClose={() => setEditingItem(null)}
                    editCartId={editingItem.cartId}
                    initialSpiciness={editingItem.spicinessLevel ?? 0}
                    initialToppings={editingItem.selectedToppings}
                />
            )}
        </>
    );
}
