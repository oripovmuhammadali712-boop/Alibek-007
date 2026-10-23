export interface PersonalCard {
  id: string;
  cardNumber: string; // e.g. "8600 4589 1234 5678"
  cardHolder: string; // e.g. "MUHAMMADALI ORIPOV"
  expiryDate: string; // e.g. "08/29"
  cardType: 'Uzcard' | 'Humo' | 'Visa' | 'Mastercard';
  bankName: string; // e.g. "Kapitalbank", "Milliy Bank", "Ipak Yo'li"
  balance: number; // card's own balance in UZS
  colorTheme: string;
  isDefault?: boolean;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  middleName: string; // Otasining ismi / Ochestvasi
  fullName: string;
  university: string;
  email: string;
  phoneNumber?: string;
  birthDate: string; // YYYY-MM-DD
  age: number;
  joinedAt: string;
  avatarUrl?: string;
  monthlyBudget: number; // e.g. 4000000 UZS
  primaryCardNumber?: string;
}


export type TransactionType = 'expense' | 'income';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number; // in UZS (so'm)
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  date: string; // ISO date YYYY-MM-DD
  time: string; // HH:mm
  description: string;
  paymentMethod: string;
  sourceCardId?: string;
  createdAt: number;
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
  color: string;
  description: string;
  budgetRecommendationPercent: number;
}

export interface UniversityOption {
  name: string;
  city: string;
  shortName: string;
}

