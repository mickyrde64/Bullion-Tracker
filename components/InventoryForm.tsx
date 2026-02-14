import React, { useState, useRef } from 'react';
import { MetalType, UnitType, InventoryItem } from '../types';
import { Plus, Upload, FileText } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface InventoryFormProps {
  onAddItem: (item: InventoryItem) => void;
  onBulkAdd: (items: InventoryItem[]) => void;
}

export const InventoryForm: React.FC<InventoryFormProps> = ({ onAddItem, onBulkAdd }) => {
  const [metal, setMetal] = useState<MetalType>(MetalType.Gold);
  const [weight, setWeight] = useState<string>('');
  const [unit, setUnit] = useState<UnitType>(UnitType.Ounces);
  const [name, setName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight) return;

    const newItem: InventoryItem = {
      id: uuidv4(),
      metal,
      weight: parseFloat(weight),
      unit,
      name: name || `${metal} Item`,
      timestamp: Date.now(),
    };

    onAddItem(newItem);
    setWeight('');
    setName('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      const newItems: InventoryItem[] = [];

      // Skip header, process lines
      // Expected format: Metal, Weight, Unit, Name(optional)
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const parts = line.split(',');
        if (parts.length >= 3) {
          const m = parts[0].trim();
          const w = parseFloat(parts[1].trim());
          const u = parts[2].trim();
          const n = parts[3]?.trim();

          // Simple validation mapping
          let parsedMetal: MetalType | undefined;
          if (m.toLowerCase() === 'gold') parsedMetal = MetalType.Gold;
          if (m.toLowerCase() === 'silver') parsedMetal = MetalType.Silver;
          if (m.toLowerCase() === 'platinum') parsedMetal = MetalType.Platinum;

          let parsedUnit: UnitType | undefined;
          if (u === 'g' || u === 'grams') parsedUnit = UnitType.Grams;
          if (u === 'oz' || u === 'ounces') parsedUnit = UnitType.Ounces;
          if (u === 't oz') parsedUnit = UnitType.TroyOunces;
          if (u === 'kg') parsedUnit = UnitType.Kilograms;

          if (parsedMetal && !isNaN(w) && parsedUnit) {
            newItems.push({
              id: uuidv4(),
              metal: parsedMetal,
              weight: w,
              unit: parsedUnit,
              name: n || `${m} Item`,
              timestamp: Date.now(),
            });
          }
        }
      }

      if (newItems.length > 0) {
        onBulkAdd(newItems);
      } else {
        alert("No valid items found in CSV. Format: Metal,Weight,Unit,Name");
      }
      
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg mb-8">
      <h3 className="text-slate-200 font-semibold mb-4 flex items-center gap-2">
        <Plus className="w-5 h-5 text-amber-500" /> Add to Inventory
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Manual Add Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Metal</label>
              <select 
                value={metal}
                onChange={(e) => setMetal(e.target.value as MetalType)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {Object.values(MetalType).map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
               <label className="block text-xs font-medium text-slate-400 mb-1">Name (Optional)</label>
               <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Maple Leaf"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Weight</label>
              <input 
                type="number"
                step="0.001"
                min="0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="0.00"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Unit</label>
              <select 
                value={unit}
                onChange={(e) => setUnit(e.target.value as UnitType)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {Object.values(UnitType).map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </form>

        {/* Divider / CSV Section */}
        <div className="border-t md:border-t-0 md:border-l border-slate-700 pt-6 md:pt-0 md:pl-6 flex flex-col justify-center">
          <div className="text-center">
            <div className="bg-slate-700/50 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
               <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <h4 className="text-white font-medium mb-2">Bulk Upload via CSV</h4>
            <p className="text-slate-400 text-xs mb-4">
              Format: Metal, Weight, Unit (g/oz), Name<br/>
              Example: Gold, 1, oz, Buffalo Coin
            </p>
            <input 
              type="file" 
              accept=".csv"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden" 
              id="csv-upload"
            />
            <label 
              htmlFor="csv-upload"
              className="cursor-pointer bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg inline-flex items-center gap-2 transition-colors text-sm font-medium"
            >
              <Upload className="w-4 h-4" /> Select CSV File
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
