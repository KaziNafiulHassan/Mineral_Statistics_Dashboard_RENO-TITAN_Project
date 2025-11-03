import React from 'react';
import { sankeyData } from '../../data/sankeyData';
import SankeyChart from '../charts/SankeyChart';

const MaterialFlowView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gray-800 p-4 rounded-lg h-[600px] flex flex-col">
        <h2 className="text-xl font-semibold mb-2 text-white">Material Flow for Titanium Feedstock</h2>
        <p className="text-sm text-gray-400 mb-4">
          This Sankey diagram illustrates a simplified national-level material flow for titanium, from initial supply to final processing. 
          All values are illustrative and expressed in kilotons (kt) of TiO2 equivalent.
        </p>
        <div className="flex-grow">
          <SankeyChart data={sankeyData} />
        </div>
      </div>
    </div>
  );
};

export default MaterialFlowView;
