"use client";

import { products, Product } from '@/data/products';
import styles from './ProductList.module.css';
import { Plus, Lock } from 'lucide-react';
import { useState } from 'react';
import ProductModal from './ProductModal';
import { useCart } from '@/context/CartContext';
import ConfirmModal from './ConfirmModal';
import PackageSelectorModal from './PackageSelectorModal';

import { useRouter, useSearchParams } from 'next/navigation';

export default function ProductList() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [toppingToConfirm, setToppingToConfirm] = useState<Product | null>(null);
    const [isChoosingPackage, setIsChoosingPackage] = useState(false);
    const { items, addToCart, addToppingToItem } = useCart();
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('q')?.toLowerCase() || '';

    const hasPackageInCart = items.some(item =>
        products.find(p => p.id === item.id)?.category === 'Paket Seblak'
    );

    const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

    const filteredProducts = products.filter(p => {
        // 1. Filter by Category
        const categoryMatch = selectedCategory === 'All' || p.category === selectedCategory;

        // 2. Filter by Search Query
        const searchMatch = p.name.toLowerCase().includes(searchQuery) ||
            p.description.toLowerCase().includes(searchQuery);

        return categoryMatch && searchMatch;
    });

    const handleProductClick = (product: Product) => {
        // Only 'Paket Seblak' opens the modal on card click
        if (product.category !== 'Paket Seblak') return;

        setSelectedProduct(product);
    };

    const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
        e.stopPropagation();
        const isLocked = product.category === 'Topping' && !hasPackageInCart;
        if (isLocked) return;

        if (product.customizable) {
            setSelectedProduct(product);
        } else if (product.category === 'Topping' && hasPackageInCart) {
            // Find all packages
            const packagesInCart = items.filter(item =>
                products.find(p => p.id === item.id)?.category === 'Paket Seblak'
            );

            if (packagesInCart.length > 1) {
                // Multiple packages, show selector
                setToppingToConfirm(product);
                setIsChoosingPackage(true);
            } else {
                // Single package, show simple confirm
                setToppingToConfirm(product);
                setIsChoosingPackage(false);
            }
        } else {
            addToCart(product);
        }
    };

    const handleSelectPackage = (cartId: string) => {
        if (toppingToConfirm) {
            addToppingToItem(cartId, toppingToConfirm);
        }
        setToppingToConfirm(null);
        setIsChoosingPackage(false);
    };

    const handleConfirmMerge = () => {
        if (!toppingToConfirm) return;

        // Find the latest package in cart to add to
        const latestPackage = [...items].reverse().find(item =>
            products.find(p => p.id === item.id)?.category === 'Paket Seblak'
        );

        if (latestPackage) {
            addToppingToItem(latestPackage.cartId, toppingToConfirm);
        } else {
            // Fallback just in case
            addToCart(toppingToConfirm);
        }
        setToppingToConfirm(null);
    };

    const handleDeclineMerge = () => {
        // 'Batal' now simply closes the modal without adding to cart
        setToppingToConfirm(null);
    };

    return (
        <section id="menu" className={styles.section}>
            <div className={styles.container}>

                <h2 className={styles.heading}>MENU SEBHEL</h2>
                <p className={styles.subheading}>Pilih paket pas di hati, gak perlu mikir.</p>

                {/* Filter Tabs */}
                <div className={styles.tabsContainer}>
                    <div className={styles.tabs}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`${styles.tab} ${selectedCategory === cat ? styles.activeTab : ''}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className={styles.grid}>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(product => {
                            const isLocked = product.category === 'Topping' && !hasPackageInCart;

                            return (
                                <div
                                    key={product.id}
                                    className={`${styles.card} ${isLocked ? styles.lockedCard : ''} ${product.category !== 'Paket Seblak' ? styles.nonClickableCard : ''}`}
                                    onClick={() => handleProductClick(product)}
                                >
                                    <div className={styles.productImageWrapper}>
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className={styles.productImage}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/1a1a1a/ffffff?text=Seblak+Enak';
                                            }}
                                        />
                                        <div className={styles.categoryBadge}>{product.category}</div>

                                        {isLocked && (
                                            <div className={styles.lockedOverlay}>
                                                <Lock size={32} className={styles.lockIcon} />
                                                <span className={styles.lockedText}>PILIH PAKET DULU</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className={styles.cardContent}>
                                        <h3 className={styles.cardTitle}>{product.name}</h3>
                                        <p className={styles.cardDesc}>{product.description}</p>

                                        <div className={styles.cardFooter}>
                                            <span className={styles.price}>
                                                Rp {product.price.toLocaleString('id-ID')}
                                            </span>
                                            <button
                                                className={styles.addButton}
                                                onClick={(e) => handleQuickAdd(e, product)}
                                                disabled={isLocked}
                                            >
                                                {isLocked ? <Lock size={16} /> : <Plus size={20} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>🤷‍♂️</div>
                            <h3 className={styles.emptyTitle}>WADUH, MENU GAK KETEMU!</h3>
                            <p className={styles.emptyText}>
                                Coba cari yang lain ya, jangan cari yang aneh-aneh. <br />
                                <span className={styles.suggestion}>Saran: "Paket", "Kerupuk", "Es"</span>
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}

            {toppingToConfirm && !isChoosingPackage && (
                <ConfirmModal
                    title="Tambah ke Paket?"
                    message={`Mau masukkan ${toppingToConfirm.name} langsung ke dalam Paket Seblak kamu?`}
                    onConfirm={handleConfirmMerge}
                    onCancel={handleDeclineMerge}
                    confirmText="ya, masukkan saja"
                    cancelText="batal"
                />
            )}

            {toppingToConfirm && isChoosingPackage && (
                <PackageSelectorModal
                    toppingName={toppingToConfirm.name}
                    packages={items.filter(item => products.find(p => p.id === item.id)?.category === 'Paket Seblak')}
                    onSelect={handleSelectPackage}
                    onCancel={() => {
                        setToppingToConfirm(null);
                        setIsChoosingPackage(false);
                    }}
                />
            )}
        </section>
    );
}
