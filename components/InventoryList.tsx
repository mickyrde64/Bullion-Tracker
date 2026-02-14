import React from 'react';
import { InventoryItem, MarketPrices, Currency } from '../types';
import { calculateItemValue, formatCurrency, formatWeight } from '../utils/calculations';
import { Trash2 } from 'lucide-react';

interface InventoryListProps {
  items: InventoryItem[];
  prices: MarketPrices;
  currency: Currency;
  onRemove: (id: string) => void;
}

export const InventoryList: React.FC<InventoryListProps> = ({ items, prices, currency, onRemove }) => {
  if (items.length === 0) {
    return (
      <div className="bg-slate-800 rounded-2xl p-8 text-center border border-slate-700">
        <p className="text-slate-500">Your inventory is empty. Start tracking your precious metals today.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Metal / Item</th>
              <th className="px-6 py-4 text-right">Weight</th>
              <th className="px-6 py-4 text-right">Current Value</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {items.map((item) => {
              const value = calculateItemValue(item, prices);
              const metalColor = 
                item.metal === 'Gold' ? 'text-amber-400' : 
                item.metal === 'Silver' ? 'text-slate-300' : 'text-slate-400';

              return (
                <tr key={item.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className={`font-semibold ${metalColor}`}>{item.metal}</span>
                      <span className="text-slate-400 text-sm">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-slate-200 font-mono">
                    {formatWeight(item.weight)} <span className="text-slate-500 text-xs">{item.unit}</span>
                  </td>
                  <td className="px-6 py-4 text-right text-emerald-400 font-mono">
                    {formatCurrency(value, currency)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => onRemove(item.id)}
                      className="text-slate-500 hover:text-red-400 transition-colors p-2 hover:bg-slate-700 rounded-full"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
