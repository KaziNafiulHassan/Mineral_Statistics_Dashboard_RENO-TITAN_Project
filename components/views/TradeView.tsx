import React, { useState, useMemo, useCallback } from 'react';
import { tradeData } from '../../data/tradeData';
import {
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart
} from 'recharts';
import { BotIcon } from '../icons';
import { summarizeTradeData } from '../../services/geminiService';

const TradeView: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState('Australia');
  const [summary, setSummary] = useState('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  const countries = useMemo(() => [...new Set(tradeData.map(d => d.country))].sort(), []);

  const { chartData, tableData, unitValueData } = useMemo(() => {
    const filtered = tradeData.filter(d => d.country === selectedCountry && d.subcommodity === '261400');
    const years = [...new Set(filtered.map(d => d.year))].sort();
    
    const chartData = years.map(year => {
      const exportRecord = filtered.find(d => d.year === year && d.flow === 'Export');
      const importRecord = filtered.find(d => d.year === year && d.flow === 'Import');
      return {
        year,
        exportValue: exportRecord?.value,
        importValue: importRecord?.value,
        exportQuantity: exportRecord?.quantity,
        importQuantity: importRecord?.quantity,
      };
    });

    const unitValueData = years.map(year => {
      const exportRecord = filtered.find(d => d.year === year && d.flow === 'Export');
      const importRecord = filtered.find(d => d.year === year && d.flow === 'Import');
      const exportUnitValue = (exportRecord?.value && exportRecord?.quantity) ? (exportRecord.value * 1000) / exportRecord.quantity : null;
      const importUnitValue = (importRecord?.value && importRecord?.quantity) ? (importRecord.value * 1000) / importRecord.quantity : null;
      return {
        year,
        exportUnitValue,
        importUnitValue,
      };
    }).filter(d => d.exportUnitValue !== null || d.importUnitValue !== null);

    return { chartData, tableData: chartData, unitValueData };
  }, [selectedCountry]);
  
  const handleGetSummary = useCallback(async () => {
    setIsLoadingSummary(true);
    setSummary('');
    const result = await summarizeTradeData(chartData, selectedCountry, 'Titanium ores and concentrates');
    setSummary(result);
    setIsLoadingSummary(false);
  }, [chartData, selectedCountry]);

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 p-4 rounded-lg">
        <label htmlFor="country-select" className="block text-sm font-medium text-gray-400 mb-1">Country</label>
        <select
          id="country-select"
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="w-full bg-gray-700 text-white rounded-md p-2 border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500"
        >
          {countries.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg h-96">
        <h2 className="text-xl font-semibold mb-4">Trade Volume for HS 261400</h2>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 30, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis dataKey="year" stroke="#A0AEC0" />
            <YAxis yAxisId="left" 
              stroke="#81E6D9"
              tickFormatter={(value) => `$${new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(value * 1000)}`}
            />
            <YAxis yAxisId="right" orientation="right" 
              stroke="#B794F4"
              tickFormatter={(value) => new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(value as number)}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#2D3748', border: '1px solid #4A5568' }}
              labelStyle={{ color: '#E2E8F0' }}
              formatter={(value: number, name: string) => [name.includes('Value') ? `$${(value*1000).toLocaleString()}` : value.toLocaleString(), name]}
            />
            <Legend wrapperStyle={{ color: '#E2E8F0' }} />
            <Bar yAxisId="right" dataKey="exportQuantity" name="Export Quantity (t)" fill="#38B2AC" opacity={0.6}/>
            <Bar yAxisId="right" dataKey="importQuantity" name="Import Quantity (t)" fill="#D53F8C" opacity={0.6} />
            <Line yAxisId="left" type="monotone" dataKey="exportValue" name="Export Value (1k USD)" stroke="#38B2AC" strokeWidth={2} />
            <Line yAxisId="left" type="monotone" dataKey="importValue" name="Import Value (1k USD)" stroke="#D53F8C" strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

       <div className="bg-gray-800 p-4 rounded-lg h-72">
        <h2 className="text-xl font-semibold mb-4">Unit Value (USD per metric ton)</h2>
         <ResponsiveContainer width="100%" height="100%">
           <LineChart data={unitValueData} margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
             <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
             <XAxis dataKey="year" stroke="#A0AEC0" />
             <YAxis 
                stroke="#A0AEC0"
                tickFormatter={(value) => `$${new Intl.NumberFormat('en-US').format(value as number)}`}
             />
             <Tooltip
                contentStyle={{ backgroundColor: '#2D3748', border: '1px solid #4A5568' }}
                labelStyle={{ color: '#E2E8F0' }}
                formatter={(value: number) => [`$${value.toFixed(2)} / t`, null]}
              />
             <Legend wrapperStyle={{ color: '#E2E8F0' }} />
             <Line type="monotone" dataKey="exportUnitValue" name="Export Unit Value" stroke="#38B2AC" strokeWidth={2} connectNulls />
             <Line type="monotone" dataKey="importUnitValue" name="Import Unit Value" stroke="#D53F8C" strokeWidth={2} connectNulls />
           </LineChart>
         </ResponsiveContainer>
      </div>

       <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold">AI Summary</h2>
              <button
                onClick={handleGetSummary}
                disabled={isLoadingSummary}
                className="flex items-center px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-md text-white disabled:bg-gray-600 transition-colors"
              >
                  <BotIcon />
                  <span className="ml-2">{isLoadingSummary ? 'Generating...' : 'Get Summary'}</span>
              </button>
          </div>
          {isLoadingSummary && <div className="text-gray-400">Loading analysis from Gemini...</div>}
          {summary && <p className="text-gray-300 leading-relaxed">{summary}</p>}
      </div>

    </div>
  );
};

export default TradeView;
