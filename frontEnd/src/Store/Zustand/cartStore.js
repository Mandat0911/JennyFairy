import { create } from "zustand";
import { persist } from "zustand/middleware";
import useCouponStore from "./coupon";

const useCartStore = create(
    persist(
        (set, get) => ({
            cart: [],
            subtotal: 0,
            total: 0,
            discount: 0,
            isCouponApplied: false,

            addToCart: (item) => {
                set((state) => {
                    const existingItem = state.cart.find(
                        (cartItem) => cartItem.productId === item.productId && cartItem.size === item.size
                    );

                    let updatedCart;
                    if (existingItem) {
                        updatedCart = state.cart.map((cartItem) =>
                            cartItem.productId === item.productId && cartItem.size === item.size
                                ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
                                : cartItem
                        );
                    } else {
                        updatedCart = [...state.cart, item];
                    }

                    return { cart: updatedCart };
                });

                get().calculateTotals(); // Ensure total updates
            },

            removeFromCart: (productId, size) => {
                set((state) => {
                    const updatedCart = state.cart.filter((item) => !(item.productId === productId && item.size === size));
                    return { cart: updatedCart };
                });

                get().calculateTotals(); // Update totals
            },

            calculateTotals: () => {
                set((state) => {
                    const subtotal = state.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

                    const coupon = useCouponStore.getState().coupon;
                    const discountAmount = coupon?.discountPercentage
                        ? (subtotal * coupon.discountPercentage) / 100
                        : 0;

                    const total = subtotal - discountAmount;

                    return { subtotal, discount: discountAmount, total };
                });
            },

            setIsCouponApplied: (isApplied) => set({ isCouponApplied: isApplied }),

            clearCart: () => {
                set({ cart: [], subtotal: 0, total: 0 });
            },
        }),
        {
            name: "cart-storage", // Name of localStorage key
            getStorage: () => localStorage, // Use localStorage to persist cart
        }
    )
);

export default useCartStore;
