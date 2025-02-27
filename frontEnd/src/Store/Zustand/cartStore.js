import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
    cart: [], 
    coupon: null, 
    subtotal: 0, 
    total: 0,

    // Add item to cart
    addToCart: (product) => {
        set((state) => {
            const existingItem = state.cart.find(item => item.productId === product.productId);
            
            let updatedCart;
            if (existingItem) {
                updatedCart = state.cart.map(item =>
                    item.productId === product.productId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                updatedCart = [...state.cart, { ...product, quantity: 1 }];
            }

            return { cart: updatedCart };
        });

        get().calculateTotals();
    },

    // Remove item from cart
    removeFromCart: (productId) => {
        set((state) => {
            const updatedCart = state.cart.filter(item => item.productId !== productId);
            return { cart: updatedCart };
        });

        get().calculateTotals();
    },

    // Update item quantity
    updateQuantity: (productId, quantity) => {
        set((state) => ({
            cart: state.cart.map(item =>
                item.productId === productId ? { ...item, quantity } : item
            )
        }));

        get().calculateTotals();
    },

    // Apply coupon and update total
    applyCoupon: (couponCode, discount) => {
        set({ coupon: { code: couponCode, discount } });
        get().calculateTotals();
    },

    // Calculate Subtotal & Total
    calculateTotals: () => {
        set((state) => {
            const subtotal = state.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
            const discountAmount = state.coupon ? (subtotal * state.coupon.discount) / 100 : 0;
            const total = subtotal - discountAmount;

            return { subtotal, total };
        });
    }
}));
