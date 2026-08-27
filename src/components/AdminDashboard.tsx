import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { PodiItem, ThemeConfig, PodiWeightOption } from '../types';
import { THEME_PRESETS } from '../data/themePresets';
import { generateCssVariablesSnippet } from '../utils/themeEngine';
import { uploadPodiImage, isSupabaseConfigured } from '../services/supabaseClient';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  Check,
  Save,
  RotateCcw,
  Palette,
  ShoppingBag,
  Settings,
  Flame,
  CheckCircle2,
  Copy,
  ExternalLink,
  DollarSign,
  Layers,
  Sparkles,
  LogOut,
  Sliders,
  Image as ImageIcon,
  RefreshCw,
  Cloud,
  CloudOff,
  UploadCloud,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminDashboardOpen,
    setIsAdminDashboardOpen,
    adminUser,
    logoutAdmin,
    podis,
    updatePodiPrice,
    updatePodi,
    addPodi,
    deletePodi,
    toggleStockStatus,
    resetPodisToDefault,
    theme,
    setTheme,
    updateThemeVariable,
    resetThemeToDefault,
    settings,
    updateSettings,
    isCloudConnected,
    isSyncing,
    lastSyncedAt,
    refreshFromCloud,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'prices' | 'menu' | 'theme' | 'settings'>('prices');
  const [editingPodi, setEditingPodi] = useState<PodiItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Quick price state tracking for fast inline edits
  const [inlinePrices, setInlinePrices] = useState<Record<string, number>>({});

  const EMPTY_PODI_FORM: Omit<PodiItem, 'id'> = {
    name: '',
    teluguName: '',
    tagline: '',
    description: '',
    price: 249,
    originalPrice: 299,
    weights: [
      { label: '100g Pouch', grams: 100, price: 130 },
      { label: '200g Jar', grams: 200, price: 249 },
      { label: '500g Value Pack', grams: 500, price: 580 },
    ],
    spiciness: 2,
    image: '',
    category: 'traditional',
    ingredients: [],
    healthBenefits: [],
    servingSuggestions: [],
    inStock: true,
    badge: '',
    isFeatured: false,
  };

  // New Podi Form state
  const [newPodiForm, setNewPodiForm] = useState<Omit<PodiItem, 'id'>>(EMPTY_PODI_FORM);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  if (!isAdminDashboardOpen) return null;

  const handleInlinePriceSave = (podiId: string, weightIdx: number, newPrice: number) => {
    updatePodiPrice(podiId, newPrice, weightIdx);
    showToast(`Price updated instantly to ₹${newPrice}!`);
  };

  const handleSaveEditedPodi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPodi) return;
    updatePodi(editingPodi);
    setEditingPodi(null);
    showToast(`"${editingPodi.name}" updated successfully!`);
  };

  const handleCreateNewPodi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPodiForm.name) return;
    addPodi(newPodiForm);
    setIsAddingNew(false);
    showToast(`New podi "${newPodiForm.name}" created and added to live menu!`);
    setNewPodiForm(EMPTY_PODI_FORM);
  };

  const handleImageFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'editing' | 'new'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setUploadError(null);
    const { url, error } = await uploadPodiImage(file);
    setIsUploadingImage(false);

    if (error || !url) {
      setUploadError(error || 'Upload failed');
      showToast(error || 'Failed to upload image');
      return;
    }

    if (target === 'editing' && editingPodi) {
      setEditingPodi({ ...editingPodi, image: url });
      showToast('Image uploaded & attached to product!');
    } else if (target === 'new') {
      setNewPodiForm((prev) => ({ ...prev, image: url }));
      showToast('Image uploaded & attached to new product!');
    }
  };

  const copyCssCode = () => {
    const code = generateCssVariablesSnippet(theme);
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    showToast('CSS variables snippet copied to clipboard!');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsAdminDashboardOpen(false)}
          className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        />

        {/* Full Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative w-full max-w-5xl bg-brand-surface-card rounded-2xl shadow-2xl overflow-hidden z-10 border border-brand-outline-variant/50 max-h-[92vh] flex flex-col my-auto"
          style={{
            backgroundColor: 'var(--color-surface-card)',
            borderColor: 'var(--color-outline-variant)',
          }}
        >
          {/* Dashboard Header Bar */}
          <div className="p-4 sm:p-5 border-b border-brand-outline-variant/30 flex flex-wrap items-center justify-between gap-3 bg-brand-surface-container/70 shrink-0">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-serif-brand text-lg sm:text-xl font-bold text-brand-on-surface">
                    Admin Command Dashboard
                  </h2>
                  {isCloudConnected ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                      <Cloud className="w-3 h-3 text-emerald-600" />
                      <span>Supabase Cloud Active</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                      <CloudOff className="w-3 h-3 text-amber-600" />
                      <span>Local Persistence Mode</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-brand-on-surface-variant">
                  Logged in as <strong className="text-brand-on-surface">{adminUser?.name || 'Chef Admin'}</strong> ({adminUser?.email})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Cloud Sync Button */}
              {isCloudConnected && (
                <button
                  onClick={() => {
                    refreshFromCloud();
                    showToast('Syncing with Supabase Cloud...');
                  }}
                  disabled={isSyncing}
                  className="px-2.5 py-1.5 text-xs font-semibold rounded-md border border-brand-outline-variant bg-brand-surface-card hover:bg-brand-surface text-brand-on-surface transition cursor-pointer flex items-center gap-1.5"
                  title="Force refresh data from Supabase Cloud"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-brand-primary' : ''}`} />
                  <span className="hidden sm:inline">
                    {isSyncing ? 'Syncing...' : lastSyncedAt ? 'Synced' : 'Sync'}
                  </span>
                </button>
              )}

              <button
                onClick={logoutAdmin}
                className="px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 rounded-md border border-red-200 transition cursor-pointer flex items-center gap-1"
                title="Sign out of admin"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>

              <button
                onClick={() => setIsAdminDashboardOpen(false)}
                className="p-2 rounded-full hover:bg-brand-surface text-brand-on-surface transition cursor-pointer"
                aria-label="Close dashboard"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Toast Notification */}
          {notification && (
            <div className="bg-emerald-600 text-white text-xs px-4 py-2 text-center font-medium flex items-center justify-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4" />
              <span>{notification}</span>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 px-4 sm:px-6 pt-3 border-b border-brand-outline-variant/30 overflow-x-auto bg-brand-surface-card shrink-0">
            <button
              onClick={() => setActiveTab('prices')}
              className={`px-4 py-2.5 text-xs font-bold font-label-brand tracking-wider uppercase border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'prices'
                  ? 'border-brand-primary text-brand-primary'
                  : 'border-transparent text-brand-muted hover:text-brand-on-surface'
              }`}
              style={{
                borderColor: activeTab === 'prices' ? 'var(--color-primary)' : 'transparent',
                color: activeTab === 'prices' ? 'var(--color-primary)' : 'inherit',
              }}
            >
              <DollarSign className="w-4 h-4" />
              <span>Instant Price Manager</span>
            </button>

            <button
              onClick={() => setActiveTab('menu')}
              className={`px-4 py-2.5 text-xs font-bold font-label-brand tracking-wider uppercase border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'menu'
                  ? 'border-brand-primary text-brand-primary'
                  : 'border-transparent text-brand-muted hover:text-brand-on-surface'
              }`}
              style={{
                borderColor: activeTab === 'menu' ? 'var(--color-primary)' : 'transparent',
                color: activeTab === 'menu' ? 'var(--color-primary)' : 'inherit',
              }}
            >
              <Layers className="w-4 h-4" />
              <span>Menu & Podis Editor ({podis.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('theme')}
              className={`px-4 py-2.5 text-xs font-bold font-label-brand tracking-wider uppercase border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'theme'
                  ? 'border-brand-primary text-brand-primary'
                  : 'border-transparent text-brand-muted hover:text-brand-on-surface'
              }`}
              style={{
                borderColor: activeTab === 'theme' ? 'var(--color-primary)' : 'transparent',
                color: activeTab === 'theme' ? 'var(--color-primary)' : 'inherit',
              }}
            >
              <Palette className="w-4 h-4" />
              <span>Theme & CSS Variables</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2.5 text-xs font-bold font-label-brand tracking-wider uppercase border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'settings'
                  ? 'border-brand-primary text-brand-primary'
                  : 'border-transparent text-brand-muted hover:text-brand-on-surface'
              }`}
              style={{
                borderColor: activeTab === 'settings' ? 'var(--color-primary)' : 'transparent',
                color: activeTab === 'settings' ? 'var(--color-primary)' : 'inherit',
              }}
            >
              <Settings className="w-4 h-4" />
              <span>Store & WhatsApp Settings</span>
            </button>
          </div>

          {/* Tab 1: Instant Price Manager */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {activeTab === 'prices' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-serif-brand text-lg text-brand-on-surface">
                      Quick Live Price Modifier
                    </h3>
                    <p className="text-xs text-brand-on-surface-variant">
                      Update prices instantly. Any change takes effect in real-time across the storefront, cart, and WhatsApp orders.
                    </p>
                  </div>
                  <button
                    onClick={resetPodisToDefault}
                    className="text-xs text-brand-muted hover:text-brand-primary flex items-center gap-1 border border-brand-outline-variant/60 px-3 py-1.5 rounded bg-brand-surface-card cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset All to Defaults</span>
                  </button>
                </div>

                <div className="border border-brand-outline-variant/40 rounded-xl overflow-hidden shadow-2xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-brand-surface-container text-brand-on-surface font-label-brand uppercase font-bold tracking-wider border-b border-brand-outline-variant/40">
                        <tr>
                          <th className="p-3">Podi Item</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">100g Price (₹)</th>
                          <th className="p-3">200g/250g Jar Price (₹)</th>
                          <th className="p-3">500g Value Pack (₹)</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-outline-variant/20 bg-brand-surface-card">
                        {podis.map((podi) => (
                          <tr key={podi.id} className="hover:bg-brand-surface-container/30 transition">
                            <td className="p-3 font-medium text-brand-on-surface flex items-center gap-2.5">
                              <img
                                src={podi.image}
                                alt={podi.name}
                                className="w-8 h-8 rounded object-cover shrink-0"
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <span className="font-serif-brand text-sm block">{podi.name}</span>
                                <span className="text-[10px] text-brand-muted">{podi.category}</span>
                              </div>
                            </td>

                            <td className="p-3">
                              <button
                                onClick={() => toggleStockStatus(podi.id)}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition cursor-pointer ${
                                  podi.inStock
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {podi.inStock ? 'In Stock' : 'Out of Stock'}
                              </button>
                            </td>

                            {/* 100g */}
                            <td className="p-3">
                              {podi.weights[0] ? (
                                <div className="flex items-center gap-1">
                                  <span className="text-brand-muted">₹</span>
                                  <input
                                    type="number"
                                    defaultValue={podi.weights[0].price}
                                    onBlur={(e) => {
                                      const val = parseInt(e.target.value, 10);
                                      if (!isNaN(val) && val > 0) handleInlinePriceSave(podi.id, 0, val);
                                    }}
                                    className="w-16 p-1 text-xs border border-brand-outline-variant/60 rounded text-center bg-brand-surface-container/40 focus:bg-white"
                                  />
                                </div>
                              ) : (
                                <span className="text-brand-muted">—</span>
                              )}
                            </td>

                            {/* 200g */}
                            <td className="p-3">
                              {podi.weights[1] ? (
                                <div className="flex items-center gap-1">
                                  <span className="text-brand-muted">₹</span>
                                  <input
                                    type="number"
                                    defaultValue={podi.weights[1].price}
                                    onBlur={(e) => {
                                      const val = parseInt(e.target.value, 10);
                                      if (!isNaN(val) && val > 0) handleInlinePriceSave(podi.id, 1, val);
                                    }}
                                    className="w-16 p-1 text-xs font-bold border border-brand-outline-variant/80 rounded text-center bg-amber-50/50 focus:bg-white text-brand-primary"
                                  />
                                </div>
                              ) : (
                                <div className="flex items-center gap-1">
                                  <span className="text-brand-muted">₹</span>
                                  <input
                                    type="number"
                                    defaultValue={podi.price}
                                    onBlur={(e) => {
                                      const val = parseInt(e.target.value, 10);
                                      if (!isNaN(val) && val > 0) handleInlinePriceSave(podi.id, 0, val);
                                    }}
                                    className="w-16 p-1 text-xs font-bold border border-brand-outline-variant/80 rounded text-center bg-amber-50/50 focus:bg-white text-brand-primary"
                                  />
                                </div>
                              )}
                            </td>

                            {/* 500g */}
                            <td className="p-3">
                              {podi.weights[2] ? (
                                <div className="flex items-center gap-1">
                                  <span className="text-brand-muted">₹</span>
                                  <input
                                    type="number"
                                    defaultValue={podi.weights[2].price}
                                    onBlur={(e) => {
                                      const val = parseInt(e.target.value, 10);
                                      if (!isNaN(val) && val > 0) handleInlinePriceSave(podi.id, 2, val);
                                    }}
                                    className="w-16 p-1 text-xs border border-brand-outline-variant/60 rounded text-center bg-brand-surface-container/40 focus:bg-white"
                                  />
                                </div>
                              ) : (
                                <span className="text-brand-muted">—</span>
                              )}
                            </td>

                            <td className="p-3 text-right">
                              <button
                                onClick={() => setEditingPodi(podi)}
                                className="px-2.5 py-1 text-xs font-semibold bg-brand-surface-container hover:bg-brand-surface-container-high rounded text-brand-on-surface transition cursor-pointer"
                              >
                                Full Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Menu Items Full CRUD */}
            {activeTab === 'menu' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-serif-brand text-lg text-brand-on-surface">
                      Menu & Podi Catalogue
                    </h3>
                    <p className="text-xs text-brand-on-surface-variant">
                      Add fresh handcrafted podi recipes, customize ingredients, spice intensity, and descriptions.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsAddingNew(true)}
                    className="px-4 py-2.5 text-xs font-label-brand font-bold uppercase tracking-wider text-white bg-brand-primary rounded-brand-btn flex items-center gap-1.5 shadow-xs hover:opacity-90 transition cursor-pointer"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Podi Item</span>
                  </button>
                </div>

                {/* Podi Cards Grid for Admin */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {podis.map((podi) => (
                    <div
                      key={podi.id}
                      className="p-4 bg-brand-surface-container/40 rounded-xl border border-brand-outline-variant/40 space-y-3 flex flex-col justify-between"
                    >
                      <div className="flex gap-3">
                        <img
                          src={podi.image}
                          alt={podi.name}
                          className="w-20 h-20 rounded-lg object-cover bg-brand-surface-container shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase text-brand-primary">
                              {podi.category}
                            </span>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                podi.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {podi.inStock ? 'In Stock' : 'Out'}
                            </span>
                          </div>
                          <h4 className="font-serif-brand text-sm font-bold text-brand-on-surface truncate">
                            {podi.name}
                          </h4>
                          <p className="text-xs text-brand-on-surface-variant line-clamp-1">
                            {podi.tagline}
                          </p>
                          <div className="text-xs font-serif-brand font-bold text-brand-primary mt-1">
                            ₹{podi.price}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-brand-outline-variant/30 text-xs">
                        <span className="text-brand-muted text-[11px]">
                          Spice: {podi.spiciness === 3 ? 'Fiery 🔥🔥🔥' : podi.spiciness === 2 ? 'Medium 🔥🔥' : 'Mild 🔥'}
                        </span>
                        
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setEditingPodi(podi)}
                            className="p-1.5 text-brand-on-surface hover:text-brand-primary hover:bg-brand-surface rounded transition cursor-pointer"
                            title="Edit Podi"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete "${podi.name}" from catalog?`)) {
                                deletePodi(podi.id);
                                showToast(`"${podi.name}" deleted.`);
                              }
                            }}
                            className="p-1.5 text-brand-muted hover:text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                            title="Delete Podi"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Theme & CSS Variables Editor */}
            {activeTab === 'theme' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif-brand text-lg text-brand-on-surface">
                    Centralized Theme & CSS Variables Customizer
                  </h3>
                  <p className="text-xs text-brand-on-surface-variant">
                    Update colors, surfaces, button shapes, and typography. Changes apply in real-time to every screen and persist in local memory.
                  </p>
                </div>

                {/* Preset Themes */}
                <div className="space-y-2">
                  <label className="text-xs font-label-brand font-bold uppercase tracking-wider text-brand-on-surface">
                    Instant Theme Presets:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {THEME_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => {
                          setTheme(preset);
                          showToast(`Applied preset: ${preset.name}`);
                        }}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          theme.id === preset.id
                            ? 'border-brand-primary ring-2 ring-brand-primary/30 bg-brand-surface-card'
                            : 'border-brand-outline-variant/60 bg-brand-surface-card hover:bg-brand-surface-container'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-brand-on-surface">
                            {preset.name}
                          </span>
                          {theme.id === preset.id && (
                            <Check className="w-3.5 h-3.5 text-brand-primary" />
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-5 h-5 rounded-full border border-black/10 shadow-2xs"
                            style={{ backgroundColor: preset.primary }}
                            title="Primary"
                          />
                          <span
                            className="w-5 h-5 rounded-full border border-black/10 shadow-2xs"
                            style={{ backgroundColor: preset.secondary }}
                            title="Secondary"
                          />
                          <span
                            className="w-5 h-5 rounded-full border border-black/10 shadow-2xs"
                            style={{ backgroundColor: preset.surface }}
                            title="Surface"
                          />
                          <span
                            className="w-5 h-5 rounded-full border border-black/10 shadow-2xs"
                            style={{ backgroundColor: preset.outline }}
                            title="Outline"
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live CSS Variables Editor Form */}
                <div className="p-4 bg-brand-surface-container/40 rounded-xl border border-brand-outline-variant/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-label-brand font-bold uppercase tracking-wider text-brand-on-surface">
                      Customize Active CSS Variables:
                    </h4>
                    <button
                      onClick={resetThemeToDefault}
                      className="text-xs text-brand-muted hover:text-brand-primary flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset to Original</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Primary Color */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-brand-on-surface">
                        --color-primary (Brand Tone)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={theme.primary}
                          onChange={(e) => updateThemeVariable('primary', e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer border border-brand-outline-variant p-0.5"
                        />
                        <input
                          type="text"
                          value={theme.primary}
                          onChange={(e) => updateThemeVariable('primary', e.target.value)}
                          className="flex-1 p-1.5 text-xs font-mono border border-brand-outline-variant/60 rounded bg-brand-surface-card"
                        />
                      </div>
                    </div>

                    {/* Secondary Color */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-brand-on-surface">
                        --color-secondary (Turmeric Accent)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={theme.secondary}
                          onChange={(e) => updateThemeVariable('secondary', e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer border border-brand-outline-variant p-0.5"
                        />
                        <input
                          type="text"
                          value={theme.secondary}
                          onChange={(e) => updateThemeVariable('secondary', e.target.value)}
                          className="flex-1 p-1.5 text-xs font-mono border border-brand-outline-variant/60 rounded bg-brand-surface-card"
                        />
                      </div>
                    </div>

                    {/* Surface Color */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-brand-on-surface">
                        --color-surface (Warm Canvas)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={theme.surface}
                          onChange={(e) => updateThemeVariable('surface', e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer border border-brand-outline-variant p-0.5"
                        />
                        <input
                          type="text"
                          value={theme.surface}
                          onChange={(e) => updateThemeVariable('surface', e.target.value)}
                          className="flex-1 p-1.5 text-xs font-mono border border-brand-outline-variant/60 rounded bg-brand-surface-card"
                        />
                      </div>
                    </div>

                    {/* Outline Color */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-brand-on-surface">
                        --color-outline (Borders)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={theme.outline}
                          onChange={(e) => updateThemeVariable('outline', e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer border border-brand-outline-variant p-0.5"
                        />
                        <input
                          type="text"
                          value={theme.outline}
                          onChange={(e) => updateThemeVariable('outline', e.target.value)}
                          className="flex-1 p-1.5 text-xs font-mono border border-brand-outline-variant/60 rounded bg-brand-surface-card"
                        />
                      </div>
                    </div>

                    {/* Button Radius */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-brand-on-surface">
                        --radius-btn (Button Corners)
                      </label>
                      <select
                        value={theme.btnRadius}
                        onChange={(e) => updateThemeVariable('btnRadius', e.target.value)}
                        className="w-full p-2 text-xs border border-brand-outline-variant/60 rounded bg-brand-surface-card"
                      >
                        <option value="0px">Sharp Rectangular (0px)</option>
                        <option value="4px">Subtle Rounded (4px - Default)</option>
                        <option value="8px">Medium Rounded (8px)</option>
                        <option value="9999px">Pill / Capsule (9999px)</option>
                      </select>
                    </div>

                    {/* Card Radius */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-brand-on-surface">
                        --radius-card (Card Corners)
                      </label>
                      <select
                        value={theme.cardRadius}
                        onChange={(e) => updateThemeVariable('cardRadius', e.target.value)}
                        className="w-full p-2 text-xs border border-brand-outline-variant/60 rounded bg-brand-surface-card"
                      >
                        <option value="4px">Minimal (4px)</option>
                        <option value="10px">Artisanal Soft (10px - Default)</option>
                        <option value="16px">Extra Rounded (16px)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* CSS Variables Code Snippet Exporter */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-label-brand font-bold uppercase tracking-wider text-brand-on-surface">
                      Exportable theme.css Snippet:
                    </label>
                    <button
                      onClick={copyCssCode}
                      className="px-3 py-1 text-xs bg-brand-surface-container hover:bg-brand-surface-container-high rounded text-brand-on-surface flex items-center gap-1 transition cursor-pointer"
                    >
                      {copiedCode ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCode ? 'Copied!' : 'Copy CSS'}</span>
                    </button>
                  </div>
                  <pre className="p-3 bg-neutral-900 text-neutral-100 rounded-lg text-[11px] font-mono overflow-x-auto">
                    {generateCssVariablesSnippet(theme)}
                  </pre>
                </div>
              </div>
            )}

            {/* Tab 4: Store & WhatsApp Settings */}
            {activeTab === 'settings' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h3 className="font-serif-brand text-lg text-brand-on-surface">
                    Store Channels & Order Routing
                  </h3>
                  <p className="text-xs text-brand-on-surface-variant">
                    Configure WhatsApp ordering number, Instagram handle, and storefront announcement.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-label-brand font-bold uppercase text-brand-on-surface">
                      WhatsApp Business Number (with country code):
                    </label>
                    <input
                      type="text"
                      value={settings.whatsappNumber}
                      onChange={(e) => updateSettings({ whatsappNumber: e.target.value })}
                      placeholder="+919876543210"
                      className="w-full text-sm p-2.5 bg-brand-surface-card border border-brand-outline-variant/60 rounded-lg text-brand-on-surface"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-label-brand font-bold uppercase text-brand-on-surface">
                      Instagram Handle:
                    </label>
                    <input
                      type="text"
                      value={settings.instagramHandle}
                      onChange={(e) => updateSettings({ instagramHandle: e.target.value })}
                      placeholder="thepodifactory"
                      className="w-full text-sm p-2.5 bg-brand-surface-card border border-brand-outline-variant/60 rounded-lg text-brand-on-surface"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-label-brand font-bold uppercase text-brand-on-surface">
                      Top Announcement Message:
                    </label>
                    <textarea
                      rows={2}
                      value={settings.announcement}
                      onChange={(e) => updateSettings({ announcement: e.target.value })}
                      className="w-full text-sm p-2.5 bg-brand-surface-card border border-brand-outline-variant/60 rounded-lg text-brand-on-surface"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-label-brand font-bold uppercase text-brand-on-surface">
                      Store Address / Kitchen Origin:
                    </label>
                    <input
                      type="text"
                      value={settings.address}
                      onChange={(e) => updateSettings({ address: e.target.value })}
                      className="w-full text-sm p-2.5 bg-brand-surface-card border border-brand-outline-variant/60 rounded-lg text-brand-on-surface"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => showToast('Settings saved successfully!')}
                      className="px-6 py-2.5 text-xs font-label-brand font-bold uppercase text-white bg-brand-primary rounded-brand-btn transition cursor-pointer"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                      Save All Settings
                    </button>
                  </div>

                  {/* Cloud Database Connection Info Box */}
                  <div className="mt-8 p-4 bg-brand-surface-container rounded-xl border border-brand-outline-variant/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif-brand text-sm font-bold text-brand-on-surface flex items-center gap-2">
                        <Cloud className="w-4 h-4 text-brand-primary" />
                        <span>Cloud Database & Cross-Device Sync (Supabase)</span>
                      </h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isCloudConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {isCloudConnected ? 'Connected & Persistent' : 'Needs Supabase Keys in .env'}
                      </span>
                    </div>
                    <p className="text-[11px] text-brand-on-surface-variant leading-relaxed">
                      To synchronize prices, new products, and image uploads across all customer devices in real-time, run the included <code className="px-1.5 py-0.5 bg-brand-surface-card rounded text-brand-primary font-mono">supabase_schema.sql</code> in your free Supabase SQL editor and add your project URL and public Anon key to <code className="px-1.5 py-0.5 bg-brand-surface-card rounded text-brand-primary font-mono">.env</code>.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal for Editing Full Podi */}
          {editingPodi && (
            <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-brand-surface-card rounded-2xl max-w-xl w-full p-6 space-y-4 max-h-[92vh] overflow-y-auto border border-brand-outline-variant shadow-2xl">
                <div className="flex justify-between items-center border-b border-brand-outline-variant/30 pb-3">
                  <div>
                    <h4 className="font-serif-brand text-lg text-brand-on-surface">
                      Edit "{editingPodi.name}"
                    </h4>
                    <p className="text-[11px] text-brand-on-surface-variant">
                      Update recipe details, pricing, pack sizes & badges
                    </p>
                  </div>
                  <button onClick={() => setEditingPodi(null)} className="p-1 rounded-full hover:bg-brand-surface-container cursor-pointer">
                    <X className="w-5 h-5 text-brand-muted" />
                  </button>
                </div>

                <form onSubmit={handleSaveEditedPodi} className="space-y-4 text-xs">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-brand-on-surface">Podi Name *:</label>
                      <input
                        type="text"
                        required
                        value={editingPodi.name}
                        onChange={(e) => setEditingPodi({ ...editingPodi, name: e.target.value })}
                        className="w-full p-2 border border-brand-outline-variant rounded bg-brand-surface-card"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-brand-on-surface">Telugu Name:</label>
                      <input
                        type="text"
                        placeholder="e.g. మునగాకు కారం"
                        value={editingPodi.teluguName || ''}
                        onChange={(e) => setEditingPodi({ ...editingPodi, teluguName: e.target.value })}
                        className="w-full p-2 border border-brand-outline-variant rounded bg-brand-surface-card"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-brand-on-surface">Tagline / Short Flavor Profile *:</label>
                    <input
                      type="text"
                      required
                      value={editingPodi.tagline}
                      onChange={(e) => setEditingPodi({ ...editingPodi, tagline: e.target.value })}
                      className="w-full p-2 border border-brand-outline-variant rounded bg-brand-surface-card"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-brand-on-surface">About this Podi (Detailed Description):</label>
                    <textarea
                      rows={3}
                      value={editingPodi.description}
                      onChange={(e) => setEditingPodi({ ...editingPodi, description: e.target.value })}
                      className="w-full p-2 border border-brand-outline-variant rounded bg-brand-surface-card"
                    />
                  </div>

                  {/* Category, Heat, and Badge */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-brand-on-surface">Category:</label>
                      <select
                        value={editingPodi.category}
                        onChange={(e) => setEditingPodi({ ...editingPodi, category: e.target.value as any })}
                        className="w-full p-2 border border-brand-outline-variant rounded bg-brand-surface-card"
                      >
                        <option value="traditional">🌶️ Traditional Karams</option>
                        <option value="leafy">🌿 Leafy Superfoods</option>
                        <option value="lentils">🥜 Lentils & Seeds</option>
                        <option value="combos">🎁 Combos & Gifts</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-brand-on-surface">Spiciness Heat:</label>
                      <select
                        value={editingPodi.spiciness}
                        onChange={(e) => setEditingPodi({ ...editingPodi, spiciness: Number(e.target.value) as any })}
                        className="w-full p-2 border border-brand-outline-variant rounded bg-brand-surface-card"
                      >
                        <option value={1}>Mild (1 🔥)</option>
                        <option value={2}>Medium (2 🔥🔥)</option>
                        <option value={3}>Andhra Fiery (3 🔥🔥🔥)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-brand-on-surface">Badge Tag:</label>
                      <select
                        value={editingPodi.badge || ''}
                        onChange={(e) => setEditingPodi({ ...editingPodi, badge: e.target.value })}
                        className="w-full p-2 border border-brand-outline-variant rounded bg-brand-surface-card"
                      >
                        <option value="">(No Badge)</option>
                        <option value="Bestseller">Bestseller 🔥</option>
                        <option value="Classic Favorite">Classic Favorite ⭐</option>
                        <option value="Artisanal Blend">Artisanal Blend 🌿</option>
                        <option value="Signature Reserve">Signature Reserve 👑</option>
                        <option value="Seasonal Special">Seasonal Special 🍂</option>
                        <option value="New Harvest">New Harvest 🌱</option>
                        <option value="Chef's Special">Chef's Special 👨‍🍳</option>
                      </select>
                    </div>
                  </div>

                  {/* Package Rates & Rates Before Offer (MRP) */}
                  <div className="p-3 bg-brand-surface-container/40 rounded-xl border border-brand-outline-variant/40 space-y-2.5">
                    <div className="flex justify-between items-center">
                      <label className="font-bold text-brand-on-surface">
                        Package Sizes, Offer Rates & Before-Offer MRP:
                      </label>
                      <span className="text-[10px] text-brand-muted">Strike-through MRP will appear automatically</span>
                    </div>

                    <div className="space-y-2">
                      {editingPodi.weights.map((w, idx) => (
                        <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-brand-surface-card p-2.5 rounded-lg border border-brand-outline-variant/40 items-center">
                          <div>
                            <span className="font-bold text-brand-on-surface text-xs block">{w.label}</span>
                            <span className="text-[10px] text-brand-muted">{w.grams} grams</span>
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-brand-primary block">Offer Price (₹):</label>
                            <input
                              type="number"
                              required
                              value={w.price}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                const updatedWeights = [...editingPodi.weights];
                                updatedWeights[idx] = { ...updatedWeights[idx], price: val };
                                setEditingPodi({
                                  ...editingPodi,
                                  weights: updatedWeights,
                                  price: idx === 1 ? val : editingPodi.price,
                                });
                              }}
                              className="w-full p-1.5 border border-brand-outline-variant rounded bg-brand-surface-card font-bold text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-brand-muted block">Rate Before Offer / MRP (₹):</label>
                            <input
                              type="number"
                              placeholder="e.g. 299 (optional)"
                              value={w.originalPrice || ''}
                              onChange={(e) => {
                                const val = e.target.value ? Number(e.target.value) : undefined;
                                const updatedWeights = [...editingPodi.weights];
                                updatedWeights[idx] = { ...updatedWeights[idx], originalPrice: val };
                                setEditingPodi({
                                  ...editingPodi,
                                  weights: updatedWeights,
                                  originalPrice: idx === 1 ? val : editingPodi.originalPrice,
                                });
                              }}
                              className="w-full p-1.5 border border-brand-outline-variant rounded bg-brand-surface-card text-xs"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pure Ingredients */}
                  <div className="space-y-1">
                    <label className="font-bold text-brand-on-surface">
                      Pure Ingredients (comma-separated):
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Guntur Red Chillies, Roasted Bengal Gram, Garlic, Cumin, Rock Salt"
                      value={(editingPodi.ingredients || []).join(', ')}
                      onChange={(e) => {
                        const arr = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                        setEditingPodi({ ...editingPodi, ingredients: arr });
                      }}
                      className="w-full p-2 border border-brand-outline-variant rounded bg-brand-surface-card"
                    />
                  </div>

                  {/* Health Benefits */}
                  <div className="space-y-1">
                    <label className="font-bold text-brand-on-surface">
                      Health Benefits (one per line):
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Rich in natural dietary fiber and plant protein&#10;Zero artificial preservatives or colors&#10;Aids smooth digestion and gut health"
                      value={(editingPodi.healthBenefits || []).join('\n')}
                      onChange={(e) => {
                        const arr = e.target.value.split('\n').map((s) => s.trim()).filter(Boolean);
                        setEditingPodi({ ...editingPodi, healthBenefits: arr });
                      }}
                      className="w-full p-2 border border-brand-outline-variant rounded bg-brand-surface-card"
                    />
                  </div>

                  {/* How to Enjoy (Traditional Pairings) */}
                  <div className="space-y-1">
                    <label className="font-bold text-brand-on-surface">
                      How to Enjoy / Traditional Pairings (one per line):
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Hot steamed rice with generous melted homemade ghee&#10;Crispy golden ghee roast dosa accompaniment&#10;Soft hot idlis sprinkled with sesame oil"
                      value={(editingPodi.servingSuggestions || []).join('\n')}
                      onChange={(e) => {
                        const arr = e.target.value.split('\n').map((s) => s.trim()).filter(Boolean);
                        setEditingPodi({ ...editingPodi, servingSuggestions: arr });
                      }}
                      className="w-full p-2 border border-brand-outline-variant rounded bg-brand-surface-card"
                    />
                  </div>

                  {/* Spotlight & Availability */}
                  <div className="flex items-center justify-between p-2.5 bg-brand-surface-container/40 rounded-lg border border-brand-outline-variant/30">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-brand-on-surface">
                      <input
                        type="checkbox"
                        checked={editingPodi.isFeatured || false}
                        onChange={(e) => setEditingPodi({ ...editingPodi, isFeatured: e.target.checked })}
                        className="rounded text-brand-primary"
                      />
                      <span>Spotlight in Hero Carousel</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-brand-on-surface">
                      <input
                        type="checkbox"
                        checked={editingPodi.inStock !== false}
                        onChange={(e) => setEditingPodi({ ...editingPodi, inStock: e.target.checked })}
                        className="rounded text-emerald-600"
                      />
                      <span>In Stock & Available</span>
                    </label>
                  </div>

                  {/* Image Uploader */}
                  <div className="space-y-2">
                    <label className="font-bold text-brand-on-surface">Product Image:</label>
                    <div className="flex items-center gap-3">
                      <img
                        src={editingPodi.image || '/logo.png'}
                        alt={editingPodi.name}
                        className="w-12 h-12 rounded-lg object-cover border border-brand-outline-variant shrink-0 bg-brand-surface-container"
                      />
                      <div className="flex-1 space-y-1.5">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-brand-outline-variant bg-brand-surface-container hover:bg-brand-surface text-brand-on-surface cursor-pointer transition">
                          {isUploadingImage ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-primary" />
                          ) : (
                            <UploadCloud className="w-3.5 h-3.5 text-brand-primary" />
                          )}
                          <span>{isUploadingImage ? 'Uploading to Cloud...' : 'Upload Image from Computer'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageFileUpload(e, 'editing')}
                            className="hidden"
                            disabled={isUploadingImage}
                          />
                        </label>
                        <input
                          type="url"
                          placeholder="Or paste image URL directly..."
                          value={editingPodi.image}
                          onChange={(e) => setEditingPodi({ ...editingPodi, image: e.target.value })}
                          className="w-full p-2 border border-brand-outline-variant rounded bg-brand-surface-card font-mono text-[11px]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-brand-outline-variant/30">
                    <button
                      type="button"
                      onClick={() => setEditingPodi(null)}
                      className="px-4 py-2 border rounded cursor-pointer hover:bg-brand-surface-container"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-brand-primary text-white rounded font-bold cursor-pointer hover:opacity-90 shadow-xs"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal for Adding New Podi */}
          {isAddingNew && (
            <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-brand-surface-card rounded-2xl max-w-xl w-full p-6 space-y-4 max-h-[92vh] overflow-y-auto border border-brand-outline-variant shadow-2xl">
                <div className="flex justify-between items-center border-b border-brand-outline-variant/30 pb-3">
                  <div>
                    <h4 className="font-serif-brand text-lg text-brand-on-surface">
                      Add New Podi Blend
                    </h4>
                    <p className="text-[11px] text-brand-on-surface-variant">
                      Create and publish a new podi to the live catalog
                    </p>
                  </div>
                  <button onClick={() => setIsAddingNew(false)} className="p-1 rounded-full hover:bg-brand-surface-container cursor-pointer">
                    <X className="w-5 h-5 text-brand-muted" />
                  </button>
                </div>

                <form onSubmit={handleCreateNewPodi} className="space-y-4 text-xs">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-brand-on-surface">Podi Name *:</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Kothimeera Karam"
                        value={newPodiForm.name}
                        onChange={(e) => setNewPodiForm({ ...newPodiForm, name: e.target.value })}
                        className="w-full p-2 border border-brand-outline-variant rounded bg-brand-surface-card"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-brand-on-surface">Telugu Name:</label>
                      <input
                        type="text"
                        placeholder="e.g. కొత్తిమీర కారం"
                        value={newPodiForm.teluguName || ''}
                        onChange={(e) => setNewPodiForm({ ...newPodiForm, teluguName: e.target.value })}
                        className="w-full p-2 border border-brand-outline-variant rounded bg-brand-surface-card"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-brand-on-surface">Tagline / Short Flavor Profile *:</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Fresh coriander leaves stone-ground with garlic & chillies"
                      value={newPodiForm.tagline}
                      onChange={(e) => setNewPodiForm({ ...newPodiForm, tagline: e.target.value })}
                      className="w-full p-2 border border-brand-outline-variant rounded bg-brand-surface-card"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-brand-on-surface">About this Podi (Detailed Description):</label>
                    <textarea
                      rows={3}
                      placeholder="Artisanal preparation, roasting method, spice notes, and kitchen heritage..."
                      value={newPodiForm.description}
                      onChange={(e) => setNewPodiForm({ ...newPodiForm, description: e.target.value })}
                      className="w-full p-2 border border-brand-outline-variant rounded bg-brand-surface-card"
                    />
                  </div>

                  {/* Category, Heat, and Badge */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-brand-on-surface">Category:</label>
                      <select
                        value={newPodiForm.category}
                        onChange={(e) => setNewPodiForm({ ...newPodiForm, category: e.target.value as any })}
                        className="w-full p-2 border border-brand-outline-variant rounded bg-brand-surface-card"
                      >
                        <option value="traditional">🌶️ Traditional Karams</option>
                        <option value="leafy">🌿 Leafy Superfoods</option>
                        <option value="lentils">🥜 Lentils & Seeds</option>
                        <option value="combos">🎁 Combos & Gifts</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-brand-on-surface">Spiciness Heat:</label>
                      <select
                        value={newPodiForm.spiciness}
                        onChange={(e) => setNewPodiForm({ ...newPodiForm, spiciness: Number(e.target.value) as any })}
                        className="w-full p-2 border border-brand-outline-variant rounded bg-brand-surface-card"
                      >
                        <option value={1}>Mild (1 🔥)</option>
                        <option value={2}>Medium (2 🔥🔥)</option>
                        <option value={3}>Andhra Fiery (3 🔥🔥🔥)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-brand-on-surface">Badge Tag:</label>
                      <select
                        value={newPodiForm.badge || ''}
                        onChange={(e) => setNewPodiForm({ ...newPodiForm, badge: e.target.value })}
                        className="w-full p-2 border border-brand-outline-variant rounded bg-brand-surface-card"
                      >
                        <option value="">(No Badge)</option>
                        <option value="Bestseller">Bestseller 🔥</option>
                        <option value="Classic Favorite">Classic Favorite ⭐</option>
                        <option value="Artisanal Blend">Artisanal Blend 🌿</option>
                        <option value="Signature Reserve">Signature Reserve 👑</option>
                        <option value="Seasonal Special">Seasonal Special 🍂</option>
                        <option value="New Harvest">New Harvest 🌱</option>
                        <option value="Chef's Special">Chef's Special 👨‍🍳</option>
                      </select>
                    </div>
                  </div>

                  {/* Package Rates & Rates Before Offer (MRP) */}
                  <div className="p-3 bg-brand-surface-container/40 rounded-xl border border-brand-outline-variant/40 space-y-2.5">
                    <div className="flex justify-between items-center">
                      <label className="font-bold text-brand-on-surface">
                        Package Sizes, Offer Rates & Before-Offer MRP:
                      </label>
                      <span className="text-[10px] text-brand-muted">Set selling price & original MRP for each pack</span>
                    </div>

                    <div className="space-y-2">
                      {newPodiForm.weights.map((w, idx) => (
                        <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-brand-surface-card p-2.5 rounded-lg border border-brand-outline-variant/40 items-center">
                          <div>
                            <span className="font-bold text-brand-on-surface text-xs block">{w.label}</span>
                            <span className="text-[10px] text-brand-muted">{w.grams} grams</span>
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-brand-primary block">Offer Price (₹) *:</label>
                            <input
                              type="number"
                              required
                              value={w.price}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                const updatedWeights = [...newPodiForm.weights];
                                updatedWeights[idx] = { ...updatedWeights[idx], price: val };
                                setNewPodiForm({
                                  ...newPodiForm,
                                  weights: updatedWeights,
                                  price: idx === 1 ? val : newPodiForm.price,
                                });
                              }}
                              className="w-full p-1.5 border border-brand-outline-variant rounded bg-brand-surface-card font-bold text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-brand-muted block">Rate Before Offer / MRP (₹):</label>
                            <input
                              type="number"
                              placeholder="e.g. 299 (optional)"
                              value={w.originalPrice || ''}
                              onChange={(e) => {
                                const val = e.target.value ? Number(e.target.value) : undefined;
                                const updatedWeights = [...newPodiForm.weights];
                                updatedWeights[idx] = { ...updatedWeights[idx], originalPrice: val };
                                setNewPodiForm({
                                  ...newPodiForm,
                                  weights: updatedWeights,
                                  originalPrice: idx === 1 ? val : newPodiForm.originalPrice,
                                });
                              }}
                              className="w-full p-1.5 border border-brand-outline-variant rounded bg-brand-surface-card text-xs"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pure Ingredients */}
                  <div className="space-y-1">
                    <label className="font-bold text-brand-on-surface">
                      Pure Ingredients (comma-separated):
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Guntur Red Chillies, Roasted Bengal Gram, Garlic, Cumin, Rock Salt"
                      value={(newPodiForm.ingredients || []).join(', ')}
                      onChange={(e) => {
                        const arr = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                        setNewPodiForm({ ...newPodiForm, ingredients: arr });
                      }}
                      className="w-full p-2 border border-brand-outline-variant rounded bg-brand-surface-card"
                    />
                  </div>

                  {/* Health Benefits */}
                  <div className="space-y-1">
                    <label className="font-bold text-brand-on-surface">
                      Health Benefits (one per line):
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Rich in natural dietary fiber and plant protein&#10;Zero artificial preservatives or colors&#10;Aids smooth digestion and gut health"
                      value={(newPodiForm.healthBenefits || []).join('\n')}
                      onChange={(e) => {
                        const arr = e.target.value.split('\n').map((s) => s.trim()).filter(Boolean);
                        setNewPodiForm({ ...newPodiForm, healthBenefits: arr });
                      }}
                      className="w-full p-2 border border-brand-outline-variant rounded bg-brand-surface-card"
                    />
                  </div>

                  {/* How to Enjoy (Traditional Pairings) */}
                  <div className="space-y-1">
                    <label className="font-bold text-brand-on-surface">
                      How to Enjoy / Traditional Pairings (one per line):
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Hot steamed rice with generous melted homemade ghee&#10;Crispy golden ghee roast dosa accompaniment&#10;Soft hot idlis sprinkled with sesame oil"
                      value={(newPodiForm.servingSuggestions || []).join('\n')}
                      onChange={(e) => {
                        const arr = e.target.value.split('\n').map((s) => s.trim()).filter(Boolean);
                        setNewPodiForm({ ...newPodiForm, servingSuggestions: arr });
                      }}
                      className="w-full p-2 border border-brand-outline-variant rounded bg-brand-surface-card"
                    />
                  </div>

                  {/* Spotlight & Availability */}
                  <div className="flex items-center justify-between p-2.5 bg-brand-surface-container/40 rounded-lg border border-brand-outline-variant/30">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-brand-on-surface">
                      <input
                        type="checkbox"
                        checked={newPodiForm.isFeatured || false}
                        onChange={(e) => setNewPodiForm({ ...newPodiForm, isFeatured: e.target.checked })}
                        className="rounded text-brand-primary"
                      />
                      <span>Spotlight in Hero Carousel</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-brand-on-surface">
                      <input
                        type="checkbox"
                        checked={newPodiForm.inStock !== false}
                        onChange={(e) => setNewPodiForm({ ...newPodiForm, inStock: e.target.checked })}
                        className="rounded text-emerald-600"
                      />
                      <span>In Stock & Available</span>
                    </label>
                  </div>

                  {/* Image Uploader */}
                  <div className="space-y-2">
                    <label className="font-bold text-brand-on-surface">Product Image:</label>
                    <div className="flex items-center gap-3">
                      <img
                        src={newPodiForm.image || '/logo.png'}
                        alt="Preview"
                        className="w-12 h-12 rounded-lg object-cover border border-brand-outline-variant shrink-0 bg-brand-surface-container"
                      />
                      <div className="flex-1 space-y-1.5">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-brand-outline-variant bg-brand-surface-container hover:bg-brand-surface text-brand-on-surface cursor-pointer transition">
                          {isUploadingImage ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-primary" />
                          ) : (
                            <UploadCloud className="w-3.5 h-3.5 text-brand-primary" />
                          )}
                          <span>{isUploadingImage ? 'Uploading to Cloud...' : 'Upload Image from Computer'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageFileUpload(e, 'new')}
                            className="hidden"
                            disabled={isUploadingImage}
                          />
                        </label>
                        <input
                          type="url"
                          placeholder="Or paste image URL directly..."
                          value={newPodiForm.image}
                          onChange={(e) => setNewPodiForm({ ...newPodiForm, image: e.target.value })}
                          className="w-full p-2 border border-brand-outline-variant rounded bg-brand-surface-card font-mono text-[11px]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-brand-outline-variant/30">
                    <button
                      type="button"
                      onClick={() => setIsAddingNew(false)}
                      className="px-4 py-2 border rounded cursor-pointer hover:bg-brand-surface-container"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-brand-primary text-white rounded font-bold cursor-pointer hover:opacity-90 shadow-xs"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                      Add to Live Store
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
