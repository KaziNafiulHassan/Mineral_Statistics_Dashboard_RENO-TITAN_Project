import React, { useState } from 'react';
import { View } from './types';
import Sidebar from './components/Sidebar';
import ProductionView from './components/views/ProductionView';
import TradeView from './components/views/TradeView';
import MaterialFlowView from './components/views/MaterialFlowView';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.PRODUCTION);

  const renderView = () => {
    switch (currentView) {
      case View.PRODUCTION:
        return <ProductionView />;
      case View.TRADE:
        return <TradeView />;
      case View.MATERIAL_FLOW:
        return <MaterialFlowView />;
      default:
        return <ProductionView />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-cyan-400 mb-6">{currentView} Dashboard</h1>
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
