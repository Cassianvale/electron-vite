import { ElectronAPI } from '@electron-toolkit/preload'


declare global {
  interface Window {
    electron: ElectronAPI
    api: any
  }
  interface Api {
    loadConfig: () => Promise<any>;
    saveConfig: (config: any) => Promise<void>;
    getShops: () => Promise<any>;
    isMacintosh: () => boolean;
    toggleAlwaysOnTop: () => void;
    getCurrentWindowId: () => number;
    updateWindowTitle: (title: string) => void;
  }
}
