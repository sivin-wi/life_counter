"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electron', {
    getTimeLeft: (targetTime) => electron_1.ipcRenderer.invoke('get-time-left', targetTime),
    setAutoLaunch: (enabled) => electron_1.ipcRenderer.invoke('set-auto-launch', enabled),
    getAutoLaunch: () => electron_1.ipcRenderer.invoke('get-auto-launch')
});
// } satisfies Window)
