import React from 'react';
import { MarketPrices, MetalType, Currency } from '../types';
import { formatCurrency } from '../utils/calculations';
import { Activity } from 'lucide-react';

interface PriceTickerProps {
  prices: MarketPrices;
  currency: Currency;
  onToggleCurrency: () => void;
}

export const PriceTicker: React.FC<PriceTickerProps> = ({ prices, currency, onToggleCurrency }) => {
  return (
    <div className="bg-slate-900 border-b border-slate-800 py-3 px-4 sticky top-0 z-50 bg-opacity-95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 text-amber-500 font-bold text-xl">
           <div className="bg-amber-500 text-slate-900 p-1 rounded">BT</div>
           <span className="hidden sm:inline">BullionTrack</span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex gap-6 text-sm font-mono overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold uppercase hidden md:inline">Gold</span>
              <span className="text-amber-400 font-bold uppercase md:hidden">Au</span>
              <span className="text-white">{formatCurrency(prices[MetalType.Gold], currency)}</span>
              <span className="text-emerald-500 text-xs flex items-center"><Activity className="w-3 h-3 mr-1" /> Live</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-300 font-bold uppercase hidden md:inline">Silver</span>
              <span className="text-slate-300 font-bold uppercase md:hidden">Ag</span>
              <span className="text-white">{formatCurrency(prices[MetalType.Silver], currency)}</span>
            </div>
            <div className="flex items-center gap-2 hidden lg:flex">
              <span className="text-slate-400 font-bold uppercase">Platinum</span>
              <span className="text-white">{formatCurrency(prices[MetalType.Platinum], currency)}</span>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-700 hidden sm:block"></div>

          <button 
            onClick={onToggleCurrency}
            className="flex items-center bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg p-1 transition-colors"
            title="Switch Currency"
          >
            <span className={`px-2 py-0.5 rounded text-xs font-bold transition-all ${currency === 'USD' ? 'bg-amber-500 text-slate-900 shadow' : 'text-slate-400 hover:text-slate-200'}`}>USD</span>
            <span className={`px-2 py-0.5 rounded text-xs font-bold transition-all ${currency === 'EUR' ? 'bg-amber-500 text-slate-900 shadow' : 'text-slate-400 hover:text-slate-200'}`}>EUR</span>
          </button>
        </div>
      </div>
    </div>
  );
};
