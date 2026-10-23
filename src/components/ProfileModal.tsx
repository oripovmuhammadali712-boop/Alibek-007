import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';
import { POPULAR_UNIVERSITIES } from '../data/universities';
import { calculateAge, formatUZS } from '../utils/formatters';
import {
  X,
  User,
  GraduationCap,
  Mail,
  Calendar,
  ShieldCheck,
  Edit2,
  Save,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onResetAccount: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  onResetAccount,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [lastName, setLastName] = useState(user.lastName || '');
  const [firstName, setFirstName] = useState(user.firstName || '');
  const [middleName, setMiddleName] = useState(user.middleName || '');
  const [university, setUniversity] = useState(user.university);
  const [email, setEmail] = useState(user.email);
  const [birthDate, setBirthDate] = useState(user.birthDate);
  const [monthlyBudget, setMonthlyBudget] = useState(user.monthlyBudget.toString());
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const newAge = calculateAge(birthDate);
    if (newAge < 20) {
      setErrorMsg("Yosh chegarasi kamida 20 yosh bo'lishi shart!");
      return;
    }

    const budgetNum = parseInt(monthlyBudget.replace(/\D/g, '') || '0', 10);
    const fullLegal = `${lastName.trim()} ${firstName.trim()} ${middleName.trim()}`.trim();

    onUpdateUser({
      ...user,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      middleName: middleName.trim(),
      fullName: fullLegal,
      university: university.trim(),
      email: email.trim(),
      birthDate,
      age: newAge,
      monthlyBudget: budgetNum,
    });

    setIsEditing(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Talaba Profili</h3>
                <p className="text-xs text-slate-400">Shaxsiy va bank karta ma'lumotlari</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Banner with 3D crystal prosperity artwork */}
          <div className="relative rounded-xl overflow-hidden h-28 my-4 border border-slate-800">
            <img
              src="/src/assets/images/financial_growth_crystal_1792769415209.jpg"
              alt="Prosperity visual"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent flex items-center p-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">
                  Tasdiqlangan Foydalanuvchi (20+)
                </span>
                <h4 className="text-base font-extrabold text-white">{user.fullName}</h4>
                <p className="text-xs text-slate-300 truncate max-w-[280px]">{user.university}</p>
                {user.primaryCardNumber && (
                  <p className="text-[11px] font-mono text-emerald-400 mt-0.5">
                    Karta: {user.primaryCardNumber}
                  </p>
                )}
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-3.5">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Familiya
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Ism
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Ochestvasi
                  </label>
                  <input
                    type="text"
                    required
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Universitet
                </label>
                <input
                  type="text"
                  required
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Elektron pochta
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Tug'ilgan sana (20+)
                  </label>
                  <input
                    type="date"
                    required
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Oylik rejalashtirilgan byudjet (so'm)
                </label>
                <input
                  type="text"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Saqlash</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Bekor qilish
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[11px] text-slate-500 block mb-1">F.I.Sh (To'liq)</span>
                  <span className="font-semibold text-slate-200 block truncate">{user.fullName}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[11px] text-slate-500 block mb-1">Ochestvasi (Otasi ismi)</span>
                  <span className="font-semibold text-slate-200 block truncate">{user.middleName || '-'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[11px] text-slate-500 block mb-1">Oliygoh / Universitet</span>
                  <span className="font-semibold text-slate-200 block truncate">{user.university}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[11px] text-slate-500 block mb-1">Elektron pochta</span>
                  <span className="font-semibold text-slate-200 block truncate">{user.email}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[11px] text-slate-500 block mb-1">Yoshi va holati</span>
                  <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{user.age} yosh (20+ Tasdiqlangan)</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[11px] text-slate-500 block mb-1">Asosiy Karta Raqami</span>
                  <span className="font-semibold text-white font-mono">{user.primaryCardNumber || '8600 •••• •••• 6078'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Profilni tahrirlash</span>
                </button>

                <button
                  onClick={onResetAccount}
                  className="px-3 py-2 text-rose-400 hover:text-rose-300 text-xs font-medium hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Boshqa talaba hisobiga o'tish"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Qayta ro'yxatdan o'tish</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

