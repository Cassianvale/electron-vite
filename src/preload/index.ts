import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { getCurrentWindow } from '@electron/remote'

// Custom APIs for renderer
const api = {
  loadConfig: () => ipcRenderer.invoke('load-config'),
  saveConfig: (config) => ipcRenderer.invoke('save-config', config),
  getShops: () => ipcRenderer.invoke('get-shops'),
  isMacintosh: () => process.platform === 'darwin',  // 检测平台
  toggleAlwaysOnTop: () => {
    const windowId = getCurrentWindow().id
    ipcRenderer.send('toggle-always-on-top', windowId)
  },
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
