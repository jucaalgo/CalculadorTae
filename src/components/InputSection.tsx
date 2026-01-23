import React from 'react';
import { useStore } from '../store';
import { Euro, Calendar, Percent, Plus, RefreshCw } from 'lucide-react';

interface Props {
    onOpenExpenses: () => void;
}

export const InputSection: React.FC<Props> = ({ onOpenExpenses }) => {
    const { principal, months, tin, setPrincipal, setMonths, setTin, expenses, reset } = useStore();

    const activeExpensesCount = expenses.filter(e => e.includedInTAE && e.value > 0).length;

    return (
        <div className="glass-panel p-6 space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Préstamo Vehículo</h2>
                <div className="flex items-center gap-3">
                    <button
                        onClick={reset}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                        title="Restablecer valores"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-mono text-brand-accent px-2 py-1 bg-brand-accent/10 rounded border border-brand-accent/20">USADO</span>
                </div>
            </div>

            {/* Principal Slider + Manual Input */}
            <div className="input-group">
                <div className="flex justify-between items-end mb-2">
                    <label className="text-sm text-slate-400">Importe a Financiar</label>
                    <div className="flex items-center border-b border-white/20 focus-within:border-brand-accent">
                        <input
                            type="number"
                            value={principal}
                            onChange={(e) => setPrincipal(Number(e.target.value))}
                            className="bg-transparent text-right font-mono font-bold text-brand-success outline-none w-28"
                            step="100"
                        />
                        <span className="text-brand-success ml-1">€</span>
                    </div>
                </div>
                <input
                    type="range"
                    min="1000"
                    max="100000"
                    step="100"
                    value={principal}
                    onChange={(e) => setPrincipal(Number(e.target.value))}
                    className="accent-brand-accent"
                />
                <div className="flex justify-between text-xs text-slate-600 mt-1">
                    <span>1.000€</span>
                    <span>100.000€</span>
                </div>
            </div>

            {/* Months Slider + Manual Input */}
            <div className="input-group">
                <div className="flex justify-between items-end mb-2">
                    <label className="text-sm text-slate-400">Plazo (Meses)</label>
                    <div className="flex items-center border-b border-white/20 focus-within:border-brand-purple">
                        <input
                            type="number"
                            value={months}
                            onChange={(e) => setMonths(Number(e.target.value))}
                            className="bg-transparent text-right font-mono font-bold text-brand-purple outline-none w-16"
                            min="12"
                            max="120"
                        />
                        <span className="text-brand-purple ml-1">Meses</span>
                    </div>
                </div>
                <input
                    type="range"
                    min="12"
                    max="120"
                    step="6"
                    value={months}
                    onChange={(e) => setMonths(Number(e.target.value))}
                />
                <div className="flex justify-between text-xs text-slate-600 mt-1">
                    <span>12m</span>
                    <span>120m</span>
                </div>
            </div>

            {/* TIN Input */}
            <div className="input-group">
                <label className="text-sm text-slate-400">TIN (Nominal)</label>
                <div className="relative">
                    <Percent className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                        type="number"
                        value={tin}
                        onChange={(e) => setTin(Number(e.target.value))}
                        className="input-field w-full pl-10 text-lg"
                        step="0.01"
                    />
                </div>
            </div>

            {/* Config Button (NOW ACTIVE) */}
            <button
                onClick={onOpenExpenses}
                className="w-full btn-primary flex items-center justify-center gap-2 relative overflow-hidden group"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <Plus className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Configurar Gastos ({activeExpensesCount})</span>
            </button>

        </div>
    );
};
