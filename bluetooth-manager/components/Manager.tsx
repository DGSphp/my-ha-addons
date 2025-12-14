
import React from 'react';
import { useBluetooth } from '../hooks/useBluetooth.ts';
import DeviceCard from './DeviceCard.tsx';
import { BluetoothIcon, SpinnerIcon } from './Icons.tsx';

const Manager: React.FC = () => {
  const {
    devices,
    connectedDevice,
    status,
    isScanning,
    error,
    isSupported,
    scanForDevices,
    connect,
    disconnect,
    setError,
  } = useBluetooth();

  const handleScan = () => {
    if (isScanning) return;
    scanForDevices();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-4xl font-bold text-white flex items-center gap-3">
          <BluetoothIcon className="w-10 h-10 text-blue-400" />
          Bluetooth Device Manager
        </h1>
        <button
          onClick={handleScan}
          disabled={isScanning || !isSupported}
          className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-slate-500 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          aria-label="Scan for new Bluetooth devices"
        >
          {isScanning ? (
            <>
              <SpinnerIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              Scanning...
            </>
          ) : (
            'Scan for Devices'
          )}
        </button>
      </div>

      {error && (
        <div
          className="bg-red-800/50 border border-red-600 text-red-200 px-4 py-3 rounded-lg relative mb-6"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <button
            onClick={() => setError(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            aria-label="Close error message"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
      )}

      {!isSupported && (
         <div className="bg-yellow-800/50 border border-yellow-600 text-yellow-200 px-4 py-3 rounded-lg mb-6" role="alert">
          <strong className="font-bold">Compatibility Warning: </strong>
          <span>Web Bluetooth is not supported by your browser. Please use a recent version of Chrome, Edge, or Opera on desktop or Android.</span>
        </div>
      )}

      {devices.length === 0 && !isScanning && (
        <div className="text-center py-16 px-6 bg-slate-800/50 rounded-lg shadow-lg">
          <BluetoothIcon className="mx-auto h-16 w-16 text-slate-500" />
          <h3 className="mt-4 text-xl font-medium text-slate-300">No Devices Found Yet</h3>
          <p className="mt-2 text-slate-400">Click "Scan for Devices" to begin searching for nearby Bluetooth Low Energy devices.</p>
          <p className="mt-1 text-xs text-slate-500">Note: This scans for devices near your computer, not the Home Assistant server.</p>
        </div>
      )}

      {devices.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map(device => (
            <DeviceCard
              key={device.id}
              device={device}
              isConnected={connectedDevice?.id === device.id}
              connectionStatus={connectedDevice?.id === device.id ? status : 'disconnected'}
              onConnect={() => connect(device)}
              onDisconnect={disconnect}
              isAnotherDeviceConnecting={status === 'connecting' && connectedDevice?.id !== device.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Manager;
