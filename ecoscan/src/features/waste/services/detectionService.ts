import { analyzeWasteImage, type WasteAnalysisResult } from '@/features/waste/services/geminiService';
import type { WasteDetection } from '@/features/waste/types';
export type { WasteDetection };

export interface DetectionResult {
  success: boolean;
  detection?: WasteDetection;
  error?: string;
  mode: 'ai' | 'demo';
}

export type DetectionMode = 'ai' | 'demo';

const DEMO_DETECTIONS: Record<string, WasteDetection> = {
  'plastic-bottle': {
    name: 'Plastic Bottle',
    category: 'recyclable',
    material: 'PET Plastic',
    confidence: 0.94,
    bin: 'recyclable',
    decompositionTime: '450 years',
    description: 'A plastic beverage bottle made from PET (Polyethylene Terephthalate). Widely accepted in recycling programs.',
    environmentalImpact: 'Medium',
    boundingBox: { x: 0.25, y: 0.2, width: 0.5, height: 0.6 }
  },
  'aluminum-can': {
    name: 'Aluminum Can',
    category: 'recyclable',
    material: 'Aluminum',
    confidence: 0.96,
    bin: 'recyclable',
    decompositionTime: '200-500 years',
    description: 'Aluminum beverage can. Infinitely recyclable with 95% energy savings vs new production.',
    environmentalImpact: 'Low',
    boundingBox: { x: 0.3, y: 0.25, width: 0.4, height: 0.55 }
  },
  'banana-peel': {
    name: 'Banana Peel',
    category: 'organic',
    material: 'Organic Matter',
    confidence: 0.92,
    bin: 'organic',
    decompositionTime: '2-5 weeks',
    description: 'Biodegradable food waste. Perfect for composting - returns nutrients to soil.',
    environmentalImpact: 'Low',
    boundingBox: { x: 0.28, y: 0.3, width: 0.44, height: 0.45 }
  },
  'paper': {
    name: 'Paper',
    category: 'recyclable',
    material: 'Paper Fiber',
    confidence: 0.93,
    bin: 'recyclable',
    decompositionTime: '2-6 weeks',
    description: 'Clean paper and cardboard. Recyclable 5-7 times before fibers become too short.',
    environmentalImpact: 'Low',
    boundingBox: { x: 0.2, y: 0.2, width: 0.6, height: 0.55 }
  },
  'glass-bottle': {
    name: 'Glass Bottle',
    category: 'recyclable',
    material: 'Glass',
    confidence: 0.95,
    bin: 'recyclable',
    decompositionTime: '1 million years',
    description: 'Glass container. Infinitely recyclable without quality loss. Rinse before recycling.',
    environmentalImpact: 'Low',
    boundingBox: { x: 0.25, y: 0.15, width: 0.5, height: 0.7 }
  },
  'food-waste': {
    name: 'Food Waste',
    category: 'organic',
    material: 'Organic Matter',
    confidence: 0.89,
    bin: 'organic',
    decompositionTime: '2-4 weeks',
    description: 'Compostable food scraps. Diverts methane from landfills when composted properly.',
    environmentalImpact: 'Low',
    boundingBox: { x: 0.25, y: 0.25, width: 0.5, height: 0.5 }
  },
  'plastic-bag': {
    name: 'Plastic Bag',
    category: 'non-recyclable',
    material: 'LDPE Plastic',
    confidence: 0.91,
    bin: 'non-recyclable',
    decompositionTime: '10-20 years',
    description: 'Thin plastic film. Most curbside programs cannot process - check store drop-off locations.',
    environmentalImpact: 'High',
    boundingBox: { x: 0.2, y: 0.3, width: 0.6, height: 0.4 }
  },
  'battery': {
    name: 'Battery',
    category: 'special',
    material: 'Lithium-Ion / Alkaline',
    confidence: 0.97,
    bin: 'special',
    decompositionTime: '100+ years (toxic leakage)',
    description: 'Hazardous electronic waste. Contains toxic metals. Never place in regular bins.',
    environmentalImpact: 'High',
    boundingBox: { x: 0.35, y: 0.3, width: 0.3, height: 0.4 }
  },
  'cardboard': {
    name: 'Cardboard',
    category: 'recyclable',
    material: 'Corrugated Fiberboard',
    confidence: 0.94,
    bin: 'recyclable',
    decompositionTime: '2 months',
    description: 'Corrugated cardboard boxes. Flatten before recycling. Remove tape and labels.',
    environmentalImpact: 'Low',
    boundingBox: { x: 0.15, y: 0.2, width: 0.7, height: 0.55 }
  }
};

