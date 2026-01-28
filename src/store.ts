import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Expense } from './utils/finance';
import { supabase, APP_ID } from './utils/supabase';
import { Sentinel } from './utils/sentinel';

// Access Log Type matching Unified Schema (metadata focus)
export interface AccessLog {
    id: string; // UUID from supabase
    action: string;
    created_at: string;
    metadata: any;
}

interface AuthState {
    logs: AccessLog[];
    currentLogId?: string; // UUID now
    supaUrl?: string;
    supaKey?: string;

    // Actions
    recordVisit: () => Promise<void>;
    updateLogDuration: (seconds: number) => Promise<void>;
    setSupabaseConfig: (url: string, key: string) => void;
    fetchLogs: () => Promise<void>;

    // User Auth (Mock/Simple for now)
    isAuthenticated: boolean;
    login: (password: string) => boolean;
    logout: () => void;
}

interface LoanState {
    principal: number;
    tin: number;
    months: number;
    expenses: Expense[];

    setPrincipal: (amount: number) => void;
    setTin: (rate: number) => void;
    setMonths: (m: number) => void;

    addExpense: (expense: Expense) => void;
    removeExpense: (id: string) => void;
    toggleExpenseInclusion: (id: string) => void;
    updateExpense: (id: string, updates: Partial<Expense>) => void;
    reset: () => void;
}

type Store = LoanState & AuthState;

export const useStore = create<Store>()(persist((set, get) => ({
    // --- Loan Slice ---
    principal: 10000,
    tin: 5.99,
    months: 60,
    expenses: [
        { id: '1', name: 'Comisión Apertura', unit: 'percent', value: 0, recurrence: 'initial', includedInTAE: true },
        { id: '2', name: 'Seguro Vida', unit: 'currency', value: 0, recurrence: 'annual', includedInTAE: true },
        { id: '3', name: 'Otros Gastos', unit: 'currency', value: 0, recurrence: 'initial', includedInTAE: true },
    ],

    setPrincipal: (val) => set({ principal: val }),
    setTin: (val) => set({ tin: val }),
    setMonths: (val) => set({ months: val }),

    addExpense: (exp) => set((state) => ({ expenses: [...state.expenses, exp] })),
    removeExpense: (id) => set((state) => ({
        expenses: state.expenses.filter(e => e.id !== id)
    })),
    toggleExpenseInclusion: (id) => set((state) => ({
        expenses: state.expenses.map(e => e.id === id ? { ...e, includedInTAE: !e.includedInTAE } : e)
    })),
    updateExpense: (id, updates) => set((state) => ({
        expenses: state.expenses.map(e => e.id === id ? { ...e, ...updates } : e)
    })),
    reset: () => set({
        principal: 10000,
        tin: 5.99,
        months: 60,
        expenses: [
            { id: '1', name: 'Comisión Apertura', unit: 'percent', value: 0, recurrence: 'initial', includedInTAE: true },
            { id: '2', name: 'Seguro Vida', unit: 'currency', value: 0, recurrence: 'annual', includedInTAE: true },
            { id: '3', name: 'Otros Gastos', unit: 'currency', value: 0, recurrence: 'initial', includedInTAE: true },
        ]
    }),

    // --- Auth/Telemetry Slice (Unified) ---
    // --- Auth/Telemetry Slice (Unified) ---
    logs: [],
    currentLogId: undefined,
    supaUrl: import.meta.env.VITE_SUPABASE_URL,
    supaKey: import.meta.env.VITE_SUPABASE_ANON_KEY,

    setSupabaseConfig: (url, key) => set({ supaUrl: url, supaKey: key }),

    fetchLogs: async () => {
        const { supaUrl, supaKey } = get();
        if (!supaUrl || !supaKey) return;

        try {
            // Dynamic client creation if config changes (or use global if static)
            // For now, if we assume global supabase is configured with env vars, 
            // but if user overrides via UI, we might need a new client. 
            // Simplified: use global 'supabase' client which reads env vars. 
            // If we want dynamic swap, we'd need to re-init client.
            // For MVP build fix:
            const { data, error } = await supabase
                .from('activity_logs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(100);

            if (data) {
                // Map DB schema to AccessLog type if needed, or cast
                set({ logs: data as any });
            }
        } catch (e) {
            console.error("Error fetching logs", e);
        }
    },

    recordVisit: async () => {
        try {
            const logData = await Sentinel.assembleLog();

            // Insert into Unified Table
            const entry = {
                app_id: null, // Resolves via RLS or simplified schema
                action: 'LOGIN',
                level: 'info',
                metadata: {
                    ip: logData.ip_address,
                    location: `${logData.city}, ${logData.country}`,
                    user_agent: logData.user_agent,
                    app_slug: APP_ID
                }
            };

            const { data, error } = await supabase
                .from('activity_logs')
                .insert([entry])
                .select()
                .single();

            if (data) {
                set({ currentLogId: data.id });
            } else if (error) {
                console.error("Supabase Log Error:", error);
            }
        } catch (e) {
            console.error("Sentinel Error", e);
        }
    },

    updateLogDuration: async (seconds: number) => {
        // Placeholder to avoid unused var warning
        if (seconds < 0) return;

        const { currentLogId } = get();
        if (!currentLogId) return;
        // ... (rest)

        // Currently 'activity_logs' might not store duration in the root column depending on schema v1 vs v2
        // We'll update metadata or ignored for now if schema is strict.
        // Assuming we added 'metadata' updates support:
        // await supabase.from('activity_logs').update({ metadata: { duration: seconds } }).eq('id', currentLogId);
    }
}), {
    name: 'fincalc-storage',
    partialize: (state) => ({
        expenses: state.expenses,
        principal: state.principal,
        tin: state.tin,
        months: state.months,
    })
}));
