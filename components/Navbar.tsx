"use client";

import Link from 'next/link';
import { Menu, X, Search, Flame } from 'lucide-react';
import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';
import { useCart } from '@/context/CartContext';
import CartDrawer from './CartDrawer';
import { useRouter, useSearchParams } from 'next/navigation';
import { products } from '@/data/products';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { items } = useCart();
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<typeof products>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

    // Sync state with URL query on mount/update
    useEffect(() => {
        const q = searchParams.get('q');
        if (q) setSearchQuery(q);
    }, [searchParams]);

    // Close suggestions on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!(e.target as HTMLElement).closest(`.${styles.searchBar}`)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim()) {
            const filtered = products.filter(p =>
                p.name.toLowerCase().includes(query.toLowerCase()) ||
                p.category.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 5); // Limit to 5 suggestions
            setSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
            router.replace(`?q=${query}`, { scroll: false });
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
            router.replace('/', { scroll: false });
        }
    };

    const handleSuggestionClick = (name: string) => {
        setSearchQuery(name);
        setShowSuggestions(false);
        router.replace(`?q=${name}`, { scroll: false });
        // Optional: Scroll to menu
        const menuHeader = document.getElementById('menu');
        if (menuHeader) menuHeader.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            <nav className={`${styles.navbar} glass`}>
                <div className={styles.container}>
                    <Link href="/" className={styles.logo}>
                        <div className={styles.logoIcon}>
                            <Flame size={20} fill="black" color="black" />
                        </div>
                        <div className={styles.logoText}>
                            <span className={styles.logoMain}>SEBHEL</span>
                            <span className={styles.logoSub}>✦ Seblak Rachel ✦</span>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className={styles.menuDesktop}>
                        <Link href="#menu" className={styles.link}>Menu</Link>
                        <Link href="#rachel" className={styles.link}>Tentang Rachel</Link>
                        <Link href="#contact" className={styles.link}>Kontak</Link>
                    </div>

                    <div className={styles.actions}>
                        <div className={`${styles.searchBar} glass`}>
                            <input
                                type="text"
                                placeholder="Cari menu..."
                                value={searchQuery}
                                onChange={handleSearch}
                                onFocus={() => searchQuery.trim() && suggestions.length > 0 && setShowSuggestions(true)}
                                className={styles.searchInput}
                            />
                            {searchQuery ? (
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSuggestions([]);
                                        setShowSuggestions(false);
                                        router.replace('/', { scroll: false });
                                    }}
                                    className={styles.clearButton}
                                    aria-label="Clear search"
                                >
                                    <X size={16} />
                                </button>
                            ) : (
                                <Search size={16} className={styles.searchIcon} />
                            )}

                            {/* Suggestions Dropdown */}
                            {showSuggestions && (
                                <div className={`${styles.suggestionsDropdown} glass`}>
                                    {suggestions.map(p => (
                                        <div
                                            key={p.id}
                                            className={styles.suggestionItem}
                                            onClick={() => handleSuggestionClick(p.name)}
                                        >
                                            <div className={styles.suggestionImage}>
                                                <img src={p.image} alt={p.name} />
                                            </div>
                                            <div className={styles.suggestionInfo}>
                                                <span className={styles.suggestionName}>{p.name}</span>
                                                <span className={styles.suggestionPrice}>Rp {p.price.toLocaleString('id-ID')}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button className={styles.cartButton} onClick={() => setIsCartOpen(true)}>
                            <span className={styles.cartText}>PESAN</span>
                            {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
                        </button>

                        <button className={styles.mobileToggle} onClick={() => setIsOpen(!isOpen)}>
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`${styles.mobileMenu} ${isOpen ? styles.mobileMenuOpen : ''} glass`}>
                    <Link href="#menu" className={styles.link} onClick={() => setIsOpen(false)}>Menu</Link>
                    <Link href="#rachel" className={styles.link} onClick={() => setIsOpen(false)}>Tentang Rachel</Link>
                    <Link href="#contact" className={styles.link} onClick={() => setIsOpen(false)}>Kontak</Link>
                </div>
            </nav>

            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
}
