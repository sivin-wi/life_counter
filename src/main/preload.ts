import {contextBridge,ipcRenderer} from 'electron'

contextBridge.exposeInMainWorld('electron',{
    getTimeLeft: (targetTime: number)=> ipcRenderer.invoke('get-time-left', targetTime),
    setAutoLaunch: (enabled: boolean)=> ipcRenderer.invoke('set-auto-launch', enabled),
    getAutoLaunch: ()=> ipcRenderer.invoke('get-auto-launch')
})
// } satisfies Window)