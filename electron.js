
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false
    },
    icon: path.join(__dirname, 'public/favicon.ico'),
    show: false
  });

  // في حالة التطوير، استخدم localhost مع المنفذ الصحيح
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173'); // Vite's default port
    win.webContents.openDevTools();
  } else {
    // في الإنتاج، استخدم ملفات build
    win.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  win.once('ready-to-show', () => {
    win.show();
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
