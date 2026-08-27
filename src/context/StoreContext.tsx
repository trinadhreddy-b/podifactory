import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PodiItem, ThemeConfig, StoreSettings, CartItem, AdminUser, PodiWeightOption } from '../types';
import { THEME_PRESETS } from '../data/themePresets';
import { applyThemeToDOM, loadSavedTheme } from '../utils/themeEngine';
import {
  isSupabaseConfigured,
  fetchPodisFromCloud,
  savePodiToCloud,
  deletePodiFromCloud,
  toggleStockInCloud,
  updatePriceInCloud,
  fetchSettingsFromCloud,
  saveSettingsToCloud,
  subscribeToRealtimeChanges,
  signInWithSupabase,
  signOutFromSupabase,
  getSupabaseSessionUser,
  sendMagicLink,
  onSupabaseAuthStateChange,
} from '../services/supabaseClient';

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

  // Cloud Sync Metadata
  isCloudConnected: boolean;
  isSyncing: boolean;
  isLoading: boolean;
  lastSyncedAt: Date | null;

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
  refreshFromCloud: () => Promise<void>;

  // Podi CRUD (Admin)
  updatePodiPrice: (podiId: string, newPrice: number, weightIndex?: number) => Promise<void>;
  updatePodi: (updatedPodi: PodiItem) => Promise<void>;
  addPodi: (newPodi: Omit<PodiItem, 'id'>) => Promise<void>;
  deletePodi: (podiId: string) => Promise<void>;
  toggleStockStatus: (podiId: string) => Promise<void>;
  resetPodisToDefault: () => Promise<void>;

  // Theme Management
  setTheme: (theme: ThemeConfig) => void;
  updateThemeVariable: (key: keyof ThemeConfig, value: string) => void;
  resetThemeToDefault: () => void;

  // Admin Auth
  loginAdmin: (email: string, pass: string) => Promise<{ success: boolean; message: string }>;
  requestMagicLink: (email: string) => Promise<{ success: boolean; message: string }>;
  logoutAdmin: () => Promise<void>;

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
  updateSettings: (newSettings: Partial<StoreSettings>) => Promise<void>;
}

