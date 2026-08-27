import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PodiItem, StoreSettings, PodiWeightOption, AdminUser } from '../types';

// Read from Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('placeholder')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database row interface mapping (snake_case -> camelCase)
interface PodiRow {
  id: string;
  name: string;
  telugu_name?: string | null;
  tagline: string;
  description: string;
  price: number;
  original_price?: number | null;
  weights: PodiWeightOption[];
  spiciness: number;
  image: string;
  category: 'leafy' | 'traditional' | 'lentils' | 'combos';
  ingredients: string[];
  health_benefits: string[];
  serving_suggestions: string[];
  in_stock: boolean;
  badge?: string | null;
  is_featured?: boolean | null;
  display_order?: number;
}

interface SettingsRow {
  id: string;
  store_name: string;
  tagline?: string | null;
  whatsapp_number: string;
  instagram_handle?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  announcement?: string | null;
  upi_id?: string | null;
  currency_symbol?: string | null;
}

function mapRowToPodi(row: PodiRow): PodiItem {
  return {
    id: row.id,
    name: row.name,
    teluguName: row.telugu_name || undefined,
    tagline: row.tagline,
    description: row.description,
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    weights: Array.isArray(row.weights) ? row.weights : [],
    spiciness: (row.spiciness as 1 | 2 | 3) || 2,
    image: row.image,
    category: row.category,
    ingredients: row.ingredients || [],
    healthBenefits: row.health_benefits || [],
    servingSuggestions: row.serving_suggestions || [],
    inStock: row.in_stock ?? true,
    badge: row.badge || undefined,
    isFeatured: Boolean(row.is_featured),
  };
}

function mapPodiToRow(podi: PodiItem): PodiRow {
  return {
    id: podi.id,
    name: podi.name,
    telugu_name: podi.teluguName || null,
    tagline: podi.tagline,
    description: podi.description,
    price: podi.price,
    original_price: podi.originalPrice || null,
    weights: podi.weights,
    spiciness: podi.spiciness,
    image: podi.image,
    category: podi.category,
    ingredients: podi.ingredients,
    health_benefits: podi.healthBenefits,
    serving_suggestions: podi.servingSuggestions,
    in_stock: podi.inStock,
    badge: podi.badge || null,
    is_featured: podi.isFeatured || false,
  };
}

function mapRowToSettings(row: SettingsRow): StoreSettings {
  return {
    storeName: row.store_name,
    tagline: row.tagline || '',
    whatsappNumber: row.whatsapp_number,
    instagramHandle: row.instagram_handle || '',
    email: row.email || '',
    phone: row.phone || '',
    address: row.address || '',
    announcement: row.announcement || '',
    upiId: row.upi_id || '',
    currencySymbol: row.currency_symbol || '₹',
  };
}

function mapSettingsToRow(s: StoreSettings): SettingsRow {
  return {
    id: 'main',
    store_name: s.storeName,
    tagline: s.tagline,
    whatsapp_number: s.whatsappNumber,
    instagram_handle: s.instagramHandle,
    email: s.email,
    phone: s.phone,
    address: s.address,
    announcement: s.announcement,
    upi_id: s.upiId,
    currency_symbol: s.currencySymbol,
  };
}

/**
 * Fetch all podis from Supabase
 */
export async function fetchPodisFromCloud(): Promise<PodiItem[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('podis')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching podis from Supabase:', error);
      return null;
    }
    if (data && data.length > 0) {
      return data.map((row) => mapRowToPodi(row as PodiRow));
    }
    return [];
  } catch (err) {
    console.error('Failed to communicate with Supabase:', err);
    return null;
  }
}

/**
 * Upsert a single Podi item into Supabase
 */
export async function savePodiToCloud(podi: PodiItem): Promise<boolean> {
  if (!supabase) return false;
  try {
    const row = mapPodiToRow(podi);
    const { error } = await supabase.from('podis').upsert(row, { onConflict: 'id' });
    if (error) {
      console.error('Error saving podi to Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to save podi:', err);
    return false;
  }
}

/**
 * Delete a Podi from Supabase
 */
export async function deletePodiFromCloud(podiId: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('podis').delete().eq('id', podiId);
    if (error) {
      console.error('Error deleting podi from Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to delete podi:', err);
    return false;
  }
}

/**
 * Update stock status in Supabase
 */
export async function toggleStockInCloud(podiId: string, inStock: boolean): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('podis')
      .update({ in_stock: inStock })
      .eq('id', podiId);
    if (error) {
      console.error('Error updating stock status in Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to toggle stock status:', err);
    return false;
  }
}

/**
 * Update price for a podi in Supabase
 */
