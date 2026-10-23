import { Category } from '../types';

export const EXPENSE_CATEGORIES: Category[] = [
  {
    id: 'education',
    name: "Ta'lim & O'qish",
    iconName: 'GraduationCap',
    color: '#38bdf8', // sky-400
    description: 'Kontrakt, o\'quv kurslari, kitoblar va ilmiy anjumanlar',
    budgetRecommendationPercent: 25,
  },
  {
    id: 'food',
    name: 'Oziq-ovqat & Tushlik',
    iconName: 'Utensils',
    color: '#fb923c', // orange-400
    description: 'Universitet oshxonasi, kofe, bozorlik va kechki ovqat',
    budgetRecommendationPercent: 30,
  },
  {
    id: 'transport',
    name: 'Transport & Yo\'l',
    iconName: 'Car',
    color: '#a78bfa', // purple-400
    description: 'Metro, avtobus, Yandex Go taksi va yo\'l chiptalari',
    budgetRecommendationPercent: 12,
  },
  {
    id: 'housing',
    name: 'Ijara & Yotoqxona',
    iconName: 'Home',
    color: '#f43f5e', // rose-500
    description: 'Kvartira ijarasi, talabalar turar joyi va kommunal to\'lovlar',
    budgetRecommendationPercent: 15,
  },
  {
    id: 'tech',
    name: 'Texnologiya & Internet',
    iconName: 'Laptop',
    color: '#34d399', // emerald-400
    description: 'Mobil aloqa, Wi-Fi, ilovalar obunasi, gadjetlar',
    budgetRecommendationPercent: 8,
  },
  {
    id: 'clothing',
    name: 'Kiyim & Parvarish',
    iconName: 'Shirt',
    color: '#facc15', // yellow-400
    description: 'Kiyim-kechak, poyabzal, gigiyena va sport mashg\'ulotlari',
    budgetRecommendationPercent: 5,
  },
  {
    id: 'entertainment',
    name: 'Dam olish & Hordiq',
    iconName: 'Film',
    color: '#ec4899', // pink-500
    description: 'Kino, konsertlar, do\'stlar davrasi va sayohatlar',
    budgetRecommendationPercent: 5,
  },
  {
    id: 'health',
    name: 'Salomatlik & Tibbiyot',
    iconName: 'HeartPulse',
    color: '#10b981', // emerald-500
    description: 'Dorilar, tibbiy ko\'rik, vitaminlar va stomatologiya',
    budgetRecommendationPercent: 5,
  },
];

export const INCOME_CATEGORIES: Category[] = [
  {
    id: 'scholarship',
    name: 'Stipendiya',
    iconName: 'Award',
    color: '#10b981',
    description: 'Universitet stipendiyasi yoki grant to\'lovi',
    budgetRecommendationPercent: 0,
  },
  {
    id: 'topup',
    name: 'Hisob to\'ldirish',
    iconName: 'CreditCard',
    color: '#38bdf8',
    description: 'Uzcard / Humo / Visa orqali hisobni to\'ldirish',
    budgetRecommendationPercent: 0,
  },
  {
    id: 'salary',
    name: 'Maosh & Freelance',
    iconName: 'Briefcase',
    color: '#a78bfa',
    description: 'Ish haqi, loyihalar va frilans daromadi',
    budgetRecommendationPercent: 0,
  },
  {
    id: 'parents',
    name: 'Oila / Ota-ona yordami',
    iconName: 'Users',
    color: '#f59e0b',
    description: 'Oilaviy moliyaviy qo\'llab-quvvatlash',
    budgetRecommendationPercent: 0,
  },
];
