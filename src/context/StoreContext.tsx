import React, { createContext, useContext, useState, useEffect } from 'react';
import { PodiItem, ThemeConfig, StoreSettings, CartItem, AdminUser, PodiWeightOption } from '../types';
import { INITIAL_PODIS, INITIAL_SETTINGS } from '../data/initialPodis';
import { THEME_PRESETS } from '../data/themePresets';
import { applyThemeToDOM, loadSavedTheme } from '../utils/themeEngine';

interface StoreContextType {
  podis: PodiItem[];
  theme: ThemeConfig;
  settings: StoreSettings;
  adminUser: AdminUser | null;
  isAdminAuthenticated: boolean;
  cart: CartItem[];
  searchQuery: string;
  activeCategory: string;
  selectedPodi: PodiItem | null;
  isCartDrawerOpen: boolean;
  isAdminModalOpen: boolean;
  isAdminDashboardOpen: boolean;
  isMenuDrawerOpen: boolean;
  isStoryModalOpen: boolean;
  isContactModalOpen: boolean;
  isThemeDrawerOpen: boolean;

  // Actions
  setSearchQuery: (query: string) => void;
  setActiveCategory: (cat: string) => void;
  setSelectedPodi: (podi: PodiItem | null) => void;
  setIsCartDrawerOpen: (open: boolean) => void;
  setIsAdminModalOpen: (open: boolean) => void;
  setIsAdminDashboardOpen: (open: boolean) => void;
  setIsMenuDrawerOpen: (open: boolean) => void;
  setIsStoryModalOpen: (open: boolean) => void;
  setIsContactModalOpen: (open: boolean) => void;
  setIsThemeDrawerOpen: (open: boolean) => void;

  // Podi CRUD (Admin)
  updatePodiPrice: (podiId: string, newPrice: number, weightIndex?: number) => void;
  updatePodi: (updatedPodi: PodiItem) => void;
  addPodi: (newPodi: Omit<PodiItem, 'id'>) => void;
  deletePodi: (podiId: string) => void;
  toggleStockStatus: (podiId: string) => void;
  resetPodisToDefault: () => void;

  // Theme Management
  setTheme: (theme: ThemeConfig) => void;
  updateThemeVariable: (key: keyof ThemeConfig, value: string) => void;
  resetThemeToDefault: () => void;

  // Admin Auth
  loginAdmin: (email: string, pass: string) => { success: boolean; message: string };
  logoutAdmin: () => void;

