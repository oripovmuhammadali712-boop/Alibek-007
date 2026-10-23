import React from 'react';
import { motion } from 'motion/react';
import { PersonalCard } from '../types';
import { formatUZS } from '../utils/formatters';
import { CreditCard, Plus, ArrowUpRight, ShieldCheck } from 'lucide-react';

interface PersonalCardsStripProps {
  cards: PersonalCard[];
  onOpenTopUpForCard: (cardId: string) => void;
  onOpenAddNewCard: () => void;
}

export const PersonalCardsStrip: React.FC<PersonalCardsStripProps> = ({
  cards,
  onOpenTopUpForCard,
  onOpenAddNewCard,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <span>Mening Shaxsiy Bank Kartalarim</span>
          </h3>
          <p className="text-xs text-slate-400">
            Mablag' tushirish uchun ulangan shaxsiy Uzcard, Humo va xalqaro kartalar
          </p>
        </div>

        <button
          onClick={onOpenAddNewCard}
          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Yangi karta ulash</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => {
          const last4 = card.cardNumber.slice(-4);

          return (
            <motion.div
              key={card.id}
              whileHover={{ y: -2 }}
              className={`p-4 rounded-2xl bg-gradient-to-br ${card.colorTheme} border border-slate-800/80 shadow-md flex flex-col justify-between relative overflow-hidden group`}
            >
              {/* Card top */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    {card.bankName}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Shaxsiy karta</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-white/10 text-[11px] font-bold font-mono tracking-wider text-slate-200">
                  {card.cardType}
                </span>
              </div>

              {/* Number */}
              <div className="my-3">
                <span className="font-mono text-sm tracking-widest text-slate-300 font-medium">
                  •••• •••• •••• {last4}
                </span>
              </div>

              {/* Bottom with balance and quick topup button */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Mavjud Mablag'</span>
                  <span className="text-xs font-bold text-emerald-400 font-mono tabular-nums">
                    {formatUZS(card.balance)}
                  </span>
                </div>

                <button
                  onClick={() => onOpenTopUpForCard(card.id)}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] flex items-center gap-1 transition-all shadow-sm cursor-pointer"
                  title="Ushbu kartadan hisobga pul o'tkazish"
                >
                  <span>Pul o'tkazish</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
