// main.js — Electron main process
// இது தான் .exe double-click பண்ணும்போது run ஆகும் entry file.
const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1000,
    minHeight: 650,
    title: 'Construction Management and Billing',
    // 'build/icon.ico' file வச்சா அதுவே app icon ஆக காட்டும். இல்லனா default Electron icon வரும்.
    icon: require('fs').existsSync(path.join(__dirname, 'build', 'icon.ico'))
      ? path.join(__dirname, 'build', 'icon.ico')
      : undefined,
    webPreferences: {
      // App code நேரடியா require('fs') / require('http') / require('os')
      // பண்றதால இது Node integration ஆன் ஆயிருக்கணும்.
      nodeIntegration: true,
      contextIsolation: false,
      backgroundThrottling: false
    }
  });

  // BUGFIX: the app's "📲 WhatsApp" button (and anything else) calls
  // window.open('https://wa.me/...', '_blank') to hand a message off to
  // WhatsApp. Electron denies window.open by default unless the main
  // process explicitly handles it — with no handler wired up here, every
  // one of those calls was silently swallowed, so tapping "📲 WhatsApp"
  // did nothing at all, with no error either. Any http(s) link the app
  // tries to pop open now hands off to the user's normal web browser /
  // installed WhatsApp app via shell.openExternal, instead of trying (and
  // failing) to open inside a bare Electron window with no address bar.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//i.test(url)) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  // Browser-மாதிரி menu bar (File/Edit/View) தேவையில்ல, தள்ளிடுவோம்.
  Menu.setApplicationMenu(null);

  // Hardening: the app window must never navigate away from the local index.html
  // (nodeIntegration is ON, so loading any remote page here would be dangerous).
  mainWindow.webContents.on('will-navigate', (e, url) => {
    if (!url.startsWith('file://')) e.preventDefault();
  });

  mainWindow.loadFile('index.html');

  // Optional: appத்த maximize பண்ணி open பண்ண வேணும்னா இத uncomment பண்ணுங்க
  // mainWindow.maximize();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// FIX: launching the .exe twice opened two windows that both held their own copy of the data and
// overwrote each other's data file (one window's entries were lost). Only ONE instance may run;
// a second launch just brings the existing window to the front.
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
  app.whenReady().then(createWindow);
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
