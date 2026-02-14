import { MetalType, MarketPrices } from '../types';

// Mock base prices (USD per Troy Ounce)
const BASE_PRICES = {
  [MetalType.Gold]: 2350.50,
  [MetalType.Silver]: 28.75,
  [MetalType.Platinum]: 980.20,
};

// Simulate small market fluctuations
export const getSimulatedPrices = (currentPrices?: MarketPrices): MarketPrices => {
  const volatility = 0.002; // 0.2% fluctuation max

  const fluctuate = (base: number) => {
    const change = base * volatility * (Math.random() - 0.5);
    return base + change;
  };

  // If we have current prices, drift from them, otherwise start from base
  const gold = currentPrices ? fluctuate(currentPrices[MetalType.Gold]) : fluctuate(BASE_PRICES[MetalType.Gold]);
  const silver = currentPrices ? fluctuate(currentPrices[MetalType.Silver]) : fluctuate(BASE_PRICES[MetalType.Silver]);
  const platinum = currentPrices ? fluctuate(currentPrices[MetalType.Platinum]) : fluctuate(BASE_PRICES[MetalType.Platinum]);

  return {
    [MetalType.Gold]: gold,
    [MetalType.Silver]: silver,
    [MetalType.Platinum]: platinum,
    lastUpdated: Date.now(),
  };
};
