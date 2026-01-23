import { useState } from 'react';
import { InputSection } from './components/InputSection';
import { ResultsSection } from './components/ResultsSection';
import { ExpenseModal } from './components/ExpenseModal';
import { AlertTriangle } from 'lucide-react';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
              <p className="text-[10px] text-slate-500 font-mono tracking-widest">LCCI COMPLIANT ENGINE</p>
            </div>
          </div>

          {/* Credits - Top, Single Line, Visible */}
          <div className="text-center md:text-right">
            <p className="text-sm font-medium text-slate-400">
              Designed & Engineered by <span className="text-white font-bold text-base ml-1 drop-shadow-md">Juan Carlos Alvarado</span>
            </p>
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
                Este simulador utiliza el método de <strong>TIR (Tasa Interna de Retorno)</strong> cumpliendo la norma del Banco de España (2019), incluyendo gastos recurrentes y vinculaciones en el cálculo de la TAE.
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
    </div>
  );
}

export default App;
