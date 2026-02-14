import { MetalType, UnitType, InventoryItem, MarketPrices, PortfolioStats, Currency } from '../types';

// Standard conversion rates to Troy Ounces
const TO_TROY_OZ = {
  [UnitType.Grams]: 0.0321507,
  [UnitType.Ounces]: 0.911458, // Standard avoirdupois ounce to troy ounce
  [UnitType.TroyOunces]: 1.0,
  [UnitType.Kilograms]: 32.1507,
};

// Simulated Exchange Rate (In a real app, this would be fetched live)
export const USD_TO_EUR_RATE = 0.92;

export const convertToTroyOz = (weight: number, unit: UnitType): number => {
  return weight * (TO_TROY_OZ[unit] || 0);
};

export const calculateItemValue = (item: InventoryItem, prices: MarketPrices): number => {
  const weightInTroyOz = convertToTroyOz(item.weight, item.unit);
  const pricePerOz = prices[item.metal] || 0;
  return weightInTroyOz * pricePerOz;
};

export const calculatePortfolioStats = (inventory: InventoryItem[], prices: MarketPrices): PortfolioStats => {
  const stats: PortfolioStats = {
    totalValue: 0,
    totalGoldValue: 0,
    totalSilverValue: 0,
    totalPlatinumValue: 0,
    totalGoldWeightOz: 0,
    totalSilverWeightOz: 0,
    totalPlatinumWeightOz: 0,
  };

  inventory.forEach(item => {
    const weightInOz = convertToTroyOz(item.weight, item.unit);
    const value = calculateItemValue(item, prices);

    stats.totalValue += value;

    if (item.metal === MetalType.Gold) {
      stats.totalGoldValue += value;
      stats.totalGoldWeightOz += weightInOz;
    } else if (item.metal === MetalType.Silver) {
      stats.totalSilverValue += value;
      stats.totalSilverWeightOz += weightInOz;
    } else if (item.metal === MetalType.Platinum) {
      stats.totalPlatinumValue += value;
      stats.totalPlatinumWeightOz += weightInOz;
    }
  });

  return stats;
};

export const formatCurrency = (valueInUSD: number, currency: Currency = 'USD') => {
  const value = currency === 'EUR' ? valueInUSD * USD_TO_EUR_RATE : valueInUSD;
  const locale = currency === 'EUR' ? 'de-DE' : 'en-US';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatWeight = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 3,
  }).format(value);
};
