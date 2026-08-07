import { NextResponse } from "next/server";
import { getRazorpayClient } from "@/lib/razorpay";

export async function POST(request) {
  try {
    const body = await request.json();
    const { amount, currency = "INR" } = body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid donation amount specified." },
        { status: 400 }
      );
    }

    const { isConfigured, razorpay } = getRazorpayClient();

    // Fallback mode if credentials are not yet added to .env.local
    if (!isConfigured) {
      const mockOrderId = `order_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      return NextResponse.json({
        success: true,
        isMock: true,
        orderId: mockOrderId,
        amount: Math.round(amount * 100),
        currency,
        message: "Razorpay credentials not yet configured in .env.local. Running in mock order mode.",
      });
    }

    // Create real Razorpay order
    const options = {
      amount: Math.round(amount * 100), // Amount in paise
      currency,
      receipt: `receipt_ngo_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      success: true,
      isMock: false,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create Razorpay order." },
      { status: 500 }
    );
  }
}
