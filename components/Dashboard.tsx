import React from 'react';
import { PortfolioStats, Currency } from '../types';
import { formatCurrency, formatWeight } from '../utils/calculations';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ArrowUpRight, TrendingUp, Coins, Scale } from 'lucide-react';

interface DashboardProps {
  stats: PortfolioStats;
  currency: Currency;
  aiInsight: string | null;
  isLoadingInsight: boolean;
  onRefreshInsight: () => void;
}

const COLORS = ['#fbbf24', '#cbd5e1', '#94a3b8']; // Amber-400 (Gold), Slate-300 (Silver), Slate-400 (Plat)

export const Dashboard: React.FC<DashboardProps> = ({ stats, currency, aiInsight, isLoadingInsight, onRefreshInsight }) => {
  const data = [
    { name: 'Gold', value: stats.totalGoldValue },
    { name: 'Silver', value: stats.totalSilverValue },
    { name: 'Platinum', value: stats.totalPlatinumValue },
  ].filter(d => d.value > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Total Value Card */}
      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl col-span-1 lg:col-span-3 flex flex-col md:flex-row justify-between items-center relative overflow-hidden">
        <div className="z-10 w-full">
          <h2 className="text-slate-400 text-sm uppercase tracking-wider font-semibold mb-1">Total Portfolio Value</h2>
          <div className="text-5xl font-bold text-white tracking-tight flex items-baseline gap-2">
            {formatCurrency(stats.totalValue, currency)}
            <span className="text-emerald-400 text-lg font-medium flex items-center">
              <ArrowUpRight className="w-4 h-4 mr-1" /> Live
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-2">Values updated based on real-time spot prices</p>
        </div>
        
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none" />
      </div>

      {/* Breakdown Cards */}
      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-amber-500/20 rounded-full">
             <Coins className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h3 className="text-slate-200 font-semibold">Gold Holdings</h3>
            <p className="text-slate-500 text-xs">XAU / {currency}</p>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between items-end">
             <span className="text-slate-400 text-sm">Weight</span>
             <span className="text-white font-mono text-lg">{formatWeight(stats.totalGoldWeightOz)} oz</span>
          </div>
          <div className="flex justify-between items-end">
             <span className="text-slate-400 text-sm">Value</span>
             <span className="text-amber-400 font-mono text-lg">{formatCurrency(stats.totalGoldValue, currency)}</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-slate-400/20 rounded-full">
             <Scale className="w-6 h-6 text-slate-300" />
          </div>
          <div>
            <h3 className="text-slate-200 font-semibold">Silver Holdings</h3>
            <p className="text-slate-500 text-xs">XAG / {currency}</p>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between items-end">
             <span className="text-slate-400 text-sm">Weight</span>
             <span className="text-white font-mono text-lg">{formatWeight(stats.totalSilverWeightOz)} oz</span>
          </div>
          <div className="flex justify-between items-end">
             <span className="text-slate-400 text-sm">Value</span>
             <span className="text-slate-300 font-mono text-lg">{formatCurrency(stats.totalSilverValue, currency)}</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg flex flex-col justify-center">
         <h3 className="text-slate-400 font-semibold mb-4 text-center">Portfolio Composition</h3>
         {data.length > 0 ? (
           <div className="h-40 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={data}
                   cx="50%"
                   cy="50%"
                   innerRadius={40}
                   outerRadius={60}
                   paddingAngle={5}
                   dataKey="value"
                 >
                   {data.map((_, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Pie>
                 <Tooltip 
                    formatter={(value: number) => formatCurrency(value, currency)}
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                 />
                 <Legend />
               </PieChart>
             </ResponsiveContainer>
           </div>
         ) : (
           <div className="text-center text-slate-600 italic py-8">No inventory data</div>
         )}
      </div>

      {/* AI Insight Section */}
      <div className="bg-gradient-to-br from-indigo-900 to-slate-800 p-6 rounded-2xl border border-indigo-700/50 shadow-lg col-span-1 lg:col-span-3">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-indigo-200 font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            Gemini Wealth Analyst
          </h3>
          <button 
            onClick={onRefreshInsight}
            disabled={isLoadingInsight}
            className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded transition disabled:opacity-50"
          >
            {isLoadingInsight ? 'Analyzing...' : 'Refresh Analysis'}
          </button>
        </div>
        <div className="bg-slate-900/50 p-4 rounded-xl border border-indigo-500/20 text-indigo-100 text-sm leading-relaxed min-h-[60px] flex items-center">
          {aiInsight ? aiInsight : (
            <span className="text-slate-500 italic">Add items to your inventory to generate AI-powered insights regarding your wealth distribution and market position.</span>
          )}
        </div>
      </div>
    </div>
  );
};