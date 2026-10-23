import React from 'react';
import { UserProfile } from '../types';
import { PlusCircle, Wallet, Download, UserCheck } from 'lucide-react';

interface TopBarProps {
  user: UserProfile;
  onOpenTopUp: () => void;
  onOpenProfile: () => void;
  onExportPDF: () => void;
  activeSection: string;
  onSelectSection: (section: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  user,
  onOpenTopUp,
  onOpenProfile,
  onExportPDF,
  activeSection,
  onSelectSection,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-base">
            S
          </div>
          <button
            onClick={() => onSelectSection('overview')}
            className="text-lg font-extrabold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-emerald-400 transition-colors"
          >
            SARMOYA
          </button>
        </div>

        {/* Zone 2: 4 Navigation Links (concise, single-line) */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
          <button
            onClick={() => onSelectSection('overview')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeSection === 'overview' ? 'text-emerald-400 border-b-2 border-emerald-400 pb-0.5' : 'hover:text-white'
            }`}
          >
            Boshqaruv Paneli
          </button>
          <button
            onClick={() => onSelectSection('analytics')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeSection === 'analytics' ? 'text-emerald-400 border-b-2 border-emerald-400 pb-0.5' : 'hover:text-white'
            }`}
          >
            Kategoriyalar Tahlili
          </button>
          <button
            onClick={() => onSelectSection('history')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeSection === 'history' ? 'text-emerald-400 border-b-2 border-emerald-400 pb-0.5' : 'hover:text-white'
            }`}
          >
            Xarajatlar Tarixi
          </button>
          <button
            onClick={onExportPDF}
            className="whitespace-nowrap shrink-0 hover:text-emerald-300 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>PDF Hisobot</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action & Profile Info */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenProfile}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-colors"
            title="Profilni ko'rish"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-medium max-w-[120px] truncate">{user.fullName || 'Talaba'}</span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">20+</span>
          </button>

          <button
            onClick={onOpenTopUp}
            className="px-3.5 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 active:scale-95 rounded-lg shadow-sm shadow-emerald-500/20 transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Pul Tushirish</span>
          </button>
        </div>
      </div>
    </header>
  );
};
