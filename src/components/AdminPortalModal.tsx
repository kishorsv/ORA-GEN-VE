import React, { useState, useEffect } from 'react';
import type { WatchModel, DbInquiry, DbSiteSettings } from '../types/database';
import { updateWatchStock, deleteWatch, createWatch, updateWatch } from '../services/watches';
import { fetchInquiries, updateInquiryStatus, subscribeToInquiries } from '../services/inquiries';
import { uploadImageFile } from '../services/storage';
import { isSupabaseConfigured } from '../lib/supabase';
import {
  X,
  Plus,
  Trash2,
  Save,
  Radio,
  Sliders,
  Inbox,
  Settings as SettingsIcon,
  RefreshCw,
  Upload,
  CheckCircle,
  Database,
} from 'lucide-react';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  watches: WatchModel[];
  siteSettings: DbSiteSettings;
  onUpdateSiteSettings: (settings: Partial<DbSiteSettings>) => Promise<any>;
  onWatchUpdated?: () => void;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  watches,
  siteSettings,
  onUpdateSiteSettings,
  onWatchUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'add' | 'inquiries' | 'settings'>('inventory');
  const [inquiries, setInquiries] = useState<DbInquiry[]>([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<DbSiteSettings>(siteSettings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // New watch form state
  const [newWatchData, setNewWatchData] = useState({
    name: 'ORA 05',
    slug: 'ora-05',
    collection: 'Master Chronometer',
    subtitle: 'Calibre 950 Perpetual Chronograph',
    tagline: 'The pinnacle of astronomical time.',
    description: 'An extraordinary perpetual calendar chronograph combining moonphase indications, perpetual leap-year programming, and an open architecture Calibre 950 movement.',
    price: 42000,
    price_chf: 38900,
    currency: 'USD',
    stock: 5,
    status: 'available' as const,
    is_active: true,
    hero_image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=2400&q=95',
    movement_image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=2400&q=95',
    case_material: '18K White Gold',
    diameter: '41.0 mm',
    movement: 'Manufacture Calibre 950',
    power_reserve: '70 Hours',
  });

  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    setSettingsForm(siteSettings);
  }, [siteSettings]);

  useEffect(() => {
    if (isOpen) {
      loadInquiries();
      const unsub = subscribeToInquiries(() => loadInquiries());
      return () => unsub();
    }
  }, [isOpen]);

  const loadInquiries = async () => {
    setInquiriesLoading(true);
    const data = await fetchInquiries();
    setInquiries(data);
    setInquiriesLoading(false);
  };

  if (!isOpen) return null;

  // Handlers
  const handleStockChange = async (id: string, newStock: number) => {
    await updateWatchStock(id, newStock);
    onWatchUpdated?.();
  };

  const handleDeleteWatch = async (id: string) => {
    if (window.confirm('Confirm removal of this timepiece from the Maison database?')) {
      await deleteWatch(id);
      onWatchUpdated?.();
    }
  };

  const handleStatusChange = async (id: string, status: any) => {
    await updateWatch(id, { status });
    onWatchUpdated?.();
  };

  const handleInquiryStatus = async (id: string, status: any) => {
    await updateInquiryStatus(id, status);
    loadInquiries();
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateSiteSettings(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: 'hero_image' | 'movement_image') => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const url = await uploadImageFile(file, 'watch-images');
      setNewWatchData((prev) => ({ ...prev, [targetField]: url }));
    } catch (err) {
      console.error('Image upload failed', err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCreateWatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createWatch(
      {
        name: newWatchData.name,
        slug: newWatchData.slug,
        collection: newWatchData.collection,
        subtitle: newWatchData.subtitle,
        tagline: newWatchData.tagline,
        description: newWatchData.description,
        price: Number(newWatchData.price),
        price_chf: Number(newWatchData.price_chf),
        currency: newWatchData.currency,
        stock: Number(newWatchData.stock),
        status: newWatchData.status,
        is_active: newWatchData.is_active,
        hero_image: newWatchData.hero_image,
        movement_image: newWatchData.movement_image,
      },
      [
        { image_url: newWatchData.hero_image, image_type: 'hero', sort_order: 0 },
        { image_url: newWatchData.hero_image, image_type: 'front', sort_order: 1 },
        { image_url: newWatchData.movement_image, image_type: 'movement', sort_order: 2 },
      ],
      {
        reference: `REF. 950-${Math.floor(100 + Math.random() * 899)}`,
        case_material: newWatchData.case_material,
        diameter: newWatchData.diameter,
        thickness: '10.2 mm',
        movement: newWatchData.movement,
        frequency: '28,800 vph (4.0 Hz)',
        jewels: '35 Synthetic Rubies',
        power_reserve: newWatchData.power_reserve,
        water_resistance: '50 Meters / 5 ATM',
        crystal: 'Domed sapphire crystal',
        strap: 'Alligator leather strap',
        clasp: 'Folding buckle',
        finishing: 'Hand-chamfered bridges',
      }
    );

    onWatchUpdated?.();
    setActiveTab('inventory');
  };

  const connectionStatus = isSupabaseConfigured ? 'CONNECTED' : 'LOCAL DB (PERSISTED)';

  return (
    <div
      className="fixed inset-0 z-[9999] bg-[#030303]/95 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-[#070707] border border-white/[0.08] shadow-2xl shadow-black rounded-sm overflow-hidden my-auto animate-fadeIn flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-white/[0.08] bg-[#050505]">
          <div className="flex items-center gap-3">
            <Sliders className="w-4 h-4 text-luxury-champagne" />
            <div>
              <span className="font-serif text-xl tracking-[0.2em] text-luxury-ivory font-light">
                MAISON ATELIER PORTAL
              </span>
              <span className="font-mono text-[9px] tracking-[0.3em] text-luxury-champagne block mt-0.5">
                REAL-TIME DATABASE & INVENTORY CONTROLLER
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Connection Indicator */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-black/60 border border-white/[0.08]">
              <Radio
                className={`w-3 h-3 animate-pulse ${
                  isSupabaseConfigured ? 'text-emerald-400' : 'text-luxury-champagne'
                }`}
              />
              <span className="font-mono text-[8px] tracking-wider text-luxury-stone">
                {connectionStatus}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-luxury-stone hover:text-luxury-ivory"
              data-cursor="CLOSE"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>
        </div>

        {/* Tab Toggle Navigation */}
        <div className="flex border-b border-white/[0.08] bg-[#060606] px-6 sm:px-8 overflow-x-auto">
          {[
            { id: 'inventory', label: `TIMEPIECES (${watches.length})`, icon: Database },
            { id: 'add', label: '+ ADD NEW TIMEPIECE', icon: Plus },
            { id: 'inquiries', label: `CLIENT INQUIRIES (${inquiries.length})`, icon: Inbox },
            { id: 'settings', label: 'SITE SETTINGS', icon: SettingsIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3.5 px-4 font-mono text-[10px] tracking-[0.2em] transition-all relative flex items-center gap-2 whitespace-nowrap ${
                  isSelected ? 'text-luxury-champagne' : 'text-luxury-stone hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {isSelected && (
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-luxury-champagne" />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Panes */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {/* TAB 1: INVENTORY & WATCHES */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs font-mono text-luxury-stone/80">
                <span>EDIT STOCK, STATUS, OR METADATA (SYNCS REAL-TIME ACROSS SITE)</span>
                <span className="text-luxury-champagne">{watches.length} RECORDED MODELS</span>
              </div>

              <div className="space-y-4">
                {watches.map((watch) => (
                  <div
                    key={watch.id}
                    className="p-4 sm:p-5 bg-[#050505] border border-white/[0.06] rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    {/* Watch Identity */}
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-black p-1 rounded border border-white/[0.04] flex items-center justify-center flex-shrink-0">
                        <img
                          src={watch.hero_image}
                          alt={watch.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[8px] tracking-widest text-luxury-champagne uppercase">
                            {watch.collection}
                          </span>
                          <span className="text-white/20">·</span>
                          <span className="font-mono text-[8px] tracking-widest text-luxury-stone/60">
                            {watch.specs?.reference || 'REF. 900'}
                          </span>
                        </div>
                        <h4 className="font-serif text-xl font-light text-luxury-ivory">
                          {watch.name}
                        </h4>
                        <span className="font-mono text-xs text-luxury-stone">
                          {watch.formattedPrice}
                        </span>
                      </div>
                    </div>

                    {/* Controls: Stock Counter & Status */}
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                      {/* Stock Counter */}
                      <div className="flex items-center gap-2 bg-[#090909] border border-white/[0.08] px-3 py-1.5 rounded">
                        <span className="font-mono text-[9px] text-luxury-stone tracking-wider">STOCK:</span>
                        <button
                          onClick={() => handleStockChange(watch.id, watch.stock - 1)}
                          className="w-5 h-5 bg-white/10 hover:bg-white/20 text-white rounded flex items-center justify-center text-xs"
                          title="Decrease stock"
                        >
                          -
                        </button>
                        <span className="font-mono text-sm font-semibold text-luxury-ivory px-1.5">
                          {watch.stock}
                        </span>
                        <button
                          onClick={() => handleStockChange(watch.id, watch.stock + 1)}
                          className="w-5 h-5 bg-white/10 hover:bg-white/20 text-white rounded flex items-center justify-center text-xs"
                          title="Increase stock"
                        >
                          +
                        </button>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center gap-2">
                        <select
                          value={watch.status}
                          onChange={(e) => handleStatusChange(watch.id, e.target.value)}
                          className="bg-[#090909] border border-white/[0.08] text-luxury-ivory text-xs px-2.5 py-1.5 rounded font-mono uppercase focus:border-luxury-champagne focus:outline-none"
                        >
                          <option value="available">available</option>
                          <option value="limited">limited</option>
                          <option value="sold_out">sold out</option>
                          <option value="coming_soon">coming soon</option>
                        </select>
                      </div>

                      {/* Computed Badge */}
                      <span className="font-mono text-[9px] px-2 py-1 border rounded uppercase text-luxury-champagne border-luxury-champagne/30">
                        {watch.availability}
                      </span>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteWatch(watch.id)}
                        className="p-2 text-rose-400/60 hover:text-rose-400 hover:bg-rose-950/20 rounded transition-colors"
                        title="Delete timepiece"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: ADD NEW WATCH */}
          {activeTab === 'add' && (
            <form onSubmit={handleCreateWatchSubmit} className="space-y-6 max-w-3xl mx-auto">
              <div>
                <h3 className="font-serif text-2xl font-light text-luxury-ivory">
                  Add Timepiece to Haute Horlogerie Collection
                </h3>
                <p className="font-sans text-xs text-luxury-stone mt-1">
                  Upload real photography or link high-resolution studio assets. The timepiece will instantly appear across the public catalogue and anatomy experience.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[9px] tracking-widest text-luxury-stone/80 uppercase block mb-1">
                    MODEL NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={newWatchData.name}
                    onChange={(e) => setNewWatchData({ ...newWatchData, name: e.target.value })}
                    className="w-full bg-[#050505] border border-white/[0.1] px-3 py-2 text-xs text-luxury-ivory font-sans focus:outline-none focus:border-luxury-champagne"
                  />
                </div>

                <div>
                  <label className="font-mono text-[9px] tracking-widest text-luxury-stone/80 uppercase block mb-1">
                    SLUG (URL KEY) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newWatchData.slug}
                    onChange={(e) => setNewWatchData({ ...newWatchData, slug: e.target.value })}
                    className="w-full bg-[#050505] border border-white/[0.1] px-3 py-2 text-xs text-luxury-ivory font-mono focus:outline-none focus:border-luxury-champagne"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[9px] tracking-widest text-luxury-stone/80 uppercase block mb-1">
                    COLLECTION LINEAGE
                  </label>
                  <select
                    value={newWatchData.collection}
                    onChange={(e) => setNewWatchData({ ...newWatchData, collection: e.target.value })}
                    className="w-full bg-[#050505] border border-white/[0.1] px-3 py-2 text-xs text-luxury-ivory font-sans focus:outline-none focus:border-luxury-champagne"
                  >
                    <option value="Master Chronometer">Master Chronometer</option>
                    <option value="Grand Complication">Grand Complication</option>
                    <option value="Avant-Garde Skeleton">Avant-Garde Skeleton</option>
                    <option value="Métiers d’Art">Métiers d’Art</option>
                  </select>
                </div>

                <div>
                  <label className="font-mono text-[9px] tracking-widest text-luxury-stone/80 uppercase block mb-1">
                    SUBTITLE / COMPLICATION
                  </label>
                  <input
                    type="text"
                    value={newWatchData.subtitle}
                    onChange={(e) => setNewWatchData({ ...newWatchData, subtitle: e.target.value })}
                    className="w-full bg-[#050505] border border-white/[0.1] px-3 py-2 text-xs text-luxury-ivory font-sans focus:outline-none focus:border-luxury-champagne"
                  />
                </div>
              </div>

              {/* Photography URLs & Upload */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#050505] border border-white/[0.06] rounded-sm">
                <div>
                  <label className="font-mono text-[9px] tracking-widest text-luxury-champagne uppercase block mb-1">
                    HERO REAL WATCH PHOTOGRAPHY URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={newWatchData.hero_image}
                    onChange={(e) => setNewWatchData({ ...newWatchData, hero_image: e.target.value })}
                    className="w-full bg-[#090909] border border-white/[0.1] px-3 py-2 text-xs text-luxury-ivory font-mono focus:outline-none focus:border-luxury-champagne mb-2"
                  />
                  <label className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 hover:bg-white/10 text-luxury-stone hover:text-white rounded text-[10px] font-mono cursor-pointer transition-colors">
                    <Upload className="w-3 h-3" />
                    <span>Upload to Supabase Storage</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, 'hero_image')}
                    />
                  </label>
                </div>

                <div>
                  <label className="font-mono text-[9px] tracking-widest text-luxury-champagne uppercase block mb-1">
                    MOVEMENT PHOTOGRAPHY URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={newWatchData.movement_image}
                    onChange={(e) => setNewWatchData({ ...newWatchData, movement_image: e.target.value })}
                    className="w-full bg-[#090909] border border-white/[0.1] px-3 py-2 text-xs text-luxury-ivory font-mono focus:outline-none focus:border-luxury-champagne mb-2"
                  />
                  <label className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 hover:bg-white/10 text-luxury-stone hover:text-white rounded text-[10px] font-mono cursor-pointer transition-colors">
                    <Upload className="w-3 h-3" />
                    <span>Upload to Supabase Storage</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, 'movement_image')}
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-mono text-[9px] tracking-widest text-luxury-stone/80 uppercase block mb-1">
                    PRICE (USD)
                  </label>
                  <input
                    type="number"
                    value={newWatchData.price}
                    onChange={(e) => setNewWatchData({ ...newWatchData, price: Number(e.target.value) })}
                    className="w-full bg-[#050505] border border-white/[0.1] px-3 py-2 text-xs text-luxury-ivory font-sans focus:outline-none focus:border-luxury-champagne"
                  />
                </div>

                <div>
                  <label className="font-mono text-[9px] tracking-widest text-luxury-stone/80 uppercase block mb-1">
                    PRICE (CHF)
                  </label>
                  <input
                    type="number"
                    value={newWatchData.price_chf}
                    onChange={(e) => setNewWatchData({ ...newWatchData, price_chf: Number(e.target.value) })}
                    className="w-full bg-[#050505] border border-white/[0.1] px-3 py-2 text-xs text-luxury-ivory font-sans focus:outline-none focus:border-luxury-champagne"
                  />
                </div>

                <div>
                  <label className="font-mono text-[9px] tracking-widest text-luxury-stone/80 uppercase block mb-1">
                    INITIAL STOCK
                  </label>
                  <input
                    type="number"
                    value={newWatchData.stock}
                    onChange={(e) => setNewWatchData({ ...newWatchData, stock: Number(e.target.value) })}
                    className="w-full bg-[#050505] border border-white/[0.1] px-3 py-2 text-xs text-luxury-ivory font-sans focus:outline-none focus:border-luxury-champagne"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-[9px] tracking-widest text-luxury-stone/80 uppercase block mb-1">
                  EDITORIAL HOROLOGICAL DESCRIPTION
                </label>
                <textarea
                  rows={3}
                  value={newWatchData.description}
                  onChange={(e) => setNewWatchData({ ...newWatchData, description: e.target.value })}
                  className="w-full bg-[#050505] border border-white/[0.1] px-3 py-2 text-xs text-luxury-ivory font-sans focus:outline-none focus:border-luxury-champagne"
                />
              </div>

              <button
                type="submit"
                disabled={uploadingImage}
                className="w-full py-3.5 bg-luxury-champagne text-black font-mono text-[11px] tracking-[0.25em] hover:bg-white transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>SAVE & PUBLISH TIMEPIECE</span>
              </button>
            </form>
          )}

          {/* TAB 3: CLIENT INQUIRIES */}
          {activeTab === 'inquiries' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-luxury-stone/80">
                <span>CLIENT ALLOCATION DOSSIERS STORED IN SUPABASE</span>
                <button
                  onClick={loadInquiries}
                  className="flex items-center gap-1.5 text-luxury-champagne hover:underline"
                >
                  <RefreshCw className="w-3 h-3" /> REFRESH
                </button>
              </div>

              {inquiriesLoading ? (
                <div className="py-12 text-center font-mono text-[10px] tracking-widest text-luxury-stone">
                  LOADING ALLOCATION DOSSIERS...
                </div>
              ) : inquiries.length === 0 ? (
                <div className="py-12 text-center font-serif italic text-luxury-stone text-lg">
                  No allocation inquiries recorded yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="p-5 bg-[#050505] border border-white/[0.06] rounded-sm space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.05] pb-2">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[10px] tracking-wider text-luxury-champagne font-semibold">
                            {inq.reference_code}
                          </span>
                          <span className="font-serif text-lg text-luxury-ivory font-light">
                            {inq.client_name}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[9px] text-luxury-stone/60">
                            {new Date(inq.created_at).toLocaleDateString()}
                          </span>
                          <select
                            value={inq.status}
                            onChange={(e) => handleInquiryStatus(inq.id, e.target.value)}
                            className="bg-[#090909] border border-white/[0.1] text-xs px-2 py-1 rounded font-mono uppercase text-luxury-bone focus:outline-none"
                          >
                            <option value="pending">Pending</option>
                            <option value="contacted">Contacted</option>
                            <option value="allocated">Allocated</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[10px] text-luxury-stone/80">
                        <div>EMAIL: <span className="text-white">{inq.email}</span></div>
                        <div>PHONE: <span className="text-white">{inq.phone || 'N/A'}</span></div>
                        <div>SALON: <span className="text-white">{inq.location}</span></div>
                      </div>

                      <div className="text-xs font-sans text-luxury-stone/90 font-light bg-black/40 p-3 rounded border border-white/[0.03]">
                        <span className="text-luxury-champagne font-mono text-[9px] block mb-1">
                          TIMEPIECE: {inq.watch_name}
                        </span>
                        {inq.message || 'No additional message provided.'}
                        {inq.bespoke_engraving && (
                          <div className="mt-1 pt-1 border-t border-white/[0.04] font-mono text-[9px] text-luxury-stone/70">
                            ENGRAVING: "{inq.bespoke_engraving}"
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SITE SETTINGS */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-6 max-w-3xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-2xl font-light text-luxury-ivory">
                    Global Maison Configuration
                  </h3>
                  <p className="font-sans text-xs text-luxury-stone mt-1">
                    Control live announcements, hero copy, and contact credentials stored in Supabase.
                  </p>
                </div>

                {settingsSaved && (
                  <span className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-400">
                    <CheckCircle className="w-3.5 h-3.5" /> SAVED
                  </span>
                )}
              </div>

              {/* Announcement Bar */}
              <div className="p-4 bg-[#050505] border border-white/[0.06] rounded-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-wider text-luxury-champagne uppercase">
                    ANNOUNCEMENT BAR
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer font-mono text-[10px] text-luxury-stone">
                    <input
                      type="checkbox"
                      checked={settingsForm.announcement_active}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, announcement_active: e.target.checked })
                      }
                      className="rounded accent-luxury-champagne"
                    />
                    <span>ENABLE BANNER</span>
                  </label>
                </div>

                <input
                  type="text"
                  value={settingsForm.announcement_text}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, announcement_text: e.target.value })
                  }
                  className="w-full bg-[#090909] border border-white/[0.1] px-3 py-2 text-xs text-luxury-ivory font-mono focus:outline-none focus:border-luxury-champagne"
                />
              </div>

              {/* Hero Headings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[9px] tracking-widest text-luxury-stone/80 uppercase block mb-1">
                    HERO DISPLAY TITLE
                  </label>
                  <input
                    type="text"
                    value={settingsForm.hero_title}
                    onChange={(e) => setSettingsForm({ ...settingsForm, hero_title: e.target.value })}
                    className="w-full bg-[#050505] border border-white/[0.1] px-3 py-2 text-xs text-luxury-ivory font-sans focus:outline-none focus:border-luxury-champagne"
                  />
                </div>

                <div>
                  <label className="font-mono text-[9px] tracking-widest text-luxury-stone/80 uppercase block mb-1">
                    HERO SUBTITLE
                  </label>
                  <input
                    type="text"
                    value={settingsForm.hero_subtitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, hero_subtitle: e.target.value })}
                    className="w-full bg-[#050505] border border-white/[0.1] px-3 py-2 text-xs text-luxury-ivory font-sans focus:outline-none focus:border-luxury-champagne"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-[9px] tracking-widest text-luxury-stone/80 uppercase block mb-1">
                  HERO TAGLINE
                </label>
                <input
                  type="text"
                  value={settingsForm.hero_tagline}
                  onChange={(e) => setSettingsForm({ ...settingsForm, hero_tagline: e.target.value })}
                  className="w-full bg-[#050505] border border-white/[0.1] px-3 py-2 text-xs text-luxury-ivory font-sans focus:outline-none focus:border-luxury-champagne"
                />
              </div>

              {/* Contact Credentials */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[9px] tracking-widest text-luxury-stone/80 uppercase block mb-1">
                    CONCIERGE EMAIL
                  </label>
                  <input
                    type="email"
                    value={settingsForm.contact_email}
                    onChange={(e) => setSettingsForm({ ...settingsForm, contact_email: e.target.value })}
                    className="w-full bg-[#050505] border border-white/[0.1] px-3 py-2 text-xs text-luxury-ivory font-mono focus:outline-none focus:border-luxury-champagne"
                  />
                </div>

                <div>
                  <label className="font-mono text-[9px] tracking-widest text-luxury-stone/80 uppercase block mb-1">
                    GENEVA PHONE
                  </label>
                  <input
                    type="text"
                    value={settingsForm.contact_phone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, contact_phone: e.target.value })}
                    className="w-full bg-[#050505] border border-white/[0.1] px-3 py-2 text-xs text-luxury-ivory font-mono focus:outline-none focus:border-luxury-champagne"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-luxury-champagne text-black font-mono text-[10px] tracking-[0.25em] hover:bg-white transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <Save className="w-3.5 h-3.5" />
                <span>SAVE GLOBAL SETTINGS</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
