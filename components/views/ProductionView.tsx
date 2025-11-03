import React, { useState, useMemo, useCallback } from 'react';
import { productionData } from '../../data/productionData';
import { ProductionRecord } from '../../types';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar, ComposedChart
} from 'recharts';
import { BotIcon } from '../icons';
// FIX: Changed import from summarizeData to the correctly named summarizeProductionData
import { summarizeProductionData } from '../../services/geminiService';


const ProductionView: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState('Australia');
  const [selectedCommodity, setSelectedCommodity] = useState('Ilmenite');
  const [summary, setSummary] = useState('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  const countries = useMemo(() => [...new Set(productionData.map(d => d.country))], []);
  const commodities = useMemo(() => [...new Set(productionData.map(d => d.subcommodity))], []);

  const filteredData = useMemo(() => {
    return productionData.filter(
      d => d.country === selectedCountry && d.subcommodity === selectedCommodity
    );
  }, [selectedCountry, selectedCommodity]);

  const chartData = useMemo(() => {
    const years = [...new Set(filteredData.map(d => d.year))].sort();
    return years.map(year => {
      const bgsRecord = filteredData.find(d => d.year === year && d.source === 'BGS');
      const usgsRecord = filteredData.find(d => d.year === year && d.source === 'USGS');
      return {
        year,
        BGS: bgsRecord ? bgsRecord.quantity : null,
        USGS: usgsRecord ? usgsRecord.quantity : null,
      };
    });
  }, [filteredData]);
  
  const handleGetSummary = useCallback(async () => {
    setIsLoadingSummary(true);
    setSummary('');
    // FIX: Called the correct function summarizeProductionData with the correct arguments.
    const result = await summarizeProductionData(chartData, selectedCountry, selectedCommodity);
    setSummary(result);
    setIsLoadingSummary(false);
  }, [chartData, selectedCountry, selectedCommodity]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <div className="bg-gray-800 p-4 rounded-lg">
          <label htmlFor="commodity-select" className="block text-sm font-medium text-gray-400 mb-1">Commodity</label>
          <select
            id="commodity-select"
            value={selectedCommodity}
            onChange={(e) => setSelectedCommodity(e.target.value)}
            className="w-full bg-gray-700 text-white rounded-md p-2 border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500"
          >
            {commodities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg h-96">
        <h2 className="text-xl font-semibold mb-4">Production Volume (Metric Tons)</h2>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis dataKey="year" stroke="#A0AEC0" />
            <YAxis 
              stroke="#A0AEC0"
              tickFormatter={(value) => new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(value as number)}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#2D3748', border: '1px solid #4A5568' }}
              labelStyle={{ color: '#E2E8F0' }}
              formatter={(value: number) => new Intl.NumberFormat('en-US').format(value)}
            />
            <Legend wrapperStyle={{ color: '#E2E8F0' }} />
            <Line type="monotone" dataKey="BGS" stroke="#38B2AC" strokeWidth={2} name="BGS Production" />
            <Line type="monotone" dataKey="USGS" stroke="#805AD5" strokeWidth={2} name="USGS Production" />
          </ComposedChart>
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

export default ProductionView;