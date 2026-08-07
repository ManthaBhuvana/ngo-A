import Razorpay from "razorpay";
// Helper checking if Razorpay credentials are validly configured
export function getRazorpayClient() {
    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    const isConfigured =
        key_id &&
        key_secret &&
        !key_id.includes("placeholder") &&
        !key_secret.includes("placeholder");
    if (!isConfigured) {
        return { isConfigured: false, razorpay: null };
    }
    const razorpay = new Razorpay({
        key_id,
        key_secret,
    });
    return { isConfigured: true, razorpay };
}
