import React from 'react';
import { useStore } from '../store';
import { X, CheckCircle, Circle } from 'lucide-react';
import { Finance } from '../utils/finance';
import clsx from 'clsx';
import type { Expense } from '../utils/finance';

export const ExpenseModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { expenses, updateExpense, toggleExpenseInclusion, principal } = useStore();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="glass-panel w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-brand-card">
                    <h3 className="text-xl font-bold text-white">Gastos y Comisiones</h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-400 hover:text-white" />
                    </button>
                </div>

                {/* List of Existing Expenses (Editable) */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {expenses.map((exp) => (
                        <div key={exp.id} className={clsx("p-4 rounded-xl border transition-all space-y-3",
                            exp.includedInTAE ? 'bg-brand-dark/50 border-brand-accent/20' : 'bg-brand-dark/30 border-white/5 opacity-60'
                        )}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <button onClick={() => toggleExpenseInclusion(exp.id)}>
                                        {exp.includedInTAE
                                            ? <CheckCircle className="w-5 h-5 text-brand-success" />
                                            : <Circle className="w-5 h-5 text-slate-500" />
                                        }
                                    </button>
                                    <span className="font-semibold text-white">{exp.name}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Unit Toggle */}
                                <div className="flex bg-slate-800 rounded-lg p-1">
                                    <button
                                        onClick={() => updateExpense(exp.id, { unit: 'percent' })}
                                        className={clsx("flex-1 text-xs py-1 rounded", exp.unit === 'percent' ? "bg-white text-black" : "text-slate-400")}
                                    >
                                        %
                                    </button>
                                    <button
                                        onClick={() => updateExpense(exp.id, { unit: 'currency' })}
                                        className={clsx("flex-1 text-xs py-1 rounded", exp.unit === 'currency' ? "bg-white text-black" : "text-slate-400")}
                                    >
                                        €
                                    </button>
                                </div>

                                {/* Value Input */}
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={exp.value}
                                        onChange={(e) => updateExpense(exp.id, { value: Number(e.target.value) })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-right font-mono"
                                    />
                                    <span className="absolute right-8 top-1.5 text-xs text-slate-500">
                                        {exp.unit === 'percent' ? '%' : '€'}
                                    </span>
                                </div>
                            </div>

                            {/* Recurrence Selector - FIXED INJECTION */}
                            <div className="flex bg-slate-800 rounded-lg p-1 mt-2">
                                {(['initial', 'annual', 'monthly'] as const).map((rec) => (
                                    <button
                                        key={rec}
                                        onClick={() => updateExpense(exp.id, { recurrence: rec })}
                                        className={clsx(
                                            "flex-1 text-xs py-1 rounded transition-colors",
                                            exp.recurrence === rec ? "bg-white text-black font-semibold shadow-sm" : "text-slate-400 hover:text-white"
                                        )}
                                    >
                                        {rec === 'initial' ? 'Al Inicio (Único)' : rec === 'annual' ? 'Cada Año' : 'Mensual'}
                                    </button>
                                ))}
                            </div>

                            {/* Visual Feedback of Real Cost */}
                            <div className="flex justify-end border-t border-white/5 pt-2">
                                <p className="text-xs text-slate-400">
                                    Coste Calculado (Simulación): <span className="text-brand-accent font-mono">
                                        {Finance.getExpenseAmount(exp, principal).toLocaleString('es-ES')}€
                                    </span>
                                </p>
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};
