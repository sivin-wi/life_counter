import {app, ipcMain, Tray, Menu, nativeImage, BrowserWindow} from 'electron'
import path from 'path';

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

const isDev = process.env.NODE_ENV === "development";
let isQuitting = false;

function createWindow(){
   
    // console.log('w>>',path.join(__dirname,'../','src/renderer/assets/img.ico'))
    //C:\Users\anu\Desktop\electron_project\life_counter\dist-electron
    mainWindow = new BrowserWindow({
     width: 500,
    height: 600,
    minWidth: 600,           // Minimum width (if resizable)
    minHeight: 600,          // Minimum height (if resizable)
    maxWidth: 600,           // Maximum width (if resizable)
    maxHeight: 600,          // Maximum height (if resizable)
    resizable: false,        // Disable resizing completely
    maximizable: false,      // Disable maximize button
    fullscreenable: false,   // Disable fullscreen
     webPreferences:{
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true,
        nodeIntegration: false
     },
     autoHideMenuBar: true,
     icon: path.join(__dirname,'../','src/renderer/assets/img.ico')
    })

    if(isDev){
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools()
    }else{
        mainWindow.loadFile(path.join(__dirname,'../','src/renderer/assets/img.ico'))
    }

    mainWindow.on('close',(event)=>{
       if(!isQuitting){
           event.preventDefault()
           mainWindow?.hide()
       }
    })
}

function createTray(){
    const icon =  nativeImage.createFromPath(
        path.join(__dirname,'../','src/renderer/assets/img.ico')
    )
    tray = new Tray(icon.resize({
       height: 16,
       width: 16,
       quality: "best"
    }));
    const contextMenu =  Menu.buildFromTemplate([
        {
            label: 'Show App',
            click: ()=>{
                mainWindow?.show();
            }
        },
        {
            label: 'Quit',
            click: ()=>{
                isQuitting = true;
                app.quit();
            }
        }
    ])
  
    tray.setToolTip('life counter');
    tray.setContextMenu(contextMenu)

    tray.on('click',()=>{
        mainWindow?.show();
    });
}

app.whenReady().then(()=>{
    createWindow();
    createTray();
    // auto-launch setup
    app.setLoginItemSettings({
        openAtLogin: true,
        openAsHidden: false
    })
})

app.on('window-all-closed',()=>{
    if(process.platform !== "darwin"){
        app.quit();
    }
})

app.on("activate",()=>{
    if(BrowserWindow.getAllWindows().length === 0){
        createWindow();
    }
})

// IPC handlers
ipcMain.handle("get-time-left", async (_,targetTime: number)=>{
    const now = Date.now();
    const diff = targetTime - now;
    return Math.max(0,diff);
})

ipcMain.handle('set-auto-launch',async(_,enabled: boolean)=>{
    app.setLoginItemSettings({
        openAtLogin: enabled,
        openAsHidden: false
    })
})

ipcMain.handle('get-auto-launch', async ()=>{
    return app.getLoginItemSettings().openAtLogin;
})

// // hmr for development
// if(isDev && module.hot){
//     module.hot.accept();
//     module.hot.dispose(()=>{
//         mainWindow?.close();
//         tray?.destroy();
//     })
// }