const DEMO_OBJECTS = [
  { id: 'plastic-bottle', name: 'Plastic Bottle', icon: '🥤', category: 'recyclable' },
  { id: 'aluminum-can', name: 'Aluminum Can', icon: '♻️', category: 'recyclable' },
  { id: 'banana-peel', name: 'Banana Peel', icon: '🍌', category: 'organic' },
  { id: 'paper', name: 'Paper', icon: '📄', category: 'recyclable' },
  { id: 'glass-bottle', name: 'Glass Bottle', icon: '🍾', category: 'recyclable' },
  { id: 'food-waste', name: 'Food Waste', icon: '🥗', category: 'organic' },
  { id: 'plastic-bag', name: 'Plastic Bag', icon: '🛍️', category: 'non-recyclable' },
  { id: 'battery', name: 'Battery', icon: '🔋', category: 'special' },
  { id: 'cardboard', name: 'Cardboard', icon: '📦', category: 'recyclable' },
];

class DetectionService {
  private mode: DetectionMode = 'demo';
  private apiKey: string | null = null;
  private listeners: Set<(mode: DetectionMode) => void> = new Set();

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || null;
    this.mode = this.apiKey ? 'ai' : 'demo';
  }

  getMode(): DetectionMode {
    return this.mode;
  }

  getApiKey(): string | null {
    return this.apiKey;
  }

  setApiKey(key: string) {
    this.apiKey = key;
    this.mode = key ? 'ai' : 'demo';
    this.notifyListeners();
  }

  subscribe(listener: (mode: DetectionMode) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(l => l(this.mode));
  }

  async detectFromImage(imageData: string): Promise<DetectionResult> {
    if (this.mode === 'ai' && this.apiKey) {
      try {
        const result = await this.callGeminiAPI(imageData);
        if (result.success) {
          return { ...result, mode: 'ai' };
        }
        console.warn('Gemini API failed, falling back to demo:', result.error);
      } catch (error) {
        console.warn('Gemini API error, falling back to demo:', error);
      }
    }
    
    return this.simulateDemoDetection();
  }

  private async callGeminiAPI(imageData: string): Promise<DetectionResult> {
    try {
      const result = await analyzeWasteImage(imageData);
      return this.mapGeminiResult(result);
    } catch (error) {
      throw new Error(`Gemini API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private mapGeminiResult(result: WasteAnalysisResult): DetectionResult {
    const categoryMap: Record<string, 'recyclable' | 'organic' | 'non-recyclable' | 'special'> = {
      'Plastic': 'recyclable',
      'Paper': 'recyclable',
      'Metal': 'recyclable',
      'Glass': 'recyclable',
      'Organic': 'organic',
      'E-Waste': 'special',
      'Other': 'non-recyclable',
    };

    const impactMap: Record<string, 'Low' | 'Medium' | 'High'> = {
      'Low': 'Low',
      'Medium': 'Medium',
      'High': 'High',
    };

    const detection: WasteDetection = {
      name: result.itemName,
      category: categoryMap[result.category] || 'non-recyclable',
      material: result.category,
      confidence: 0.9,
      bin: categoryMap[result.category] || 'non-recyclable',
      decompositionTime: this.getDecompositionTime(result.category),
      description: result.disposalMethod,
      environmentalImpact: impactMap[result.environmentalImpact] || 'Medium',
      disposalMethod: result.disposalMethod,
    };

    return { success: true, detection, mode: 'ai' };
  }

  private getDecompositionTime(category: string): string {
    const times: Record<string, string> = {
      'Plastic': '450+ years',
      'Paper': '2-6 weeks',
      'Metal': '200-500 years',
      'Glass': '1 million years',
      'Organic': '2-5 weeks',
      'E-Waste': '100+ years (toxic leakage)',
      'Other': 'Unknown',
    };
    return times[category] || 'Unknown';
  }

  private async simulateDemoDetection(): Promise<DetectionResult> {
    await new Promise(r => setTimeout(r, 800 + Math.random() * 700));
    
    const keys = Object.keys(DEMO_DETECTIONS);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const detection = DEMO_DETECTIONS[randomKey];
    
    return {
      success: true,
      detection: { ...detection, confidence: 0.85 + Math.random() * 0.12 },
      mode: 'demo'
    };
  }

  getDemoObjects() {
    return DEMO_OBJECTS;
  }

  getDemoDetection(id: string): DetectionResult {
    const detection = DEMO_DETECTIONS[id];
    if (!detection) {
      return { success: false, error: 'Unknown demo object', mode: 'demo' };
    }
    return {
      success: true,
      detection: { ...detection, confidence: 0.85 + Math.random() * 0.12 },
      mode: 'demo'
    };
  }
}

export const detectionService = new DetectionService();