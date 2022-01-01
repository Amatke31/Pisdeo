import { ipcRenderer } from 'electron'

const ipc = {
    async getVersion(): Promise<string> {
        return await ipcRenderer.invoke('getVersion')
    },
    async getStorePath(): Promise<string> {
        return await ipcRenderer.invoke('getStorePath')
    },
    async chooseProjectPath(callback: (path: any) => void) {
        await ipcRenderer.invoke('chooseProjectPath').then((path) => {
            console.log(path)
            callback(path)
        })
    }
}

export default ipc
