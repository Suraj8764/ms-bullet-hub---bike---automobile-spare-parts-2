import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

let supabaseClientInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
    if (supabaseClientInstance) return supabaseClientInstance;

    const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

    if (!url || !key || url.trim() === '' || key.trim() === '') {
        return null;
    }

    try {
        supabaseClientInstance = createClient(url, key, {
            auth: { persistSession: false },
        });
        console.log('Successfully initialized Supabase client for Payment processing!');
        return supabaseClientInstance;
    } catch (err) {
        console.error('Failed to initialize Supabase client:', err);
        return null;
    }
}

export async function checkSupabaseConnection(): Promise<{
    connected: boolean;
    message: string;
    url?: string;
}> {
    const supabase = getSupabaseClient();
    const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;

    if (!supabase) {
        return {
            connected: false,
            message: 'Supabase credentials (SUPABASE_URL / SUPABASE_ANON_KEY) are not set in environment.',
            url: url || 'Unconfigured',
        };
    }

    try {
        // Ping Supabase payments table or rest health check
        const { data, error } = await supabase.from('payments').select('count', { count: 'exact', head: true });
        if (error && error.code !== 'PGRST116' && !error.message?.includes('relation "public.payments" does not exist')) {
            // If table missing, Supabase instance itself is connected
            if (error.message?.includes('relation') || error.code === '42P01') {
                return {
                    connected: true,
                    message: 'Connected to Supabase project! (Payments table pending schema creation)',
                    url,
                };
            }
            return {
                connected: false,
                message: `Supabase error: ${error.message}`,
                url,
            };
        }

        return {
            connected: true,
            message: 'Successfully connected to Supabase Payment database!',
            url,
        };
    } catch (err: any) {
        return {
            connected: false,
            message: `Supabase connection check failed: ${err?.message || err}`,
            url,
        };
    }
}
