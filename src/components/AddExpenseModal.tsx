import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EXPENSE_CATEGORIES } from '../data/categories';
import { Transaction } from '../types';
import { formatUZS, getCurrentTimeString, getTodayDateString } from '../utils/formatters';
import {
  X,
  PlusCircle,
  GraduationCap,
  Utensils,
  Car,
  Home,
  Laptop,
  Shirt,
  Film,
  HeartPulse,
  CreditCard,
  Calendar,
  AlertTriangle,
} from 'lucide-react';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExpense: (tx: Transaction) => void;
  currentBalance: number;
}

const ICONS_MAP: Record<string, React.ReactNode> = {
  GraduationCap: <GraduationCap className="w-4 h-4" />,
  Utensils: <Utensils className="w-4 h-4" />,
  Car: <Car className="w-4 h-4" />,
  Home: <Home className="w-4 h-4" />,
  Laptop: <Laptop className="w-4 h-4" />,
  Shirt: <Shirt className="w-4 h-4" />,
  Film: <Film className="w-4 h-4" />,
  HeartPulse: <HeartPulse className="w-4 h-4" />,
};

const PAYMENT_OPTIONS = ['Uzcard', 'Humo', 'Payme', 'Click', 'Naqd'] as const;

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  onAddExpense,
  currentBalance,
}) => {
  const [amount, setAmount] = useState<number>(35000);
  const [customInput, setCustomInput] = useState<string>('35000');
  const [categoryId, setCategoryId] = useState<string>(EXPENSE_CATEGORIES[1].id); // food default
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>(getTodayDateString());
  const [time, setTime] = useState<string>(getCurrentTimeString());
  const [paymentMethod, setPaymentMethod] = useState<'Uzcard' | 'Humo' | 'Payme' | 'Click' | 'Naqd'>('Uzcard');
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const selectedCategory = EXPENSE_CATEGORIES.find((c) => c.id === categoryId) || EXPENSE_CATEGORIES[0];

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    const num = parseInt(raw || '0', 10);
    setAmount(num);
    setCustomInput(raw);
  };

  const handleQuickAmount = (val: number) => {
    setAmount(val);
    setCustomInput(val.toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (amount <= 0) {
      setErrorMsg("Iltimos, to'g'ri xarajat miqdorini kiriting.");
      return;
    }

    const tx: Transaction = {
      id: 'exp-' + Date.now(),
      type: 'expense',
      amount: amount,
      categoryId: selectedCategory.id,
      categoryName: selectedCategory.name,
      categoryIcon: selectedCategory.iconName,
      categoryColor: selectedCategory.color,
      date: date || getTodayDateString(),
      time: time || getCurrentTimeString(),
      description: description.trim() || `${selectedCategory.name} xarajati`,
      paymentMethod: paymentMethod,
      createdAt: Date.now(),
    };

    onAddExpense(tx);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Yangi Xarajat Qayd Etish</h3>
                <p className="text-xs text-slate-400">Kundalik sarf-xarajatlarni kiritish va tahlilga qo'shish</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {errorMsg && (
            <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}

          {amount > currentBalance && (
            <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>
                Diqqat: Xarajat miqdori mavjud balansingizdan ({formatUZS(currentBalance)}) yuqori!
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Amount input */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Xarajat miqdori (so'm)
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={customInput}
                  onChange={handleAmountChange}
                  placeholder="0"
                  className="w-full pl-4 pr-16 py-3 bg-slate-950/80 border border-slate-700 rounded-xl text-lg font-bold text-rose-400 tabular-nums focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 uppercase">
                  so'm
                </span>
              </div>
            </div>

            {/* Quick buttons */}
            <div className="flex flex-wrap gap-1.5">
              {[15000, 30000, 50000, 100000, 250000].map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => handleQuickAmount(val)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium tabular-nums transition-colors ${
                    amount === val
                      ? 'bg-rose-500 text-white font-semibold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {formatUZS(val).replace(" so'm", '')}
                </button>
              ))}
            </div>

            {/* Categories Grid */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Kategoriya tanlang
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {EXPENSE_CATEGORIES.map((cat) => {
                  const isSelected = categoryId === cat.id;
                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setCategoryId(cat.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-slate-800 border-rose-500 ring-1 ring-rose-500/50'
                          : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-400'
                      }`}
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center mb-1.5"
                        style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                      >
                        {ICONS_MAP[cat.iconName] || <CreditCard className="w-4 h-4" />}
                      </div>
                      <span className={`text-xs font-semibold truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {cat.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Xarajat tavsifi (izoh)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Masalan: Tushlik va choy, yoki Yandex Go taksi"
                className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
              />
            </div>

            {/* Date & Payment Method Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Sana va vaqt
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-2/3 px-2.5 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-1/3 px-2.5 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  To'lov manbasi
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-rose-500 cursor-pointer"
                >
                  {PAYMENT_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="bg-slate-900 text-white">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-rose-500 hover:bg-rose-600 active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{formatUZS(amount)} Xarajatni Saqlash</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
