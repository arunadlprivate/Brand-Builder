import React, { useState } from 'react';
import { MediumConfig, CampaignShot } from '../types';
import {
  X,
  Download,
  Copy,
  Check,
  Smartphone,
  Eye,
  Sliders,
  Sparkles,
  Layers,
  Newspaper,
  BookOpen,
  UserX,
} from 'lucide-react';

interface MockupModalProps {
  medium: MediumConfig;
  shot: CampaignShot;
  productName: string;
  tagline: string;
  onClose: () => void;
  onDownload: () => void;
}

export const MockupModal: React.FC<MockupModalProps> = ({
  medium,
  shot,
  productName,
  tagline,
  onClose,
  onDownload,
}) => {
  const [viewMode, setViewMode] = useState<'mockup' | 'raw'>('mockup');
  const [copied, setCopied] = useState(false);

  const handleCopyPrompt = () => {
    if (shot.promptUsed) {
      navigator.clipboard.writeText(shot.promptUsed);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderInSituFrame = () => {
    if (viewMode === 'raw') {
      return (
        <div className="relative max-h-[70vh] flex items-center justify-center p-2">
          <img
            src={shot.imageUrl}
            alt={medium.name}
            className="max-h-[65vh] w-auto object-contain rounded-lg shadow-2xl"
          />
        </div>
      );
    }

    // In-Situ Framing depending on medium type
    switch (medium.mockupType) {
      case 'billboard':
        return (
          <div className="relative max-w-4xl mx-auto p-4 flex flex-col items-center">
            {/* Ambient Open Sky Backdrop */}
            <div className="w-full bg-gradient-to-b from-slate-900 via-indigo-950/80 to-amber-950/40 p-6 rounded-2xl border border-neutral-800 shadow-2xl relative overflow-hidden">
              {/* Overhead ad spotlights */}
              <div className="flex justify-around mb-2 px-12">
                <div className="w-8 h-2 bg-neutral-600 rounded-t flex flex-col items-center">
                  <div className="w-1 h-3 bg-neutral-700"></div>
                  <div className="w-12 h-16 bg-amber-400/10 blur-md -mt-1 transform -rotate-12"></div>
                </div>
                <div className="w-8 h-2 bg-neutral-600 rounded-t flex flex-col items-center">
                  <div className="w-1 h-3 bg-neutral-700"></div>
                  <div className="w-12 h-16 bg-amber-400/10 blur-md -mt-1"></div>
                </div>
                <div className="w-8 h-2 bg-neutral-600 rounded-t flex flex-col items-center">
                  <div className="w-1 h-3 bg-neutral-700"></div>
                  <div className="w-12 h-16 bg-amber-400/10 blur-md -mt-1 transform rotate-12"></div>
                </div>
              </div>

              {/* Billboard Canvas Frame */}
              <div className="bg-neutral-900 p-3 rounded-lg border-4 border-neutral-700 shadow-2xl">
                <img
                  src={shot.imageUrl}
                  alt={medium.name}
                  className="w-full max-h-[50vh] object-cover rounded"
                />
              </div>

              {/* Billboard structural support pole */}
              <div className="w-8 h-16 bg-neutral-800 mx-auto border-x border-neutral-700 mt-2 shadow-inner"></div>
            </div>
          </div>
        );

      case 'newspaper':
        return (
          <div className="max-w-2xl mx-auto bg-[#f5f0e6] text-neutral-900 p-6 rounded-xl shadow-2xl border border-amber-900/20 font-serif">
            {/* Broadsheet masthead */}
            <div className="border-b-2 border-neutral-900 pb-2 mb-3 text-center">
              <div className="text-[10px] tracking-widest font-sans uppercase text-neutral-600">
                Morning Broadsheet Edition · Est. 1892
              </div>
              <div className="text-3xl font-extrabold tracking-tight mt-1 text-neutral-950 font-serif">
                THE COMMERCIAL TRIBUNE
              </div>
              <div className="text-[10px] font-sans flex justify-between px-4 mt-1 text-neutral-600">
                <span>NEW YORK / LONDON / TOKYO</span>
                <span>VOL. CXL · NO. 54,921</span>
                <span>LATE CITY FINAL</span>
              </div>
            </div>

            {/* Print Ad Placement Container */}
            <div className="p-3 bg-neutral-100/90 border border-neutral-400 shadow-sm">
              <img
                src={shot.imageUrl}
                alt={medium.name}
                className="w-full max-h-[48vh] object-contain rounded"
              />
              <div className="mt-2 text-center text-xs font-serif text-neutral-700 italic">
                Special commercial feature supplement
              </div>
            </div>
          </div>
        );

      case 'social_post':
        return (
          <div className="max-w-md mx-auto bg-neutral-950 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl p-3">
            {/* Smartphone Feed Frame */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-900 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 p-0.5">
                  <div className="w-full h-full rounded-full bg-neutral-950 flex items-center justify-center font-bold text-[10px] text-amber-300">
                    {productName.slice(0, 1)}
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-neutral-100 text-[11px] flex items-center gap-1">
                    <span>{productName.toLowerCase().replace(/[^a-z0-9]/g, '_')}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                  </div>
                  <div className="text-[9px] text-neutral-500">Sponsored</div>
                </div>
              </div>
              <span className="text-neutral-500 text-xs">•••</span>
            </div>

            {/* Media Asset */}
            <div className="bg-neutral-900 aspect-square overflow-hidden flex items-center justify-center">
              <img
                src={shot.imageUrl}
                alt={medium.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Social Engagement Bar */}
            <div className="p-3 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-neutral-300">
                <div className="flex items-center gap-3">
                  <span>❤️ 4,812</span>
                  <span>💬 284</span>
                  <span>↗️</span>
                </div>
                <span>🔖</span>
              </div>
              <p className="text-[11px] text-neutral-300 leading-snug">
                <span className="font-semibold text-neutral-100 mr-1">
                  {productName.toLowerCase().replace(/[^a-z0-9]/g, '_')}
                </span>
                {tagline}. Designed for absolute permanence. Shot with Nano-Banana.
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="relative max-h-[70vh] flex items-center justify-center p-2">
            <img
              src={shot.imageUrl}
              alt={medium.name}
              className="max-h-[65vh] w-auto object-contain rounded-xl shadow-2xl border border-neutral-800"
            />
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:px-6 bg-neutral-950/80 border-b border-neutral-800 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                {medium.category} MEDIUM
              </span>
              <span className="text-neutral-600">·</span>
              <span className="text-xs font-mono text-neutral-400">
                Aspect: {medium.aspectRatio}
              </span>
            </div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-neutral-100">
              {medium.name}
            </h3>
          </div>

          {/* Toggle View Mode & Close */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-neutral-900 p-0.5 rounded-lg border border-neutral-800 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('mockup')}
                className={`px-3 py-1 rounded-md transition font-medium cursor-pointer ${
                  viewMode === 'mockup'
                    ? 'bg-neutral-800 text-amber-300 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                In-Situ Mockup
              </button>
              <button
                type="button"
                onClick={() => setViewMode('raw')}
                className={`px-3 py-1 rounded-md transition font-medium cursor-pointer ${
                  viewMode === 'raw'
                    ? 'bg-neutral-800 text-amber-300 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Raw Asset
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Mockup Preview */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center bg-neutral-950/60">
          {renderInSituFrame()}
        </div>

        {/* Modal Footer / Prompt and Controls */}
        <div className="p-4 sm:px-6 bg-neutral-950/90 border-t border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-rose-300/90">
              <UserX className="w-3.5 h-3.5 text-rose-400" />
              <span>Strict Constraint: Zero people verified</span>
            </div>
            <div className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 font-mono text-neutral-400">
              Model: {shot.modelUsed || 'Nano-Banana'}
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {shot.promptUsed && (
              <button
                type="button"
                onClick={handleCopyPrompt}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Prompt' : 'Copy Prompt'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onDownload}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold transition shadow-md cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download High-Res PNG</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
