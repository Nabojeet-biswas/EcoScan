export interface WasteDetection {
  name: string;
  category: "recyclable" | "organic" | "non-recyclable" | "special";
  material: string;
  confidence: number;
  bin: "recyclable" | "organic" | "non-recyclable" | "special";
  decompositionTime: string;
  description: string;
  environmentalImpact: "Low" | "Medium" | "High";
  disposalMethod?: string;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}
