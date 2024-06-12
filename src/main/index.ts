import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import Store from 'electron-store'

const store = new Store()


const login_width=350;
const login_height=450;


function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: login_width,
    height: login_height,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    resizable:false,
    frame: false, // 隐藏默认框架以实现自定义圆角
    transparent: true, // 启用透明背景
    backgroundColor: '#00FFFFFF', // 设置透明背景
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))


  // IPC handlers
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

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
