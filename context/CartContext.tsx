"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product, products } from '@/data/products';

export type SelectedTopping = {
    id: string;
    name: string;
    price: number;
    quantity: number;
};

export type CartItem = Product & {
    cartId: string; // Unique ID for cart item (in case of same product with different options)
    quantity: number;
    spicinessLevel?: number;
    selectedToppings?: SelectedTopping[];
    note?: string;
    totalPrice: number;
};

type CartOptions = {
    spiciness?: number;
    toppings?: SelectedTopping[];
    spicinessCost?: number;
};

type CartContextType = {
    items: CartItem[];
    addToCart: (product: Product, options?: CartOptions) => void;
    updateCartItem: (cartId: string, options: { spiciness: number; toppings: SelectedTopping[]; spicinessCost: number }) => void;
    updateQuantity: (cartId: string, delta: number) => void;
    updateToppingQuantityInItem: (cartId: string, toppingId: string, delta: number) => void;
    addToppingToItem: (cartId: string, topping: Product) => void;
    removeFromCart: (cartId: string) => void;
    clearCart: () => void;
    total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [total, setTotal] = useState(0);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initial load from localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('sebhel-cart');
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error('Failed to parse cart from localStorage:', e);
            }
        }
        setIsInitialized(true);
    }, []);

    // Save to localStorage on every change
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('sebhel-cart', JSON.stringify(items));
        }
    }, [items, isInitialized]);

    useEffect(() => {
        const newTotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
        setTotal(newTotal);
    }, [items]);

    const addToCart = (product: Product, options?: CartOptions) => {
        const toppingsPrice = options?.toppings?.reduce((sum, t) => sum + (t.price * t.quantity), 0) || 0;
        const spicinessPrice = options?.spicinessCost || 0;
        const itemTotal = product.price + toppingsPrice + spicinessPrice;

        const newItem: CartItem = {
            ...product,
            cartId: Math.random().toString(36).substr(2, 9),
            quantity: 1,
            spicinessLevel: options?.spiciness,
            selectedToppings: options?.toppings || [],
            totalPrice: itemTotal,
        };

        setItems([...items, newItem]);
    };

    const removeFromCart = (cartId: string) => {
        setItems(items.filter(item => item.cartId !== cartId));
    };

    const updateCartItem = (cartId: string, options: { spiciness: number; toppings: SelectedTopping[]; spicinessCost: number }) => {
        setItems(items.map(item => {
            if (item.cartId !== cartId) return item;
            const toppingsPrice = options.toppings.reduce((sum, t) => sum + (t.price * t.quantity), 0);
            const unitPrice = item.price + toppingsPrice + options.spicinessCost;
            return {
                ...item,
                spicinessLevel: options.spiciness,
                selectedToppings: options.toppings,
                totalPrice: unitPrice * item.quantity,
            };
        }));
    };

    const updateQuantity = (cartId: string, delta: number) => {
        setItems(items.map(item => {
            if (item.cartId !== cartId) return item;
            const newQuantity = Math.max(1, item.quantity + delta);
            if (newQuantity === item.quantity) return item;

            const unitPrice = item.totalPrice / item.quantity;
            return {
                ...item,
                quantity: newQuantity,
                totalPrice: unitPrice * newQuantity
            };
        }));
    };

    const addToppingToItem = (cartId: string, topping: Product) => {
        setItems(items.map(item => {
            if (item.cartId !== cartId) return item;

            const currentToppings = item.selectedToppings || [];
            const existingToppingIndex = currentToppings.findIndex(t => t.id === topping.id);

            let newToppings;
            if (existingToppingIndex > -1) {
                newToppings = currentToppings.map((t, idx) =>
                    idx === existingToppingIndex ? { ...t, quantity: t.quantity + 1 } : t
                );
            } else {
                newToppings = [...currentToppings, { id: topping.id, name: topping.name, price: topping.price, quantity: 1 }];
            }

            // Recalculate totalPrice
            // Total price increases by topping price * item quantity
            const newTotalPrice = item.totalPrice + (topping.price * item.quantity);

            return {
                ...item,
                selectedToppings: newToppings,
                totalPrice: newTotalPrice
            };
        }));
    };

    const updateToppingQuantityInItem = (cartId: string, toppingId: string, delta: number) => {
        setItems(items.map(item => {
            if (item.cartId !== cartId) return item;

            const currentToppings = item.selectedToppings || [];
            const toppingIndex = currentToppings.findIndex(t => t.id === toppingId);

            if (toppingIndex === -1 && delta <= 0) return item;

            let newToppings = [...currentToppings];
            let priceChange = 0;

            if (toppingIndex > -1) {
                const topping = currentToppings[toppingIndex];
                const newQuantity = Math.max(0, topping.quantity + delta);
                priceChange = (newQuantity - topping.quantity) * topping.price;

                if (newQuantity === 0) {
                    newToppings.splice(toppingIndex, 1);
                } else {
                    newToppings[toppingIndex] = { ...topping, quantity: newQuantity };
                }
            } else if (delta > 0) {
                const toppingProduct = products.find(p => p.id === toppingId);
                if (toppingProduct) {
                    newToppings.push({ id: toppingProduct.id, name: toppingProduct.name, price: toppingProduct.price, quantity: 1 });
                    priceChange = toppingProduct.price;
                }
            }

            return {
                ...item,
                selectedToppings: newToppings,
                totalPrice: item.totalPrice + (priceChange * item.quantity)
            };
        }));
    };

    const clearCart = () => {
        setItems([]);
    };

    return (
        <CartContext.Provider value={{ items, addToCart, updateCartItem, updateQuantity, updateToppingQuantityInItem, addToppingToItem, removeFromCart, clearCart, total }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
