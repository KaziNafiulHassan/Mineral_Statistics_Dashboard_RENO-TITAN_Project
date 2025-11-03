import React from 'react';
import { View } from '../types';
import { ChartIcon, GlobeIcon, FlowIcon } from './icons';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const navItems = [
    { view: View.PRODUCTION, icon: <ChartIcon />, label: 'Production' },
    { view: View.TRADE, icon: <GlobeIcon />, label: 'Trade' },
    { view: View.MATERIAL_FLOW, icon: <FlowIcon />, label: 'Material Flow' },
  ];

  return (
    <aside className="w-16 md:w-64 bg-gray-800 p-2 md:p-4 flex flex-col space-y-2 transition-all duration-300">
      <div className="flex items-center mb-6 md:mb-8">
         <div className="p-2 bg-cyan-500/20 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
         </div>
        <h1 className="hidden md:block text-xl font-bold ml-3 text-white">MineralSands</h1>
      </div>
      <nav className="flex-1">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setCurrentView(item.view)}
            className={`w-full flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${
              currentView === item.view
                ? 'bg-cyan-500 text-white'
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="hidden md:block ml-4 font-semibold">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
