import { createClient } from '@supabase/supabase-js';

// We allow the user to provide these at runtime via the Settings panel, 
// OR use environment variables if provided during build.
// For the playground, we will store them in localStorage so the user doesn't have to re-enter them constantly.

export const getSupabaseClient = (url: string, key: string) => {
    return createClient(url, key);
};

export interface AccessLog {
    id?: number;
    created_at?: string;
    ip_address: string;
    city: string;
    country: string;
    user_agent: string;
    device_type: string;
    description: string;
}

export const logVisitToSupabase = async (client: any, log: AccessLog) => {
    if (!client) return { error: 'No client' };

    // Assume table is 'access_logs'
    const { data, error } = await client
        .from('access_logs')
        .insert([log])
        .select();

    return { data, error };
};

export const fetchLogsFromSupabase = async (client: any) => {
    if (!client) return { error: 'No client' };

    const { data, error } = await client
        .from('access_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

    return { data, error };
};
