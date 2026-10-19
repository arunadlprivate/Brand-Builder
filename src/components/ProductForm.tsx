import React, { useState } from 'react';
import { ProductConcept } from '../types';
import { PRODUCT_PRESETS } from '../data/presets';
import { Sparkles, Upload, Wand2, Palette, Box, Check, RefreshCw, AlertCircle } from 'lucide-react';

interface ProductFormProps {
  product: ProductConcept;
  onChange: (updated: ProductConcept) => void;
  onGenerateMaster: () => void;
  onUploadImage: (file: File) => void;
  isGenerating: boolean;
  selectedModel: string;
  onModelChange: (model: string) => void;
  hasMasterImage: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onChange,
  onGenerateMaster,
  onUploadImage,
  isGenerating,
  selectedModel,
  onModelChange,
  hasMasterImage,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSelectPreset = (preset: ProductConcept) => {
    onChange({ ...preset });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadImage(file);
    }
  };

  return (
    <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-5 sm:p-6 backdrop-blur-sm shadow-xl">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-mono font-bold text-sm">
            01
          </div>
          <div>
            <h2 className="text-base font-semibold text-neutral-100 flex items-center gap-2">
              Product Definition & Visual Anchor
            </h2>
            <p className="text-xs text-neutral-400">
              Describe your product or pick an artisanal concept to lock in brand consistency.
            </p>
          </div>
        </div>

        {/* Tab switcher: Presets vs Custom */}
        <div className="flex items-center p-1 bg-neutral-950/80 rounded-xl border border-neutral-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition ${
              activeTab === 'presets'
                ? 'bg-neutral-800 text-amber-300 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Curated Presets
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition ${
              activeTab === 'custom'
                ? 'bg-neutral-800 text-amber-300 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Custom Brand
          </button>
        </div>
      </div>

      {/* Preset Pills */}
      {activeTab === 'presets' && (
        <div className="mt-4 pt-1">
          <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2 block">
            Select a Reference Brand Concept
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {PRODUCT_PRESETS.map((preset) => {
              const isSelected = product.id === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`text-left p-3 rounded-xl border transition group cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-neutral-800/90 border-amber-500/60 ring-1 ring-amber-500/40 shadow-lg shadow-amber-500/5'
                      : 'bg-neutral-950/40 hover:bg-neutral-800/50 border-neutral-800/90 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-neutral-100 group-hover:text-amber-200 transition">
                      {preset.name}
                    </span>
                    <span
                      className="w-3 h-3 rounded-full border border-neutral-700 shrink-0"
                      style={{ backgroundColor: preset.colorPalette.secondaryHex }}
                      title={preset.colorPalette.name}
                    />
                  </div>
                  <div className="text-[11px] text-neutral-400 line-clamp-1 mb-1">
                    {preset.tagline}
                  </div>
                  <div className="text-[10px] text-neutral-500 font-mono">
                    {preset.category}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Form Fields */}
      <div className="mt-5 space-y-4">
        {/* Name & Category Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-neutral-300 mb-1.5 block">
              Product / Brand Name
            </label>
            <input
              type="text"
              value={product.name}
              onChange={(e) => onChange({ ...product, name: e.target.value })}
              placeholder="e.g. AURA L'ÉLIXIR"
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/90 border border-neutral-800 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/30 transition"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-300 mb-1.5 block">
              Category
            </label>
            <input
              type="text"
              value={product.category}
              onChange={(e) => onChange({ ...product, category: e.target.value })}
              placeholder="e.g. Luxury Skincare"
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/90 border border-neutral-800 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/30 transition"
            />
          </div>
        </div>

        {/* Tagline */}
        <div>
          <label className="text-xs font-medium text-neutral-300 mb-1.5 block">
            Campaign Slogan / Hook
          </label>
          <input
            type="text"
            value={product.tagline}
            onChange={(e) => onChange({ ...product, tagline: e.target.value })}
            placeholder="e.g. Luminescent botanical cellular nectar"
            className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/90 border border-neutral-800 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/30 transition"
          />
        </div>

        {/* Detailed Physical Description */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-neutral-300">
              Form Factor, Materials & Packaging Details
            </label>
            <span className="text-[10px] text-neutral-500 font-mono">
              Key anchor for shot consistency
            </span>
          </div>
          <textarea
            rows={3}
            value={product.description}
            onChange={(e) => onChange({ ...product, description: e.target.value })}
            placeholder="Describe the exact bottle shape, glass fluting, cap material, typography, label layout..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/90 border border-neutral-800 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/30 transition resize-y text-xs sm:text-sm leading-relaxed"
          />
        </div>

        {/* Visual Motifs & Colors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="text-xs font-medium text-neutral-300 mb-1.5 block">
              Distinctive Visual Features
            </label>
            <input
              type="text"
              value={product.keyFeatures}
              onChange={(e) => onChange({ ...product, keyFeatures: e.target.value })}
              placeholder="e.g. Brushed 24k gold collar, amber glow, fluted crystal"
              className="w-full px-3.5 py-2 rounded-xl bg-neutral-950/90 border border-neutral-800 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500/80 transition"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-300 mb-1.5 block">
              Color Palette Swatches
            </label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-950/90 border border-neutral-800 flex-1">
                <input
                  type="color"
                  value={product.colorPalette.primaryHex}
                  onChange={(e) =>
                    onChange({
                      ...product,
                      colorPalette: { ...product.colorPalette, primaryHex: e.target.value },
                    })
                  }
                  className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                  title="Primary Brand Color"
                />
                <input
                  type="color"
                  value={product.colorPalette.secondaryHex}
                  onChange={(e) =>
                    onChange({
                      ...product,
                      colorPalette: { ...product.colorPalette, secondaryHex: e.target.value },
                    })
                  }
                  className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                  title="Secondary Brand Color"
                />
                <input
                  type="color"
                  value={product.colorPalette.accentHex}
                  onChange={(e) =>
                    onChange({
                      ...product,
                      colorPalette: { ...product.colorPalette, accentHex: e.target.value },
                    })
                  }
                  className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                  title="Accent Brand Color"
                />
                <span className="text-[11px] text-neutral-400 ml-auto font-mono">
                  {product.colorPalette.name}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Model Selection & Zero People Reminder */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-neutral-950/40 p-3 rounded-xl border border-neutral-800/60">
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400">Nano-Banana Engine:</span>
            <div className="flex items-center gap-1 bg-neutral-900 p-0.5 rounded-lg border border-neutral-800 text-xs">
              <button
                type="button"
                onClick={() => onModelChange('gemini-3.1-flash-lite-image')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition ${
                  selectedModel === 'gemini-3.1-flash-lite-image'
                    ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Nano-Banana (Flash)
              </button>
              <button
                type="button"
                onClick={() => onModelChange('gemini-nano-banana-2.1')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition ${
                  selectedModel === 'gemini-nano-banana-2.1'
                    ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Nano-Banana 2.1 (HQ)
              </button>
            </div>
          </div>

          <div className="text-[11px] text-rose-300/80 flex items-center gap-1.5 self-start sm:self-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            Zero people constraint strictly injected
          </div>
        </div>

        {/* Action Button & Upload Alternative */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch gap-3">
          <button
            type="button"
            onClick={onGenerateMaster}
            disabled={isGenerating || !product.name}
            className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:via-amber-500 hover:to-amber-600 active:scale-[0.99] text-neutral-950 font-semibold text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating Master Hero Shot with Nano-Banana...</span>
              </>
            ) : hasMasterImage ? (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Regenerate Master Product Shot</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Master Product Shot (Hero)</span>
              </>
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-3 rounded-xl bg-neutral-950/80 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-neutral-100 text-xs font-medium flex items-center justify-center gap-2 transition cursor-pointer"
            title="Upload your own existing product reference image"
          >
            <Upload className="w-4 h-4 text-neutral-400" />
            <span>Upload Reference</span>
          </button>
        </div>
      </div>
    </div>
  );
};
