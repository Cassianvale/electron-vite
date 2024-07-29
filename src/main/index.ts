import { app, shell, BrowserWindow, ipcMain, nativeTheme } from 'electron';
import { initialize, enable } from '@electron/remote/main';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
import {
  registerTitleBarListener,
  attachTitleBarToWindow
} from '@electron-uikit/titlebar';
import { useUIKit } from '@electron-uikit/core/main';
import si from 'systeminformation'; // 获取系统信息


// 初始化 @electron/remote
initialize();

const windows: { [key: string]: BrowserWindow } = {};

//定时打印当前打开的窗口数量
setInterval(() => {
  console.log('windows:', Object.keys(windows).length);
}, 1000);

// 扩展 BrowserWindow 类型
declare module 'electron' {
  interface BrowserWindow {
    updateInterval?: NodeJS.Timeout;
  }
}

// 将窗口设置为始终置顶，对Mac系统隐藏dock
function alwaysOnTop(app, win) {
  const isMac = process.platform === 'darwin';
  if (isMac) {
    app.dock.hide(); // 在 macOS 上隐藏应用图标
  }
  win.setAlwaysOnTop(true, 'screen-saver'); // 将窗口置顶
  win.setVisibleOnAllWorkspaces(true); // 在所有工作区可见
}

// 创建窗口的通用函数
function createWindow(route, options) {
  // 如果窗口已存在，显示并返回它
  const existingWindow = windows[route];
  if (existingWindow) {
    existingWindow.show();
    return existingWindow;
  }

  // 创建新窗口
  const window = new BrowserWindow({
    ...options,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  });

  // 启用 @electron/remote
  enable(window.webContents);

  // 附加标题栏到窗口
  attachTitleBarToWindow(window);

  // 当窗口准备好显示时，显示窗口
  window.on('ready-to-show', () => {
    window.show();
  });

  // 非隐藏窗口为0时关闭应用，多窗口关闭最后一个窗口时关闭应用，隐藏窗口10s后销毁
  window.on('close', (event) => {
    const allWindows = BrowserWindow.getAllWindows();
    const visibleWindows = allWindows.filter(win => win.isVisible()); // 过滤使用中的可见窗口

    if (visibleWindows.length === 1) {
      // 如果只有一个可见窗口，退出应用
      app.quit();
    } else {
      // 否则，隐藏窗口并在10秒后销毁
      event.preventDefault();
      window.hide();

      const timeoutId = setTimeout(() => {
        if (!window.isVisible()) {
          window.destroy();
          delete windows[route];
          console.log('The previous window has been destroyed');
        }
      }, 500);

      // 清理定时器防止操作已被销毁的对象
      window.once('closed', () => {
        clearTimeout(timeoutId);
        if (window.updateInterval) {
          clearInterval(window.updateInterval);
        }
      });

    }
  });
  // 处理窗口打开外部链接
  window.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // 加载窗口内容
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    window.loadURL(`${process.env['ELECTRON_RENDERER_URL']}#${route}`);
  } else {
    window.loadFile(join(__dirname, '../renderer/index.html'), { hash: route });
  }

  // 将新窗口添加到窗口列表中
  windows[route] = window;
  return window;
}

app.whenReady().then(() => {
  nativeTheme.themeSource = 'light';  // 设置默认主题
  electronApp.setAppUserModelId('com.electron');  // 设置应用模型 ID

  // 处理窗口标题更新事件
  ipcMain.on('window-title-update', (_, { windowId, title, logo = '' }) => {
    const win = BrowserWindow.fromId(windowId);
    if (win) {
      win.setTitle(title);
      win.webContents.send('window-title-updated', { title, logo });
    }
  });

  // 当创建新的浏览器窗口时，监视窗口快捷键
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // 处理窗口置顶事件
  ipcMain.on('toggle-always-on-top', (_, windowId) => {
    const win = BrowserWindow.fromId(windowId);
    if (win) {
      const isAlwaysOnTop = win.isAlwaysOnTop();
      if (isAlwaysOnTop) {
        win.setAlwaysOnTop(false);
        if (process.platform === 'darwin') {
          app.dock.show();  // 在 macOS 上显示应用图标
        }
      } else {
        alwaysOnTop(app, win);
      }
    }
  });

  // 处理创建通用窗口请求
  ipcMain.handle('create-generic-window', (_, { route, width, height }) => {
    if (windows[route]) {
      windows[route].show();
    } else {
      const genericWindow = createWindow(route, {
        width,
        height,
        show: false,
        titleBarStyle: 'hidden',
        resizable:false,  // 能否调整窗口大小和拉伸
        ...(process.platform === 'linux' ? { icon } : {}),
      });
      genericWindow.once('ready-to-show', () => {
        genericWindow.show();
      });

      if (route === '/statschart') {
        const updateSystemData = async () => {
          if (genericWindow.isDestroyed()) return; // 检查窗口是否已销毁
          try {
            const memoryData = await si.mem();
            const cpuData = await si.currentLoad();
            const gpuData = await si.graphics();
            genericWindow.webContents.send('system-data', { memoryData, cpuData, gpuData });
          } catch (error) {
            console.error('Error fetching system data:', error);
          }
        };
        genericWindow.updateInterval = setInterval(updateSystemData, 1000);
        // 在窗口关闭时清理定时器
        genericWindow.on('close', () => {
          if (genericWindow.updateInterval) {
            clearInterval(genericWindow.updateInterval);
          }
        });
      }
    }
  });

  // 获取系统数据
  ipcMain.handle('get-system-data', async () => {
    const memoryData = await si.mem();
    const cpuData = await si.currentLoad();
    const gpuData = await si.graphics();
    return { memoryData, cpuData, gpuData };
  });

  // 注册标题栏监听器
  registerTitleBarListener();
  useUIKit();

  // 创建初始窗口(登录窗口)
  createWindow('/', {
    width: 400,
    height: 450,
    show: false,
    titleBarStyle: 'hidden',
    resizable:false,  // 能否调整窗口大小和拉伸
    ...(process.platform === 'linux' ? { icon } : {}),
  });

  // 在应用激活时，如果没有窗口，则创建初始窗口
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow('/', {
        width: 400,
        height: 450,
        show: false,
        titleBarStyle: 'hidden',
        resizable:false,
        ...(process.platform === 'linux' ? { icon } : {}),
      });
    }
  });
});



// 处理登录成功事件
ipcMain.on('login-success', async (_, message) => {

  console.log(message);  // 确认消息接收

  const rootWindow = windows['/'];
  if (rootWindow) {
    // 创建新的 home 路由窗口
    const homeWindow = createWindow('/home', {
      width: 800,
      height: 600,
      show: false,
      title: 'Home',
      titleBarStyle: 'hidden',
      ...(process.platform === 'linux' ? { icon } : {}),
    });

    // 等待组件挂载和事件处理完成
    setTimeout(() => {
      rootWindow.destroy();
      delete windows['/'];
      homeWindow.show();
    }, 0);
  }

});


ipcMain.on('test-message', (_, message) => {
  console.log(message);  // 确认消息接收
});


// 处理所有窗口关闭事件
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
