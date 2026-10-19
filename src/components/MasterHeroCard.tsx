import React, { useState } from 'react';
import { ProductConcept } from '../types';
import { Lock, Maximize2, Download, Copy, Check, Info, Sparkles, UserX, Eye } from 'lucide-react';

interface MasterHeroCardProps {
  imageUrl: string;
  product: ProductConcept;
  onOpenZoom: () => void;
  onDownload: () => void;
  promptUsed?: string;
  modelUsed?: string;
}

export const MasterHeroCard: React.FC<MasterHeroCardProps> = ({
  imageUrl,
  product,
  onOpenZoom,
  onDownload,
  promptUsed,
  modelUsed,
}) => {
  const [copied, setCopied] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  const handleCopyPrompt = () => {
    if (promptUsed) {
      navigator.clipboard.writeText(promptUsed);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-neutral-900/60 border border-amber-500/30 rounded-2xl p-5 sm:p-6 backdrop-blur-sm shadow-xl relative overflow-hidden group">
      {/* Subtle background glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-300">
            Master Visual Anchor (Hero Shot)
          </span>
          <Lock className="w-3.5 h-3.5 text-neutral-400" />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-neutral-400">
            {modelUsed || 'Nano-Banana'}
          </span>
        </div>
      </div>

      {/* Content Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Product Image Preview with Zoom overlay */}
        <div className="md:col-span-5 relative rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-inner aspect-square flex items-center justify-center group/img">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition duration-500 group-hover/img:scale-105"
          />

          {/* Quick overlay buttons */}
          <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              onClick={onOpenZoom}
              className="p-2.5 rounded-xl bg-neutral-900/90 text-neutral-100 hover:bg-neutral-800 border border-neutral-700 shadow-lg cursor-pointer"
              title="Inspect Full Resolution"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={onDownload}
              className="p-2.5 rounded-xl bg-neutral-900/90 text-neutral-100 hover:bg-neutral-800 border border-neutral-700 shadow-lg cursor-pointer"
              title="Download Master Image"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute bottom-2 left-2 bg-neutral-950/80 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-mono text-neutral-300 border border-neutral-800">
            1:1 Reference Asset
          </div>
        </div>

        {/* Details & Consistency Mechanism Explanation */}
        <div className="md:col-span-7 space-y-3">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500">
              {product.category}
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-neutral-100 tracking-wide mt-0.5">
              {product.name}
            </h3>
            <p className="text-xs text-neutral-400 mt-1 italic">
              "{product.tagline}"
            </p>
          </div>

          <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80 text-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-medium text-[11px]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Medium Consistency Engine Active</span>
            </div>
            <p className="text-neutral-400 text-[11px] leading-relaxed">
              This master asset is supplied as a multimodal visual reference to Nano-Banana. The model maps its exact geometry, packaging materials, label typography, and color palette into every advertising shot.
            </p>
            <div className="flex items-center gap-1.5 text-[10px] text-rose-300/90 pt-1 border-t border-neutral-900">
              <UserX className="w-3 h-3 text-rose-400" />
              <span>Negative prompt enforced: 0 human models, no hands, no faces across all outputs.</span>
            </div>
          </div>

          {/* Color swatches & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-neutral-400">Palette:</span>
              <span
                className="w-4 h-4 rounded-full border border-neutral-700 shadow-sm"
                style={{ backgroundColor: product.colorPalette.primaryHex }}
                title="Primary"
              />
              <span
                className="w-4 h-4 rounded-full border border-neutral-700 shadow-sm"
                style={{ backgroundColor: product.colorPalette.secondaryHex }}
                title="Secondary"
              />
              <span
                className="w-4 h-4 rounded-full border border-neutral-700 shadow-sm"
                style={{ backgroundColor: product.colorPalette.accentHex }}
                title="Accent"
              />
              <span className="text-[10px] font-mono text-neutral-500 ml-1">
                {product.colorPalette.name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowPrompt(!showPrompt)}
                className="px-2.5 py-1 text-[11px] rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-neutral-200 transition cursor-pointer"
              >
                {showPrompt ? 'Hide Prompt' : 'View Prompt'}
              </button>
              <button
                type="button"
                onClick={onDownload}
                className="flex items-center gap-1 px-3 py-1 text-[11px] font-medium rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>Save PNG</span>
              </button>
            </div>
          </div>

          {/* Expandable Prompt display */}
          {showPrompt && promptUsed && (
            <div className="mt-2 p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] font-mono text-neutral-400 space-y-2">
              <div className="flex items-center justify-between text-neutral-500 text-[10px]">
                <span>PROMPT EXECUTED ON NANO-BANANA:</span>
                <button
                  onClick={handleCopyPrompt}
                  className="flex items-center gap-1 text-amber-400 hover:text-amber-300"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
                {promptUsed}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
