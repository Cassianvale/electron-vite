import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { getCurrentWindow } from '@electron/remote'

// 自定义API暴露给渲染进程
const api = {
  // 创建通用窗口
  createGenericWindow: (route, width, height) => ipcRenderer.invoke('create-generic-window', { route, width, height }),
  loadConfig: () => ipcRenderer.invoke('load-config'),
  saveConfig: (config) => ipcRenderer.invoke('save-config', config),
  getShops: () => ipcRenderer.invoke('get-shops'),
  isMacintosh: () => process.platform === 'darwin',
  getCurrentWindowId: () => getCurrentWindow().id,
  toggleAlwaysOnTop: () => {
    const windowId = getCurrentWindow().id
    ipcRenderer.send('toggle-always-on-top', windowId)
  },
  updateWindowTitle: (title, logo) => {
    const windowId = getCurrentWindow().id;
    const payload: { windowId: number; title: string; logo?: string } = { windowId, title };
    if (logo) {
      payload.logo = logo;
    }
    ipcRenderer.send('window-title-update', payload);
  },
  getSystemData: () => ipcRenderer.invoke('get-system-data')
}

// 使用 contextBridge API 暴露 Electron API 到渲染进程
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
