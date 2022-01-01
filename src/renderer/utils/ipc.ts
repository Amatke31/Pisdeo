import { ipcRenderer } from 'electron'

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
