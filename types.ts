export type Currency = 'USD' | 'EUR';

export enum MetalType {
  Gold = 'Gold',
  Silver = 'Silver',
  Platinum = 'Platinum'
}

export enum UnitType {
  Grams = 'g',
  Ounces = 'oz',
  TroyOunces = 't oz',
  Kilograms = 'kg'
}

export interface InventoryItem {
  id: string;
  metal: MetalType;
  weight: number;
  unit: UnitType;
  name?: string; // e.g., "American Eagle 2023"
  purchasePrice?: number;
  purchaseDate?: string;
  timestamp: number;
}

export interface MarketPrices {
  [MetalType.Gold]: number; // Price per Troy Ounce in USD
  [MetalType.Silver]: number;
  [MetalType.Platinum]: number;
  lastUpdated: number;
}

export interface PortfolioStats {
  totalValue: number;
  totalGoldValue: number;
  totalSilverValue: number;
  totalPlatinumValue: number;
  totalGoldWeightOz: number;
  totalSilverWeightOz: number;
  totalPlatinumWeightOz: number;
}