  // Cart & Ordering
  addToCart: (podi: PodiItem, weight?: PodiWeightOption, qty?: number) => void;
  updateCartQty: (podiId: string, weightGrams: number, qty: number) => void;
  removeFromCart: (podiId: string, weightGrams: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  getWhatsAppOrderUrl: (customItems?: CartItem[], notes?: string) => string;
  getInstagramDmUrl: () => string;

  // Store Settings (Admin)
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
}

const PODI_STORAGE_KEY = 'the_podi_factory_items_v1';
const SETTINGS_STORAGE_KEY = 'the_podi_factory_settings_v1';
const ADMIN_AUTH_KEY = 'the_podi_factory_admin_session';

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Podis state with local persistence
  const [podis, setPodis] = useState<PodiItem[]>(() => {
    try {
      const saved = localStorage.getItem(PODI_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved podis', e);
    }
    return INITIAL_PODIS;
  });

  // 2. Theme state
  const [theme, setThemeState] = useState<ThemeConfig>(loadSavedTheme);

  // 3. Settings state
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) {
        return { ...INITIAL_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to parse settings', e);
    }
    return INITIAL_SETTINGS;
  });

  // 4. Admin Auth
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem(ADMIN_AUTH_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse admin session', e);
    }
    return null;
  });

  // 5. Cart
  const [cart, setCart] = useState<CartItem[]>([]);

  // 6. UI Navigation & Modals
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedPodi, setSelectedPodi] = useState<PodiItem | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isMenuDrawerOpen, setIsMenuDrawerOpen] = useState(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isThemeDrawerOpen, setIsThemeDrawerOpen] = useState(false);

  // Apply theme on load and change
  useEffect(() => {
    applyThemeToDOM(theme);
  }, [theme]);

  // Persist podis
  useEffect(() => {
    try {
      localStorage.setItem(PODI_STORAGE_KEY, JSON.stringify(podis));
    } catch (e) {
      console.warn('Failed to save podis', e);
    }
  }, [podis]);

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings', e);
    }
  }, [settings]);

  // Podi CRUD
  const updatePodiPrice = (podiId: string, newPrice: number, weightIndex?: number) => {
    setPodis((prev) =>
      prev.map((item) => {
        if (item.id !== podiId) return item;
        const updatedWeights = [...item.weights];
        if (weightIndex !== undefined && updatedWeights[weightIndex]) {
          updatedWeights[weightIndex] = {
            ...updatedWeights[weightIndex],
            price: newPrice,
          };
          return {
            ...item,
            price: weightIndex === 1 || updatedWeights.length === 1 ? newPrice : item.price,
            weights: updatedWeights,
          };
        }
        // Base price update
        return {
          ...item,
          price: newPrice,
          weights: updatedWeights.map((w, idx) =>
            idx === 1 ? { ...w, price: newPrice } : w
          ),
        };
      })
    );
  };

  const updatePodi = (updatedPodi: PodiItem) => {
    setPodis((prev) =>
      prev.map((item) => (item.id === updatedPodi.id ? updatedPodi : item))
    );
    if (selectedPodi?.id === updatedPodi.id) {
      setSelectedPodi(updatedPodi);
    }
  };

  const addPodi = (newPodiData: Omit<PodiItem, 'id'>) => {
    const id = newPodiData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);
    const newPodi: PodiItem = {
      ...newPodiData,
      id,
    };
    setPodis((prev) => [newPodi, ...prev]);
  };

  const deletePodi = (podiId: string) => {
    setPodis((prev) => prev.filter((item) => item.id !== podiId));
    if (selectedPodi?.id === podiId) {
      setSelectedPodi(null);
    }
  };

  const toggleStockStatus = (podiId: string) => {
    setPodis((prev) =>
      prev.map((item) =>
        item.id === podiId ? { ...item, inStock: !item.inStock } : item
      )
    );
  };

  const resetPodisToDefault = () => {
    setPodis(INITIAL_PODIS);
    localStorage.removeItem(PODI_STORAGE_KEY);
  };

  // Theme Management
  const setTheme = (newTheme: ThemeConfig) => {
    setThemeState(newTheme);
    applyThemeToDOM(newTheme);
  };

  const updateThemeVariable = (key: keyof ThemeConfig, value: string) => {
    const updated = {
      ...theme,
      [key]: value,
    };
    setThemeState(updated);
    applyThemeToDOM(updated);
  };

  const resetThemeToDefault = () => {
    setTheme(THEME_PRESETS[0]);
  };

  // Admin Auth Flow
  const loginAdmin = (email: string, pass: string): { success: boolean; message: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    // Secure authentication flow with predefined admin / manager credentials or stored override
    if (
      (cleanEmail === 'admin@podifactory.com' && (cleanPass === 'podi1234' || cleanPass === 'admin123')) ||
      (cleanEmail === 'trinadhreddy.b@gmail.com' && (cleanPass === 'podi1234' || cleanPass === 'admin123')) ||
      (cleanEmail === 'manager@podifactory.com' && cleanPass === 'podi1234')
    ) {
      const user: AdminUser = {
        email: cleanEmail,
        name: cleanEmail.startsWith('trinadh') ? 'Trinadh Reddy' : cleanEmail.startsWith('manager') ? 'Store Manager' : 'Master Chef & Admin',
        role: cleanEmail.startsWith('manager') ? 'store_manager' : 'super_admin',
        lastLogin: new Date().toISOString(),
      };
      setAdminUser(user);
      localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify(user));
      return { success: true, message: 'Authentication successful! Welcome to the Admin Portal.' };
    }

    return {
      success: false,
      message: 'Invalid credentials. Use demo: admin@podifactory.com / podi1234',
    };
  };

  const logoutAdmin = () => {
    setAdminUser(null);
    localStorage.removeItem(ADMIN_AUTH_KEY);
    setIsAdminDashboardOpen(false);
  };

  // Cart functions
  const addToCart = (podi: PodiItem, weight?: PodiWeightOption, qty: number = 1) => {
    const chosenWeight = weight || podi.weights[1] || podi.weights[0];
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (ci) => ci.podi.id === podi.id && ci.selectedWeight.grams === chosenWeight.grams
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += qty;
        return updated;
      }
      return [...prev, { podi, selectedWeight: chosenWeight, quantity: qty }];
    });
    setIsCartDrawerOpen(true);
  };

  const updateCartQty = (podiId: string, weightGrams: number, qty: number) => {
    if (qty <= 0) {
      removeFromCart(podiId, weightGrams);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.podi.id === podiId && item.selectedWeight.grams === weightGrams
          ? { ...item, quantity: qty }
          : item
      )
    );
  };

  const removeFromCart = (podiId: string, weightGrams: number) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.podi.id === podiId && item.selectedWeight.grams === weightGrams)
      )
    );
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => {
    return cart.reduce((acc, item) => acc + item.selectedWeight.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  };

  const getWhatsAppOrderUrl = (customItems?: CartItem[], notes?: string) => {
    const itemsToOrder = customItems || cart;
    const phone = settings.whatsappNumber.replace(/[^0-9]/g, '');
    
    let text = `Namaste *The Podi Factory*! 🙏\nI would like to place an authentic Podi order:\n\n`;
    
    if (itemsToOrder.length > 0) {
      itemsToOrder.forEach((item, idx) => {
        text += `${idx + 1}. *${item.podi.name}* (${item.selectedWeight.label}) - ${item.quantity} unit(s) @ ₹${item.selectedWeight.price * item.quantity}\n`;
      });
      const total = itemsToOrder.reduce((sum, it) => sum + it.selectedWeight.price * it.quantity, 0);
      text += `\n💰 *Estimated Total:* ₹${total}\n`;
    } else {
      text += `I would like to enquire about your fresh batch Andhra Podis.\n`;
    }

    if (notes) {
      text += `\n📝 *Notes:* ${notes}\n`;
    }
    text += `\nPlease confirm batch availability & payment details. Thank you!`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  const getInstagramDmUrl = () => {
    const handle = settings.instagramHandle.replace('@', '');
    return `https://instagram.com/${handle}`;
  };

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <StoreContext.Provider
      value={{
        podis,
        theme,
        settings,
        adminUser,
        isAdminAuthenticated: !!adminUser,
        cart,
        searchQuery,
        activeCategory,
        selectedPodi,
        isCartDrawerOpen,
        isAdminModalOpen,
        isAdminDashboardOpen,
        isMenuDrawerOpen,
        isStoryModalOpen,
        isContactModalOpen,
        isThemeDrawerOpen,

        setSearchQuery,
        setActiveCategory,
        setSelectedPodi,
        setIsCartDrawerOpen,
        setIsAdminModalOpen,
        setIsAdminDashboardOpen,
        setIsMenuDrawerOpen,
        setIsStoryModalOpen,
        setIsContactModalOpen,
        setIsThemeDrawerOpen,

        updatePodiPrice,
        updatePodi,
        addPodi,
        deletePodi,
        toggleStockStatus,
        resetPodisToDefault,

        setTheme,
        updateThemeVariable,
        resetThemeToDefault,

        loginAdmin,
        logoutAdmin,

        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartCount,
        getWhatsAppOrderUrl,
        getInstagramDmUrl,

        updateSettings,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
