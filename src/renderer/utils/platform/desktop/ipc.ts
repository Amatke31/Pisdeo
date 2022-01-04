// import { ipcRenderer } from 'electron'
import platform from '../platform'

let ipcRenderer: any = {
    invoke: async function(msg: string) {
        return 'Not desktop environment'
    }
}

if (platform === 'desktop') {
    ipcRenderer = require('electron').ipcRenderer
}

const ipc = {
    async getVersion(): Promise<string> {
        return await ipcRenderer.invoke('getVersion')
    },
    async getDocumentsPath(): Promise<string> {
        return await ipcRenderer.invoke('getDocumentsPath')
    },
    async getStorePath(): Promise<string> {
        return await ipcRenderer.invoke('getStorePath')
    },
    async getConfig(): Promise<string> {
        return await ipcRenderer.invoke('getConfig')
    },
    async chooseProjectPath() {
        let cppath: string = ''
        await ipcRenderer.invoke('chooseProjectPath').then((path: any) => {
            if (path != ('cancel' || 'error'))
                cppath = path
        })
        return cppath
    }
}

export default ipc
export { ipc }
