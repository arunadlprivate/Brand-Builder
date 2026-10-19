import { ProductConcept } from '../types';

/**
 * Generates an SVG/Canvas based visual asset for the product or medium scene.
 * This guarantees that even if external API quota is temporarily at limit (0 free tier requests),
 * the user can experience the full multi-medium consistency workflow smoothly.
 */
export function generateConsistentMockAsset(
  product: ProductConcept,
  mediumType: string = 'master',
  customLabel?: string
): string {
  const pCol = product.colorPalette.primaryHex || '#1e293b';
  const sCol = product.colorPalette.secondaryHex || '#d97706';
  const aCol = product.colorPalette.accentHex || '#f8fafc';
  const name = product.name.toUpperCase();
  const cat = product.category.toUpperCase();

  // Create SVG string based on medium type
  let svg = '';

  if (mediumType === 'master') {
    // Clean studio hero shot on podium with softbox lighting
    svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
      <defs>
        <radialGradient id="bgG" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stop-color="#262626"/>
          <stop offset="60%" stop-color="#141414"/>
          <stop offset="100%" stop-color="#0a0a0a"/>
        </radialGradient>
        <radialGradient id="glow" cx="50%" cy="45%" r="40%">
          <stop offset="0%" stop-color="${sCol}" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="${sCol}" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="podiumGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#3f3f46"/>
          <stop offset="100%" stop-color="#18181b"/>
        </linearGradient>
        <linearGradient id="bottleG" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${pCol}"/>
          <stop offset="35%" stop-color="${sCol}"/>
          <stop offset="70%" stop-color="${pCol}"/>
          <stop offset="100%" stop-color="#0a0a0a"/>
        </linearGradient>
        <linearGradient id="goldCollar" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#b45309"/>
          <stop offset="50%" stop-color="#fef08a"/>
          <stop offset="100%" stop-color="#78350f"/>
        </linearGradient>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="18" stdDeviation="15" flood-color="#000000" flood-opacity="0.8"/>
        </filter>
      </defs>

      <!-- Background -->
      <rect width="800" height="800" fill="url(#bgG)"/>
      <ellipse cx="400" cy="460" rx="280" ry="200" fill="url(#glow)"/>

      <!-- Architectural Podium -->
      <ellipse cx="400" cy="620" rx="260" ry="40" fill="#050505" opacity="0.6"/>
      <path d="M 180 580 L 620 580 L 600 660 L 200 660 Z" fill="url(#podiumGrad)"/>
      <ellipse cx="400" cy="580" rx="220" ry="25" fill="#52525b"/>

      <!-- Product Bottle/Object Shape -->
      <g filter="url(#softShadow)">
        <!-- Cap / Collar -->
        <rect x="375" y="220" width="50" height="65" rx="6" fill="url(#goldCollar)"/>
        <rect x="388" y="180" width="24" height="42" rx="4" fill="#27272a"/>
        
        <!-- Main Vessel Body -->
        <rect x="320" y="280" width="160" height="260" rx="30" fill="url(#bottleG)" stroke="${sCol}" stroke-width="2"/>
        <!-- Inner Glow & Liquid Level -->
        <rect x="330" y="300" width="140" height="225" rx="20" fill="${sCol}" opacity="0.2"/>
        <line x1="345" y1="290" x2="345" y2="530" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.4"/>
        
        <!-- Luxury Label -->
        <rect x="345" y="360" width="110" height="110" rx="6" fill="#18181b" stroke="${sCol}" stroke-width="1.5" opacity="0.95"/>
        <text x="400" y="395" font-family="'Playfair Display', serif" font-size="14" font-weight="bold" fill="${sCol}" text-anchor="middle" letter-spacing="3">${name.slice(0, 10)}</text>
        <line x1="365" y1="405" x2="435" y2="405" stroke="${sCol}" stroke-width="1" opacity="0.5"/>
        <text x="400" y="425" font-family="sans-serif" font-size="8" fill="#e4e4e7" text-anchor="middle" letter-spacing="2">EDITION PUR</text>
        <text x="400" y="445" font-family="monospace" font-size="7" fill="${aCol}" text-anchor="middle" letter-spacing="1">100 ML · 3.4 FL. OZ</text>
      </g>

      <!-- Badge Overlay -->
      <rect x="30" y="30" width="220" height="36" rx="18" fill="#18181b" stroke="#3f3f46" stroke-width="1" opacity="0.9"/>
      <circle cx="50" cy="48" r="6" fill="#22c55e"/>
      <text x="66" y="52" font-family="sans-serif" font-size="11" font-weight="600" fill="#f4f4f5" letter-spacing="1">MASTER HERO ANCHOR</text>

      <text x="770" y="52" font-family="monospace" font-size="11" fill="#71717a" text-anchor="end">NANO-BANANA STUDIO</text>
    </svg>
    `;
  } else if (mediumType === 'billboard') {
    // Highway / Skyline Billboard scene (16:9)
    svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
      <defs>
        <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#0f172a"/>
          <stop offset="45%" stop-color="#1e1b4b"/>
          <stop offset="80%" stop-color="#f97316"/>
          <stop offset="100%" stop-color="#fdba74"/>
        </linearGradient>
        <linearGradient id="billboardGlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#09090b"/>
          <stop offset="60%" stop-color="#18181b"/>
          <stop offset="100%" stop-color="#09090b"/>
        </linearGradient>
        <filter id="adShadow">
          <feDropShadow dx="0" dy="25" stdDeviation="20" flood-color="#000000" flood-opacity="0.9"/>
        </filter>
      </defs>

      <!-- Dramatic Dusk Sky -->
      <rect width="1200" height="675" fill="url(#skyGrad)"/>

      <!-- Distant Mountain/Urban Skyline Silhouette (NO PEOPLE) -->
      <path d="M 0 520 L 140 480 L 260 510 L 410 470 L 590 530 L 760 490 L 980 520 L 1200 480 L 1200 675 L 0 675 Z" fill="#0b0f19" opacity="0.9"/>
      <path d="M 0 570 L 1200 570 L 1200 675 L 0 675 Z" fill="#050811"/>

      <!-- Billboard Steel Pillars -->
      <rect x="580" y="440" width="40" height="200" fill="#27272a"/>
      <line x1="560" y1="460" x2="640" y2="520" stroke="#18181b" stroke-width="4"/>
      <line x1="560" y1="520" x2="640" y2="460" stroke="#18181b" stroke-width="4"/>

      <!-- Giant Billboard Canvas Frame -->
      <g filter="url(#adShadow)">
        <rect x="180" y="80" width="840" height="380" rx="8" fill="#18181b" stroke="#3f3f46" stroke-width="8"/>
        
        <!-- Billboard Ad Artwork -->
        <rect x="190" y="90" width="820" height="360" rx="4" fill="url(#billboardGlow)"/>
        
        <!-- Billboard Lighting Fixtures on top -->
        <rect x="250" y="65" width="40" height="12" fill="#52525b"/>
        <line x1="270" y1="65" x2="270" y2="80" stroke="#71717a" stroke-width="4"/>
        <rect x="580" y="65" width="40" height="12" fill="#52525b"/>
        <line x1="600" y1="65" x2="600" y2="80" stroke="#71717a" stroke-width="4"/>
        <rect x="910" y="65" width="40" height="12" fill="#52525b"/>
        <line x1="930" y1="65" x2="930" y2="80" stroke="#71717a" stroke-width="4"/>

        <!-- Ad Typography on Left -->
        <text x="240" y="190" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="bold" fill="${sCol}" letter-spacing="4">INTRODUCING</text>
        <text x="240" y="250" font-family="'Playfair Display', serif" font-size="44" font-weight="bold" fill="#ffffff" letter-spacing="2">${name}</text>
        <text x="240" y="295" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" fill="#a1a1aa" max-width="400">${product.tagline}</text>
        <rect x="240" y="325" width="180" height="38" rx="4" fill="${sCol}"/>
        <text x="330" y="350" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="800" fill="#000000" text-anchor="middle" letter-spacing="2">EXPERIENCE PURITY</text>

        <!-- EXACT PRODUCT HERO on Right (Consistent bottle/container) -->
        <g transform="translate(420, -10)">
          <rect x="360" y="150" width="36" height="45" rx="4" fill="#fef08a"/>
          <rect x="320" y="190" width="115" height="180" rx="22" fill="${pCol}" stroke="${sCol}" stroke-width="2"/>
          <rect x="330" y="205" width="95" height="150" rx="14" fill="${sCol}" opacity="0.3"/>
          <rect x="340" y="240" width="75" height="75" rx="4" fill="#09090b" opacity="0.9"/>
          <text x="377" y="275" font-family="'Playfair Display', serif" font-size="10" font-weight="bold" fill="${sCol}" text-anchor="middle" letter-spacing="2">${name.slice(0, 8)}</text>
          <text x="377" y="295" font-family="monospace" font-size="7" fill="#ffffff" text-anchor="middle">AUTHENTIC</text>
        </g>
      </g>

      <!-- Medium watermark / tag -->
      <rect x="20" y="625" width="260" height="30" rx="6" fill="#09090b" opacity="0.8"/>
      <text x="35" y="645" font-family="monospace" font-size="11" fill="#a1a1aa">HIGHWAY BILLBOARD OOH · 16:9</text>
    </svg>
    `;
  } else if (mediumType === 'newspaper') {
    // Broadsheet newspaper ad (3:4)
    svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 1000" width="750" height="1000">
      <defs>
        <!-- Halftone dot pattern -->
        <pattern id="halftone" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.2" fill="#18181b" opacity="0.25"/>
        </pattern>
        <filter id="paperGrain">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.94  0 0 0 0 0.92  0 0 0 0 0.87  0 0 0 0.15 0"/>
        </filter>
      </defs>

      <!-- Aged Broadsheet Paper Texture -->
      <rect width="750" height="1000" fill="#f4efe6"/>
      <rect width="750" height="1000" fill="url(#halftone)"/>

      <!-- Newspaper Header Banner -->
      <line x1="40" y1="45" x2="710" y2="45" stroke="#262626" stroke-width="3"/>
      <line x1="40" y1="52" x2="710" y2="52" stroke="#262626" stroke-width="1"/>
      
      <text x="375" y="105" font-family="'Playfair Display', serif" font-size="46" font-weight="900" fill="#171717" text-anchor="middle" letter-spacing="6">THE DAILY CHRONICLE</text>
      <text x="50" y="130" font-family="'Plus Jakarta Sans', serif" font-size="11" fill="#525252">VOL. CXXIV · NO. 41,209</text>
      <text x="375" y="130" font-family="'Plus Jakarta Sans', serif" font-size="11" fill="#525252" text-anchor="middle">INTERNATIONAL COMMERCE & INNOVATION REPORT</text>
      <text x="700" y="130" font-family="'Plus Jakarta Sans', serif" font-size="11" fill="#525252" text-anchor="end">TWO DOLLARS</text>
      
      <line x1="40" y1="140" x2="710" y2="140" stroke="#262626" stroke-width="2"/>

      <!-- Surrounding Fake Newspaper Columns (NO PEOPLE) -->
      <text x="40" y="170" font-family="'Playfair Display', serif" font-size="18" font-weight="bold" fill="#171717">GLOBAL MARKETS EMBRACE NEW LUXURY BENCHMARK</text>
      <g fill="#404040" font-family="'Playfair Display', serif" font-size="9" opacity="0.85">
        <text x="40" y="195">Financial indicators across major capital centers reached notable</text>
        <text x="40" y="210">milestones this quarter, driven largely by sustained innovation in</text>
        <text x="40" y="225">premium artisanal manufacturing and sustainable materials research.</text>
        <text x="40" y="240">Analysts underscore the shift toward enduring quality over volume.</text>
      </g>

      <!-- Full Feature Newspaper Advertisement Box -->
      <rect x="40" y="265" width="670" height="680" fill="#fdfbf7" stroke="#171717" stroke-width="3"/>
      <rect x="48" y="273" width="654" height="664" fill="none" stroke="#171717" stroke-width="1"/>

      <!-- Inside the Ad -->
      <text x="375" y="325" font-family="'Playfair Display', serif" font-size="13" font-weight="bold" fill="#525252" text-anchor="middle" letter-spacing="4">AN EXCEPTIONAL ACHIEVEMENT IN FORM & ESSENCE</text>
      <text x="375" y="375" font-family="'Playfair Display', serif" font-size="36" font-weight="bold" fill="#171717" text-anchor="middle" letter-spacing="3">${name}</text>
      <line x1="300" y1="395" x2="450" y2="395" stroke="#171717" stroke-width="1.5"/>

      <!-- Halftone Print Product Illustration (Pure Product, NO PEOPLE) -->
      <g transform="translate(180, 220)">
        <!-- Engraving / Halftone Style Product -->
        <rect x="175" y="200" width="40" height="50" fill="#262626"/>
        <rect x="130" y="245" width="130" height="210" rx="20" fill="#171717"/>
        <rect x="140" y="260" width="110" height="180" rx="12" fill="#3f3f46"/>
        <rect x="155" y="300" width="80" height="80" fill="#f4efe6"/>
        <text x="195" y="335" font-family="'Playfair Display', serif" font-size="11" font-weight="bold" fill="#171717" text-anchor="middle">${name.slice(0, 10)}</text>
        <text x="195" y="355" font-family="serif" font-size="8" fill="#525252" text-anchor="middle">PURE QUALITY</text>
      </g>

      <text x="375" y="730" font-family="'Playfair Display', serif" font-size="15" font-style="italic" fill="#262626" text-anchor="middle">"${product.tagline}"</text>
      <text x="375" y="765" font-family="'Playfair Display', serif" font-size="10" fill="#404040" text-anchor="middle" max-width="500">Crafted without compromise. Available through curated purveyors worldwide.</text>
      
      <!-- Seal / Stamp in Newspaper -->
      <circle cx="375" cy="830" r="38" fill="none" stroke="#171717" stroke-width="2" stroke-dasharray="4,2"/>
      <text x="375" y="825" font-family="sans-serif" font-size="8" font-weight="bold" fill="#171717" text-anchor="middle" letter-spacing="2">OFFICIAL</text>
      <text x="375" y="840" font-family="sans-serif" font-size="7" fill="#525252" text-anchor="middle" letter-spacing="1">MASTER CRAFT</text>

      <text x="375" y="910" font-family="monospace" font-size="10" fill="#737373" text-anchor="middle" letter-spacing="3">WWW.${product.name.replace(/[^a-zA-Z]/g, '').toUpperCase()}.COM</text>
    </svg>
    `;
  } else if (mediumType === 'social_post') {
    // Instagram / Social post flat-lay (1:1)
    svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
      <defs>
        <linearGradient id="stoneG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#e7e5e4"/>
          <stop offset="60%" stop-color="#d6d3d1"/>
          <stop offset="100%" stop-color="#a8a29e"/>
        </linearGradient>
        <linearGradient id="shadowCast" x1="0%" y1="0%" x2="100%" y2="80%">
          <stop offset="0%" stop-color="#78716c" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="#1c1917" stop-opacity="0"/>
        </linearGradient>
      </defs>

      <!-- Warm Travertine Stone Backdrop -->
      <rect width="800" height="800" fill="url(#stoneG)"/>

      <!-- Architectural Sunbeam Shadows (Window Pane Casting) -->
      <polygon points="120,0 240,0 60,800 -60,800" fill="url(#shadowCast)"/>
      <polygon points="360,0 480,0 300,800 180,800" fill="url(#shadowCast)"/>
      <polygon points="600,0 720,0 540,800 420,800" fill="url(#shadowCast)"/>

      <!-- Organic Styling Props (Botanical Leaves & Travertine Blocks, NO PEOPLE) -->
      <!-- Travertine Block Podium -->
      <rect x="250" y="280" width="300" height="300" rx="4" fill="#f5f5f4" stroke="#e5e5e5" stroke-width="1"/>
      <rect x="230" y="480" width="340" height="80" rx="4" fill="#e7e5e4" opacity="0.8"/>
      
      <!-- Minimalist Botanical Frond Shadow -->
      <path d="M 680 750 Q 580 500 480 380 Q 420 320 380 280" stroke="#78716c" stroke-width="3" fill="none" opacity="0.3"/>
      <ellipse cx="500" cy="380" rx="30" ry="12" fill="#78716c" opacity="0.25" transform="rotate(-30 500 380)"/>
      <ellipse cx="560" cy="450" rx="35" ry="14" fill="#78716c" opacity="0.25" transform="rotate(-20 560 450)"/>

      <!-- Consistent Product Asset in Center -->
      <g transform="translate(140, 20)">
        <ellipse cx="260" cy="520" rx="90" ry="25" fill="#44403c" opacity="0.35"/>
        <rect x="240" y="240" width="40" height="55" rx="6" fill="#fef08a"/>
        <rect x="195" y="290" width="130" height="210" rx="24" fill="${pCol}" stroke="${sCol}" stroke-width="2"/>
        <rect x="205" y="305" width="110" height="180" rx="16" fill="${sCol}" opacity="0.3"/>
        <rect x="215" y="350" width="90" height="90" rx="6" fill="#18181b" opacity="0.95"/>
        <text x="260" y="385" font-family="'Playfair Display', serif" font-size="12" font-weight="bold" fill="${sCol}" text-anchor="middle" letter-spacing="2">${name.slice(0, 9)}</text>
        <line x1="230" y1="395" x2="290" y2="395" stroke="${sCol}" stroke-width="1" opacity="0.6"/>
        <text x="260" y="415" font-family="sans-serif" font-size="8" fill="#e4e4e7" text-anchor="middle">PURE AESTHETIC</text>
      </g>

      <!-- Social Media UI Overlay -->
      <g transform="translate(30, 710)">
        <rect width="740" height="60" rx="14" fill="#1c1917" opacity="0.85"/>
        <circle cx="35" cy="30" r="16" fill="${sCol}"/>
        <text x="35" y="35" font-family="sans-serif" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">${name.slice(0, 1)}</text>
        <text x="65" y="26" font-family="sans-serif" font-size="13" font-weight="bold" fill="#ffffff">${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}</text>
        <text x="65" y="44" font-family="sans-serif" font-size="10" fill="#a8a29e">Sponsored · Shot with Nano-Banana</text>
        
        <text x="705" y="36" font-family="sans-serif" font-size="12" font-weight="700" fill="${sCol}">Learn More →</text>
      </g>
    </svg>
    `;
  } else if (mediumType === 'magazine_spread') {
    // Double page luxury editorial spread (16:9)
    svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
      <defs>
        <linearGradient id="pageSheen" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="47%" stop-color="#f4f4f5"/>
          <stop offset="50%" stop-color="#71717a"/>
          <stop offset="53%" stop-color="#f4f4f5"/>
          <stop offset="100%" stop-color="#ffffff"/>
        </linearGradient>
      </defs>

      <!-- Polished Dark Granite Studio Surface -->
      <rect width="1200" height="675" fill="#18181b"/>

      <!-- Open Magazine Double-Page Spread -->
      <rect x="80" y="60" width="1040" height="555" rx="4" fill="url(#pageSheen)" filter="drop-shadow(0 20px 25px rgba(0,0,0,0.6))"/>
      
      <!-- Center Gutter Crease Shadow -->
      <line x1="600" y1="60" x2="600" y2="615" stroke="#3f3f46" stroke-width="2" opacity="0.6"/>
      <rect x="585" y="60" width="30" height="555" fill="black" opacity="0.08"/>

      <!-- LEFT PAGE: Editorial Story & Layout -->
      <text x="140" y="140" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="700" fill="#a1a1aa" letter-spacing="4">ARCHITECTURAL DESIGN & MATERIAL ARCHIVE</text>
      <text x="140" y="210" font-family="'Playfair Display', serif" font-size="38" font-weight="bold" fill="#09090b" max-width="400">The Geometry</text>
      <text x="140" y="255" font-family="'Playfair Display', serif" font-size="38" font-weight="bold" fill="${sCol}">of Permanence.</text>
      
      <g fill="#52525b" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" line-height="1.6">
        <text x="140" y="320">In an era inundated with ephemeral cycles, ${product.name}</text>
        <text x="140" y="340">reasserts the weight of deliberate material architecture. Every angle,</text>
        <text x="140" y="360">every surface contour has been disciplined to eliminate superfluity.</text>
        <text x="140" y="400">"We did not seek to decorate a silhouette," the design notes explain.</text>
        <text x="140" y="420">"We sought to distill its functional core until nothing could be</text>
        <text x="140" y="440">removed without diminishing its essence."</text>
      </g>
      <text x="140" y="560" font-family="monospace" font-size="10" fill="#71717a">PAGE 104 · ISSUE NO. 88</text>

      <!-- RIGHT PAGE: Full Bleed Product Hero (Pure Product, NO PEOPLE) -->
      <rect x="640" y="100" width="440" height="475" rx="4" fill="#0f172a"/>
      <g transform="translate(680, 50)">
        <ellipse cx="180" cy="400" rx="140" ry="25" fill="#000000" opacity="0.7"/>
        <rect x="160" y="140" width="40" height="50" rx="4" fill="#fef08a"/>
        <rect x="115" y="190" width="130" height="200" rx="24" fill="${pCol}" stroke="${sCol}" stroke-width="2"/>
        <rect x="125" y="205" width="110" height="170" rx="16" fill="${sCol}" opacity="0.3"/>
        <rect x="135" y="245" width="90" height="85" rx="6" fill="#18181b" opacity="0.95"/>
        <text x="180" y="280" font-family="'Playfair Display', serif" font-size="12" font-weight="bold" fill="${sCol}" text-anchor="middle" letter-spacing="2">${name.slice(0, 8)}</text>
        <text x="180" y="300" font-family="monospace" font-size="8" fill="#ffffff" text-anchor="middle">CURATED</text>
      </g>
      <text x="1040" y="560" font-family="monospace" font-size="10" fill="#71717a" text-anchor="end">PAGE 105</text>
    </svg>
    `;
  } else {
    // General default consistent medium template
    svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
      <defs>
        <linearGradient id="genG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#18181b"/>
          <stop offset="100%" stop-color="#09090b"/>
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#genG)"/>
      <rect x="40" y="40" width="720" height="520" rx="8" fill="#18181b" stroke="#27272a" stroke-width="2"/>
      
      <!-- Product Silhouette -->
      <g transform="translate(260, 60)">
        <ellipse cx="140" cy="380" rx="120" ry="25" fill="#000000" opacity="0.5"/>
        <rect x="120" y="140" width="40" height="50" rx="4" fill="#fef08a"/>
        <rect x="80" y="190" width="120" height="180" rx="20" fill="${pCol}" stroke="${sCol}" stroke-width="2"/>
        <text x="140" y="275" font-family="'Playfair Display', serif" font-size="12" font-weight="bold" fill="${sCol}" text-anchor="middle">${name.slice(0, 10)}</text>
      </g>

      <text x="400" y="500" font-family="'Playfair Display', serif" font-size="24" font-weight="bold" fill="#ffffff" text-anchor="middle">${name}</text>
      <text x="400" y="530" font-family="sans-serif" font-size="12" fill="${sCol}" text-anchor="middle" letter-spacing="3">${(customLabel || mediumType).toUpperCase()} CAMPAIGN ASSET</text>
    </svg>
    `;
  }

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
