export interface ImageFile {
  file: File | null; // Allow null for synthetic files
  preview: string;
  base64: string;
}

export interface AnalysisResult {
  critique: string;
  rating: number; // 0-10
  matchScore: number; // 0-100%
  suggestions: string[];
}

export interface InspirationItem {
  outfitName: string;
  estimatedPrice: string;
  description: string;
  sourceUrl: string;
}

// --- PROFESSIONAL STUDIO TYPES ---

export enum AspectRatio {
  PORTRAIT = '3:4',
  SQUARE = '1:1',
  LANDSCAPE = '16:9',
  STORY = '9:16'
}

export enum FocalLength {
  WIDE_24 = '24mm (Wide/Dynamic)',
  STREET_35 = '35mm (Street/Lifestyle)',
  NORMAL_50 = '50mm (Natural/Human Eye)',
  PORTRAIT_85 = '85mm (Flattering Portrait)',
  TELE_135 = '135mm (Compressed/Runway)'
}

export enum DepthOfField {
  DEEP = 'f/11 (Deep Focus - All Clear)',
  BALANCED = 'f/5.6 (Balanced)',
  SHALLOW = 'f/1.8 (Shallow - Bokeh Background)'
}

export enum Pose {
  CLASSIC = 'Classic Model Stance',
  WALKING = 'Walking / Runway Strut',
  SITTING = 'Sitting / Relaxed',
  LEANING = 'Leaning against wall/prop',
  DYNAMIC = 'Dynamic / In Motion',
  CANDID = 'Candid / Unposed',
  CLOSEUP_HANDS = 'Detail (Hands/Accessories)'
}

export enum LightingStyle {
  SOFTBOX = 'Studio Softbox (Even, Clean)',
  HARD = 'Hard Light (High Contrast)',
  NATURAL = 'Natural Window Light',
  GOLDEN = 'Golden Hour (Warm Sun)',
  REMBRANDT = 'Rembrandt (Dramatic)',
  NEON = 'Neon / Cyberpunk',
  RIM = 'Rim Light / Backlit',
  FLASH = 'Direct Flash (Paparazzi)'
}

export enum Environment {
  STUDIO_GREY = 'Studio Grey Seamless',
  STUDIO_WHITE = 'Infinity White Cyc',
  STUDIO_BLACK = 'Pitch Black Void',
  LUXURY = 'Luxury Penthouse',
  STREET = 'Urban Street / Concrete',
  NATURE = 'Botanic Garden',
  BEACH = 'Sunset Beach',
  RUNWAY = 'Fashion Runway',
  MIRROR = 'Studio with Mirror Floor',
  CUSTOM = 'Custom Location...'
}

export enum ColorGrade {
  TRUE = 'True to Life',
  BW = 'Black & White (High Contrast)',
  VINTAGE = 'Vintage / Film Look',
  CINEMATIC = 'Cinematic Teal/Orange',
  FASHION = 'High Fashion / Vibrant',
  MUTED = 'Muted / Matte / Pastel'
}

export interface StudioSettings {
  // Camera
  aspectRatio: AspectRatio;
  focalLength: FocalLength;
  depthOfField: DepthOfField;
  
  // Subject
  pose: Pose;
  
  // Atmosphere
  lighting: LightingStyle;
  environment: Environment;
  customEnvironment?: string;
  
  // Post-Process
  colorGrade: ColorGrade;
  
  // Advanced Toggles
  enhanceTexture: boolean; // Emphasize fabric details
  filmGrain: boolean;      // Add analog texture
  beautyFilter: boolean;   // Skin retouching
}