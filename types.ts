
export enum ScannerMode {
  HEALTH = 'HEALTH',
  DISEASE = 'DISEASE',
  FOOD = 'FOOD',
  FINANCE = 'FINANCE',
  STOCK = 'STOCK',
  SHOPPING = 'SHOPPING',
  TRAVEL = 'TRAVEL',
  STUDY = 'STUDY',
  BEAUTY = 'BEAUTY',
  PETS = 'PETS',
  PLANT = 'PLANT',
  ENVIRONMENT = 'ENVIRONMENT',
  GENERAL = 'GENERAL',
  PRIVACY = 'PRIVACY',
  ENTERTAINMENT = 'ENTERTAINMENT',
  DOCUMENT = 'DOCUMENT',
  FASHION = 'FASHION',
  WINE = 'WINE',
  SLEEP = 'SLEEP',
  POSTURE = 'POSTURE',
  GEMSTONE = 'GEMSTONE'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface ScanResult {
  id: string;
  mode: ScannerMode;
  subMode?: string; // Track specific task
  imageUrl: string; // Base64 or Blob URL
  text: string;
  timestamp: number;
  groundingMetadata?: any;
  status?: 'analyzing' | 'complete' | 'error';
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export type ViewState = 'AUTH' | 'HOME' | 'CAMERA' | 'RESULT' | 'HISTORY' | 'BATCH_SUMMARY'|'DASHBOARD'|'PROFILE';

export interface ScannerConfig {
  mode: ScannerMode;
  label: string;
  description: string;
  icon: string;
  color: string;
  systemPrompt: string;
  useGoogleSearch?: boolean;
  useGoogleMaps?: boolean;
}

export interface SubMode {
  id: string;
  label: string;
  description: string;
  icon?: string;
}

// Define specific options for each scanner
export const SCANNER_SUBMODES: Record<ScannerMode, SubMode[]> = {
  [ScannerMode.HEALTH]: [
    { id: 'face', label: 'Face Health Scan', description: 'Analyze skin, eyes, and circulation.' },
    { id: 'tongue', label: 'Tongue Analysis', description: 'TCM & nutritional deficiency check.' },
    { id: 'nails', label: 'Nail Health', description: 'Check texture and circulation.' },
    { id: 'vitals', label: 'Vital Signs Estimate', description: 'Est. Heart rate & stress levels.' }
  ],
  [ScannerMode.POSTURE]: [
    { id: 'standing', label: 'Standing Alignment', description: 'Spine, shoulder & head position.' },
    { id: 'desk', label: 'Desk Ergonomics', description: 'Monitor height & chair setup.' },
    { id: 'movement', label: 'Lifting/Workout Form', description: 'Squat/Deadlift mechanics.' }
  ],
  [ScannerMode.BEAUTY]: [
    { id: 'hair', label: 'Hairstyle Recommender', description: 'Face shape analysis & style tips.' },
    { id: 'skin', label: 'Skincare Analysis', description: 'Routine builder for your skin type.' },
    { id: 'makeup', label: 'Makeup Match', description: 'Foundation shade & color palette.' },
    { id: 'hand', label: 'Hand & Nail Care', description: 'Manicure & anti-aging tips.' }
  ],
  [ScannerMode.DISEASE]: [
    { id: 'skin', label: 'Skin Condition', description: 'Rash, mole, or lesion analysis.' },
    { id: 'wound', label: 'Wound Check', description: 'Infection risk & healing tracker.' },
    { id: 'eye', label: 'Eye Condition', description: 'Redness, styes, or discharge.' },
    { id: 'symptom', label: 'General Symptom', description: 'Swelling or physical abnormality.' }
  ],
  [ScannerMode.FOOD]: [
    { id: 'nutrition', label: 'Nutrition Facts', description: 'Macros, calories & vitamins.' },
    { id: 'safety', label: 'Food Safety', description: 'Freshness, mold & spoilage check.' },
    { id: 'ingredients', label: 'Ingredient Scan', description: 'Additives & clean eating score.' },
    { id: 'meal', label: 'Full Meal Analysis', description: 'Plate breakdown & health impact.' }
  ],
  [ScannerMode.FINANCE]: [
    { id: 'vehicle', label: 'Vehicle Appraisal', description: 'Car value, condition & mileage.' },
    { id: 'item', label: 'Item Valuation', description: 'Antiques, electronics & resell value.' },
    { id: 'real_estate', label: 'Real Estate Estimate', description: 'Exterior property value check.' },
    { id: 'doc', label: 'Financial Document', description: 'Analyze statements or charts.' }
  ],
  [ScannerMode.STOCK]: [
    { id: 'chart', label: 'Chart Analysis', description: 'Patterns, candles & indicators.' },
    { id: 'earnings', label: 'Earnings Calendar', description: 'Estimates & upcoming reports.' },
    { id: 'insider', label: 'Insider Trading', description: 'Track CEO/Exec buying & selling.' },
    { id: 'short', label: 'Short Interest', description: 'Short squeeze potential & float.' },
    { id: 'dividend', label: 'Dividend Scanner', description: 'Yield, safety & growth.' },
    { id: 'value', label: 'Value Screener', description: 'Find undervalued stocks (P/E, P/B).' },
    { id: 'momentum', label: 'Momentum Scanner', description: 'Breakouts & trend strength.' },
    { id: 'economics', label: 'Economic Data', description: 'GDP, Inflation, Fed Rates.' },
    { id: 'global', label: 'Global Markets', description: 'Forex, Indices & Commodities.' }
  ],
  [ScannerMode.SHOPPING]: [
    { id: 'price', label: 'Price Check', description: 'Compare retail vs online prices.' },
    { id: 'negotiation', label: 'Negotiation Help', description: 'Strategy to get a lower price.' },
    { id: 'deal', label: 'Deal Scorer', description: 'Is this actually a good deal?' }
  ],
  [ScannerMode.PETS]: [
    { id: 'dog', label: 'Dog Health', description: 'General checkup for canines.' },
    { id: 'cat', label: 'Cat Health', description: 'General checkup for felines.' },
    { id: 'exotic', label: 'Bird/Small Pet', description: 'Checkup for other animals.' }
  ],
  [ScannerMode.PLANT]: [
    { id: 'id', label: 'Identify Plant', description: 'Name, family & origin.' },
    { id: 'health', label: 'Health Diagnosis', description: 'Check for pests, rot, or disease.' },
    { id: 'care', label: 'Care Guide', description: 'Watering & light schedule.' }
  ],
  [ScannerMode.PRIVACY]: [
    { id: 'camera', label: 'Hidden Camera Check', description: 'Find lenses in detectors/clocks.' },
    { id: 'mirror', label: 'Two-Way Mirror Test', description: 'Fingernail gap analysis.' },
    { id: 'wifi', label: 'Network Scan', description: 'Analyze list of WiFi networks.' },
    { id: 'physical', label: 'Room Security', description: 'Door locks & window check.' }
  ],
  [ScannerMode.STUDY]: [
    { id: 'math', label: 'Math Solver', description: 'Step-by-step solution.' },
    { id: 'science', label: 'Science Explainer', description: 'Concept breakdown.' },
    { id: 'writing', label: 'Essay Review', description: 'Grammar & structure feedback.' }
  ],
  [ScannerMode.DOCUMENT]: [
    { id: 'summary', label: 'Summarize', description: 'Key points & action items.' },
    { id: 'translate', label: 'Translate', description: 'Convert text to your language.' },
    { id: 'explain', label: 'Explain Terms', description: 'Simplify legal/technical jargon.' }
  ],
  [ScannerMode.FASHION]: [
    { id: 'outfit', label: 'Outfit Check', description: 'Style score & matching tips.' },
    { id: 'brand', label: 'Brand Identifier', description: 'Identify designer & collection.' }
  ],
  [ScannerMode.WINE]: [
    { id: 'label', label: 'Label Scan', description: 'Ratings, price & reviews.' },
    { id: 'pairing', label: 'Food Pairing', description: 'What to eat with this drink.' }
  ],
  [ScannerMode.ENTERTAINMENT]: [
    { id: 'movie', label: 'Movie/TV ID', description: 'Scene or poster recognition.' },
    { id: 'book', label: 'Book Review', description: 'Ratings & summary.' },
    { id: 'music', label: 'Music/Album ID', description: 'Artist info & tracklist.' }
  ],
  [ScannerMode.ENVIRONMENT]: [
    { id: 'recycle', label: 'Recycling Guide', description: 'How to dispose of this item.' },
    { id: 'nature', label: 'Nature Scan', description: 'Air quality & carbon footprint.' }
  ],
  [ScannerMode.TRAVEL]: [
    { id: 'landmark', label: 'Landmark Info', description: 'History & facts.' },
    { id: 'safety', label: 'Safety Check', description: 'Area risk assessment.' }
  ],
  [ScannerMode.SLEEP]: [
    { id: 'environment', label: 'Bedroom Check', description: 'Analyze light, clutter & sleep hygiene.' },
    { id: 'fatigue', label: 'Fatigue Scan', description: 'Check eyes & face for exhaustion signs.' },
    { id: 'routine', label: 'Sleep Routine', description: 'Get a personalized wind-down plan.' }
  ],
  [ScannerMode.GEMSTONE]: [
    { id: 'id', label: 'Identify Stone', description: 'Species, mineral class & origin.' },
    { id: 'valuation', label: 'Value & Quality', description: 'The 4 Cs (Cut, Color, Clarity).' },
    { id: 'healing', label: 'Crystal Properties', description: 'Metaphysical & healing meanings.' }
  ],
  [ScannerMode.GENERAL]: [
    { id: 'object', label: 'Identify Object', description: 'What is this?' },
    { id: 'text', label: 'Read Text', description: 'Extract text from image.' }
  ]
};

export interface LanguageOption {
  code: string;
  label: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'auto', label: 'Auto Detect', nativeName: 'Device Default' },
  { code: 'en', label: 'English', nativeName: 'English' },
  { code: 'es', label: 'Spanish', nativeName: 'Español' },
  { code: 'fr', label: 'French', nativeName: 'Français' },
  { code: 'de', label: 'German', nativeName: 'Deutsch' },
  { code: 'it', label: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', label: 'Portuguese', nativeName: 'Português' },
  { code: 'zh', label: 'Chinese', nativeName: '中文' },
  { code: 'ja', label: 'Japanese', nativeName: '日本語' },
  { code: 'ko', label: 'Korean', nativeName: '한국어' },
  { code: 'ru', label: 'Russian', nativeName: 'Русский' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ar', label: 'Arabic', nativeName: 'العربية' },
  { code: 'tr', label: 'Turkish', nativeName: 'Türkçe' },
  { code: 'nl', label: 'Dutch', nativeName: 'Nederlands' },
  { code: 'pl', label: 'Polish', nativeName: 'Polski' },
  { code: 'vi', label: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'th', label: 'Thai', nativeName: 'ไทย' }
];
