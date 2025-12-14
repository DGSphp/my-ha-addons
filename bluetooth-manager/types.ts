
export interface Device {
  id: string;
  name: string | null;
  device: BluetoothDevice;
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';
