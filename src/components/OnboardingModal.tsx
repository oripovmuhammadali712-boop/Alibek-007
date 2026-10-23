import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PersonalCard, UserProfile } from '../types';
import { POPULAR_UNIVERSITIES } from '../data/universities';
import { calculateAge, formatUZS, getTodayDateString } from '../utils/formatters';
import {
  CreditCard,
  ShieldCheck,
  ShieldAlert,
  GraduationCap,
  Mail,
  Calendar,
  Sparkles,
  Building2,
  User,
  ArrowRight,
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (profile: UserProfile, initialCard: PersonalCard) => void;
  initialProfile?: UserProfile | null;
}

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

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  initialProfile,
}) => {
  // Card Details (asked at the beginning)
  const [cardNumber, setCardNumber] = useState(
    initialProfile?.primaryCardNumber || '8600 4589 3145 6078'
  );
  const [expiryDate, setExpiryDate] = useState('08/29');
  const [bankName, setBankName] = useState(BANK_OPTIONS[0]);
  const [initialCardBalance, setInitialCardBalance] = useState('4500000');

  // Full Name on Card: Surname, Name, Patronymic (Ochestvasi)
  const [lastName, setLastName] = useState(initialProfile?.lastName || 'Oripov');
  const [firstName, setFirstName] = useState(initialProfile?.firstName || 'Muhammadali');
  const [middleName, setMiddleName] = useState(
    initialProfile?.middleName || "Alisher o'g'li"
  );

  // University & Education
  const [university, setUniversity] = useState(
    initialProfile?.university || POPULAR_UNIVERSITIES[0].name
  );
  const [isCustomUniversity, setIsCustomUniversity] = useState(false);
  const [customUniversity, setCustomUniversity] = useState('');

  // Email & Age (20+ requirement)
  const [email, setEmail] = useState(initialProfile?.email || 'oripovmuhammadali712@gmail.com');
  const [birthDate, setBirthDate] = useState(initialProfile?.birthDate || '2004-03-15');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const currentAge = calculateAge(birthDate);
  const isEligible = currentAge >= 20;

  // Detect card type
  const cleanCardNum = cardNumber.replace(/\s/g, '');
  let detectedCardType: 'Uzcard' | 'Humo' | 'Visa' | 'Mastercard' = 'Uzcard';
  if (cleanCardNum.startsWith('9860')) detectedCardType = 'Humo';
  else if (cleanCardNum.startsWith('4')) detectedCardType = 'Visa';
  else if (cleanCardNum.startsWith('5')) detectedCardType = 'Mastercard';

  // Card color gradient based on type
  const cardGradient =
    detectedCardType === 'Humo'
      ? 'from-sky-950 via-slate-900 to-black'
      : detectedCardType === 'Visa'
      ? 'from-indigo-950 via-slate-900 to-black'
      : 'from-emerald-950 via-slate-900 to-black';

  const fullLegalName = `${lastName.trim()} ${firstName.trim()} ${middleName.trim()}`.trim();

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (cleanCardNum.length < 16) {
      setErrorMsg("Iltimos, kartangizning to'liq 16 xonali raqamini kiriting.");
      return;
    }

    if (!lastName.trim() || !firstName.trim() || !middleName.trim()) {
      setErrorMsg("Iltimos, kartadagi Familiya, Ism va Ochestvangizni (otangizning ismini) to'liq kiriting.");
      return;
    }

    const selectedUni = isCustomUniversity ? customUniversity.trim() : university;
    if (!selectedUni) {
      setErrorMsg("Iltimos, o'qiydigan oliygohingizni tanlang yoki kiriting.");
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg("Iltimos, to'g'ri elektron pochta manzilini kiriting.");
      return;
    }

    if (!birthDate) {
      setErrorMsg("Tug'ilgan sanangizni tanlang.");
      return;
    }

    if (!isEligible) {
      setErrorMsg("Tizim qoidasiga binoan, faqat 20 va undan katta yoshdagi talaba/mutaxassislar kira oladi.");
      return;
    }

    const initialBal = parseInt(initialCardBalance.replace(/\D/g, '') || '3000000', 10);

    const newProfile: UserProfile = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      middleName: middleName.trim(),
      fullName: fullLegalName,
      university: selectedUni,
      email: email.trim(),
      birthDate,
      age: currentAge,
      joinedAt: initialProfile?.joinedAt || getTodayDateString(),
      monthlyBudget: initialProfile?.monthlyBudget || 3500000,
      primaryCardNumber: cardNumber,
    };

    const newCard: PersonalCard = {
      id: 'card-primary-' + Date.now(),
      cardNumber: cardNumber,
      cardHolder: fullLegalName.toUpperCase(),
      expiryDate: expiryDate || '08/29',
      cardType: detectedCardType,
      bankName: bankName,
      balance: initialBal,
      colorTheme: cardGradient,
      isDefault: true,
    };

    onComplete(newProfile, newCard);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-5 sm:p-7 my-6"
        >
          {/* Glowing Top Beam */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-500" />

          {/* Header */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-2">
              <CreditCard className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Shaxsiy Bank Karta va Talaba Ro'yxati
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Hisobdan pul yechish va sarf-xarajatlarni boshqarish uchun shaxsiy kartangiz hamda ma'lumotlaringizni kiriting
            </p>
          </div>

          {/* DYNAMIC VIRTUAL BANK CARD PREVIEW */}
          <div
            className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-br ${cardGradient} border border-slate-700/80 shadow-xl relative overflow-hidden mb-5 text-white transition-all duration-300`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  {bankName || 'Kapitalbank'}
                </span>
                <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Karta egasi tasdiqlangan</span>
                </p>
              </div>
              <span className="px-2.5 py-1 rounded bg-white/10 text-xs font-bold font-mono tracking-wider">
                {detectedCardType}
              </span>
            </div>

            {/* 16 Digit Display */}
            <div className="my-4">
              <p className="font-mono text-lg sm:text-xl tracking-[0.18em] font-medium text-slate-100">
                {cardNumber || '•••• •••• •••• ••••'}
              </p>
            </div>

            {/* Cardholder Full Name & Patronymic */}
            <div className="flex items-end justify-between pt-2 border-t border-white/10 text-xs">
              <div className="min-w-0 pr-3">
                <span className="text-[10px] text-slate-400 block uppercase">
                  Kartadagi F.I.Sh (Familiya, Ism, Ochestvasi)
                </span>
                <span className="font-semibold text-slate-200 block truncate font-mono uppercase text-[11px] sm:text-xs">
                  {fullLegalName || "FAMILIYA ISM OCHESTVA"}
                </span>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-400 block uppercase">Muddati</span>
                <span className="font-mono text-xs font-bold text-slate-200">{expiryDate}</span>
              </div>
            </div>
          </div>

          {/* Age Requirement Disclaimer Banner (20+ Strict check) */}
          <div
            className={`p-3 rounded-xl border mb-5 transition-all ${
              isEligible
                ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300'
                : 'bg-rose-950/30 border-rose-800/50 text-rose-300'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {isEligible ? (
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="text-xs leading-snug">
                <span className="font-semibold block mb-0.5">
                  Yosh Cheklovi Qoidasi: Faqat 20 va undan katta yoshdagilar uchun (20, 21+)
                </span>
                {isEligible ? (
                  <span>
                    Hisoblangan yoshingiz: <strong className="font-bold text-white tabular-nums">{currentAge} yosh</strong>. Qoidaga to'liq javob berasiz.
                  </span>
                ) : (
                  <span>
                    Hisoblangan yoshingiz: <strong className="font-bold text-white tabular-nums">{currentAge} yosh</strong>. Platformaga kirish uchun kamida 20 yosh bo'lish shart.
                  </span>
                )}
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* SECTION 1: SHAXSIY KARTA RAQAMI VA MA'LUMOTLARI */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5" />
                1. Shaxsiy Bank Karta Ma'lumotlari
              </span>

              {/* Card Number */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  16 xonali Shaxsiy Karta Raqamingiz
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={19}
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="8600 0000 0000 0000"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-mono tracking-widest placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-400 font-mono">
                    {detectedCardType}
                  </span>
                </div>
              </div>

              {/* Expiry, Bank, and Initial Balance */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Amal qilish muddati
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    placeholder="08/29"
                    className="w-full px-2.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Kartani bergan bank
                  </label>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer truncate"
                  >
                    {BANK_OPTIONS.map((b) => (
                      <option key={b} value={b} className="bg-slate-900 text-white">
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Kartadagi balans (so'm)
                  </label>
                  <input
                    type="text"
                    required
                    value={initialCardBalance}
                    onChange={(e) => setInitialCardBalance(e.target.value.replace(/\D/g, ''))}
                    placeholder="4500000"
                    className="w-full px-2.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: KARTADAGI ISMI, FAMILIYASI VA OCHESTVASI */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                2. Kartadagi Ismi, Familiyasi va Ochestvasi
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Familiya */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Familiyangiz
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Oripov"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Ism */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Ismingiz
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Muhammadali"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Ochestvasi */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Ochestvasi (Otangiz ismi)
                  </label>
                  <input
                    type="text"
                    required
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                    placeholder="Alisher o'g'li"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: UNIVERSITET, EMAIL VA YOSH */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                3. Oliy Ta'lim va Shaxsiy Ma'lumotlar
              </span>

              {/* University */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
                  <span>Qaysi universitetda o'qiysiz?</span>
                  <button
                    type="button"
                    onClick={() => setIsCustomUniversity(!isCustomUniversity)}
                    className="text-[11px] text-emerald-400 hover:underline"
                  >
                    {isCustomUniversity ? "Ro'yxatdan tanlash" : "Boshqa oliygoh"}
                  </button>
                </label>

                {isCustomUniversity ? (
                  <input
                    type="text"
                    required
                    value={customUniversity}
                    onChange={(e) => setCustomUniversity(e.target.value)}
                    placeholder="Universitet yoki institut nomini yozing..."
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                ) : (
                  <select
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {POPULAR_UNIVERSITIES.map((uni) => (
                      <option key={uni.shortName} value={uni.name} className="bg-slate-900 text-white">
                        {uni.name} ({uni.city})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Email & Birth Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    Elektron pochta (Email)
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="namuna@gmail.com"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Tug'ilgan sana (20+)
                    </span>
                    <span className={`font-mono font-bold ${isEligible ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {currentAge > 0 ? `${currentAge} yosh` : ''}
                    </span>
                  </label>
                  <input
                    type="date"
                    required
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    max={getTodayDateString()}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!isEligible}
                className={`w-full py-3.5 px-4 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                  isEligible
                    ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 active:scale-[0.99] cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                }`}
              >
                {isEligible ? (
                  <>
                    <span>Kartani Ulash va Tizimga Kirish</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>20 yoshdan kichiklar kira olmaydi</span>
                    <ShieldAlert className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
