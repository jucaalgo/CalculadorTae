import { useEffect, useState } from 'react';
import { useStore } from '../../store';
import { Activity, Globe, Save, RefreshCw, Key, Database, Clock } from 'lucide-react';

export const Dashboard = () => {
    const { logs, supaUrl, supaKey, setSupabaseConfig, fetchLogs } = useStore();
    const [urlInput, setUrlInput] = useState(supaUrl);
    const [keyInput, setKeyInput] = useState(supaKey);
    const [isConfigOpen, setIsConfigOpen] = useState(!supaUrl); // Open if no config

    useEffect(() => {
        if (supaUrl && supaKey) {
            fetchLogs();
        }
    }, []);

    const handleSaveConfig = () => {
        setSupabaseConfig(urlInput, keyInput);
        setIsConfigOpen(false);
        setTimeout(() => fetchLogs(), 500);
    };

    // Derived Stats
    const totalVisits = logs.length;
    const uniqueIPs = new Set(logs.map(l => l.ip_address)).size;
    const topCountry = logs.length > 0
        ? Object.entries(logs.reduce((acc, l) => { acc[l.country] = (acc[l.country] || 0) + 1; return acc; }, {} as any))
            .sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || 'N/A'
        : 'N/A';

    return (
        <div className="w-full h-full flex flex-col gap-6 text-white animate-in fade-in duration-500">

            {/* Header / Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-brand-accent/20 rounded-lg text-brand-accent">
                        <Activity className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-mono">TOTAL VISITS</p>
                        <p className="text-2xl font-bold">{totalVisits}</p>
                    </div>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-brand-purple/20 rounded-lg text-brand-purple">
                        <Globe className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-mono">TOP COUNTRY</p>
                        <p className="text-2xl font-bold truncate max-w-[150px]">{topCountry}</p>
                    </div>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                        <Database className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-mono">UNIQUE VISITORS</p>
                        <p className="text-2xl font-bold">{uniqueIPs}</p>
                    </div>
                </div>
            </div>

            {/* Connection Config (Collapsible) */}
            <div className="bg-black/40 border border-white/10 rounded-xl">
                <div
                    className="flex justify-between items-center p-4 cursor-pointer hover:bg-white/5"
                    onClick={() => setIsConfigOpen(!isConfigOpen)}
                >
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                        <Key className="w-4 h-4" />
                        <span>SUPABASE CONNECTION</span>
                    </div>
                    <span className="text-xs text-slate-500">{isConfigOpen ? 'Hide' : 'Configure'}</span>
                </div>

                {isConfigOpen && (
                    <div className="p-4 pt-0 space-y-4 border-t border-white/10 mt-2 animate-in slide-in-from-top-2 duration-200">
                        <div className="grid gap-2">
                            <label className="text-xs text-slate-500">Project URL</label>
                            <input
                                value={urlInput}
                                onChange={(e) => setUrlInput(e.target.value)}
                                className="bg-black/50 border border-white/10 rounded px-3 py-2 text-xs font-mono text-brand-accent w-full focus:outline-none focus:border-brand-accent"
                                placeholder="https://xyz.supabase.co"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-xs text-slate-500">Anon Key</label>
                            <input
                                value={keyInput}
                                onChange={(e) => setKeyInput(e.target.value)}
                                className="bg-black/50 border border-white/10 rounded px-3 py-2 text-xs font-mono text-brand-accent w-full focus:outline-none focus:border-brand-accent"
                                placeholder="eyJhbGciOiJIUzI1NiIsInR..."
                            />
                        </div>
                        <button
                            onClick={handleSaveConfig}
                            className="w-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2 rounded flex items-center justify-center gap-2"
                        >
                            <Save className="w-3 h-3" />
                            SAVE CONFIG
                        </button>
                    </div>
                )}
            </div>

            {/* Logs Table */}
            <div className="flex-1 bg-black/60 border border-white/10 rounded-xl overflow-hidden flex flex-col min-h-[300px]">
                <div className="p-3 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <h3 className="text-sm font-bold tracking-widest text-slate-400">ACCESS LOGS</h3>
                    <button onClick={() => fetchLogs()} className="text-slate-400 hover:text-white transition-colors">
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex-1 overflow-auto p-0">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white/5 text-xs text-slate-500 font-mono sticky top-0 backdrop-blur-md">
                            <tr>
                                <th className="p-3 font-medium">TIME</th>
                                <th className="p-3 font-medium">IP & ISP</th>
                                <th className="p-3 font-medium">LOCATION</th>
                                <th className="p-3 font-medium">SYSTEM</th>
                                <th className="p-3 font-medium">DURATION</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs font-mono divide-y divide-white/5">
                            {logs.map((log, i) => (
                                <tr key={log.id || i} className="hover:bg-white/5 transition-colors">
                                    <td className="p-3 text-slate-400 flex items-center gap-2">
                                        <Clock className="w-3 h-3 opacity-50" />
                                        {log.created_at ? new Date(log.created_at).toLocaleString() : 'Just now'}
                                    </td>
                                    <td className="p-3">
                                        <div className="text-brand-accent">{log.ip_address}</div>
                                        {log.org && <div className="text-[10px] text-slate-500 truncate max-w-[150px]">{log.org}</div>}
                                    </td>
                                    <td className="p-3">
                                        <div className="text-white">{log.city}, {log.country}</div>
                                        {log.region && <div className="text-[10px] text-slate-500">{log.region}</div>}
                                    </td>
                                    <td className="p-3 text-slate-500">
                                        <div>{log.device_type}</div>
                                        {log.platform && <div className="text-[10px] opacity-70">{log.platform}</div>}
                                    </td>
                                    <td className="p-3 text-white">
                                        {log.duration_seconds ? `${Math.floor(log.duration_seconds / 60)}m ${log.duration_seconds % 60}s` : '-'}
                                    </td>
                                </tr>
                            ))}
                            {logs.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-600">
                                        {supaUrl ? 'No logs found on server.' : 'No local logs yet. Visit the page to generate one.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mode Indicator */}
            {!supaUrl && (
                <div className="absolute bottom-4 right-4 text-[10px] bg-brand-warning/10 text-brand-warning px-2 py-1 rounded border border-brand-warning/20 font-mono">
                    LOCAL_STORAGE_MODE
                </div>
            )}

        </div>
    );
};
