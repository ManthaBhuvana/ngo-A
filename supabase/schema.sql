-- =========================================================
-- Supabase SQL Schema for Avasa Foundation Donations Table
-- Run this SQL in your Supabase SQL Editor:
-- Dashboard -> SQL Editor -> New Query -> Run
-- =========================================================
CREATE TABLE IF NOT EXISTS public.donations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    donation_type VARCHAR(20) NOT NULL DEFAULT 'one-time', -- 'one-time' or 'monthly'
    amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(5) NOT NULL DEFAULT 'INR',
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    pan_number VARCHAR(10),
    address TEXT,
    city_state TEXT,
    pincode VARCHAR(10),
    purpose VARCHAR(100) DEFAULT 'general',
    is_anonymous BOOLEAN DEFAULT FALSE,
    payment_method VARCHAR(50) DEFAULT 'upi',
    razorpay_order_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    razorpay_signature VARCHAR(512),
    status VARCHAR(20) NOT NULL DEFAULT 'success', -- 'pending', 'success', 'failed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Index for searching donations by email or payment status
CREATE INDEX IF NOT EXISTS idx_donations_email ON public.donations(email);
CREATE INDEX IF NOT EXISTS idx_donations_order_id ON public.donations(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_donations_status ON public.donations(status);
-- Enable Row Level Security (RLS)
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
-- Allow insert via service role key (Backend API)
CREATE POLICY "Allow server insertion" ON public.donations
    FOR INSERT TO service_role WITH CHECK (true);
-- Allow server selection
CREATE POLICY "Allow server selection" ON public.donations
    FOR SELECT TO service_role USING (true);
