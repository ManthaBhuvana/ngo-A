"use client";
import React, { useState, useEffect } from "react";
import {
  IconHeart,
  IconShieldCheck,
  IconReceiptTax,
  IconUsers,
  IconQrcode,
  IconCreditCard,
  IconBuildingBank,
  IconWallet,
  IconCheck,
  IconX,
  IconHeartHandshake,
  IconLockCheck,
  IconUser,
  IconMail,
  IconPhone,
  IconTarget,
} from "@tabler/icons-react";
const PRESETS = [250, 500, 1000, 2500];
const PURPOSES = [
  { id: "general", label: "General Fund (Where Needed Most)" },
  { id: "education", label: "Child Education & Literacy" },
  { id: "healthcare", label: "Healthcare & Emergency Relief" },
  { id: "childwelfare", label: "Nutrition & Child Welfare" },
  { id: "women", label: "Women Empowerment" },
];
const PAYMENT_METHODS = [
  { id: "upi", name: "UPI / QR Code", desc: "GPay, PhonePe, Paytm, BHIM", Icon: IconQrcode },
  { id: "card", name: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay", Icon: IconCreditCard },
  { id: "netbanking", name: "Net Banking", desc: "All Major Indian Banks", Icon: IconBuildingBank },
  { id: "wallet", name: "Digital Wallets", desc: "Amazon Pay, Mobikwik", Icon: IconWallet },
];
export default function PaymentPage() {
  const [donationType, setDonationType] = useState("one-time"); // 'one-time' | 'monthly'
  const [selectedPreset, setSelectedPreset] = useState(1000);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [purpose, setPurpose] = useState("general");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    panNumber: "",
    address: "",
    cityState: "",
    pincode: "",
    isAnonymous: false,
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalDetails, setModalDetails] = useState(null);
  // Load Razorpay Checkout SDK Script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Compute live donation total
  const effectiveAmount =
    selectedPreset === "custom"
      ? parseFloat(customAmount) || 0
      : selectedPreset;
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };
  const handlePresetSelect = (amount) => {
    setSelectedPreset(amount);
    if (amount !== "custom") setCustomAmount("");
    if (errors.amount) setErrors((prev) => ({ ...prev, amount: "" }));
  };
  const handleCustomChange = (val) => {
    setSelectedPreset("custom");
    setCustomAmount(val);
    if (errors.amount) setErrors((prev) => ({ ...prev, amount: "" }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!effectiveAmount || effectiveAmount <= 0) {
      newErrors.amount = "Please select or enter a valid donation amount.";
    }
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone.replace(/[\s-]/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit mobile number.";
    }
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the Terms & Privacy Policy to proceed.";
    }
    // Optional PAN format validation if provided
    if (formData.panNumber.trim()) {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(formData.panNumber.trim().toUpperCase())) {
        newErrors.panNumber = "Invalid PAN format (e.g. ABCDE1234F).";
      }
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setIsProcessing(true);
    try {
      // 1. Create Razorpay Order via Next.js API Route
      const orderRes = await fetch("/api/create-razorpay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: effectiveAmount }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        alert(orderData.error || "Failed to initialize order.");
        setIsProcessing(false);
        return;
      }
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      const isRealRazorpay =
        razorpayKey &&
        !razorpayKey.includes("placeholder") &&
        window.Razorpay;
      // 2A. Real Razorpay Checkout flow if credentials exist
      if (isRealRazorpay) {
        const options = {
          key: razorpayKey,
          amount: orderData.amount,
          currency: "INR",
          name: "Avasa Foundation",
          description: `Donation for ${PURPOSES.find((p) => p.id === purpose)?.label || "NGO"}`,
          order_id: orderData.orderId,
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.phone,
          },
          theme: { color: "#db2777" },
          handler: async function (response) {
            // Verify donation and record to Supabase
            const verifyRes = await fetch("/api/verify-donation", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                donationData: { ...formData, donationType, amount: effectiveAmount, purpose, paymentMethod },
              }),
            });
            const verifyData = await verifyRes.json();
            setModalDetails({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              isRealPayment: true,
              isSavedToDb: verifyData.isDatabaseSaved,
            });
            setIsProcessing(false);
            setShowModal(true);
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            },
          },
        };
        const razor = new window.Razorpay(options);
        razor.open();
      } else {
        // 2B. Mock/Simulated Flow if credentials are not yet in .env.local
        const verifyRes = await fetch("/api/verify-donation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: orderData.orderId,
            razorpay_payment_id: `pay_demo_${Date.now()}`,
            razorpay_signature: "demo_signature",
            donationData: { ...formData, donationType, amount: effectiveAmount, purpose, paymentMethod },
          }),
        });
        const verifyData = await verifyRes.json();
        setModalDetails({
          orderId: orderData.orderId,
          paymentId: `pay_demo_${Date.now()}`,
          isRealPayment: false,
          isSavedToDb: verifyData.isDatabaseSaved,
        });
        setIsProcessing(false);
        setShowModal(true);
      }
    } catch (err) {
      console.error("Donation submission error:", err);
      alert("Something went wrong processing your request. Please try again.");
      setIsProcessing(false);
    }
  };
  return (
    <div className="min-h-screen bg-black text-white font-sans pb-24 pt-10">
      {/* Page Header */}
      <header className="max-w-4xl mx-auto px-4 text-center mb-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-950/60 border border-pink-500/30 text-pink-400 text-xs font-semibold uppercase tracking-wider">
          <IconHeartHandshake className="w-4 h-4 text-pink-400" />
          <span>Avasa Foundation Giving</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
          Support Our Cause,{" "}
          <span className="bg-gradient-to-r from-pink-400 to-rose-600 bg-clip-text text-transparent">
            Change Lives
          </span>
        </h1>
        <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Your contribution directly funds healthcare, nutrition, and child education programs across underprivileged communities.
        </p>
        {/* Impact Highlights */}
        <div className="flex flex-wrap justify-center gap-3 pt-2 text-xs text-gray-300">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800">
            <IconShieldCheck className="w-4 h-4 text-pink-500" /> 100% Direct Impact
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800">
            <IconReceiptTax className="w-4 h-4 text-emerald-400" /> 80G Tax Exemption
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800">
            <IconUsers className="w-4 h-4 text-amber-400" /> 10,000+ Children Helped
          </span>
        </div>
      </header>
      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8">

          {/* Left Column: Form Fields */}
          <div className="md:col-span-7 space-y-6">
            {/* 1. Donation Type Toggle & Preset Amounts */}
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 space-y-5">

              {/* Type Switcher (One-Time vs Monthly) */}
              <div className="flex items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="text-pink-500">1.</span> Donation Frequency
                </h2>
                <div className="inline-flex p-1 bg-zinc-950 border border-zinc-800 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setDonationType("one-time")}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${donationType === "one-time"
                      ? "bg-pink-600 text-white shadow-md shadow-pink-600/30"
                      : "text-gray-400 hover:text-white"
                      }`}
                  >
                    One-Time
                  </button>
                  <button
                    type="button"
                    onClick={() => setDonationType("monthly")}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${donationType === "monthly"
                      ? "bg-pink-600 text-white shadow-md shadow-pink-600/30"
                      : "text-gray-400 hover:text-white"
                      }`}
                  >
                    <span>Monthly</span>
                    <span className="text-[10px] bg-pink-400/20 text-pink-300 px-1 rounded font-bold">
                      +Impact
                    </span>
                  </button>
                </div>
              </div>
              {/* Preset Buttons */}
              {/* Presets Grid */}
              <div className="space-y-3">
                <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Select Amount (INR)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {PRESETS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handlePresetSelect(amt)}
                      className={`py-3 px-4 rounded-xl font-bold border transition-all text-center ${selectedPreset === amt
                        ? "bg-pink-600 border-pink-500 text-white shadow-lg shadow-pink-600/30"
                        : "bg-zinc-950/80 border-zinc-800 text-gray-300 hover:border-zinc-700"
                        }`}
                    >
                      ₹{amt.toLocaleString("en-IN")}
                    </button>
                  ))}
                </div>
                {/* Custom Amount Input */}
                <div className="pt-1">
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-pink-400 font-bold">₹</span>
                    <input
                      type="number"
                      min="1"
                      placeholder="Or enter custom amount"
                      value={customAmount}
                      onChange={(e) => handleCustomChange(e.target.value)}
                      className={`w-full pl-8 pr-4 py-2.5 bg-zinc-950 border rounded-xl text-white text-sm focus:outline-none ${selectedPreset === "custom" ? "border-pink-500 ring-1 ring-pink-500" : "border-zinc-800"
                        }`}
                    />
                  </div>
                </div>
                {errors.amount && <p className="text-red-400 text-xs font-medium">{errors.amount}</p>}
              </div>
              {/* Donation Purpose Dropdown */}
              {/* Purpose Dropdown */}
              <div className="pt-2 border-t border-zinc-800/80 space-y-1.5">
                <label htmlFor="purpose" className="block text-xs font-medium text-gray-300 flex items-center gap-1.5">
                  <IconTarget className="w-4 h-4 text-pink-400" />
                  Donation Cause / Purpose
                </label>
                <select
                  id="purpose"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-pink-500"
                >
                  {PURPOSES.map((p) => (
                    <option key={p.id} value={p.id} className="bg-zinc-900 text-white">
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* 2. Donor Details Form */}
            {/* 2. Donor Details */}
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 space-y-5">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="text-pink-500">2.</span> Donor Information
              </h2>
              <div className="space-y-4">

                {/* Full Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Full Name <span className="text-pink-500">*</span>
                    </label>
                    <div className="relative">
                      <IconUser className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        placeholder="Ramesh Sharma"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 bg-zinc-950 border rounded-xl text-white text-sm focus:outline-none focus:border-pink-500 ${errors.fullName ? "border-red-500" : "border-zinc-800"
                          }`}
                      />
                    </div>
                    {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Email Address <span className="text-pink-500">*</span>
                    </label>
                    <div className="relative">
                      <IconMail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        placeholder="ramesh@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 bg-zinc-950 border rounded-xl text-white text-sm focus:outline-none focus:border-pink-500 ${errors.email ? "border-red-500" : "border-zinc-800"
                          }`}
                      />
                    </div>
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>
                {/* Mobile Number & PAN Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Mobile Number <span className="text-pink-500">*</span>
                    </label>
                    <div className="relative">
                      <IconPhone className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        placeholder="9876543210"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 bg-zinc-950 border rounded-xl text-white text-sm focus:outline-none focus:border-pink-500 ${errors.phone ? "border-red-500" : "border-zinc-800"
                          }`}
                      />
                    </div>
                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      PAN Number <span className="text-gray-500">(Optional for 80G)</span>
                    </label>
                    <input
                      type="text"
                      maxLength="10"
                      placeholder="ABCDE1234F"
                      value={formData.panNumber}
                      onChange={(e) => handleInputChange("panNumber", e.target.value.toUpperCase())}
                      className={`w-full px-4 py-2.5 bg-zinc-950 border rounded-xl text-white text-sm uppercase font-mono focus:outline-none focus:border-pink-500 ${errors.panNumber ? "border-red-500" : "border-zinc-800"
                        }`}
                    />
                    {errors.panNumber && <p className="text-red-400 text-xs mt-1">{errors.panNumber}</p>}
                  </div>
                </div>
                {/* Optional Address Fields */}
                {/* Optional Address */}
                <div className="pt-2 border-t border-zinc-800/80 space-y-3">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block">
                    Address Details (Optional)
                  </span>
                  <div>
                    <input
                      type="text"
                      placeholder="Street Address / House No."
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-pink-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="City & State (e.g. Jaipur, Rajasthan)"
                      value={formData.cityState}
                      onChange={(e) => handleInputChange("cityState", e.target.value)}
                      className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-pink-500"
                    />
                    <input
                      type="text"
                      placeholder="Pincode (e.g. 302001)"
                      value={formData.pincode}
                      onChange={(e) => handleInputChange("pincode", e.target.value)}
                      className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </div>
                {/* Checkboxes: Anonymous & Terms Consent */}
                {/* Checkboxes */}
                <div className="pt-3 border-t border-zinc-800/80 space-y-3 text-xs">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isAnonymous}
                      onChange={(e) => handleInputChange("isAnonymous", e.target.checked)}
                      className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-pink-600 focus:ring-pink-500"
                    />
                    <span className="text-gray-300">Keep my donation anonymous (Hide name on public reports)</span>
                  </label>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agreeTerms}
                      onChange={(e) => handleInputChange("agreeTerms", e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-pink-600 focus:ring-pink-500"
                    />
                    <span className="text-gray-300">
                      I agree to the <span className="text-pink-400 underline">Terms & Conditions</span> and{" "}
                      <span className="text-pink-400 underline">Privacy Policy</span>. <span className="text-pink-500">*</span>
                    </span>
                  </label>
                  {errors.agreeTerms && (
                    <p className="text-red-400 text-xs font-medium pt-0.5">{errors.agreeTerms}</p>
                  )}
                </div>
              </div>
            </div>
            {/* 3. Payment Method Placeholder Cards */}
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="text-pink-500">3.</span> Payment Channel
                </h2>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <IconLockCheck className="w-3.5 h-3.5" /> 256-bit Encrypted
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PAYMENT_METHODS.map(({ id, name, desc, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPaymentMethod(id)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${paymentMethod === id
                      ? "bg-pink-950/40 border-pink-500 ring-1 ring-pink-500"
                      : "bg-zinc-950/60 border-zinc-800 hover:border-zinc-700"
                      }`}
                  >
                    <div className={`p-2 rounded-lg ${paymentMethod === id ? "bg-pink-600 text-white" : "bg-zinc-900 text-gray-400"}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">{name}</div>
                      <div className="text-[11px] text-gray-400">{desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* Right Column: Donation Summary & Submit */}
          <div className="md:col-span-5">
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 space-y-6 sticky top-24 shadow-xl">
              <h3 className="text-lg font-bold text-white border-b border-zinc-800 pb-3">
                Donation Summary
              </h3>
              <div className="space-y-3.5 text-sm">
                <div className="flex justify-between items-center text-gray-300">
                  <span>Donation Type</span>
                  <span className="capitalize text-pink-400 font-semibold px-2 py-0.5 rounded bg-pink-500/10 text-xs">
                    {donationType === "monthly" ? "Monthly Recurring" : "One-Time"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-gray-300">
                  <span>Cause</span>
                  <span className="text-xs text-gray-400 capitalize truncate max-w-[150px]">
                    {PURPOSES.find((p) => p.id === purpose)?.label}
                  </span>
                </div>
                <div className="flex justify-between items-center text-gray-300">
                  <span>Donation Amount</span>
                  <span className="font-semibold text-white">₹{effectiveAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between items-center text-gray-300">
                  <span>Processing Fee</span>
                  <span className="text-emerald-400 font-semibold">₹0 (Free)</span>
                </div>
                <div className="pt-3 border-t border-zinc-800 flex justify-between items-baseline">
                  <span className="text-xs text-gray-400 font-medium uppercase">Total Amount</span>
                  <span className="text-2xl font-bold text-pink-400">₹{effectiveAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>
              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30 disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <>
                    <IconHeart className="w-5 h-5 fill-current" />
                    <span>
                      Donate ₹{effectiveAmount.toLocaleString("en-IN")}{" "}
                      {donationType === "monthly" ? "/ month" : ""}
                    </span>
                  </>
                )}
              </button>
              <p className="text-[11px] text-center text-gray-400">
                🔒 100% Safe & Transparent Giving Demo
              </p>
            </div>
          </div>
        </form>
      </main>
      {/* Success Modal */}
      {/* Success Modal Notification */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md w-full text-center space-y-4 relative shadow-2xl">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <IconX className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 mx-auto flex items-center justify-center">
              <IconCheck className="w-6 h-6 stroke-[3]" />
            </div>
            <h3 className="text-xl font-bold text-white">Thank You, {formData.fullName}!</h3>

            <p className="text-pink-400 font-medium text-sm bg-pink-950/60 border border-pink-500/30 p-3 rounded-xl">
              Payment gateway integration will be connected in the backend.
            </p>
            <div className="text-xs text-gray-300 space-y-1.5 text-left bg-zinc-950 p-4 rounded-xl border border-zinc-800">
              <div><strong className="text-gray-400">Type:</strong> {donationType === "monthly" ? "Monthly Recurring" : "One-Time"}</div>
              <div><strong className="text-gray-400">Amount:</strong> ₹{effectiveAmount.toLocaleString("en-IN")}</div>
              <div><strong className="text-gray-400">Email:</strong> {formData.email}</div>
              <div><strong className="text-gray-400">Mobile:</strong> {formData.phone}</div>
              {formData.panNumber && <div><strong className="text-gray-400">PAN:</strong> {formData.panNumber}</div>}
              <div><strong className="text-gray-400">Channel:</strong> {paymentMethod.toUpperCase()}</div>
              {modalDetails?.isSavedToDb && (
                <div className="text-emerald-400 font-semibold pt-1">
                  ✓ Recorded in Supabase Database
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="w-full py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-semibold text-sm transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}