const PODI_STORAGE_KEY = 'the_podi_factory_items_v1';
const SETTINGS_STORAGE_KEY = 'the_podi_factory_settings_v1';

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'The Podi Factory',
  tagline: 'Hand-pounded. Sun-dried. Andhra\'s soul.',
  whatsappNumber: '+919876543210',
  instagramHandle: 'thepodifactory',
  email: 'orders@thepodifactory.com',
  phone: '+91 98765 43210',
  address: 'Artisanal Batch Kitchen, Guntur & Hyderabad, India',
  announcement: '🌿 Small-batch fresh harvest podis now shipping across India! Free delivery on orders over ₹799',
  upiId: 'thepodifactory@okaxis',
  currencySymbol: '₹',
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Podis state loaded from Supabase (with localStorage cache for instant fast paint)
  const [podis, setPodis] = useState<PodiItem[]>(() => {
    try {
      const saved = localStorage.getItem(PODI_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse cached podis', e);
    }
    return [];
  });

  // 2. Theme state
  const [theme, setThemeState] = useState<ThemeConfig>(loadSavedTheme);

  // 3. Settings state
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to parse settings', e);
    }
    return DEFAULT_SETTINGS;
  });

  // 4. Admin Auth
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

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

  // 7. Cloud Sync & Loading State
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  // Function to refresh podis and settings from Supabase
  const refreshFromCloud = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }
    setIsSyncing(true);
    try {
      const [cloudPodis, cloudSettings] = await Promise.all([
        fetchPodisFromCloud(),
        fetchSettingsFromCloud(),
      ]);

      if (cloudPodis && cloudPodis.length > 0) {
        setPodis(cloudPodis);
        try {
          localStorage.setItem(PODI_STORAGE_KEY, JSON.stringify(cloudPodis));
        } catch (e) {
          console.warn('Failed to cache podis', e);
        }
      }

      if (cloudSettings) {
        setSettings(cloudSettings);
        try {
          localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(cloudSettings));
        } catch (e) {
          console.warn('Failed to cache settings', e);
        }
      }

      setLastSyncedAt(new Date());
    } catch (err) {
      console.warn('Cloud sync error:', err);
    } finally {
      setIsSyncing(false);
      setIsLoading(false);
    }
  }, []);

  // Initial cloud fetch on mount + Realtime changes listener + Session check
  useEffect(() => {
    if (isSupabaseConfigured) {
      refreshFromCloud();

      // Check existing Supabase session
      getSupabaseSessionUser().then((user) => {
        if (user) {
          setAdminUser(user);
        }
      });

      // Realtime listener for Auth changes
      const unsubscribeAuth = onSupabaseAuthStateChange((user) => {
        setAdminUser(user);
      });

      // Realtime listener for Database table changes
      const unsubscribeTables = subscribeToRealtimeChanges(
        () => {
          fetchPodisFromCloud().then((freshPodis) => {
            if (freshPodis && freshPodis.length > 0) {
              setPodis(freshPodis);
              localStorage.setItem(PODI_STORAGE_KEY, JSON.stringify(freshPodis));
              setLastSyncedAt(new Date());
            }
          });
        },
        () => {
          fetchSettingsFromCloud().then((freshSettings) => {
            if (freshSettings) {
              setSettings(freshSettings);
              localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(freshSettings));
              setLastSyncedAt(new Date());
            }
          });
        }
      );

      return () => {
        unsubscribeTables();
        unsubscribeAuth();
      };
    } else {
      setIsLoading(false);
    }
  }, [refreshFromCloud]);

  // Apply theme on load and change
  useEffect(() => {
    applyThemeToDOM(theme);
  }, [theme]);

  // Persist podis cache locally
  useEffect(() => {
    if (podis.length > 0) {
      try {
        localStorage.setItem(PODI_STORAGE_KEY, JSON.stringify(podis));
      } catch (e) {
        console.warn('Failed to save podis cache', e);
      }
    }
  }, [podis]);

  // Persist settings cache locally
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings cache', e);
    }
  }, [settings]);

  // Podi CRUD with Cloud Sync
  const updatePodiPrice = async (podiId: string, newPrice: number, weightIndex?: number) => {
    let targetWeights: PodiWeightOption[] = [];
    let updatedPrice = newPrice;

    setPodis((prev) =>
      prev.map((item) => {
        if (item.id !== podiId) return item;
        const updatedWeights = [...item.weights];
        if (weightIndex !== undefined && updatedWeights[weightIndex]) {
          updatedWeights[weightIndex] = {
            ...updatedWeights[weightIndex],
            price: newPrice,
          };
          targetWeights = updatedWeights;
          updatedPrice = weightIndex === 1 || updatedWeights.length === 1 ? newPrice : item.price;
          return {
            ...item,
            price: updatedPrice,
            weights: updatedWeights,
          };
        }
        // Base price update
        targetWeights = updatedWeights.map((w, idx) =>
          idx === 1 ? { ...w, price: newPrice } : w
        );
        return {
          ...item,
          price: newPrice,
          weights: targetWeights,
        };
      })
    );

    // Sync to Supabase
    if (isSupabaseConfigured && targetWeights.length > 0) {
      setIsSyncing(true);
      await updatePriceInCloud(podiId, updatedPrice, targetWeights);
      setIsSyncing(false);
      setLastSyncedAt(new Date());
    }
  };

  const updatePodi = async (updatedPodi: PodiItem) => {
    setPodis((prev) =>
      prev.map((item) => (item.id === updatedPodi.id ? updatedPodi : item))
    );
    if (selectedPodi?.id === updatedPodi.id) {
      setSelectedPodi(updatedPodi);
    }

    // Sync to Supabase
    if (isSupabaseConfigured) {
      setIsSyncing(true);
      await savePodiToCloud(updatedPodi);
      setIsSyncing(false);
      setLastSyncedAt(new Date());
    }
  };

  const addPodi = async (newPodiData: Omit<PodiItem, 'id'>) => {
    const id = newPodiData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);
    const newPodi: PodiItem = {
      ...newPodiData,
      id,
    };
    setPodis((prev) => [newPodi, ...prev]);

    // Sync to Supabase
    if (isSupabaseConfigured) {
      setIsSyncing(true);
      await savePodiToCloud(newPodi);
      setIsSyncing(false);
      setLastSyncedAt(new Date());
    }
  };

  const deletePodi = async (podiId: string) => {
    setPodis((prev) => prev.filter((item) => item.id !== podiId));
    if (selectedPodi?.id === podiId) {
      setSelectedPodi(null);
    }

    // Sync to Supabase
    if (isSupabaseConfigured) {
      setIsSyncing(true);
      await deletePodiFromCloud(podiId);
      setIsSyncing(false);
      setLastSyncedAt(new Date());
    }
  };

  const toggleStockStatus = async (podiId: string) => {
    let nextStatus = true;
    setPodis((prev) =>
      prev.map((item) => {
        if (item.id === podiId) {
          nextStatus = !item.inStock;
          return { ...item, inStock: nextStatus };
        }
        return item;
      })
    );

    // Sync to Supabase
    if (isSupabaseConfigured) {
      setIsSyncing(true);
      await toggleStockInCloud(podiId, nextStatus);
      setIsSyncing(false);
      setLastSyncedAt(new Date());
    }
  };

  const resetPodisToDefault = async () => {
    await refreshFromCloud();
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

  // Admin Auth Flow (100% Supabase Auth with bcrypt hashing and JWT tokens)
  const loginAdmin = async (email: string, pass: string): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!isSupabaseConfigured) {
      return {
        success: false,
        message: 'Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.',
      };
    }

    const res = await signInWithSupabase(cleanEmail, cleanPass);
    if (res.success && res.user) {
      setAdminUser(res.user);
      return { success: true, message: res.message };
    }
    return { success: false, message: res.message };
  };

  const requestMagicLink = async (email: string): Promise<{ success: boolean; message: string }> => {
    return await sendMagicLink(email);
  };

  const logoutAdmin = async () => {
    await signOutFromSupabase();
    setAdminUser(null);
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
    
    let text = `Namaste *${settings.storeName}*! 🙏\nI would like to place an authentic Podi order:\n\n`;
    
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

  const updateSettings = async (newSettings: Partial<StoreSettings>) => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);

    // Sync to Supabase
    if (isSupabaseConfigured) {
      setIsSyncing(true);
      await saveSettingsToCloud(merged);
      setIsSyncing(false);
      setLastSyncedAt(new Date());
    }
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

        isCloudConnected: isSupabaseConfigured,
        isSyncing,
        isLoading,
        lastSyncedAt,

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
        refreshFromCloud,

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
        requestMagicLink,
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
