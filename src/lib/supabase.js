import { createClient } from "@supabase/supabase-js";
export function getSupabaseClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const isConfigured =
        supabaseUrl &&
        supabaseKey &&
        !supabaseUrl.includes("your-project-id") &&
        !supabaseKey.includes("your_supabase_service_role_key");
    if (!isConfigured) {
        return { isConfigured: false, supabase: null };
    }
    const supabase = createClient(supabaseUrl, supabaseKey);
    return { isConfigured: true, supabase };
}
