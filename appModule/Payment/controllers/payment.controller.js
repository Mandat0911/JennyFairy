
import { 
    // checkoutSuccessService, 
    createCheckoutCODService, 
    createCheckoutPaypalCodeService, 
    createCheckoutQrcodeService, 
    // createCheckoutSessionService 
} from "../service/payment.service.js";


// export const createCheckoutSession = async (req, res) => {
//     try {
//         const { products, couponCode, shippingDetails } = req.body;
//         const userId = req.user.id;
//         res.status(200).json(await createCheckoutSessionService(userId, products, couponCode, shippingDetails));
//     } catch (error) {
//         console.error("Error in createCheckoutSession controller: ", error.message);
//         res.status(500).json({ error: error.message || "Internal Server Error!" });
//     }
// };

// export const checkoutSuccess = async (req, res) => {
//     try {
//         const { sessionId } = req.body;
//         const userId = req.user.id;
//         const response = await checkoutSuccessService(userId, sessionId);
//         res.status(200).json({message: "Payment successful, order created, and coupon deactivated if used.", orderId: response});
//     } catch (error) {
//         console.error("Error in checkoutSuccess controller:", error.message);
//         res.status(500).json({ error: "Internal Server Error!" });
//     }
// };

export const createCheckoutQrcode = async (req, res) => {
    try {
        const {products, totalAmount, couponCode, couponDiscountPercentage, Code, shippingDetails} = req.body;
        const userId = req.user.id;        
        res.status(200).json(await createCheckoutQrcodeService(userId, products, totalAmount, couponCode, couponDiscountPercentage, Code, shippingDetails));
    } catch (error) {
        console.error("Error in createCheckoutQrcode controller:", error.message);
        res.status(500).json({ error: error.message || "Internal Server Error!" });
    }
}

export const createCheckoutPaypalCode = async (req, res) => {
    try {
        const {products, totalAmount, couponCode, couponDiscountPercentage, Code, shippingDetails} = req.body;
        const userId = req.user.id;        
        res.status(200).json(await createCheckoutPaypalCodeService(userId, products, totalAmount, couponCode, couponDiscountPercentage, Code, shippingDetails));
    } catch (error) {
        console.error("Error in createCheckoutPaypalCode controller:", error.message);
        res.status(500).json({ error: error.message || "Internal Server Error!" });
    }
}

export const createCheckoutCOD = async (req, res) => {
    try {
        const {products, totalAmount, couponCode, couponDiscountPercentage, shippingDetails} = req.body;
        const userId = req.user.id;
        res.status(200).json(await createCheckoutCODService(userId, products, totalAmount, couponCode, couponDiscountPercentage, shippingDetails));
    } catch (error) {
        console.error("COD Checkout Error:", error);
        res.status(500).json({ error: error.message || "Internal Server Error!" });
    }
};