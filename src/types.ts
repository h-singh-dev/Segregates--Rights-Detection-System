export type WasteCategory = 'WET' | 'DRY' | 'HAZARD';

export interface WasteResult {
  name: string;
  category: WasteCategory;
  description: string;
  disposalMethod: string;
  confidence: number;
}

export interface ClassificationHistory {
  id: string;
  timestamp: number;
  item: WasteResult;
  imageUrl?: string;
}
