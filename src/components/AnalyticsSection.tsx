import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Transaction } from '../types';
import { EXPENSE_CATEGORIES } from '../data/categories';
import { formatUZS, formatCompactUZS } from '../utils/formatters';
import {
  PieChart,
  BarChart3,
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
  Info,
  TrendingUp,
} from 'lucide-react';

interface AnalyticsSectionProps {
  transactions: Transaction[];
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

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ transactions }) => {
  const [activeTab, setActiveTab] = useState<'category' | 'daily'>('category');
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const expenseTx = transactions.filter((t) => t.type === 'expense');
  const totalExpense = expenseTx.reduce((sum, t) => sum + t.amount, 0);

  // Group by category
  const categoryMap = new Map<string, { total: number; count: number; name: string; color: string; icon: string }>();

  EXPENSE_CATEGORIES.forEach((cat) => {
    categoryMap.set(cat.id, {
      total: 0,
      count: 0,
      name: cat.name,
      color: cat.color,
      icon: cat.iconName,
    });
  });

  expenseTx.forEach((tx) => {
    const existing = categoryMap.get(tx.categoryId);
    if (existing) {
      existing.total += tx.amount;
      existing.count += 1;
    } else {
      categoryMap.set(tx.categoryId, {
        total: tx.amount,
        count: 1,
        name: tx.categoryName,
        color: tx.categoryColor || '#94a3b8',
        icon: tx.categoryIcon || 'Layers',
      });
    }
  });

  const categoryData = Array.from(categoryMap.entries())
    .map(([id, data]) => ({
      id,
      ...data,
      percent: totalExpense > 0 ? (data.total / totalExpense) * 100 : 0,
    }))
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total);

  // Group by Day for daily timeline
  const dailyMap = new Map<string, number>();
  // Prepopulate last 10 days
  for (let i = 9; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    dailyMap.set(key, 0);
  }

  expenseTx.forEach((tx) => {
    if (dailyMap.has(tx.date)) {
      dailyMap.set(tx.date, (dailyMap.get(tx.date) || 0) + tx.amount);
    } else {
      dailyMap.set(tx.date, tx.amount);
    }
  });

  const dailyData = Array.from(dailyMap.entries())
    .map(([date, amount]) => {
      const d = new Date(date);
      const label = `${d.getDate()}-${['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'][d.getMonth()]}`;
      return { date, label, amount };
    })
    .slice(-10);

  const maxDailyExpense = Math.max(...dailyData.map((d) => d.amount), 1);

  // Top Category
  const topCategory = categoryData[0];

  // Calculate SVG Donut parameters
  let cumulativeAngle = 0;
  const radius = 60;
  const strokeWidth = 22;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="space-y-6">
      {/* Section Header with Segmented Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Xarajatlar Tahlili va Monitoringi
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Kundalik xarajatlarning turlari, tuzilishi va dinamikasi
          </p>
        </div>

        {/* Segmented Controls (functional filter buttons) */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('category')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'category'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Kategoriyalar bo'yicha</span>
          </button>
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'daily'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Kunlik Dinamika</span>
          </button>
        </div>
      </div>

      {activeTab === 'category' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Donut Chart Visual: 5 columns */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center relative min-h-[340px]">
            <h4 className="text-xs font-semibold text-slate-400 self-start uppercase tracking-wider mb-2">
              Kategoriya Ulushi Diagrammasi
            </h4>

            {categoryData.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-xs text-slate-500">Hozircha xarajat qayd etilmagan.</p>
              </div>
            ) : (
              <div className="relative flex items-center justify-center my-4">
                <svg width="220" height="220" viewBox="0 0 160 160" className="transform -rotate-90">
                  {/* Background Track */}
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="transparent"
                    stroke="#1e293b"
                    strokeWidth={strokeWidth}
                  />

                  {/* Arcs */}
                  {categoryData.map((cat) => {
                    const strokeDasharray = `${(cat.percent / 100) * circumference} ${circumference}`;
                    const strokeDashoffset = -cumulativeAngle;
                    cumulativeAngle += (cat.percent / 100) * circumference;

                    const isHovered = hoveredCategory === cat.id;

                    return (
                      <circle
                        key={cat.id}
                        cx="80"
                        cy="80"
                        r={radius}
                        fill="transparent"
                        stroke={cat.color}
                        strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-300 cursor-pointer"
                        onMouseEnter={() => setHoveredCategory(cat.id)}
                        onMouseLeave={() => setHoveredCategory(null)}
                      />
                    );
                  })}
                </svg>

                {/* Center Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  {hoveredCategory ? (
                    (() => {
                      const item = categoryData.find((c) => c.id === hoveredCategory);
                      if (!item) return null;
                      return (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                          <span className="text-[11px] text-slate-400 block truncate max-w-[110px]">{item.name}</span>
                          <span className="text-lg font-bold text-white tabular-nums">{item.percent.toFixed(1)}%</span>
                          <span className="text-[10px] text-emerald-400 block font-mono">{formatCompactUZS(item.total)}</span>
                        </motion.div>
                      );
                    })()
                  ) : (
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Jami Chiqim</span>
                      <span className="text-lg font-extrabold text-white block tabular-nums">{formatCompactUZS(totalExpense)}</span>
                      <span className="text-[10px] text-slate-400">{expenseTx.length} ta xarajat</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Summary Pill text */}
            {topCategory && (
              <div className="w-full mt-auto pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Eng katta xarajat sohasi:</span>
                <span className="font-semibold text-white flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: topCategory.color }} />
                  {topCategory.name}
                </span>
              </div>
            )}
          </div>

          {/* Categorized List & Progress Bars: 7 columns */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Kategoriyalar bo'yicha Taqsimot
                </h4>
                <span className="text-xs text-slate-400">
                  {categoryData.length} ta faol kategoriya
                </span>
              </div>

              <div className="space-y-3.5">
                {categoryData.map((cat) => {
                  const isHovered = hoveredCategory === cat.id;
                  return (
                    <div
                      key={cat.id}
                      onMouseEnter={() => setHoveredCategory(cat.id)}
                      onMouseLeave={() => setHoveredCategory(null)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        isHovered
                          ? 'bg-slate-800/90 border-slate-700'
                          : 'bg-slate-950/40 border-slate-800/60 hover:border-slate-700/80'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                          >
                            {ICONS_MAP[cat.icon] || <Layers className="w-4 h-4" />}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">{cat.name}</span>
                            <span className="text-[11px] text-slate-400">{cat.count} ta to'lov</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-bold text-white tabular-nums block">
                            {formatUZS(cat.total)}
                          </span>
                          <span className="text-[11px] font-mono font-medium text-emerald-400 tabular-nums">
                            {cat.percent.toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      {/* Bar indicator */}
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${cat.percent}%`,
                            backgroundColor: cat.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Smart student budget tips */}
            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-400">
              <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p>
                <strong className="text-slate-200">Moliyaviy tavsiya:</strong> Talabalar byudjetida ta'lim va oziq-ovqat xarajatlari jami daromadning 50-60% idan oshmasligi moliyaviy barqarorlikni ta'minlaydi.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Daily Timeline Spending Bar Chart */
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Oxirgi 10 Kunlik Xarajatlar Grafigi
              </h4>
              <p className="text-xs text-slate-400 mt-1">Har bir kunda sarflangan mablag' miqdori (so'mda)</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Eng yuqori kunlik sarf:</span>
              <span className="text-xs font-bold text-rose-400 block tabular-nums">
                {formatUZS(maxDailyExpense)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-10 gap-2 sm:gap-4 items-end h-56 pt-8 pb-4 border-b border-slate-800">
            {dailyData.map((item, idx) => {
              const heightPercent = maxDailyExpense > 0 ? (item.amount / maxDailyExpense) * 100 : 0;
              const isToday = idx === dailyData.length - 1;

              return (
                <div key={item.date} className="flex flex-col items-center h-full justify-end group relative">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 border border-slate-700 text-white text-[10px] py-1 px-2 rounded-lg whitespace-nowrap pointer-events-none z-20 shadow-lg tabular-nums">
                    {formatUZS(item.amount)}
                  </div>

                  {/* Bar */}
                  <div className="w-full max-w-[36px] bg-slate-800/70 rounded-t-lg overflow-hidden flex flex-col justify-end h-full">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(heightPercent, 4)}%` }}
                      transition={{ duration: 0.5, delay: idx * 0.04 }}
                      className={`w-full rounded-t-lg transition-all ${
                        isToday
                          ? 'bg-gradient-to-t from-emerald-500 to-teal-400 shadow-md shadow-emerald-500/20'
                          : item.amount > 0
                          ? 'bg-slate-700 group-hover:bg-rose-400'
                          : 'bg-slate-800/40'
                      }`}
                    />
                  </div>

                  {/* Day label */}
                  <span className={`text-[10px] mt-2 block font-medium tabular-nums ${isToday ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 mt-4">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
                Bugungi kun
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-slate-700 inline-block" />
                O'tgan kunlar
              </span>
            </div>
            <span>Hisob-kitoblar avtomatik yangilanadi</span>
          </div>
        </div>
      )}
    </div>
  );
};
