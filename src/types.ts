export interface PodiWeightOption {
  label: string;
  grams: number;
  price: number;
}

export interface PodiItem {
  id: string;
  name: string;
  teluguName?: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  weights: PodiWeightOption[];
  spiciness: 1 | 2 | 3; // 1: Mild, 2: Medium, 3: Andhra Fiery
  image: string;
  category: 'leafy' | 'traditional' | 'lentils' | 'combos';
  ingredients: string[];
  healthBenefits: string[];
  servingSuggestions: string[];
  inStock: boolean;
  badge?: string;
  isFeatured?: boolean;
}

export interface CartItem {
  podi: PodiItem;
  selectedWeight: PodiWeightOption;
  quantity: number;
}

export interface ThemeConfig {
  id: string;
  name: string;
  primary: string;
  primaryHover: string;
  primaryContainer: string;
  secondary: string;
  surface: string;
  surfaceContainer: string;
  surfaceCard: string;
  onSurface: string;
  onSurfaceVariant: string;
  outline: string;
  btnRadius: string;
  cardRadius: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  whatsappNumber: string;
  instagramHandle: string;
  email: string;
  phone: string;
  address: string;
  announcement: string;
  upiId: string;
  currencySymbol: string;
}

export interface AdminUser {
  email: string;
  name: string;
  role: 'super_admin' | 'store_manager';
  lastLogin: string;
}
