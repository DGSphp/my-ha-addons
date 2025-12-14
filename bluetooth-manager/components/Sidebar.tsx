
import React from 'react';
import { BluetoothIcon, DocsIcon, InfoIcon, LogIcon, WatchdogIcon, HomeAssistantIcon } from './Icons.tsx';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: any) => void;
}

const NavItem: React.FC<{
  label: string;
  view: string;
  currentView: string;
  onClick: (view: string) => void;
  children: React.ReactNode;
}> = ({ label, view, currentView, onClick, children }) => (
  <li>
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick(view);
      }}
      className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
        currentView === view
          ? 'bg-blue-600 text-white shadow-md'
          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
      }`}
      aria-current={currentView === view ? 'page' : undefined}
    >
      {children}
      <span className="ml-3 font-medium">{label}</span>
    </a>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  return (
    <aside className="w-64 bg-slate-800 p-4 flex flex-col shadow-2xl">
      <div className="flex items-center gap-3 mb-8 px-2">
        <HomeAssistantIcon className="w-10 h-10 text-cyan-400" />
        <h1 className="text-xl font-bold text-white">Bluetooth Manager</h1>
      </div>
      <nav>
        <ul className="space-y-2">
          <NavItem label="Manager" view="manager" currentView={currentView} onClick={setCurrentView}>
            <BluetoothIcon className="w-6 h-6" />
          </NavItem>
          <NavItem label="Info" view="info" currentView={currentView} onClick={setCurrentView}>
            <InfoIcon className="w-6 h-6" />
          </NavItem>
          <NavItem label="Log" view="log" currentView={currentView} onClick={setCurrentView}>
            <LogIcon className="w-6 h-6" />
          </NavItem>
          <NavItem label="Watchdog" view="watchdog" currentView={currentView} onClick={setCurrentView}>
            <WatchdogIcon className="w-6 h-6" />
          </NavItem>
          <NavItem label="Documentation" view="documentation" currentView={currentView} onClick={setCurrentView}>
            <DocsIcon className="w-6 h-6" />
          </NavItem>
        </ul>
      </nav>
      <div className="mt-auto text-center text-xs text-slate-500">
        <p>Version 1.0.0</p>
        <p>Simulated Add-on UI</p>
      </div>
    </aside>
  );
};

export default Sidebar;