export async function updatePriceInCloud(
  podiId: string,
  price: number,
  weights: PodiWeightOption[]
): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('podis')
      .update({ price, weights })
      .eq('id', podiId);
    if (error) {
      console.error('Error updating price in Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to update price:', err);
    return false;
  }
}

/**
 * Fetch store settings from Supabase
 */
export async function fetchSettingsFromCloud(): Promise<StoreSettings | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('store_settings')
      .select('*')
      .eq('id', 'main')
      .maybeSingle();

    if (error) {
      console.error('Error fetching store settings:', error);
      return null;
    }
    if (data) {
      return mapRowToSettings(data as SettingsRow);
    }
    return null;
  } catch (err) {
    console.error('Failed to fetch store settings:', err);
    return null;
  }
}

/**
 * Save store settings to Supabase
 */
export async function saveSettingsToCloud(settings: StoreSettings): Promise<boolean> {
  if (!supabase) return false;
  try {
    const row = mapSettingsToRow(settings);
    const { error } = await supabase
      .from('store_settings')
      .upsert(row, { onConflict: 'id' });
    if (error) {
      console.error('Error saving store settings:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to save store settings:', err);
    return false;
  }
}

/**
 * Upload an image file directly to the Supabase Storage public bucket ('podi-images')
 */
export async function uploadPodiImage(file: File): Promise<{ url: string | null; error: string | null }> {
  if (!supabase) {
    return { url: null, error: 'Supabase is not configured yet. Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.' };
  }
  try {
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `podi-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;
    const filePath = `uploads/${filename}`;

    const { error: uploadError } = await supabase.storage
      .from('podi-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      return { url: null, error: uploadError.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from('podi-images')
      .getPublicUrl(filePath);

    return { url: publicUrlData.publicUrl, error: null };
  } catch (err: any) {
    return { url: null, error: err?.message || 'Failed to upload image' };
  }
}

/**
 * Subscribe to realtime updates for Podis and Settings across all devices
 */
export function subscribeToRealtimeChanges(
  onPodisChange: () => void,
  onSettingsChange: () => void
) {
  if (!supabase) return () => {};

  const channel = supabase
    .channel('podi-factory-realtime-sync')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'podis' },
      () => {
        onPodisChange();
      }
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'store_settings' },
      () => {
        onSettingsChange();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Sign in using Supabase Auth (Server-side bcrypt hash check & JWT session)
 */
export async function signInWithSupabase(
  email: string,
  pass: string
): Promise<{ success: boolean; user: AdminUser | null; message: string }> {
  if (!supabase) {
    return {
      success: false,
      user: null,
      message: 'Supabase is not configured. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: pass.trim(),
    });

    if (error) {
      return { success: false, user: null, message: error.message };
    }

    if (data?.user) {
      const adminUser: AdminUser = {
        email: data.user.email || email,
        name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Admin Chef',
        role: 'super_admin',
        lastLogin: new Date().toISOString(),
      };
      return {
        success: true,
        user: adminUser,
        message: 'Authentication successful! Welcome to the Admin Portal.',
      };
    }

    return { success: false, user: null, message: 'Invalid credentials or no session returned.' };
  } catch (err: any) {
    return { success: false, user: null, message: err?.message || 'Authentication failed.' };
  }
}

/**
 * Sign in with Magic Link / OTP via email
 */
export async function sendMagicLink(email: string): Promise<{ success: boolean; message: string }> {
  if (!supabase) {
    return { success: false, message: 'Supabase is not configured.' };
  }

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return {
      success: true,
      message: 'Secure Magic Login link sent! Please check your email inbox.',
    };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed to send login link.' };
  }
}

/**
 * Sign out from Supabase Auth
 */
export async function signOutFromSupabase(): Promise<void> {
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Error signing out from Supabase', e);
    }
  }
}

/**
 * Get current active session from Supabase Auth
 */
export async function getSupabaseSessionUser(): Promise<AdminUser | null> {
  if (!supabase) return null;
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.user) {
      return {
        email: session.user.email || '',
        name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Admin Chef',
        role: 'super_admin',
        lastLogin: new Date().toISOString(),
      };
    }
  } catch (e) {
    console.warn('Failed to retrieve Supabase session', e);
  }
  return null;
}

/**
 * Listen for auth state changes (login, logout, token refresh)
 */
export function onSupabaseAuthStateChange(
  callback: (user: AdminUser | null) => void
) {
  if (!supabase) return () => {};

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      callback({
        email: session.user.email || '',
        name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Admin Chef',
        role: 'super_admin',
        lastLogin: new Date().toISOString(),
      });
    } else {
      callback(null);
    }
  });

  return () => {
    subscription.unsubscribe();
  };
}

