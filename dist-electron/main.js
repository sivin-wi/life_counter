"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
let mainWindow = null;
let tray = null;
const isDev = process.env.NODE_ENV === "development";
let isQuitting = false;
function createWindow() {
    // console.log('w>>',path.join(__dirname,'../','src/renderer/assets/img.ico'))
    //C:\Users\anu\Desktop\electron_project\life_counter\dist-electron
    mainWindow = new electron_1.BrowserWindow({
        width: 500,
        height: 600,
        minWidth: 600, // Minimum width (if resizable)
        minHeight: 600, // Minimum height (if resizable)
        maxWidth: 600, // Maximum width (if resizable)
        maxHeight: 600, // Maximum height (if resizable)
        resizable: false, // Disable resizing completely
        maximizable: false, // Disable maximize button
        fullscreenable: false, // Disable fullscreen
        webPreferences: {
            preload: path_1.default.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        },
        autoHideMenuBar: true,
        icon: path_1.default.join(__dirname, '../', 'src/renderer/assets/img.ico')
    });
    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    }
    else {
        mainWindow.loadFile(path_1.default.join(__dirname, '../', 'src/renderer/assets/img.ico'));
    }
    mainWindow.on('close', (event) => {
        if (!isQuitting) {
            event.preventDefault();
            mainWindow?.hide();
        }
    });
}
function createTray() {
    const icon = electron_1.nativeImage.createFromPath(path_1.default.join(__dirname, '../', 'src/renderer/assets/img.ico'));
    tray = new electron_1.Tray(icon.resize({
        height: 16,
        width: 16,
        quality: "best"
    }));
    const contextMenu = electron_1.Menu.buildFromTemplate([
        {
            label: 'Show App',
            click: () => {
                mainWindow?.show();
            }
        },
        {
            label: 'Quit',
            click: () => {
                isQuitting = true;
                electron_1.app.quit();
            }
        }
    ]);
    tray.setToolTip('life counter');
    tray.setContextMenu(contextMenu);
    tray.on('click', () => {
        mainWindow?.show();
    });
}
electron_1.app.whenReady().then(() => {
    createWindow();
    createTray();
    // auto-launch setup
    electron_1.app.setLoginItemSettings({
        openAtLogin: true,
        openAsHidden: false
    });
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
electron_1.app.on("activate", () => {
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
// IPC handlers
electron_1.ipcMain.handle("get-time-left", async (_, targetTime) => {
    const now = Date.now();
    const diff = targetTime - now;
    return Math.max(0, diff);
});
electron_1.ipcMain.handle('set-auto-launch', async (_, enabled) => {
    electron_1.app.setLoginItemSettings({
        openAtLogin: enabled,
        openAsHidden: false
    });
});
electron_1.ipcMain.handle('get-auto-launch', async () => {
    return electron_1.app.getLoginItemSettings().openAtLogin;
});
// // hmr for development
// if(isDev && module.hot){
//     module.hot.accept();
//     module.hot.dispose(()=>{
//         mainWindow?.close();
//         tray?.destroy();
//     })
// }
