import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { PersonalCard, Transaction, UserProfile } from '../types';
import { formatUZS, getCurrentTimeString, getTodayDateString } from '../utils/formatters';
import {
  CreditCard,
  Wallet,
  ArrowRight,
  CheckCircle2,
  X,
  ShieldCheck,
  Plus,
  AlertCircle,
  KeyRound,
  Building2,
  RefreshCw,
} from 'lucide-react';

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newTx: Transaction, updatedCards: PersonalCard[]) => void;
  cards: PersonalCard[];
  onAddNewCard: (card: PersonalCard) => void;
  user: UserProfile;
}

const PRESET_AMOUNTS = [100000, 300000, 500000, 1000000, 2000000];

const BANK_OPTIONS = [
  'Kapitalbank',
  'Milliy Bank (NBU)',
  "Ipak Yo'li Bank",
  'SQB (O\'zsanoatqurilishbank)',
  'Hamkorbank',
  'Agrobank',
  'TBC Bank',
  'Anorbank',
  'Uzum Bank',
  'Xalq Banki',
];

export const TopUpModal: React.FC<TopUpModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  cards,
  onAddNewCard,
  user,
}) => {
  // Step: 'select' | 'sms_verify' | 'add_card' | 'success'
  const [step, setStep] = useState<'select' | 'sms_verify' | 'add_card' | 'success'>('select');
  const [selectedCardId, setSelectedCardId] = useState<string>(cards[0]?.id || '');
  const [amount, setAmount] = useState<number>(500000);
  const [customInput, setCustomInput] = useState<string>('500000');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // SMS Verification State
  const [generatedOtp, setGeneratedOtp] = useState<string>('742195');
  const [otpInput, setOtpInput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // New Card Form State
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardHolder, setNewCardHolder] = useState(user.fullName.toUpperCase());
  const [newExpiry, setNewExpiry] = useState('08/29');
  const [newBank, setNewBank] = useState(BANK_OPTIONS[0]);
  const [newInitialBalance, setNewInitialBalance] = useState('3000000');

  if (!isOpen) return null;

  const selectedCard = cards.find((c) => c.id === selectedCardId) || cards[0];

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    const num = parseInt(raw || '0', 10);
    setAmount(num);
    setCustomInput(raw);
    setErrorMsg('');
  };

  const handlePresetClick = (val: number) => {
    setAmount(val);
    setCustomInput(val.toString());
    setErrorMsg('');
  };

  // Move to SMS verification step
  const handleProceedToOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedCard) {
      setErrorMsg("Iltimos, mablag' yechib olinadigan shaxsiy kartangizni tanlang.");
      return;
    }

    if (amount <= 0) {
      setErrorMsg("Iltimos, o'tkazma miqdorini kiriting.");
      return;
    }

    if (amount > selectedCard.balance) {
      setErrorMsg(
        `Tanlangan ${selectedCard.bankName} kartangizda yetarli mablag' mavjud emas! (Kartada mavjud: ${formatUZS(selectedCard.balance)})`
      );
      return;
    }

    // Generate random 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpInput('');
    setStep('sms_verify');
  };

  // Verify OTP and complete transfer
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput.trim() !== generatedOtp) {
      setErrorMsg("Kiritilgan SMS tasdiqlash kodi noto'g'ri! Qaytadan urinib ko'ring.");
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');

      // Trigger Confetti
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#10b981', '#38bdf8', '#fbbf24', '#ffffff'],
        });
      } catch (e) {
        console.error(e);
      }

      // Deduct from personal card balance
      const updatedCards = cards.map((c) => {
        if (c.id === selectedCard.id) {
          return {
            ...c,
            balance: Math.max(0, c.balance - amount),
          };
        }
        return c;
      });

      // Create transaction
      const last4 = selectedCard.cardNumber.slice(-4);
      const tx: Transaction = {
        id: 'tx-' + Date.now(),
        type: 'income',
        amount: amount,
        categoryId: 'topup',
        categoryName: "Hisob to'ldirish",
        categoryIcon: 'CreditCard',
        categoryColor: '#10b981',
        date: getTodayDateString(),
        time: getCurrentTimeString(),
        description: `Shaxsiy ${selectedCard.bankName} (${selectedCard.cardType} ••${last4}) kartasidan tushirildi`,
        paymentMethod: `${selectedCard.cardType} ••${last4}`,
        sourceCardId: selectedCard.id,
        createdAt: Date.now(),
      };

      setTimeout(() => {
        onSuccess(tx, updatedCards);
        handleResetModal();
        onClose();
      }, 1400);
    }, 800);
  };

  // Add a new personal card
  const handleAddNewCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardNumber.trim() || newCardNumber.replace(/\s/g, '').length < 16) {
      setErrorMsg("Iltimos, 16 xonali karta raqamini to'liq kiriting.");
      return;
    }

    const cleanNum = newCardNumber.replace(/\s/g, '');
    let cType: 'Uzcard' | 'Humo' | 'Visa' | 'Mastercard' = 'Uzcard';
    if (cleanNum.startsWith('9860')) cType = 'Humo';
    else if (cleanNum.startsWith('4')) cType = 'Visa';
    else if (cleanNum.startsWith('5')) cType = 'Mastercard';

    const formatted = cleanNum.replace(/(\d{4})(?=\d)/g, '$1 ');

    const newCard: PersonalCard = {
      id: 'card-' + Date.now(),
      cardNumber: formatted,
      cardHolder: (newCardHolder || user.fullName).toUpperCase(),
      expiryDate: newExpiry || '08/29',
      cardType: cType,
      bankName: newBank,
      balance: parseInt(newInitialBalance.replace(/\D/g, '') || '2000000', 10),
      colorTheme:
        cType === 'Humo'
          ? 'from-sky-950 via-slate-900 to-black'
          : cType === 'Visa'
          ? 'from-indigo-950 via-slate-900 to-black'
          : 'from-emerald-950 via-slate-900 to-black',
      isDefault: false,
    };

    onAddNewCard(newCard);
    setSelectedCardId(newCard.id);
    setStep('select');
    setErrorMsg('');
  };

  const handleResetModal = () => {
    setStep('select');
    setErrorMsg('');
    setIsProcessing(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 my-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Shaxsiy Kartadan Pul Tushirish
                </h3>
                <p className="text-xs text-slate-400">
                  O'zingizga tegishli bank kartasidan Sarmoya balansiga o'tkazma
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                handleResetModal();
                onClose();
              }}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {errorMsg && (
            <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: SELECT CARD & AMOUNT */}
          {step === 'select' && (
            <div className="mt-5 space-y-5">
              {/* Active Card Preview Visual */}
              {selectedCard && (
                <div
                  className={`p-5 rounded-2xl bg-gradient-to-br ${selectedCard.colorTheme} border border-slate-700/80 shadow-lg relative overflow-hidden text-white`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        {selectedCard.bankName}
                      </span>
                      <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Shaxsiy karta tasdiqlangan</span>
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-white/10 text-xs font-bold font-mono tracking-wider">
                      {selectedCard.cardType}
                    </span>
                  </div>

                  {/* Card Number */}
                  <div className="my-5">
                    <p className="font-mono text-lg tracking-[0.2em] font-medium text-slate-100">
                      {selectedCard.cardNumber}
                    </p>
                  </div>

                  {/* Cardholder & Balance */}
                  <div className="flex items-end justify-between pt-2 border-t border-white/10 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Karta Egasi</span>
                      <span className="font-semibold text-slate-200">{selectedCard.cardHolder}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase">Kartadagi Mablag'</span>
                      <span className="font-bold text-emerald-400 font-mono text-sm tabular-nums">
                        {formatUZS(selectedCard.balance)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Cards List Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-slate-300">
                    O'zingizning kartangizni tanlang ({cards.length} ta karta):
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMsg('');
                      setStep('add_card');
                    }}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Yangi karta ulash</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {cards.map((card) => {
                    const isSelected = card.id === selectedCard?.id;
                    const last4 = card.cardNumber.slice(-4);
                    return (
                      <button
                        type="button"
                        key={card.id}
                        onClick={() => {
                          setSelectedCardId(card.id);
                          setErrorMsg('');
                        }}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-800 border-emerald-500 ring-1 ring-emerald-500/50'
                            : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-bold text-white truncate max-w-[80px]">
                            {card.cardType}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">••{last4}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate">{card.bankName}</p>
                        <p className="text-xs font-bold text-emerald-400 font-mono mt-1 tabular-nums">
                          {formatUZS(card.balance)}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Kartadan o'tkaziladigan summa (so'm)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={customInput}
                    onChange={handleAmountChange}
                    placeholder="0"
                    className="w-full pl-4 pr-16 py-3 bg-slate-950/80 border border-slate-700 rounded-xl text-lg font-bold text-emerald-400 tabular-nums focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 uppercase">
                    so'm
                  </span>
                </div>
              </div>

              {/* Preset Buttons */}
              <div className="flex flex-wrap gap-2">
                {PRESET_AMOUNTS.map((val) => (
                  <button
                    type="button"
                    key={val}
                    onClick={() => handlePresetClick(val)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-medium tabular-nums transition-all ${
                      amount === val
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    +{formatUZS(val).replace(" so'm", '')}
                  </button>
                ))}
              </div>

              {/* CTA */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleProceedToOtp}
                  disabled={amount <= 0 || !selectedCard || amount > selectedCard.balance}
                  className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{formatUZS(amount)} Kartadan O'tkazish</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SMS OTP VERIFICATION */}
          {step === 'sms_verify' && (
            <form onSubmit={handleVerifyOtp} className="mt-5 space-y-5">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">
                  Bank Xavfsizlik Tasdig'i (SMS Kod)
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {selectedCard?.bankName} ({selectedCard?.cardType} ••{selectedCard?.cardNumber.slice(-4)}) kartangizdan <strong>{formatUZS(amount)}</strong> yechib olish uchun SMS kod yuborildi.
                </p>

                {/* Simulated SMS notification display */}
                <div className="mt-4 p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 inline-flex items-center gap-2 text-xs text-emerald-300">
                  <span>SMS Kod namunasi:</span>
                  <strong className="font-mono text-sm tracking-wider text-white">
                    {generatedOtp}
                  </strong>
                  <button
                    type="button"
                    onClick={() => setOtpInput(generatedOtp)}
                    className="ml-2 underline text-[11px] text-emerald-400 hover:text-white"
                  >
                    Kodni kiritish
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 text-center">
                  6 xonali SMS kodni kiriting
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • • • •"
                  className="w-full text-center py-3 bg-slate-950 border border-slate-700 rounded-xl text-2xl font-mono tracking-[0.4em] text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('select')}
                  className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-colors"
                >
                  Orqaga
                </button>
                <button
                  type="submit"
                  disabled={isProcessing || otpInput.length < 6}
                  className="flex-1 py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Tasdiqlanmoqda...</span>
                  ) : (
                    <>
                      <span>To'lovni Tasdiqlash</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: ADD NEW PERSONAL CARD */}
          {step === 'add_card' && (
            <form onSubmit={handleAddNewCardSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  16 xonali Karta Raqami
                </label>
                <input
                  type="text"
                  required
                  placeholder="8600 0000 0000 0000"
                  maxLength={19}
                  value={newCardNumber}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
                    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
                    setNewCardNumber(formatted);
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  8600 (Uzcard), 9860 (Humo), yoki 4... (Visa) bilan boshlanadi
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Amal qilish muddati
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="08/29"
                    maxLength={5}
                    value={newExpiry}
                    onChange={(e) => setNewExpiry(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Bank
                  </label>
                  <select
                    value={newBank}
                    onChange={(e) => setNewBank(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {BANK_OPTIONS.map((b) => (
                      <option key={b} value={b} className="bg-slate-900 text-white">
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Karta Egasi (F.I.SH)
                </label>
                <input
                  type="text"
                  required
                  value={newCardHolder}
                  onChange={(e) => setNewCardHolder(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white uppercase focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Ushbu shaxsiy kartangizdagi dastlabki mablag' (so'm)
                </label>
                <input
                  type="text"
                  required
                  value={newInitialBalance}
                  onChange={(e) => setNewInitialBalance(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('select')}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20"
                >
                  Kartani Saqlash
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 'success' && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-12 text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-white mb-1">
                Shaxsiy kartangizdan o'tkazildi!
              </h4>
              <p className="text-base text-emerald-400 font-bold tabular-nums">
                +{formatUZS(amount)}
              </p>
              <p className="text-xs text-slate-400 mt-2">
                {selectedCard?.bankName} ({selectedCard?.cardType} ••{selectedCard?.cardNumber.slice(-4)}) kartangizdan mablag' yechildi va Sarmoya hisobingizga tushirildi.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
