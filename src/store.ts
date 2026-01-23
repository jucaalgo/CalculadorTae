import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Expense } from './utils/finance';
import { getSupabaseClient, logVisitToSupabase, fetchLogsFromSupabase } from './utils/supabase';
import type { AccessLog } from './utils/supabase';
import { Sentinel } from './utils/sentinel';

interface AuthState {
    isAuthenticated: boolean;
    supaUrl: string;
    supaKey: string;
    logs: AccessLog[];

    login: () => void;
    logout: () => void;
    setSupabaseConfig: (url: string, key: string) => void;

    // Actions
    recordVisit: () => Promise<void>;
    fetchLogs: () => Promise<void>;
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

    // --- Auth Slice ---
    isAuthenticated: false,
    supaUrl: '',
    supaKey: '',
    logs: [],

    login: () => set({ isAuthenticated: true }),
    logout: () => set({ isAuthenticated: false }),
    setSupabaseConfig: (url, key) => set({ supaUrl: url, supaKey: key }),

    recordVisit: async () => {
        const { supaUrl, supaKey } = get();
        if (!supaUrl || !supaKey) return;

        // Silent execution
        try {
            const logData = await Sentinel.assembleLog();
            const client = getSupabaseClient(supaUrl, supaKey);
            await logVisitToSupabase(client, logData);
        } catch (e) {
            console.error("Sentinel Error", e);
        }
    },

    fetchLogs: async () => {
        const { supaUrl, supaKey } = get();
        if (!supaUrl || !supaKey) return;

        const client = getSupabaseClient(supaUrl, supaKey);
        const { data } = await fetchLogsFromSupabase(client);
        if (data) {
            set({ logs: data as AccessLog[] });
        }
    }
}), {
    name: 'fincalc-storage',
    partialize: (state) => ({
        // Persist only supabase config, NOT auth state (session only), 
        // NOT expenses (reset on reload? user preference. Let's persist expenses for convenience, but NOT auth for security)
        expenses: state.expenses,
        principal: state.principal,
        tin: state.tin,
        months: state.months,
        supaUrl: state.supaUrl,
        supaKey: state.supaKey
    })
}));
