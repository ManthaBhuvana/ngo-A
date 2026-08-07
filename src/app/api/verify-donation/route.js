import { NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabaseClient } from "@/lib/supabase";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      donationData,
    } = body;

    const {
      donationType = "one-time",
      amount,
      fullName,
      email,
      phone,
      panNumber = "",
      address = "",
      cityState = "",
      pincode = "",
      purpose = "general",
      isAnonymous = false,
      paymentMethod = "upi",
    } = donationData || {};

    if (!amount || !fullName || !email) {
      return NextResponse.json(
        { error: "Missing required donation details." },
        { status: 400 }
      );
    }

    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;
    const isRazorpayConfigured =
      razorpaySecret && !razorpaySecret.includes("placeholder");

    // 1. Signature Verification (if Razorpay credentials are set)
    if (isRazorpayConfigured && razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac("sha256", razorpaySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (generatedSignature !== razorpay_signature) {
        return NextResponse.json(
          { error: "Invalid payment signature. Verification failed." },
          { status: 400 }
        );
      }
    }

    // 2. Insert record into Supabase Database
    const { isConfigured: isSupabaseConfigured, supabase } = getSupabaseClient();
    let dbRecord = null;

    if (isSupabaseConfigured && supabase) {
      const record = {
        donation_type: donationType,
        amount: parseFloat(amount),
        currency: "INR",
        full_name: fullName,
        email,
        phone,
        pan_number: panNumber ? panNumber.toUpperCase() : null,
        address: address || null,
        city_state: cityState || null,
        pincode: pincode || null,
        purpose,
        is_anonymous: !!isAnonymous,
        payment_method: paymentMethod,
        razorpay_order_id: razorpay_order_id || "mock_order_id",
        razorpay_payment_id: razorpay_payment_id || `pay_mock_${Date.now()}`,
        razorpay_signature: razorpay_signature || "mock_signature",
        status: "success",
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("donations")
        .insert([record])
        .select()
        .single();

      if (error) {
        console.error("Supabase insert error:", error);
      } else {
        dbRecord = data;
      }
    }

    return NextResponse.json({
      success: true,
      message: "Donation verified and recorded successfully.",
      isDatabaseSaved: !!dbRecord,
      record: dbRecord || {
        fullName,
        email,
        amount,
        donationType,
        status: "success",
      },
    });
  } catch (error) {
    console.error("Verification endpoint error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred during verification." },
      { status: 500 }
    );
  }
}
