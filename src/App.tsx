import { useState, useEffect } from 'react';
import { InputSection } from './components/InputSection';
import { ResultsSection } from './components/ResultsSection';
import { ExpenseModal } from './components/ExpenseModal';
import { SettingsModal } from './components/Settings/SettingsModal';
import { AlertTriangle, Settings } from 'lucide-react';
import { useStore } from './store';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const recordVisit = useStore((state) => state.recordVisit);

  useEffect(() => {
    // Silent Sentinel Logging
    recordVisit();
  }, []);

  return (
    <div className="min-h-screen bg-brand-dark relative overflow-hidden flex flex-col">
      {/* Background Ambience */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-accent/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-purple/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Navbar / Header */}
      <header className="relative z-10 border-b border-white/5 bg-brand-dark/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">

          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-brand-accent to-brand-purple rounded-xl flex items-center justify-center shadow-neon">
              <span className="font-bold text-white text-lg">JC</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white leading-none">
                JCA <span className="text-brand-accent">Financial</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-mono tracking-widest">LEY 16/2011 (CRÉDITO AL CONSUMO)</p>
            </div>
          </div>

          {/* Credits - Enhanced & Settings */}
          <div className="flex items-center gap-6">
            <div className="text-center md:text-right group cursor-default">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-0.5 group-hover:text-brand-accent transition-colors">
                Designed & Engineered by
              </p>
              <p className="text-xl font-black italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-brand-accent to-white drop-shadow-sm group-hover:drop-shadow-[0_0_10px_rgba(56,255,255,0.5)] transition-all duration-300">
                Juan Carlos Alvarado
              </p>
            </div>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all hover:rotate-90 duration-500 border border-white/5 hover:border-brand-accent/30"
              title="Sentinel Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 p-4 md:p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">

          {/* Left: Controls */}
          <div className="lg:col-span-5 space-y-6">
            <InputSection onOpenExpenses={() => setIsModalOpen(true)} />

            <div className="glass-panel p-4 flex items-start gap-3 bg-brand-warning/5 border-brand-warning/20">
              <AlertTriangle className="w-5 h-5 text-brand-warning shrink-0" />
              <p className="text-xs text-slate-400 leading-relaxed">
                Este simulador sigue la normativa de la <strong>Ley 16/2011 de Contratos de Crédito al Consumo</strong>. La TAE incluye intereses, comisiones y gastos vinculados obligatorios (seguros, apertura, etc.).
              </p>
            </div>
          </div>

          {/* Right: Visualization */}
          <div className="lg:col-span-7 h-full min-h-[500px]">
            <ResultsSection />
          </div>

        </div>
      </main>

      {/* Empty Footer just for spacing if needed, but credits are gone */}
      <footer className="relative z-10 py-6 text-center border-t border-white/5 mt-auto opacity-0">
        <p>spacer</p>
      </footer>

      {/* Modals */}
      {isModalOpen && <ExpenseModal onClose={() => setIsModalOpen(false)} />}
      {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
    </div>
  );
}

export default App;
