import React, { useMemo } from 'react';
import { useStore } from '../store';
import { Finance } from '../utils/finance';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, AreaChart, Area, XAxis, YAxis } from 'recharts';
import CountUp from 'react-countup';
import Tilt from 'react-parallax-tilt';
import clsx from 'clsx';

export const ResultsSection: React.FC = () => {
    const { principal, tin, months, expenses } = useStore();

    const results = useMemo(() => {
        return Finance.calculateTAE(principal, tin, months, expenses);
    }, [principal, tin, months, expenses]);

    const amortizationData = useMemo(() => {
        return Finance.calculateAmortizationSchedule(principal, tin, months);
    }, [principal, tin, months]);

    const chartData = [
        { name: 'Principal', value: results.breakdown.principal, color: '#3B82F6' },
        { name: 'Intereses', value: results.breakdown.interest, color: '#8B5CF6' },
        { name: 'Gastos (TAE)', value: results.breakdown.expenses, color: '#EF4444' },
    ];

    return (
        <Tilt
            tiltMaxAngleX={2}
            tiltMaxAngleY={2}
            glareEnable={true}
            glareMaxOpacity={0.1}
            className="h-full"
        >
            <div className="glass-panel p-6 flex flex-col h-full bg-brand-card/70 backdrop-blur-xl border border-white/5 rounded-2xl shadow-glass transform-gpu">
                <h2 className="text-xl font-bold text-white mb-6">Cálculo Financiación</h2>

                {/* Top Metrics with CountUp */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-brand-dark/40 p-4 rounded-xl border border-white/5">
                        <p className="text-sm text-slate-400">Cuota Mensual</p>
                        <p className="text-3xl font-mono font-bold text-white">
                            <CountUp end={results.monthlyQuota} decimals={2} duration={0.5} separator="." decimal="," suffix="€" />
                        </p>
                    </div>
                    <div className={clsx("p-4 rounded-xl border border-white/5 relative overflow-hidden",
                        results.tae > tin + 1 ? "bg-brand-warning/10" : "bg-brand-success/10"
                    )}>
                        <div className="absolute top-0 right-0 p-1 bg-white/10 rounded-bl-lg text-[10px] text-white/50">LCCI</div>
                        <p className="text-sm text-slate-400">TAE Real (Coste Efectivo)</p>
                        <p className={clsx("text-3xl font-mono font-bold",
                            results.tae > tin + 1 ? "text-brand-warning" : "text-brand-success"
                        )}>
                            <CountUp end={results.tae} decimals={3} duration={1} separator="." decimal="," suffix="%" />
                        </p>
                    </div>
                </div>

                {/* Visualization Grid: Donut + Area */}
                <div className="flex-1 grid grid-rows-2 gap-4 min-h-0">

                    {/* Donut Chart */}
                    <div className="relative min-h-[180px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    innerRadius={50}
                                    outerRadius={70}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#151B2B', borderColor: '#334155', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                    formatter={(value: number) => `${value.toLocaleString('es-ES', { maximumFractionDigits: 0 })}€`}
                                />
                                <Legend verticalAlign="bottom" height={36} iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                            <div className="text-center">
                                <p className="text-[10px] text-slate-500">Total</p>
                                <p className="text-xs font-bold text-white">
                                    {(results.breakdown.totalPaid / 1000).toFixed(1)}k€
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Amortization Area Chart (Debt Mountain) */}
                    <div className="relative w-full h-full min-h-[120px] bg-brand-dark/20 rounded-xl p-2 border border-white/5">
                        <p className="absolute top-2 left-3 text-[10px] text-slate-500 z-10">Amortización (Deuda Pendiente)</p>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={amortizationData}>
                                <defs>
                                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" hide />
                                <YAxis hide domain={['dataMin', 'dataMax']} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#151B2B', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                                    itemStyle={{ color: '#3B82F6' }}
                                    formatter={(value: number) => [`${value.toLocaleString('es-ES', { maximumFractionDigits: 0 })}€`, 'Deuda']}
                                    labelFormatter={(label) => `Mes ${label}`}
                                />
                                <Area type="monotone" dataKey="balance" stroke="#3B82F6" fillOpacity={1} fill="url(#colorBalance)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                </div>

            </div>
        </Tilt>
    );
};
