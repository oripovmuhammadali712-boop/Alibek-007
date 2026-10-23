import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { formatUZS } from '../utils/formatters';
import { Target, X, Check, ArrowRight } from 'lucide-react';

interface BudgetLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBudget: number;
  onSave: (newBudget: number) => void;
}

const PRESET_BUDGETS = [2000000, 3000000, 4500000, 6000000, 8000000];

export const BudgetLimitModal: React.FC<BudgetLimitModalProps> = ({
  isOpen,
  onClose,
  currentBudget,
  onSave,
}) => {
  const [amount, setAmount] = useState<number>(currentBudget || 3500000);
  const [customInput, setCustomInput] = useState<string>((currentBudget || 3500000).toString());

  if (!isOpen) return null;

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    const num = parseInt(raw || '0', 10);
    setAmount(num);
    setCustomInput(raw);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount > 0) {
      onSave(amount);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Oylik Xarajat Limiti</h3>
                <p className="text-xs text-slate-400">Byudjet rejasini belgilash</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Rejalashtirilgan oylik byudjet (so'm)
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={customInput}
                  onChange={handleCustomChange}
                  className="w-full pl-4 pr-16 py-3 bg-slate-950 border border-slate-700 rounded-xl text-lg font-bold text-sky-400 tabular-nums focus:outline-none focus:border-sky-500"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 uppercase">
                  so'm
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {PRESET_BUDGETS.map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => {
                    setAmount(val);
                    setCustomInput(val.toString());
                  }}
                  className={`py-2 px-2 rounded-lg text-xs font-medium tabular-nums transition-colors ${
                    amount === val
                      ? 'bg-sky-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {formatUZS(val).replace(" so'm", '')}
                </button>
              ))}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Limitni Saqlash ({formatUZS(amount)})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
