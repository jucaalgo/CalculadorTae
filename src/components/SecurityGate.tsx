import React, { useState } from 'react';
import { Lock, User, KeyRound, AlertCircle } from 'lucide-react';

interface SecurityGateProps {
    onLogin: (user: { username: string; role: string }) => void;
}

export const SecurityGate: React.FC<SecurityGateProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Simulated network delay for premium feel
        setTimeout(() => {
            if (username === 'jucaalgo' && password === '13470811') {
                onLogin({ username: 'jucaalgo', role: 'admin' });
            } else if (username === 'helen' && password === 'esposa') {
                onLogin({ username: 'helen', role: 'user' });
            } else {
                setError('Acceso denegado: Credenciales inválidas');
                setIsLoading(false);
            }
        }, 800);
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background Effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative z-10 transition-all duration-300 hover:shadow-blue-500/10">
                <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

                <div className="p-8">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Acceso Seguro</h2>
                        <p className="text-slate-400 text-sm mt-1">Identifíquese para continuar</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">Usuario</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-inner"
                                    placeholder="Ingrese su usuario"
                                    autoFocus
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">Contraseña</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <KeyRound className="h-5 w-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all shadow-inner"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-pulse">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full relative py-3.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/20 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98] mt-2"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Verificando...
                                </span>
                            ) : (
                                "Validar Credenciales"
                            )}
                        </button>
                    </form>
                </div>

                <div className="p-4 bg-slate-950/30 border-t border-white/5 text-center">
                    <p className="text-xs text-slate-600">
                        Sistema Protegido &copy; {new Date().getFullYear()}
                    </p>
                </div>
            </div>
        </div>
    );
};
