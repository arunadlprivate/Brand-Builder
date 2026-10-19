import React, { useState } from 'react';
import { MediumConfig, CampaignShot } from '../types';
import {
  Sparkles,
  RefreshCw,
  Maximize2,
  Download,
  AlertCircle,
  CheckCircle2,
  Layers,
  Share2,
  Newspaper,
  BookOpen,
  Building,
  Train,
  Store,
  Package,
  Plus,
  Compass,
  Sliders,
  CheckSquare,
  Square,
} from 'lucide-react';

interface MediumGridProps {
  mediums: MediumConfig[];
  shots: Record<string, CampaignShot>;
  selectedMediumIds: string[];
  onToggleSelectMedium: (id: string) => void;
  onSelectAll: () => void;
  onSelectCoreThree: () => void;
  onGenerateMedium: (medium: MediumConfig) => void;
  onGenerateBatch: () => void;
  isBatchGenerating: boolean;
  onOpenMockup: (medium: MediumConfig, shot: CampaignShot) => void;
  onDownloadShot: (mediumName: string, imageUrl: string) => void;
  stylePreset: string;
  onStylePresetChange: (style: string) => void;
  hasMasterImage: boolean;
  onAddCustomMedium: (customMedium: MediumConfig) => void;
}

const STYLE_PRESETS = [
  'Contemporary Commercial & Luxury Minimalist',
  'Industrial Precision & Architectural',
  'Warm Organic & Craft Heritage',
  'Cinematic High-Key Editorial',
  'Neo-Cyber & Atmospheric Neon',
];

