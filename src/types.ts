export type AspectRatio = '1:1' | '3:4' | '4:3' | '16:9' | '9:16';

export interface ProductConcept {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  keyFeatures: string;
  colorPalette: {
    name: string;
    primaryHex: string;
    secondaryHex: string;
    accentHex: string;
  };
  stylePreset: string;
}

export interface MediumConfig {
  id: string;
  name: string;
  category: 'OOH' | 'Print' | 'Digital' | 'Retail' | 'Packaging';
  aspectRatio: AspectRatio;
  iconName: string;
  shortDescription: string;
  promptDescription: string;
  mockupType: 'billboard' | 'newspaper' | 'social_post' | 'magazine_spread' | 'transit_shelter' | 'metro_lightbox' | 'storefront_window' | 'unboxing_packaging' | 'custom';
  defaultSelected: boolean;
}

export interface CampaignShot {
  mediumId: string;
  mediumName: string;
  imageUrl?: string;
  status: 'idle' | 'generating' | 'completed' | 'error';
  errorMessage?: string;
  aspectRatio: AspectRatio;
  generatedAt?: number;
  promptUsed?: string;
  modelUsed?: string;
  isMockFallback?: boolean;
}
