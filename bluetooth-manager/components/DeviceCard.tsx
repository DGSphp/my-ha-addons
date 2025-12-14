
import React from 'react';
import { Device, ConnectionStatus } from '../types.ts';
import { ConnectIcon, DisconnectIcon, SpinnerIcon, BluetoothSignalIcon } from './Icons.tsx';

interface DeviceCardProps {
  device: Device;
  isConnected: boolean;
  connectionStatus: ConnectionStatus;
  onConnect: () => void;
  onDisconnect: () => void;
  isAnotherDeviceConnecting: boolean;
}

const StatusIndicator: React.FC<{ status: ConnectionStatus }> = ({ status }) => {
  const statusMap = {
    disconnected: { text: 'Disconnected', color: 'bg-slate-500' },
    connecting: { text: 'Connecting...', color: 'bg-yellow-500 animate-pulse' },
    connected: { text: 'Connected', color: 'bg-green-500' },
    error: { text: 'Error', color: 'bg-red-500' },
  };
  const { text, color } = statusMap[status];

  return (
    <div className="flex items-center gap-2">
      <span className={`w-3 h-3 rounded-full ${color}`}></span>
      <span className="text-sm font-medium text-slate-300">{text}</span>
    </div>
  );
};

const DeviceCard: React.FC<DeviceCardProps> = ({
  device,
  isConnected,
  connectionStatus,
  onConnect,
  onDisconnect,
  isAnotherDeviceConnecting,
}) => {
  const isConnecting = connectionStatus === 'connecting';
  const isDisabled = isConnecting || isAnotherDeviceConnecting;

  return (
    <div
      className={`bg-slate-800 rounded-lg shadow-lg p-5 flex flex-col justify-between transition-all duration-300 border-2 ${
        isConnected ? 'border-blue-500' : 'border-transparent'
      } ${isDisabled && !isConnecting ? 'opacity-50' : ''}`}
    >
      <div>
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-white break-all">{device.name}</h3>
          <BluetoothSignalIcon className={`w-6 h-6 ${isConnected ? 'text-blue-400' : 'text-slate-500'}`} />
        </div>
        <p className="text-xs text-slate-400 mt-1 mb-4 break-all">ID: {device.id}</p>
      </div>
      <div className="flex flex-col gap-4">
        <StatusIndicator status={connectionStatus} />
        {isConnected ? (
          <button
            onClick={onDisconnect}
            className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
            aria-label={`Disconnect from ${device.name}`}
          >
            <DisconnectIcon className="w-5 h-5 mr-2" />
            Disconnect
          </button>
        ) : (
          <button
            onClick={onConnect}
            disabled={isDisabled}
            className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
            aria-label={`Connect to ${device.name}`}
          >
            {isConnecting ? (
              <SpinnerIcon className="animate-spin h-5 w-5 mr-2" />
            ) : (
              <ConnectIcon className="w-5 h-5 mr-2" />
            )}
            {isConnecting ? 'Connecting...' : 'Connect'}
          </button>
        )}
      </div>
    </div>
  );
};

export default DeviceCard;
