import React from 'react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';
import { formatUZS, formatCompactUZS } from '../utils/formatters';
import {
  TrendingUp,
  TrendingDown,
  CreditCard,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  CalendarDays,
  Target,
} from 'lucide-react';

interface MetricCardsProps {
  user: UserProfile;
  totalIncome: number;
  totalExpense: number;
  currentBalance: number;
  dailyAverage: number;
  onOpenTopUp: () => void;
  onOpenAddExpense: () => void;
  onOpenBudgetModal: () => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  user,
  totalIncome,
  totalExpense,
  currentBalance,
  dailyAverage,
  onOpenTopUp,
  onOpenAddExpense,
  onOpenBudgetModal,
}) => {
  const budgetPercent = user.monthlyBudget > 0
    ? Math.min(100, Math.round((totalExpense / user.monthlyBudget) * 100))
    : 0;

  const isOverBudget = user.monthlyBudget > 0 && totalExpense > user.monthlyBudget;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
      {/* Visual Obsidian Card: 5 columns */}
      <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/90 shadow-xl flex flex-col justify-between p-6">
        {/* Background Image / Texture with dark contrast scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/fintech_luxury_card_1792769414922.jpg"
            alt="Virtual debit card"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-25 filter blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        {/* Card Header Content */}
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold tracking-wider text-emerald-400 uppercase">
                Talaba Moliyaviy Kartasi
              </span>
              <span className="text-[10px] text-slate-400">·</span>
              <span className="text-[10px] text-slate-400 font-mono">20+ TASDIQLANGAN</span>
            </div>
            <h4 className="text-sm font-medium text-slate-200 mt-1 truncate max-w-[260px]">
              {user.university || "Toshkent Axborot Texnologiyalari Universiteti"}
            </h4>
          </div>

          <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-emerald-400 shadow-inner">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

        {/* Balance Display */}
        <div className="relative z-10 my-6">
          <p className="text-xs font-medium text-slate-400">Joriy Mavjud Balans</p>
          <motion.h2
            key={currentBalance}
            initial={{ scale: 0.96, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 tabular-nums ${
              currentBalance >= 0 ? 'text-white' : 'text-rose-400'
            }`}
          >
            {formatUZS(currentBalance)}
          </motion.h2>
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
            <span>Ega: <strong className="text-slate-200 font-medium">{user.fullName}</strong></span>
            <span>·</span>
            <span className="font-mono text-slate-400">{user.age} yosh</span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="relative z-10 grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/80">
          <button
            onClick={onOpenTopUp}
            className="w-full py-2.5 px-3 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-emerald-500/10 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Pul Tushirish</span>
          </button>

          <button
            onClick={onOpenAddExpense}
            className="w-full py-2.5 px-3 bg-rose-500/90 hover:bg-rose-500 active:scale-[0.98] text-white font-bold text-xs rounded-xl shadow-md shadow-rose-500/10 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Xarajat Yozish</span>
          </button>
        </div>
      </div>

      {/* 3 Metric Summary KPI Cards: 7 columns */}
      <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Jami Kirim */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">Jami Kirimlar</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-emerald-400 tabular-nums">
              +{formatUZS(totalIncome)}
            </p>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            Stipendiya, o'tkazma va to'ldirilgan summalar
          </p>
        </div>

        {/* Card 2: Jami Xarajat */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">Jami Xarajatlar</span>
              <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-rose-400 tabular-nums">
              -{formatUZS(totalExpense)}
            </p>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Oylik me'yor</span>
              <span className="tabular-nums">{budgetPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isOverBudget ? 'bg-rose-500' : budgetPercent > 75 ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
                style={{ width: `${Math.min(budgetPercent, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Kunlik O'rtacha Sarf */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">Kunlik O'rtacha</span>
              <button
                onClick={onOpenBudgetModal}
                className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center hover:bg-sky-500/20 transition-colors"
                title="Limitni o'zgartirish"
              >
                <Target className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-white tabular-nums">
              {formatUZS(dailyAverage)}
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <span>Oylik reja:</span>
            <button
              onClick={onOpenBudgetModal}
              className="text-slate-300 hover:text-emerald-400 font-mono underline underline-offset-2 tabular-nums transition-colors"
            >
              {formatCompactUZS(user.monthlyBudget)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
