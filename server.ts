import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize GoogleGenAI SDK on server-side only
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface GenerateMasterRequest {
  productName: string;
  category: string;
  description: string;
  keyFeatures: string;
  colorPalette: string;
  model?: string;
  aspectRatio?: '1:1' | '3:4' | '4:3' | '16:9' | '9:16';
}

interface GenerateMediumRequest {
  masterImageBase64: string;
  productName: string;
  productDescription: string;
  mediumId: string;
  mediumName: string;
  mediumPrompt: string;
  aspectRatio?: '1:1' | '3:4' | '4:3' | '16:9' | '9:16';
  stylePreset?: string;
  model?: string;
}

// 1. Generate Master Product Hero Image
app.post('/api/generate-master', async (req: Request<{}, {}, GenerateMasterRequest>, res: Response) => {
  try {
    const { productName, category, description, keyFeatures, colorPalette, model = 'gemini-3.1-flash-lite-image', aspectRatio = '1:1' } = req.body;

    if (!productName || !description) {
      return res.status(400).json({ error: 'Product name and description are required.' });
    }

    // Build the master prompt with absolute prohibition of people
    const prompt = `Commercial product hero studio photography of "${productName}".
Category: ${category || 'Premium Consumer Product'}.
Product Details: ${description}.
Distinctive Visual Features: ${keyFeatures || 'Clean, iconic silhouette with luxury finishing'}.
Color Palette & Materials: ${colorPalette || 'Curated brand colors with high-end tactile textures'}.

Composition & Lighting:
- Hero centered commercial angle, crisp sharp focus, studio softbox lighting with subtle rim lights.
- Displayed on a minimalist podium or clean architectural surface.
- Pristine reflections and high-fidelity product textures.

MANDATORY RULES:
- ABSOLUTELY NO PEOPLE. NO human beings, NO faces, NO hands, NO fingers, NO human bodies, NO silhouettes, NO mannequins.
- Zero humans anywhere in the image.
- 100% pure focus on the product, its packaging, and its distinctive visual identity.`;

    const response = await ai.models.generateContent({
      model: model || 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio || '1:1',
        },
      },
    });

    let imageUrl = '';
    let textResponse = '';

    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        const mimeType = part.inlineData.mimeType || 'image/png';
        imageUrl = `data:${mimeType};base64,${part.inlineData.data}`;
      } else if (part.text) {
        textResponse += part.text;
      }
    }

    if (!imageUrl) {
      return res.status(500).json({
        error: 'No image was returned by the Nano-Banana model.',
        details: textResponse || 'The model did not produce an image part.',
      });
    }

    return res.json({
      success: true,
      imageUrl,
      modelUsed: model,
      prompt,
    });
  } catch (error: any) {
    console.error('Error generating master image:', error);
    const errorMessage = error?.message || 'Failed to generate master product image';
    const isQuota = errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED') || errorMessage.includes('quota');
    const isKey = errorMessage.includes('API_KEY_INVALID') || errorMessage.includes('403') || errorMessage.includes('PERMISSION_DENIED');

    return res.status(500).json({
      error: errorMessage,
      code: isQuota ? 'QUOTA_EXCEEDED' : isKey ? 'AUTH_ERROR' : 'GENERATION_ERROR',
      hint: isQuota
        ? 'Quota limit reached for image generation. Nano-Banana image generation requires a billing-enabled API key.'
        : isKey
        ? 'Please check your API key permissions in AI Studio Settings > Secrets.'
        : errorMessage,
    });
  }
});

