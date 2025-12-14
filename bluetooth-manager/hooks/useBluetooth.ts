
import { useState, useCallback, useEffect } from 'react';
import { Device, ConnectionStatus } from '../types.ts';

export const useBluetooth = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isSupported = typeof navigator !== 'undefined' && 'bluetooth' in navigator;

  const handleDisconnect = useCallback(() => {
    console.log('Device disconnected.');
    setConnectedDevice(null);
    setStatus('disconnected');
  }, []);

  useEffect(() => {
    if (connectedDevice) {
      const device = connectedDevice.device;
      device.addEventListener('gattserverdisconnected', handleDisconnect);
      return () => {
        device.removeEventListener('gattserverdisconnected', handleDisconnect);
      };
    }
  }, [connectedDevice, handleDisconnect]);

  const scanForDevices = useCallback(async () => {
    if (!isSupported) {
      setError('Web Bluetooth API is not supported on this browser. Please use Chrome, Edge, or Opera on a compatible device.');
      return;
    }
    
    setError(null);
    setIsScanning(true);

    try {
      const bleDevice = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
      });

      const newDevice: Device = {
        id: bleDevice.id,
        name: bleDevice.name || 'Unknown Device',
        device: bleDevice,
      };

      setDevices(prevDevices => {
        if (!prevDevices.some(d => d.id === newDevice.id)) {
          return [...prevDevices, newDevice];
        }
        return prevDevices;
      });
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'NotFoundError') {
          setError('No device selected. Please try again.');
        } else {
          setError(`Scan failed: ${err.message}`);
        }
      } else {
        setError('An unknown error occurred during scanning.');
      }
      console.error('Bluetooth scan error:', err);
    } finally {
      setIsScanning(false);
    }
  }, [isSupported]);

  const connect = useCallback(async (device: Device) => {
    if (connectedDevice?.id === device.id) return;
    if (connectedDevice) await disconnect();

    setError(null);
    setStatus('connecting');

    try {
      console.log(`Connecting to ${device.name} (${device.id})...`);
      await device.device.gatt?.connect();
      console.log('Connected!');
      setConnectedDevice(device);
      setStatus('connected');
    } catch (err) {
      if (err instanceof Error) {
        setError(`Failed to connect: ${err.message}`);
      } else {
        setError('An unknown error occurred during connection.');
      }
      console.error('Bluetooth connect error:', err);
      setStatus('error');
    }
  }, [connectedDevice]);

  const disconnect = useCallback(async () => {
    if (!connectedDevice) return;

    try {
      console.log(`Disconnecting from ${connectedDevice.name}...`);
      connectedDevice.device.gatt?.disconnect();
      handleDisconnect(); // Manually trigger state update
    } catch (err) {
      if (err instanceof Error) {
        setError(`Failed to disconnect: ${err.message}`);
      } else {
        setError('An unknown error occurred during disconnection.');
      }
      console.error('Bluetooth disconnect error:', err);
      setStatus('error');
    }
  }, [connectedDevice, handleDisconnect]);

  return {
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
  };
};
