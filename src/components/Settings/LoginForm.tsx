import { useState } from 'react';
import { useStore } from '../../store';
import { Lock, ArrowRight, AlertCircle } from 'lucide-react';

export const LoginForm = () => {
    const login = useStore((state) => state.login);
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Use updated login form store
        if (login(user, pass)) {
            // Success handled by store state
        } else {
            setError(true);
            setTimeout(() => setError(false), 2000); // Shake/reset
        }
    };

    return (
        <div className="w-full max-w-sm mx-auto p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            {/* Ambient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-brand-accent/20 blur-[80px] rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
                    <Lock className="w-6 h-6 text-brand-accent/80" />
                </div>

                <h2 className="text-xl font-bold text-white tracking-wide">SENTINEL ACCESS</h2>

                <form onSubmit={handleLogin} className="w-full space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-mono text-slate-500 ml-1">IDENTITY</label>
                        <input
                            type="text"
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-accent/50 transition-colors"
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                            placeholder="username"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-mono text-slate-500 ml-1">KEY</label>
                        <input
                            type="password"
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-accent/50 transition-colors"
                            value={pass}
                            onChange={(e) => setPass(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 p-2 rounded border border-red-500/20 animate-shake">
                            <AlertCircle className="w-3 h-3" />
                            <span>ACCESS DENIED</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full mt-4 bg-brand-accent hover:bg-brand-accent-light text-brand-dark font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                        <span>AUTHENTICATE</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    );
};
