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

            addToCart: (product) => {
                set((state) => {
                    const existingItem = state.cart.find((item) => item.productId === product.productId);
            
                    let updatedCart;
                    if (existingItem) {
                        updatedCart = state.cart.map((item) =>
                            item.productId === product.productId ? { ...item, quantity: item.quantity + 1 } : item
                        );
                    } else {
                        updatedCart = [...state.cart, product]; // Keep all items
                    }
            
                    // ✅ Store updated cart in localStorage
                    localStorage.setItem("cart-ids", JSON.stringify(updatedCart.map((item) => item.productId)));
            
                    return { cart: updatedCart };
                });
            
                get().calculateTotals();
            },
            
            
            

            removeFromCart: (productId) => {
                set((state) => {
                    // ✅ Ensure correct property is used for filtering
                    const updatedCart = state.cart.filter((item) => item.id !== productId);

                    // ✅ Update localStorage
                    localStorage.setItem("cart-storage", JSON.stringify(updatedCart));

                    return { cart: updatedCart };
                });

                // ✅ Immediately recalculate totals
                get().calculateTotals();
            },

            calculateTotals: () => {
                set((state) => {
                    const subtotal = state.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

                    const coupon = useCouponStore.getState().coupon;
                    const discountAmount = coupon?.discountPercentage
                        ? (subtotal * coupon.discountPercentage) / 100
                        : 0;

                    const total = subtotal - discountAmount;

                    // ✅ Remove cart from localStorage if empty
                    if (state.cart.length === 0) {
                        localStorage.removeItem("cart-storage");
                    }

                    return { subtotal, discount: discountAmount, total };
                });
            },

            clearCart: () => {
                set({ cart: [], subtotal: 0, total: 0 });

                // ✅ Ensure storage is cleared
                localStorage.removeItem("cart-storage");
            },
        }),
        {
            name: "cart-storage",
            getStorage: () => localStorage, // Persist cart in localStorage
        }
    )
);

export default useCartStore;
