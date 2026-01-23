import { X } from 'lucide-react';
import { useStore } from '../../store';
import { LoginForm } from './LoginForm';
import { Dashboard } from './Dashboard';

interface SettingsModalProps {
    onClose: () => void;
}

export const SettingsModal = ({ onClose }: SettingsModalProps) => {
    const isAuthenticated = useStore((state) => state.isAuthenticated);
    const logout = useStore((state) => state.logout);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-brand-dark/90 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-4xl h-[80vh] bg-brand-dark border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
                        <span className="font-mono text-sm tracking-widest text-slate-300">SENTINEL_V1.0</span>
                    </div>
                    <div className="flex items-center gap-4">
                        {isAuthenticated && (
                            <button
                                onClick={logout}
                                className="text-xs text-red-400 hover:text-red-300 transition-colors uppercase font-bold tracking-wider"
                            >
                                Logout
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-white/10 rounded transition-colors text-slate-400 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="flex-1 p-6 overflow-hidden bg-dot-pattern">
                    {isAuthenticated ? <Dashboard /> : <LoginForm />}
                </div>

                {/* Footer Decor */}
                <div className="h-1 w-full bg-gradient-to-r from-transparent via-brand-accent/50 to-transparent opacity-50" />
            </div>
        </div>
    );
};
