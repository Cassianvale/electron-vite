import { app, shell, BrowserWindow, ipcMain, nativeTheme } from 'electron'
import { initialize } from '@electron/remote/main'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import {
  registerTitleBarListener,
  attachTitleBarToWindow
} from '@electron-uikit/titlebar'
import Store from 'electron-store'
import { useUIKit } from '@electron-uikit/core/main'

initialize()  // 初始化 @electron/remote

const store = new Store()

let windows: { [key: string]: BrowserWindow } = {}

function alwaysOnTop(app: Electron.App, win: BrowserWindow) {
  const is_mac = process.platform === 'darwin'
  if (is_mac) {
    app.dock.hide()
  }
  win.setAlwaysOnTop(true, "screen-saver")
  win.setVisibleOnAllWorkspaces(true)
}


function createWindow(route: string, options: Electron.BrowserWindowConstructorOptions): BrowserWindow {
  const window = new BrowserWindow({
    ...options,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration:false,
      contextIsolation: true,
    }
  })

  require('@electron/remote/main').enable(window.webContents)  // 启用 remote 模块

  attachTitleBarToWindow(window)

  window.on('ready-to-show', () => {
    window.show()
  })

  window.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    window.loadURL(`${process.env['ELECTRON_RENDERER_URL']}#${route}`)
  } else {
    window.loadFile(join(__dirname, '../renderer/index.html'), { hash: route })
  }

  return window
}

function createLoginWindow(): void {
  const loginWindow = createWindow('/', {
    width: 400,
    height: 450,
    show: false,
    titleBarStyle: 'hidden',
    ...(process.platform === 'linux' ? { icon } : {})
  })
  windows['login'] = loginWindow
}

function createHomeWindow(): void {
  const homeWindow = createWindow('/home', {
    show: false,
    titleBarStyle: 'hidden',
    ...(process.platform === 'linux' ? { icon } : {})
  })
  windows['home'] = homeWindow
}

app.whenReady().then(() => {
  // 设置默认主题，注释掉可跟随操作系统主题
  nativeTheme.themeSource = 'light'

  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  ipcMain.handle('load-config', async () => {
    return store.get('config', {
      backendURL: '',
      deliveryURL: '',
      mysqlHost: '',
      mysqlUser: '',
      mysqlPassword: '',
      mysqlDatabase: '',
    })
  })

  ipcMain.handle('save-config', async (_, config) => {
    store.set('config', config)
  })

  ipcMain.handle('test-connection', async () => {
    const config = store.get('config')
    if (!config.mysqlHost || !config.mysqlUser || !config.mysqlPassword || !config.mysqlDatabase) {
      throw new Error('MySQL 配置未设置')
    }

    try {
      const connection = await mysql.createConnection({
        host: config.mysqlHost,
        user: config.mysqlUser,
        password: config.mysqlPassword,
        database: config.mysqlDatabase
      })
      await connection.end()
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.on('toggle-always-on-top', (event, windowId) => {
    const win = BrowserWindow.fromId(windowId)
    if (win) {
      const isAlwaysOnTop = win.isAlwaysOnTop()
      if (isAlwaysOnTop) {
        win.setAlwaysOnTop(false)
        if (process.platform === 'darwin') {
          app.dock.show()
        }
      } else {
        alwaysOnTop(app, win)
      }
    }
  })

  registerTitleBarListener()
  useUIKit()
  createLoginWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createLoginWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('login-success', () => {
  if (windows['login']) {
    windows['login'].close()
    delete windows['login']
  }
  createHomeWindow()
})


