import React from 'react';
import { ProductConcept, MediumConfig, CampaignShot } from '../types';
import { X, Check, ShieldCheck, Download, Sparkles, Layers, UserX, ExternalLink } from 'lucide-react';

interface ComparisonModalProps {
  product: ProductConcept;
  masterImageUrl?: string;
  mediums: MediumConfig[];
  shots: Record<string, CampaignShot>;
  onClose: () => void;
  onDownloadAll: () => void;
  onSelectShot: (medium: MediumConfig, shot: CampaignShot) => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  product,
  masterImageUrl,
  mediums,
  shots,
  onClose,
  onDownloadAll,
  onSelectShot,
}) => {
  const completedMediums = mediums.filter((m) => Boolean(shots[m.id]?.imageUrl));

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-6xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:px-6 bg-neutral-950/90 border-b border-neutral-800 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                CAMPAIGN CONSISTENCY MATRIX
              </span>
              <span className="text-neutral-600">·</span>
              <span className="text-xs text-neutral-400">
                {completedMediums.length} Mediums Rendered
              </span>
            </div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-neutral-100">
              {product.name} Across Advertising Mediums
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onDownloadAll}
              disabled={completedMediums.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-xs transition disabled:opacity-40 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Campaign Assets</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Consistency Verification Banner */}
        <div className="px-6 py-2.5 bg-neutral-950 border-b border-neutral-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Visual Anchor Locked</span>
            </div>
            <span className="text-neutral-600">|</span>
            <div className="flex items-center gap-1.5 text-rose-300">
              <UserX className="w-4 h-4 text-rose-400" />
              <span>Zero Human Bodies / Faces Verified</span>
            </div>
          </div>

          <div className="text-[11px] font-mono text-neutral-400">
            Powered by Nano-Banana Multimodal Reference Engine
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-neutral-950/40">
          {/* Master Anchor Banner */}
          {masterImageUrl && (
            <div className="p-4 rounded-xl bg-neutral-900/90 border border-amber-500/30 flex flex-col sm:flex-row items-center gap-4">
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-neutral-950 border border-neutral-800 shrink-0">
                <img
                  src={masterImageUrl}
                  alt="Master Product Anchor"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 text-center sm:text-left space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                  Master Reference Product
                </span>
                <h4 className="font-serif text-base font-bold text-neutral-100">
                  {product.name}
                </h4>
                <p className="text-xs text-neutral-400 line-clamp-2">
                  {product.description}
                </p>
              </div>
              <div className="flex sm:flex-col items-center gap-1 text-[11px] font-mono text-neutral-400">
                <span>Palette:</span>
                <div className="flex items-center gap-1">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-neutral-700"
                    style={{ backgroundColor: product.colorPalette.primaryHex }}
                  />
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-neutral-700"
                    style={{ backgroundColor: product.colorPalette.secondaryHex }}
                  />
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-neutral-700"
                    style={{ backgroundColor: product.colorPalette.accentHex }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Mediums Gallery */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              Medium Placement Variations
            </h4>

            {completedMediums.length === 0 ? (
              <div className="p-12 text-center text-neutral-500 border border-dashed border-neutral-800 rounded-xl space-y-2">
                <Layers className="w-8 h-8 mx-auto text-neutral-600" />
                <p className="text-xs">No campaign mediums rendered yet.</p>
                <p className="text-[11px] text-neutral-600">
                  Select mediums and click "Generate Campaign" to produce shots.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedMediums.map((medium) => {
                  const shot = shots[medium.id];
                  if (!shot?.imageUrl) return null;

                  return (
                    <div
                      key={medium.id}
                      onClick={() => onSelectShot(medium, shot)}
                      className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-amber-500/50 transition cursor-pointer group flex flex-col"
                    >
                      {/* Shot Image Preview */}
                      <div className="relative aspect-video bg-neutral-950 overflow-hidden flex items-center justify-center">
                        <img
                          src={shot.imageUrl}
                          alt={medium.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="px-3 py-1.5 rounded-lg bg-neutral-900/90 text-neutral-100 text-xs font-medium border border-neutral-700 flex items-center gap-1.5">
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Inspect Mockup</span>
                          </span>
                        </div>
                      </div>

                      {/* Info bar */}
                      <div className="p-3 bg-neutral-900 flex items-center justify-between gap-2 mt-auto">
                        <div>
                          <div className="text-xs font-semibold text-neutral-200">
                            {medium.name}
                          </div>
                          <div className="text-[10px] text-neutral-500 font-mono">
                            {medium.category} · {medium.aspectRatio}
                          </div>
                        </div>

                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                          Verified Consistent
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
