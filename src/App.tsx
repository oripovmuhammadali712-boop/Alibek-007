import React, { useState, useEffect } from 'react';
import { UserProfile, Transaction, PersonalCard } from './types';
import { INITIAL_USER, INITIAL_TRANSACTIONS, INITIAL_CARDS } from './data/mockData';
import { TopBar } from './components/TopBar';
import { MetricCards } from './components/MetricCards';
import { PersonalCardsStrip } from './components/PersonalCardsStrip';
import { AnalyticsSection } from './components/AnalyticsSection';
import { TransactionsTable } from './components/TransactionsTable';
import { OnboardingModal } from './components/OnboardingModal';
import { TopUpModal } from './components/TopUpModal';
import { AddExpenseModal } from './components/AddExpenseModal';
import { ProfileModal } from './components/ProfileModal';
import { BudgetLimitModal } from './components/BudgetLimitModal';
import { generateExpensePDF } from './utils/pdfGenerator';
import { formatUZS, formatCompactUZS } from './utils/formatters';
import {
  Wallet,
  Plus,
  Download,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  Layers,
  ArrowRight,
  CreditCard,
} from 'lucide-react';

export default function App() {
  // Load User Profile from localStorage or prompt onboarding
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('sarmoya_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_USER;
  });

  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => {
    return !localStorage.getItem('sarmoya_user_profile');
  });

  // Load User's Personal Linked Bank Cards
  const [cards, setCards] = useState<PersonalCard[]>(() => {
    const saved = localStorage.getItem('sarmoya_personal_cards');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_CARDS;
  });

  // Load Transactions
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('sarmoya_transactions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_TRANSACTIONS;
  });

  // Active section view
  const [activeSection, setActiveSection] = useState<string>('overview');

  // Modals state
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('sarmoya_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('sarmoya_user_profile', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('sarmoya_personal_cards', JSON.stringify(cards));
  }, [cards]);

  // Aggregate Calculations
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = totalIncome - totalExpense;

  // Daily average spending (based on distinct days of expenses)
  const expenseDays = new Set(
    transactions.filter((t) => t.type === 'expense').map((t) => t.date)
  ).size;
  const dailyAverage = expenseDays > 0 ? Math.round(totalExpense / Math.max(expenseDays, 1)) : 0;

  // Handlers
  const handleOnboardingComplete = (newProfile: UserProfile, initialCard: PersonalCard) => {
    setUser(newProfile);
    if (initialCard) {
      setCards((prev) => [
        initialCard,
        ...prev.filter((c) => c.cardNumber !== initialCard.cardNumber),
      ]);
    }
    setIsOnboardingOpen(false);
  };


  const handleAddExpense = (tx: Transaction) => {
    setTransactions((prev) => [tx, ...prev]);
  };

  const handleTopUpSuccess = (tx: Transaction, updatedCards: PersonalCard[]) => {
    setTransactions((prev) => [tx, ...prev]);
    setCards(updatedCards);
  };

  const handleAddNewCard = (newCard: PersonalCard) => {
    setCards((prev) => [newCard, ...prev]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const handleExportPDF = () => {
    generateExpensePDF(user, transactions, "Oxirgi hisobot davri");
  };

  const handleResetAccount = () => {
    setIsProfileOpen(false);
    setIsOnboardingOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 3-Zone Navigation Top Bar */}
      <TopBar
        user={user}
        onOpenTopUp={() => setIsTopUpOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onExportPDF={handleExportPDF}
        activeSection={activeSection}
        onSelectSection={(sec) => setActiveSection(sec)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Welcome Kicker Banner with Verified 20+ Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-900/60 border border-slate-800">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Salom, {user.fullName}!
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-md">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{user.age} yosh · Tasdiqlangan</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {user.university} · Talabalar va yosh mutaxassislar moliyaviy nazorati
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setIsTopUpOpen(true)}
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Shaxsiy Kartadan Tushirish</span>
            </button>
            <button
              onClick={() => setIsExpenseOpen(true)}
              className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Xarajat Qo'shish</span>
            </button>
          </div>
        </div>

        {/* Section 1: Core Financial Metrics & Holographic Card */}
        <MetricCards
          user={user}
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          currentBalance={currentBalance}
          dailyAverage={dailyAverage}
          onOpenTopUp={() => setIsTopUpOpen(true)}
          onOpenAddExpense={() => setIsExpenseOpen(true)}
          onOpenBudgetModal={() => setIsBudgetOpen(true)}
        />

        {/* Section 2: User's Own Personal Linked Bank Cards Strip */}
        <PersonalCardsStrip
          cards={cards}
          onOpenTopUpForCard={() => setIsTopUpOpen(true)}
          onOpenAddNewCard={() => setIsTopUpOpen(true)}
        />

        {/* Section 3: Deep Category Analytics & Daily Spending Dynamics */}
        {(activeSection === 'overview' || activeSection === 'analytics') && (
          <AnalyticsSection transactions={transactions} />
        )}

        {/* Section 4: Ledger of Transactions & PDF Export */}
        {(activeSection === 'overview' || activeSection === 'history') && (
          <TransactionsTable
            transactions={transactions}
            onDeleteTransaction={handleDeleteTransaction}
            onExportPDF={handleExportPDF}
            onOpenAddExpense={() => setIsExpenseOpen(true)}
            onOpenTopUp={() => setIsTopUpOpen(true)}
          />
        )}
      </main>

      {/* Quiet, Clean Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/90 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">SARMOYA</span>
            <span>·</span>
            <span>Talaba va Yosh Mutaxassislar Shaxsiy Moliyaviy Tahlili</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsProfileOpen(true)}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Profil Sozlamalari
            </button>
            <span>·</span>
            <button
              onClick={handleExportPDF}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Hisobotni Ko'chirib Olish (PDF)
            </button>
          </div>
        </div>
      </footer>

      {/* All Interactive Modals */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={handleOnboardingComplete}
        initialProfile={user}
      />

      <TopUpModal
        isOpen={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        onSuccess={handleTopUpSuccess}
        cards={cards}
        onAddNewCard={handleAddNewCard}
        user={user}
      />

      <AddExpenseModal
        isOpen={isExpenseOpen}
        onClose={() => setIsExpenseOpen(false)}
        onAddExpense={handleAddExpense}
        currentBalance={currentBalance}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        onUpdateUser={(updated) => setUser(updated)}
        onResetAccount={handleResetAccount}
      />

      <BudgetLimitModal
        isOpen={isBudgetOpen}
        onClose={() => setIsBudgetOpen(false)}
        currentBudget={user.monthlyBudget}
        onSave={(newBudget) => setUser({ ...user, monthlyBudget: newBudget })}
      />
    </div>
  );
}

