import React, { useState } from 'react';
import { Transaction } from '../types';
import { EXPENSE_CATEGORIES } from '../data/categories';
import { formatDateUz, formatUZS } from '../utils/formatters';
import {
  Search,
  Filter,
  Download,
  Trash2,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Layers,
  GraduationCap,
  Utensils,
  Car,
  Home,
  Laptop,
  Shirt,
  Film,
  HeartPulse,
  CreditCard,
  Plus,
} from 'lucide-react';

interface TransactionsTableProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  onExportPDF: () => void;
  onOpenAddExpense: () => void;
  onOpenTopUp: () => void;
}

const ICONS_MAP: Record<string, React.ReactNode> = {
  GraduationCap: <GraduationCap className="w-3.5 h-3.5" />,
  Utensils: <Utensils className="w-3.5 h-3.5" />,
  Car: <Car className="w-3.5 h-3.5" />,
  Home: <Home className="w-3.5 h-3.5" />,
  Laptop: <Laptop className="w-3.5 h-3.5" />,
  Shirt: <Shirt className="w-3.5 h-3.5" />,
  Film: <Film className="w-3.5 h-3.5" />,
  HeartPulse: <HeartPulse className="w-3.5 h-3.5" />,
};

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  onDeleteTransaction,
  onExportPDF,
  onOpenAddExpense,
  onOpenTopUp,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'expense' | 'income'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filtered = transactions.filter((tx) => {
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchDesc = tx.description.toLowerCase().includes(q);
      const matchCat = tx.categoryName.toLowerCase().includes(q);
      const matchMethod = tx.paymentMethod.toLowerCase().includes(q);
      if (!matchDesc && !matchCat && !matchMethod) return false;
    }

    // Type filter
    if (filterType !== 'all' && tx.type !== filterType) {
      return false;
    }

    // Category filter
    if (selectedCategory !== 'all' && tx.categoryId !== selectedCategory) {
      return false;
    }

    return true;
  });

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
      {/* Top Header & Search / Actions */}
      <div className="p-5 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            Tranzaksiyalar va Xarajatlar Reestri
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Barcha kirim va kundalik chiqimlarning to'liq ro'yxati ({filtered.length} ta yozuv)
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* PDF Download Button */}
          <button
            onClick={onExportPDF}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>PDF Hisobot</span>
          </button>

          {/* Quick Expense button */}
          <button
            onClick={onOpenAddExpense}
            className="px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 active:scale-95 text-xs font-bold text-white flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Xarajat</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-950/40 border-b border-slate-800/80 flex flex-col sm:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Qidiruv (nomi, kategoriya, karta)..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Type Segmented Filter (buttons) */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg w-full sm:w-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              filterType === 'all'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Barchasi
          </button>
          <button
            onClick={() => setFilterType('expense')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              filterType === 'expense'
                ? 'bg-rose-500 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Chiqimlar
          </button>
          <button
            onClick={() => setFilterType('income')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              filterType === 'income'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Kirimlar
          </button>
        </div>

        {/* Category Dropdown Filter */}
        <div className="w-full sm:w-auto sm:ml-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="all">Barcha kategoriyalar</option>
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table view */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 mx-auto mb-3">
            <Filter className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-white">Hech qanday tranzaksiya topilmadi</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Qidiruv mezonlarini o'zgartirib ko'ring yoki yangi kundalik xarajatni qayd eting.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <button
              onClick={onOpenAddExpense}
              className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-xs font-bold text-white rounded-lg transition-colors cursor-pointer"
            >
              Xarajat yozish
            </button>
            <button
              onClick={onOpenTopUp}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-xs font-bold text-slate-950 rounded-lg transition-colors cursor-pointer"
            >
              Hisob to'ldirish
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-950/20">
                <th className="py-3 px-4">Sana va vaqt</th>
                <th className="py-3 px-4">Kategoriya</th>
                <th className="py-3 px-4">Tavsif (Izoh)</th>
                <th className="py-3 px-4">To'lov usuli</th>
                <th className="py-3 px-4 text-right">Miqdor (so'm)</th>
                <th className="py-3 px-4 text-center w-12">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
              {filtered.map((tx) => {
                const isIncome = tx.type === 'income';

                return (
                  <tr
                    key={tx.id}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Date / Time */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-200">
                          {formatDateUz(tx.date)}
                        </span>
                        <span className="text-slate-500 font-mono text-[11px]">
                          {tx.time}
                        </span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                          style={{
                            backgroundColor: `${tx.categoryColor || '#10b981'}20`,
                            color: tx.categoryColor || '#10b981',
                          }}
                        >
                          {ICONS_MAP[tx.categoryIcon] || (
                            isIncome ? <CreditCard className="w-3.5 h-3.5" /> : <Layers className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <span className="font-semibold text-white">
                          {tx.categoryName}
                        </span>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="py-3.5 px-4 max-w-xs truncate text-slate-300 font-medium">
                      {tx.description}
                    </td>

                    {/* Payment Method (Unboxed metadata style) */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-400 font-medium">
                      <span>{tx.paymentMethod}</span>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono tabular-nums">
                      <span
                        className={`font-bold ${
                          isIncome ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {isIncome ? '+' : '-'}
                        {formatUZS(tx.amount)}
                      </span>
                    </td>

                    {/* Delete action */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => onDeleteTransaction(tx.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
                        title="O'chirish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