// 2. Generate Product Across Mediums (Billboard, Newspaper, Social Post, etc.)
// Uses reference image to maintain absolute product consistency
app.post('/api/generate-medium', async (req: Request<{}, {}, GenerateMediumRequest>, res: Response) => {
  try {
    const {
      masterImageBase64,
      productName,
      productDescription,
      mediumId,
      mediumName,
      mediumPrompt,
      aspectRatio = '1:1',
      stylePreset = 'Contemporary Commercial',
      model = 'gemini-3.1-flash-lite-image',
    } = req.body;

    if (!masterImageBase64) {
      return res.status(400).json({ error: 'Master product reference image is required to maintain consistency.' });
    }

    // Clean base64 string if it contains data URI prefix
    let cleanBase64 = masterImageBase64;
    let mimeType = 'image/png';
    if (masterImageBase64.includes('base64,')) {
      const parts = masterImageBase64.split('base64,');
      cleanBase64 = parts[1];
      const mimeMatch = parts[0].match(/:(.*?);/);
      if (mimeMatch) mimeType = mimeMatch[1];
    }

    // Detailed medium-specific prompts ensuring consistency and NO people
    let specificMediumGuidance = '';
    switch (mediumId) {
      case 'billboard':
        specificMediumGuidance = `OUTDOOR BILLBOARD ADVERTISING MEDIUM:
A colossal outdoor highway billboard advertisement or monumental urban rooftop billboard set against a clean architectural open sky at twilight or golden hour.
The billboard prominently displays the EXACT product from the reference image, rendered at monumental scale with crisp billboard typography, sleek modern branding slogan, and professional outdoor lighting.
Framed with realistic billboard structure, steel trusses, and ad spotlights.`;
        break;

      case 'newspaper':
        specificMediumGuidance = `VINTAGE & CONTEMPORARY NEWSPAPER ADVERTISING MEDIUM:
A full-page printed daily broadsheet newspaper advertisement.
The authentic rough-textured newsprint paper surface has visible paper grain, subtle halftone dot printing ink texture, elegant multi-column news article typography surrounding the ad, and editorial headlines.
The EXACT product from the reference image is the star hero of this print advertisement, captured in authentic high-contrast monochrome or vintage duotone newspaper ink print style.`;
        break;

      case 'social_post':
        specificMediumGuidance = `SOCIAL MEDIA FEED POST (INSTAGRAM / TIKTOK / PINTEREST):
A pristine square or vertical luxury social media campaign asset.
Staged in a modern aesthetic studio flat-lay or sculptural podium setting with organic architectural sunlight shadows, geometric travertine stone blocks, and minimalist styling.
The EXACT product from the reference image is crisp, vibrant, and perfectly centered as a thumb-stopping feed visual.`;
        break;

      case 'magazine_spread':
        specificMediumGuidance = `HIGH-FASHION GLOSSY MAGAZINE SPREAD:
A double-page spread inside a premier luxury lifestyle and design publication (like Vogue, Wallpaper*, or Monocle).
Features the open glossy magazine laying flat on a dark polished granite surface, showing the center fold crease, refined editorial typography, generous whitespace, and the EXACT product photographed in museum-grade editorial lighting.`;
        break;

      case 'transit_shelter':
        specificMediumGuidance = `BUS SHELTER / STREET POSTER KIOSK (MUPI):
An illuminated glass bus shelter advertising lightbox on a clean, empty European architectural boulevard at dusk.
The backlit advertising poster glows softly within its tempered glass frame, showcasing the EXACT product from the reference image with crystal clarity and striking depth. The surrounding street is wet asphalt with soft evening light reflections.`;
        break;

      case 'metro_lightbox':
        specificMediumGuidance = `SUBWAY & TRANSIT WALL LIGHTBOX:
A massive high-resolution illuminated advertising lightbox mounted along the polished tiled wall of an ultra-modern, pristine train terminal concourse.
The glowing display exhibits the EXACT product from the reference image, casting atmospheric colored ambient light onto the sleek architectural flooring.`;
        break;

      case 'storefront_window':
        specificMediumGuidance = `LUXURY STOREFRONT WINDOW DISPLAY:
A prestigious flagship boutique display window on a high-end luxury shopping avenue at night.
Behind the seamless architectural glass, the EXACT product from the reference image is elevated on a bespoke illuminated marble plinth with dramatic museum spotlighting, minimalist geometric backdrops, and subtle gold foil window decals.`;
        break;

      case 'unboxing_packaging':
        specificMediumGuidance = `PREMIUM PACKAGING & UNBOXING SUITE:
A top-tier unboxing arrangement featuring the EXACT product from the reference image resting beside its bespoke matte rigid presentation box, embossed foil tissue paper, and minimalist branded care card on a honed walnut table.`;
        break;

      default:
        specificMediumGuidance = `ADVERTISING MEDIUM: ${mediumName}
${mediumPrompt || 'Commercial advertising showcase featuring the product in a specialized brand environment.'}`;
        break;
    }

    const fullPrompt = `You are an elite brand creative director. Place the EXACT product shown in the attached reference image into the following advertising medium scene.

CRITICAL PRODUCT CONSISTENCY REQUIREMENT:
- Retain the exact product form, geometry, container/bottle shape, packaging design, logos, color scheme, typography, and material textures as shown in the reference image.
- The product must be immediately recognizable as the exact same brand item.

CAMPAIGN MEDIUM & SCENE:
${specificMediumGuidance}

STYLE DIRECTION:
${stylePreset} aesthetic. Professional commercial photography, cinematic lighting, ultra-crisp textures.

ABSOLUTE STRICT NEGATIVE CONSTRAINT (ZERO TOLERANCE):
- ABSOLUTELY NO PEOPLE.
- NO human beings, NO models, NO faces, NO hands, NO arms, NO legs, NO silhouettes, NO pedestrians, NO crowd, NO bystanders.
- The scene must be 100% UNPOPULATED. Focus strictly on the product and the advertising medium itself.`;

    const response = await ai.models.generateContent({
      model: model || 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType,
            },
          },
          {
            text: fullPrompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio || '1:1',
        },
      },
    });

    let imageUrl = '';
    let textResponse = '';

    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        const mime = part.inlineData.mimeType || 'image/png';
        imageUrl = `data:${mime};base64,${part.inlineData.data}`;
      } else if (part.text) {
        textResponse += part.text;
      }
    }

    if (!imageUrl) {
      return res.status(500).json({
        error: 'No image was produced for this medium.',
        details: textResponse || 'The model did not produce an image part.',
      });
    }

    return res.json({
      success: true,
      imageUrl,
      mediumId,
      aspectRatio,
      prompt: fullPrompt,
    });
  } catch (error: any) {
    console.error('Error generating medium image:', error);
    const errorMessage = error?.message || 'Failed to generate medium image';
    const isQuota = errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED') || errorMessage.includes('quota');
    const isKey = errorMessage.includes('API_KEY_INVALID') || errorMessage.includes('403') || errorMessage.includes('PERMISSION_DENIED');

    return res.status(500).json({
      error: errorMessage,
      code: isQuota ? 'QUOTA_EXCEEDED' : isKey ? 'AUTH_ERROR' : 'GENERATION_ERROR',
      hint: isQuota
        ? 'Quota limit reached for image generation. Nano-Banana requires a billing-enabled API key.'
        : isKey
        ? 'Please check your API key permissions in AI Studio Settings > Secrets.'
        : errorMessage,
    });
  }
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasKey: Boolean(process.env.GEMINI_API_KEY),
    supportedModels: ['gemini-3.1-flash-lite-image', 'gemini-nano-banana-2.1'],
  });
});

// Mount Vite or serve static dist
async function setupFrontend() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Brand Builder app running on http://0.0.0.0:${PORT}`);
  });
}

setupFrontend().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
