// import {App} from 'electron';

// declare global{
//     interface App{
//         isQuitting?: boolean // add the custom isQuitting property
//     }
// }

export interface ElectronAPI{
    getTimeLeft: (targetTime: number) => Promise<number>;
    setAutoLaunch: (enabled: boolean) => Promise<boolean>;
    getAutoLaunch: ()=> Promise<boolean>
}

declare global{
    interface Window{
        electron: ElectronAPI
    }
}

// HMR types for vite
interface ImportMeta{
    hot?:{
        accept: ()=> void;
        dispose: (cb: ()=> void) => void
    }
}

// export {}