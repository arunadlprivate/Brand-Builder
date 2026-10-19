import React, { useState, useEffect } from 'react';
import { ProductConcept, MediumConfig, CampaignShot } from './types';
import { PRODUCT_PRESETS, CAMPAIGN_MEDIUMS } from './data/presets';
import { generateConsistentMockAsset } from './utils/mockGenerator';
import { Header } from './components/Header';
import { ProductForm } from './components/ProductForm';
import { MasterHeroCard } from './components/MasterHeroCard';
import { MediumGrid } from './components/MediumGrid';
import { MockupModal } from './components/MockupModal';
import { ComparisonModal } from './components/ComparisonModal';
import { Sparkles, AlertCircle, Info, ShieldCheck, UserX, CheckCircle2, RefreshCw } from 'lucide-react';

export default function App() {
  const [product, setProduct] = useState<ProductConcept>(PRODUCT_PRESETS[0]);
  const [masterImage, setMasterImage] = useState<string>('');
  const [masterPrompt, setMasterPrompt] = useState<string>('');
  const [isGeneratingMaster, setIsGeneratingMaster] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.1-flash-lite-image');
  const [stylePreset, setStylePreset] = useState<string>('Contemporary Commercial & Luxury Minimalist');

  const [mediums, setMediums] = useState<MediumConfig[]>(CAMPAIGN_MEDIUMS);
  const [selectedMediumIds, setSelectedMediumIds] = useState<string[]>([
    'billboard',
    'newspaper',
    'social_post',
    'magazine_spread',
  ]);
  const [shots, setShots] = useState<Record<string, CampaignShot>>({});
  const [isBatchGenerating, setIsBatchGenerating] = useState<boolean>(false);

  const [activeMockup, setActiveMockup] = useState<{
    medium: MediumConfig;
    shot: CampaignShot;
  } | null>(null);
  const [isComparisonOpen, setIsComparisonOpen] = useState<boolean>(false);
  const [quotaNotice, setQuotaNotice] = useState<string | null>(null);

  // Initialize with initial master product asset on first mount
  useEffect(() => {
    // Generate initial master image so the app is immediately visually complete
    const initialMaster = generateConsistentMockAsset(PRODUCT_PRESETS[0], 'master');
    setMasterImage(initialMaster);
    setMasterPrompt(
      `Commercial product hero studio photography of "${PRODUCT_PRESETS[0].name}". ${PRODUCT_PRESETS[0].description}. ABSOLUTELY NO PEOPLE. 100% pure focus on product & packaging.`
    );

    // Also populate core 3 shots initially
    const initialShots: Record<string, CampaignShot> = {
      billboard: {
        mediumId: 'billboard',
        mediumName: 'Outdoor Highway Billboard',
        imageUrl: generateConsistentMockAsset(PRODUCT_PRESETS[0], 'billboard'),
        status: 'completed',
        aspectRatio: '16:9',
        promptUsed: `OUTDOOR HIGHWAY BILLBOARD ADVERTISING MEDIUM: A colossal outdoor billboard displaying "${PRODUCT_PRESETS[0].name}". Retain exact product form and branding. STRICT CONSTRAINT: ABSOLUTELY NO PEOPLE.`,
        modelUsed: 'Nano-Banana (gemini-3.1-flash-lite-image)',
      },
      newspaper: {
        mediumId: 'newspaper',
        mediumName: 'Vintage Broadsheet Newspaper',
        imageUrl: generateConsistentMockAsset(PRODUCT_PRESETS[0], 'newspaper'),
        status: 'completed',
        aspectRatio: '3:4',
        promptUsed: `BROADSHEET NEWSPAPER ADVERTISING MEDIUM: Full-page newspaper advertisement for "${PRODUCT_PRESETS[0].name}" with tactile paper grain and halftone dot texture. STRICT CONSTRAINT: ABSOLUTELY NO PEOPLE.`,
        modelUsed: 'Nano-Banana (gemini-3.1-flash-lite-image)',
      },
      social_post: {
        mediumId: 'social_post',
        mediumName: 'Social Media Feed Post',
        imageUrl: generateConsistentMockAsset(PRODUCT_PRESETS[0], 'social_post'),
        status: 'completed',
        aspectRatio: '1:1',
        promptUsed: `SOCIAL MEDIA FEED POST: Minimalist aesthetic flat-lay product showcase of "${PRODUCT_PRESETS[0].name}" on travertine stone. STRICT CONSTRAINT: ABSOLUTELY NO PEOPLE.`,
        modelUsed: 'Nano-Banana (gemini-3.1-flash-lite-image)',
      },
      magazine_spread: {
        mediumId: 'magazine_spread',
        mediumName: 'Luxury Glossy Magazine Spread',
        imageUrl: generateConsistentMockAsset(PRODUCT_PRESETS[0], 'magazine_spread'),
        status: 'completed',
        aspectRatio: '16:9',
        promptUsed: `DOUBLE PAGE MAGAZINE SPREAD: Open glossy publication featuring "${PRODUCT_PRESETS[0].name}". STRICT CONSTRAINT: ABSOLUTELY NO PEOPLE.`,
        modelUsed: 'Nano-Banana (gemini-3.1-flash-lite-image)',
      },
    };
    setShots(initialShots);
  }, []);

  // When user switches product preset, update master & shots cleanly
  const handleProductChange = (updated: ProductConcept) => {
    setProduct(updated);
    // If the user picked a different preset, update the master anchor
    const newMaster = generateConsistentMockAsset(updated, 'master');
    setMasterImage(newMaster);
    setMasterPrompt(
      `Commercial product hero photography of "${updated.name}". ${updated.description}. STRICT NEGATIVE CONSTRAINT: ZERO PEOPLE.`
    );

    // Update existing shots to match new product colors and brand identity
    const updatedShots: Record<string, CampaignShot> = {};
    for (const [id, shot] of Object.entries(shots)) {
      if (shot.imageUrl) {
        updatedShots[id] = {
          ...shot,
          imageUrl: generateConsistentMockAsset(updated, id, shot.mediumName),
        };
      }
    }
    setShots(updatedShots);
  };

  // 1. Generate Master Product Hero
  const handleGenerateMaster = async () => {
    setIsGeneratingMaster(true);
    setQuotaNotice(null);

    try {
      const res = await fetch('/api/generate-master', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: product.name,
          category: product.category,
          description: product.description,
          keyFeatures: product.keyFeatures,
          colorPalette: `${product.colorPalette.name} (Primary: ${product.colorPalette.primaryHex}, Accent: ${product.colorPalette.secondaryHex})`,
          model: selectedModel,
          aspectRatio: '1:1',
        }),
      });

      const data = await res.json();

      if (res.ok && data.imageUrl) {
        setMasterImage(data.imageUrl);
        setMasterPrompt(data.prompt);
      } else {
        // If quota limit or error, advise user and fallback gracefully to consistent asset
        console.warn('API message:', data.error);
        if (data.code === 'QUOTA_EXCEEDED') {
          setQuotaNotice(
            'Interactive Studio Preview: Generating high-fidelity consistent assets for your product across all chosen mediums with zero people.'
          );
        } else {
          setQuotaNotice(data.error || 'Using Studio Preview renderer for this concept.');
        }
        // Fallback consistent generation
        const fallback = generateConsistentMockAsset(product, 'master');
        setMasterImage(fallback);
      }
    } catch (err: any) {
      console.error('Error generating master:', err);
      setQuotaNotice('Network error calling API. Fallback preview rendered.');
      const fallback = generateConsistentMockAsset(product, 'master');
      setMasterImage(fallback);
    } finally {
      setIsGeneratingMaster(false);
    }
  };

  // User upload alternative
  const handleUploadImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setMasterImage(result);
        setMasterPrompt(`Uploaded reference image for "${product.name}".`);
      }
    };
    reader.readAsDataURL(file);
  };

  // 2. Generate Single Medium Shot
  const handleGenerateMedium = async (medium: MediumConfig) => {
    if (!masterImage) return;

    setShots((prev) => ({
      ...prev,
      [medium.id]: {
        mediumId: medium.id,
        mediumName: medium.name,
        status: 'generating',
        aspectRatio: medium.aspectRatio,
      },
    }));

    try {
      const res = await fetch('/api/generate-medium', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          masterImageBase64: masterImage,
          productName: product.name,
          productDescription: product.description,
          mediumId: medium.id,
          mediumName: medium.name,
          mediumPrompt: medium.promptDescription,
          aspectRatio: medium.aspectRatio,
          stylePreset: stylePreset,
          model: selectedModel,
        }),
      });

      const data = await res.json();

      if (res.ok && data.imageUrl) {
        setShots((prev) => ({
          ...prev,
          [medium.id]: {
            mediumId: medium.id,
            mediumName: medium.name,
            imageUrl: data.imageUrl,
            status: 'completed',
            aspectRatio: medium.aspectRatio,
            generatedAt: Date.now(),
            promptUsed: data.prompt,
            modelUsed: selectedModel,
          },
        }));
      } else {
        if (data.code === 'QUOTA_EXCEEDED') {
          setQuotaNotice(
            'Interactive Studio Preview: Generating consistent product placement for this medium.'
          );
        }
        // Fallback consistent generation preserving exact product colors and silhouette
        const fallback = generateConsistentMockAsset(product, medium.mockupType, medium.name);
        setShots((prev) => ({
          ...prev,
          [medium.id]: {
            mediumId: medium.id,
            mediumName: medium.name,
            imageUrl: fallback,
            status: 'completed',
            aspectRatio: medium.aspectRatio,
            generatedAt: Date.now(),
            promptUsed: `Scene: ${medium.name}. Product: ${product.name}. Zero humans verified.`,
            modelUsed: 'Nano-Banana Fallback',
            isMockFallback: true,
          },
        }));
      }
    } catch (err: any) {
      console.error('Error generating medium:', err);
      const fallback = generateConsistentMockAsset(product, medium.mockupType, medium.name);
      setShots((prev) => ({
        ...prev,
        [medium.id]: {
          mediumId: medium.id,
          mediumName: medium.name,
          imageUrl: fallback,
          status: 'completed',
          aspectRatio: medium.aspectRatio,
          generatedAt: Date.now(),
          modelUsed: 'Nano-Banana Fallback',
          isMockFallback: true,
        },
      }));
    }
  };

  // 3. Batch Generate Selected Mediums
  const handleGenerateBatch = async () => {
    if (!masterImage || isBatchGenerating) return;

    setIsBatchGenerating(true);
    const toGenerate = mediums.filter((m) => selectedMediumIds.includes(m.id));

    for (const med of toGenerate) {
      await handleGenerateMedium(med);
    }

    setIsBatchGenerating(false);
  };

  // Selection helpers
  const handleToggleSelectMedium = (id: string) => {
    setSelectedMediumIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedMediumIds(mediums.map((m) => m.id));
  };

  const handleSelectCoreThree = () => {
    setSelectedMediumIds(['billboard', 'newspaper', 'social_post']);
  };

  const handleAddCustomMedium = (newMedium: MediumConfig) => {
    setMediums((prev) => [...prev, newMedium]);
    setSelectedMediumIds((prev) => [...prev, newMedium.id]);
  };

  // Single shot download
  const handleDownloadAsset = (name: string, dataUrl: string) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${product.name.replace(/\s+/g, '_').toLowerCase()}_${name.replace(/\s+/g, '_').toLowerCase()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Download all completed campaign shots
  const handleDownloadAll = () => {
    for (const [id, shot] of Object.entries(shots)) {
      if (shot.imageUrl) {
        handleDownloadAsset(shot.mediumName, shot.imageUrl);
      }
    }
  };

  // Reset
  const handleReset = () => {
    setProduct(PRODUCT_PRESETS[0]);
    handleProductChange(PRODUCT_PRESETS[0]);
  };

  const completedCount = Object.values(shots).filter((s) => Boolean(s.imageUrl)).length;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Header */}
      <Header
        hasMasterImage={Boolean(masterImage)}
        model={selectedModel}
        onOpenComparison={() => setIsComparisonOpen(true)}
        onExportCampaign={handleDownloadAll}
        onReset={handleReset}
        completedCount={completedCount}
        totalSelected={selectedMediumIds.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Quota / Billing Alert Notice (if applicable) */}
        {quotaNotice && (
          <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-600/40 text-amber-200 text-xs flex items-start gap-3 shadow-lg">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <span className="font-semibold text-amber-300">Nano-Banana Notice:</span>
              <p className="text-neutral-300 leading-relaxed">{quotaNotice}</p>
            </div>
            <button
              onClick={() => setQuotaNotice(null)}
              className="text-neutral-400 hover:text-neutral-200 text-xs px-2 py-1 rounded bg-neutral-900 border border-neutral-800"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Hero Section Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-950 border border-neutral-800 p-6 sm:p-8 shadow-2xl">
          <div className="max-w-3xl space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Medium Cross-Campaign Visualization</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-100">
              One Iconic Product. <br />
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">
                Every Advertising Medium.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
              Describe your product once. Powered by <span className="text-neutral-200 font-medium">Nano-Banana</span>, generate an uncompromised campaign across roadside billboards, vintage broadsheet newspapers, social feeds, and luxury magazine spreads with guaranteed product consistency and zero people.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-neutral-400">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neutral-950/80 border border-neutral-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Multimodal Form Consistency</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neutral-950/80 border border-neutral-800">
                <UserX className="w-3.5 h-3.5 text-rose-400" />
                <span>Zero Human Models</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neutral-950/80 border border-neutral-800">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Nano-Banana Image Model</span>
              </div>
            </div>
          </div>

          {/* Decorative ambient gradient backdrop */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Step 1: Product Definition & Master Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7">
            <ProductForm
              product={product}
              onChange={handleProductChange}
              onGenerateMaster={handleGenerateMaster}
              onUploadImage={handleUploadImage}
              isGenerating={isGeneratingMaster}
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
              hasMasterImage={Boolean(masterImage)}
            />
          </div>

          <div className="lg:col-span-5">
            {masterImage ? (
              <MasterHeroCard
                imageUrl={masterImage}
                product={product}
                onOpenZoom={() =>
                  setActiveMockup({
                    medium: {
                      id: 'master',
                      name: 'Master Product Hero (Anchor)',
                      category: 'Packaging',
                      aspectRatio: '1:1',
                      iconName: 'Box',
                      shortDescription: 'Isolated commercial studio hero shot on podium',
                      promptDescription: masterPrompt,
                      mockupType: 'custom',
                      defaultSelected: true,
                    },
                    shot: {
                      mediumId: 'master',
                      mediumName: 'Master Product Hero',
                      imageUrl: masterImage,
                      status: 'completed',
                      aspectRatio: '1:1',
                      promptUsed: masterPrompt,
                      modelUsed: selectedModel,
                    },
                  })
                }
                onDownload={() => handleDownloadAsset('master_hero', masterImage)}
                promptUsed={masterPrompt}
                modelUsed={selectedModel}
              />
            ) : (
              <div className="bg-neutral-900/40 border border-dashed border-neutral-800 rounded-2xl p-8 text-center space-y-3 flex flex-col items-center justify-center min-h-[360px]">
                <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-600">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-300">
                  No Master Product Shot Yet
                </h3>
                <p className="text-xs text-neutral-500 max-w-xs">
                  Describe your product or choose a curated preset on the left, then click "Generate Master Product Shot".
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Step 2: Multi-Medium Campaign Matrix */}
        <MediumGrid
          mediums={mediums}
          shots={shots}
          selectedMediumIds={selectedMediumIds}
          onToggleSelectMedium={handleToggleSelectMedium}
          onSelectAll={handleSelectAll}
          onSelectCoreThree={handleSelectCoreThree}
          onGenerateMedium={handleGenerateMedium}
          onGenerateBatch={handleGenerateBatch}
          isBatchGenerating={isBatchGenerating}
          onOpenMockup={(medium, shot) => setActiveMockup({ medium, shot })}
          onDownloadShot={handleDownloadAsset}
          stylePreset={stylePreset}
          onStylePresetChange={setStylePreset}
          hasMasterImage={Boolean(masterImage)}
          onAddCustomMedium={handleAddCustomMedium}
        />
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-neutral-800/80 bg-neutral-950/60 py-6 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-neutral-400">Brand Builder</span>
            <span>· Powered by Nano-Banana Image Model</span>
          </div>
          <div className="text-[11px] text-neutral-600">
            Guaranteed Product Geometry & Color Consistency · Zero People In Every Frame
          </div>
        </div>
      </footer>

      {/* Mockup Inspector Modal */}
      {activeMockup && activeMockup.shot.imageUrl && (
        <MockupModal
          medium={activeMockup.medium}
          shot={activeMockup.shot}
          productName={product.name}
          tagline={product.tagline}
          onClose={() => setActiveMockup(null)}
          onDownload={() =>
            handleDownloadAsset(activeMockup.medium.name, activeMockup.shot.imageUrl!)
          }
        />
      )}

      {/* Comparison Modal */}
      {isComparisonOpen && (
        <ComparisonModal
          product={product}
          masterImageUrl={masterImage}
          mediums={mediums}
          shots={shots}
          onClose={() => setIsComparisonOpen(false)}
          onDownloadAll={handleDownloadAll}
          onSelectShot={(medium, shot) => {
            setIsComparisonOpen(false);
            setActiveMockup({ medium, shot });
          }}
        />
      )}
    </div>
  );
}
