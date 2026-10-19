import React from 'react';
import { Layers, Sparkles, UserX, ShieldCheck, Download, RefreshCw, Eye } from 'lucide-react';

interface HeaderProps {
  hasMasterImage: boolean;
  model: string;
  onOpenComparison: () => void;
  onExportCampaign: () => void;
  onReset: () => void;
  completedCount: number;
  totalSelected: number;
}

export const Header: React.FC<HeaderProps> = ({
  hasMasterImage,
  model,
  onOpenComparison,
  onExportCampaign,
  onReset,
  completedCount,
  totalSelected,
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-neutral-950/80 border-b border-neutral-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 text-neutral-950">
            <Layers className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-lg tracking-wide text-neutral-100">Brand Builder</span>
              <span className="px-2 py-0.5 text-[10px] font-mono tracking-wider uppercase font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full">
                Nano-Banana
              </span>
            </div>
            <p className="text-xs text-neutral-400 hidden sm:block">
              Consistent multi-medium campaign engine · Billboards, print & social
            </p>
          </div>
        </div>

        {/* Badges: Model & Strict Negative Prompting */}
        <div className="hidden lg:flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-300">
            <UserX className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-[11px] font-medium text-rose-300/90">Zero People Enforced</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-medium text-emerald-300/90">
              {hasMasterImage ? 'Product Identity Locked' : 'Awaiting Master Shot'}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {hasMasterImage && (
            <>
              <button
                onClick={onOpenComparison}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 transition shadow-sm cursor-pointer"
                title="Compare all medium shots side-by-side"
              >
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Compare</span>
                <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-neutral-800 text-neutral-400 font-mono">
                  {completedCount}
                </span>
              </button>

              <button
                onClick={onExportCampaign}
                disabled={completedCount === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-200 border border-neutral-800 transition shadow-sm cursor-pointer"
                title="Export all generated campaign assets"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Export Kit</span>
              </button>
            </>
          )}

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800 transition cursor-pointer"
            title="Start new product concept"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
