
import React, { useState } from 'react';
import Sidebar from './components/Sidebar.tsx';
import Manager from './components/Manager.tsx';
import Documentation from './components/Documentation.tsx';
import { InfoIcon, LogIcon, WatchdogIcon } from './components/Icons.tsx';

type View = 'manager' | 'info' | 'log' | 'watchdog' | 'documentation';

const PlaceholderView: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="p-8 bg-slate-800/50 rounded-lg shadow-lg">
    <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
      {children}
      {title}
    </h2>
    <p className="text-slate-400">This is a placeholder page to simulate the full Home Assistant add-on experience.</p>
    <p className="text-slate-400 mt-2">In a real add-on, this section would display relevant information.</p>
  </div>
);

export default function App() {
  const [currentView, setCurrentView] = useState<View>('manager');

  const renderView = () => {
    switch (currentView) {
      case 'manager':
        return <Manager />;
      case 'documentation':
        return <Documentation />;
      case 'info':
        return (
          <PlaceholderView title="Info">
            <InfoIcon className="w-8 h-8" />
          </PlaceholderView>
        );
      case 'log':
        return (
          <PlaceholderView title="Log">
            <LogIcon className="w-8 h-8" />
          </PlaceholderView>
        );
      case 'watchdog':
        return (
          <PlaceholderView title="Watchdog">
            <WatchdogIcon className="w-8 h-8" />
          </PlaceholderView>
        );
      default:
        return <Manager />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 font-sans">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
}
