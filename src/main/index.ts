import { app, shell, BrowserWindow, ipcMain, nativeTheme } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import {
  registerTitleBarListener,
  attachTitleBarToWindow
} from '@electron-uikit/titlebar'
import Store from 'electron-store'
import { useUIKit } from '@electron-uikit/core/main'


const store = new Store()

function createWindow(): void {
  // Register title bar IPC listeners
  registerTitleBarListener()
  useUIKit()
  const win = new BrowserWindow({
    // width: 400,
    // height: 450,
    show: false,
    autoHideMenuBar: true, // 菜单栏是否隐藏
    titleBarStyle: 'hidden', // 隐藏标题栏
    //resizable:true, // 允许拉伸或收缩
    //frame: false, // 隐藏默认框架以实现自定义圆角
    //transparent: true, // 启用透明背景
    //backgroundColor: '#00FFFFFF', // 设置透明背景
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // Attach a title bar to the window
  attachTitleBarToWindow(win)

  win.on('ready-to-show', () => {
    win.show()
  })

  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {

  nativeTheme.themeSource = 'light' // 设置为'light'或'dark'以固定主题

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
