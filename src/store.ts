import { create } from 'zustand';
import type { Expense } from './utils/finance';

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

export const useStore = create<LoanState>((set) => ({
    principal: 10000, // Default start for used car
    tin: 5.99,
    months: 60, // 5 years
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
    })
}));