export const MediumGrid: React.FC<MediumGridProps> = ({
  mediums,
  shots,
  selectedMediumIds,
  onToggleSelectMedium,
  onSelectAll,
  onSelectCoreThree,
  onGenerateMedium,
  onGenerateBatch,
  isBatchGenerating,
  onOpenMockup,
  onDownloadShot,
  stylePreset,
  onStylePresetChange,
  hasMasterImage,
  onAddCustomMedium,
}) => {
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [customRatio, setCustomRatio] = useState<'1:1' | '16:9' | '3:4' | '9:16' | '4:3'>('16:9');

  const getIcon = (mockupType: string) => {
    switch (mockupType) {
      case 'billboard':
        return <Layers className="w-4 h-4 text-amber-400" />;
      case 'newspaper':
        return <Newspaper className="w-4 h-4 text-neutral-300" />;
      case 'social_post':
        return <Share2 className="w-4 h-4 text-pink-400" />;
      case 'magazine_spread':
        return <BookOpen className="w-4 h-4 text-sky-400" />;
      case 'transit_shelter':
        return <Building className="w-4 h-4 text-emerald-400" />;
      case 'metro_lightbox':
        return <Train className="w-4 h-4 text-indigo-400" />;
      case 'storefront_window':
        return <Store className="w-4 h-4 text-amber-300" />;
      case 'unboxing_packaging':
        return <Package className="w-4 h-4 text-orange-400" />;
      default:
        return <Compass className="w-4 h-4 text-neutral-400" />;
    }
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const newMedium: MediumConfig = {
      id: `custom_${Date.now()}`,
      name: customName,
      category: 'Digital',
      aspectRatio: customRatio,
      iconName: 'Compass',
      shortDescription: 'Custom defined brand placement medium',
      promptDescription: customPrompt || `Commercial placement in ${customName} environment.`,
      mockupType: 'custom',
      defaultSelected: true,
    };

    onAddCustomMedium(newMedium);
    setCustomName('');
    setCustomPrompt('');
    setShowAddCustom(false);
  };

  const selectedCount = selectedMediumIds.length;

  return (
    <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-5 sm:p-6 backdrop-blur-sm shadow-xl space-y-5">
      {/* Step Header & Batch Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-neutral-800 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-mono font-bold text-sm">
            02
          </div>
          <div>
            <h2 className="text-base font-semibold text-neutral-100 flex items-center gap-2">
              Multi-Medium Campaign Matrix
            </h2>
            <p className="text-xs text-neutral-400">
              Apply the master product into billboard, newspaper, social, and physical environments.
            </p>
          </div>
        </div>

        {/* Action Controls & Style Selector */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          {/* Quick filters */}
          <button
            type="button"
            onClick={onSelectCoreThree}
            className="px-2.5 py-1 text-xs rounded-lg bg-neutral-950 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition cursor-pointer"
          >
            Core 3 (Billboard/News/Social)
          </button>
          <button
            type="button"
            onClick={onSelectAll}
            className="px-2.5 py-1 text-xs rounded-lg bg-neutral-950 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition cursor-pointer"
          >
            Select All ({mediums.length})
          </button>

          {/* Style Preset Selector */}
          <div className="flex items-center gap-1.5 bg-neutral-950 px-2.5 py-1 rounded-lg border border-neutral-800">
            <Sliders className="w-3.5 h-3.5 text-neutral-400" />
            <select
              value={stylePreset}
              onChange={(e) => onStylePresetChange(e.target.value)}
              className="bg-transparent text-xs text-neutral-200 focus:outline-none cursor-pointer pr-1"
            >
              {STYLE_PRESETS.map((st) => (
                <option key={st} value={st} className="bg-neutral-900 text-neutral-200">
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Generate Batch Button */}
          <button
            type="button"
            onClick={onGenerateBatch}
            disabled={!hasMasterImage || isBatchGenerating || selectedCount === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:via-amber-500 hover:to-amber-600 active:scale-[0.99] text-neutral-950 font-semibold text-xs shadow-lg shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer ml-auto sm:ml-0"
          >
            {isBatchGenerating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Generating Campaign ({selectedCount})...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Selected ({selectedCount})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mediums Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {mediums.map((medium) => {
          const isSelected = selectedMediumIds.includes(medium.id);
          const shot = shots[medium.id];
          const hasImage = Boolean(shot?.imageUrl);
          const isGeneratingThis = shot?.status === 'generating';
          const isCompleted = shot?.status === 'completed';
          const isError = shot?.status === 'error';

          return (
            <div
              key={medium.id}
              className={`rounded-xl border transition-all duration-200 flex flex-col overflow-hidden bg-neutral-950/70 group ${
                isSelected
                  ? 'border-neutral-700 ring-1 ring-neutral-700/60 shadow-lg'
                  : 'border-neutral-800/80 opacity-80 hover:opacity-100 hover:border-neutral-700'
              }`}
            >
              {/* Card Header */}
              <div className="p-3 bg-neutral-900/70 border-b border-neutral-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <button
                    type="button"
                    onClick={() => onToggleSelectMedium(medium.id)}
                    className="text-neutral-400 hover:text-amber-400 transition cursor-pointer shrink-0"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Square className="w-4 h-4 text-neutral-600" />
                    )}
                  </button>

                  <div className="shrink-0">{getIcon(medium.mockupType)}</div>

                  <div className="truncate">
                    <h3 className="text-xs font-semibold text-neutral-200 truncate">
                      {medium.name}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-neutral-400">
                    {medium.aspectRatio}
                  </span>
                </div>
              </div>

              {/* Image Preview Box */}
              <div className="relative aspect-video bg-neutral-950 flex items-center justify-center overflow-hidden">
                {hasImage ? (
                  <img
                    src={shot.imageUrl}
                    alt={medium.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="p-4 text-center space-y-2">
                    <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-600">
                      {getIcon(medium.mockupType)}
                    </div>
                    <p className="text-[11px] text-neutral-500 line-clamp-2 px-2">
                      {medium.shortDescription}
                    </p>
                  </div>
                )}

                {/* Loading overlay */}
                {isGeneratingThis && (
                  <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-xs flex flex-col items-center justify-center gap-2 p-3 text-center">
                    <RefreshCw className="w-6 h-6 text-amber-400 animate-spin" />
                    <span className="text-xs text-amber-200 font-medium">
                      Nano-Banana Rendering...
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      Locking product geometry & zero people
                    </span>
                  </div>
                )}

                {/* Error overlay */}
                {isError && (
                  <div className="absolute inset-0 bg-neutral-950/90 flex flex-col items-center justify-center p-3 text-center gap-1.5">
                    <AlertCircle className="w-5 h-5 text-rose-400" />
                    <span className="text-xs font-semibold text-rose-300">
                      Generation Limit
                    </span>
                    <p className="text-[10px] text-neutral-400 line-clamp-2">
                      {shot.errorMessage || 'Quota limit reached'}
                    </p>
                    <button
                      onClick={() => onGenerateMedium(medium)}
                      className="mt-1 px-2.5 py-1 text-[10px] rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 cursor-pointer"
                    >
                      Retry
                    </button>
                  </div>
                )}

                {/* Completed Action Hover Overlay */}
                {hasImage && !isGeneratingThis && (
                  <div className="absolute inset-0 bg-neutral-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => onOpenMockup(medium, shot)}
                      className="p-2 rounded-lg bg-neutral-900/90 text-neutral-100 hover:bg-neutral-800 border border-neutral-700 shadow-md cursor-pointer"
                      title="Inspect Fullscreen Mockup"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDownloadShot(medium.name, shot.imageUrl!)}
                      className="p-2 rounded-lg bg-neutral-900/90 text-neutral-100 hover:bg-neutral-800 border border-neutral-700 shadow-md cursor-pointer"
                      title="Download Asset"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Completed badge */}
                {hasImage && (
                  <div className="absolute bottom-2 left-2 bg-neutral-950/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] font-mono text-emerald-400 border border-neutral-800 flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>Consistent Shot</span>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="p-3 bg-neutral-900/40 mt-auto flex items-center justify-between gap-2 border-t border-neutral-800/60">
                <span className="text-[10px] text-neutral-500 font-mono">
                  {medium.category}
                </span>

                <button
                  type="button"
                  onClick={() => onGenerateMedium(medium)}
                  disabled={!hasMasterImage || isGeneratingThis}
                  className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed border border-neutral-800 text-[11px] font-medium text-neutral-200 hover:text-amber-300 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>{hasImage ? 'Re-render' : 'Render'}</span>
                </button>
              </div>
            </div>
          );
        })}

        {/* Add Custom Medium Card */}
        <div className="rounded-xl border border-dashed border-neutral-800 hover:border-neutral-700 transition flex flex-col items-center justify-center p-6 text-center bg-neutral-950/30">
          {!showAddCustom ? (
            <button
              type="button"
              onClick={() => setShowAddCustom(true)}
              className="flex flex-col items-center gap-2 text-neutral-400 hover:text-amber-400 transition cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold">Add Custom Medium</span>
              <span className="text-[10px] text-neutral-500">
                e.g. Airport Concourse, Stadium Jumbotron, Coffee Cup Sleeve
              </span>
            </button>
          ) : (
            <form onSubmit={handleCreateCustom} className="w-full space-y-2.5 text-left">
              <div className="text-xs font-semibold text-neutral-200">New Medium Setup</div>
              <input
                type="text"
                placeholder="Medium Name (e.g. Stadium Jumbotron)"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                required
              />
              <textarea
                rows={2}
                placeholder="Scene description (lights, perspective...)"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
              <div className="flex items-center gap-2">
                <select
                  value={customRatio}
                  onChange={(e) => setCustomRatio(e.target.value as any)}
                  className="bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-300 rounded px-2 py-1 focus:outline-none"
                >
                  <option value="16:9">16:9 Landscape</option>
                  <option value="1:1">1:1 Square</option>
                  <option value="3:4">3:4 Portrait</option>
                  <option value="9:16">9:16 Vertical</option>
                  <option value="4:3">4:3 Standard</option>
                </select>

                <button
                  type="submit"
                  className="px-3 py-1 rounded-lg bg-amber-500 text-neutral-950 font-semibold text-xs ml-auto cursor-pointer"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCustom(false)}
                  className="px-2 py-1 text-xs text-neutral-400 hover:text-neutral-200 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
