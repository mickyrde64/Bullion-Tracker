import React, { useState, useEffect, useMemo } from 'react';
import { PriceTicker } from './components/PriceTicker';
import { Dashboard } from './components/Dashboard';
import { InventoryForm } from './components/InventoryForm';
import { InventoryList } from './components/InventoryList';
import { InventoryItem, MarketPrices, PortfolioStats, Currency } from './types';
import { getSimulatedPrices } from './services/marketService';
import { calculatePortfolioStats } from './utils/calculations';
import { generatePortfolioInsight } from './services/geminiService';

const App: React.FC = () => {
  // --- State ---
  const [prices, setPrices] = useState<MarketPrices>(() => getSimulatedPrices());
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [currency, setCurrency] = useState<Currency>('USD');
  const [insight, setInsight] = useState<string | null>(null);
  const [isInsightLoading, setIsInsightLoading] = useState(false);

  // --- Effects ---

  // Simulate Live Market Data Updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => getSimulatedPrices(prev));
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Initial Data Load (Mock)
  useEffect(() => {
    // NOTE: In a real app, load from local storage or DB
    const savedInventory = localStorage.getItem('bulliontrack_inventory');
    if (savedInventory) {
      setInventory(JSON.parse(savedInventory));
    }
  }, []);

  // Save to Local Storage
  useEffect(() => {
    localStorage.setItem('bulliontrack_inventory', JSON.stringify(inventory));
  }, [inventory]);

  // Derived Stats
  const stats: PortfolioStats = useMemo(() => {
    return calculatePortfolioStats(inventory, prices);
  }, [inventory, prices]);

  // --- Handlers ---
  
  const handleAddItem = (item: InventoryItem) => {
    setInventory(prev => [...prev, item]);
    // Clear old insight as data changed
    if (inventory.length > 0) setInsight(null); 
  };

  const handleBulkAdd = (items: InventoryItem[]) => {
    setInventory(prev => [...prev, ...items]);
    setInsight(null);
  };

  const handleRemoveItem = (id: string) => {
    setInventory(prev => prev.filter(item => item.id !== id));
    setInsight(null);
  };

  const handleGetInsight = async () => {
    if (stats.totalValue === 0) return;
    setIsInsightLoading(true);
    const text = await generatePortfolioInsight(stats, prices, currency);
    setInsight(text);
    setIsInsightLoading(false);
  };

  const toggleCurrency = () => {
    setCurrency(prev => prev === 'USD' ? 'EUR' : 'USD');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col font-sans">
      <PriceTicker prices={prices} currency={currency} onToggleCurrency={toggleCurrency} />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Vault</h1>
          <p className="text-slate-400">Track and analyze your precious metals portfolio.</p>
        </div>

        <Dashboard 
          stats={stats} 
          currency={currency}
          aiInsight={insight}
          isLoadingInsight={isInsightLoading}
          onRefreshInsight={handleGetInsight}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
             <InventoryForm onAddItem={handleAddItem} onBulkAdd={handleBulkAdd} />
          </div>
          <div className="lg:col-span-2">
             <InventoryList items={inventory} prices={prices} currency={currency} onRemove={handleRemoveItem} />
          </div>
        </div>
      </main>

      <footer className="bg-slate-950 border-t border-slate-800 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} BullionTrack AI. Market prices are simulated for demonstration purposes.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;