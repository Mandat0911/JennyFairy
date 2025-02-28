import { create } from "zustand";
import { persist } from "zustand/middleware";
import useCouponStore from "./coupon";

const useCartStore = create(
    persist(
        (set, get) => ({
            cart: [],
            subtotal: 0,
            total: 0,
            addToCart: (product) => {
                set((state) => {
                    const existingItem = state.cart.find((item) => item.id === product.id);

                    let updatedCart;
                    if (existingItem) {
                        updatedCart = state.cart.map((item) =>
                            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                        );
                    } else {
                        updatedCart = [...state.cart, { ...product, quantity: 1 }];
                    }

                    return { cart: updatedCart };
                });

                get().calculateTotals(); // Recalculate totals when adding a product
            },
            removeFromCart: (productId) => {
                set((state) => ({
                    cart: state.cart.filter((item) => item.id !== productId),
                }));

                get().calculateTotals(); // Recalculate totals after removal
            },
            calculateTotals: () => {
                set((state) => {
                    const subtotal = state.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

                    // Fetch the latest applied coupon from Zustand
                    const coupon = useCouponStore.getState().coupon;
                    const discountAmount = coupon?.discountPercentage
                        ? (subtotal * coupon.discountPercentage) / 100
                        : 0;

                    const total = subtotal - discountAmount;

                    return { subtotal, discount: discountAmount, total };
                });
            },
            clearCart: () => set({ cart: [], subtotal: 0, total: 0 }),
        }),
        {
            name: "cart-storage", // Name for localStorage key
            getStorage: () => localStorage, // Use localStorage for persistence
        }
    )
);

export default useCartStore;
