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

            initializeCart: (cartItems) => {
                set(() => {
                    const subtotal = cartItems.reduce( (acc, item) => acc + ((item.discountPrice > 0 ? item.discountPrice : item.price) * item.quantity), 0);

                    const coupon = useCouponStore.getState().coupon;
                    const discountAmount = coupon?.discountPercentage
                        ? (subtotal * coupon.discountPercentage) / 100
                        : 0;
                    const total = subtotal - discountAmount;

                    return { cart: cartItems, subtotal, discount: discountAmount, total };
                });
            },

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
                        updatedCart = [
                            ...state.cart, 
                            { 
                                ...item, 
                                price: item.discountPrice > 0 ? item.discountPrice : item.price 
                            }
                        ];
                    }
            
                    return { cart: updatedCart };
                });
            
                get().calculateTotals(); // Ensure total updates
            },

            removeFromCart: (productId, size) => {
                set((state) => {
                    const updatedCart = state.cart.filter((item) => !(item.productId === productId && item.size === size));
                    const isCartEmpty = updatedCart.length === 0;
                    
                    if (isCartEmpty) {
                        useCouponStore.getState().resetCoupon(); // Reset coupon if cart is empty
                        set({isCouponApplied:false});
                    }
                    return { cart: updatedCart };
                });

                get().calculateTotals(); // Update totals
            },

            updateQuantity: (productId, size, quantity) => {
                set((state) => {
                    const updatedCart = state.cart.map((item) =>
                        item.productId === productId && item.size === size
                            ? { ...item, quantity } // Ensure quantity is updated
                            : item
                    );
            
                    // 🔹 Calculate subtotal and total inside set to ensure proper update
                    const subtotal = updatedCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
                    const coupon = useCouponStore.getState().coupon;
                    const discountAmount = coupon?.discountPercentage
                        ? (subtotal * coupon.discountPercentage) / 100
                        : 0;
                    const total = subtotal - discountAmount;
            
                    return { cart: updatedCart, subtotal, discount: discountAmount, total };
                });
            },
            
            calculateTotals: () => {
                set((state) => {
                    const subtotal = state.cart.reduce(
                        (acc, item) => acc + ((item.discountPrice > 0 ? item.discountPrice : item.price) * item.quantity),
                        0
                    );
            
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
                useCouponStore.getState().resetCoupon(); // Reset coupon on clear
                set({ cart: [], subtotal: 0, total: 0, discount: 0, isCouponApplied: false });
            },            
        }),
        {
            name: "cart-storage", // Name of localStorage key
            getStorage: () => localStorage, // Use localStorage to persist cart
        }
    )
);

export default useCartStore;
