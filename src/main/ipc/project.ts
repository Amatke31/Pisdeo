import { app, ipcMain, dialog } from "electron";
import path from 'path'

const appInfo = {
    path: {
        home: app.getPath('home'),
        temp: app.getPath('temp'),
        documents: app.getPath('documents')
    },
    platform: process.platform
}

async function chooseProjectPath() {
    let cppath: string = ''
    await dialog.showOpenDialog({
        defaultPath: path.join(appInfo.path.documents),
        properties: ['openDirectory']
    }).then(result => {
        if (!result.canceled) {
            cppath = result.filePaths[0]
        }
        else {
            cppath = 'cancel'
        }
    }).catch(err => {
        console.log(err)
        cppath = 'error'
    })
    return cppath
}

ipcMain.handle('chooseProjectPath', async () => {
    const cppath = await chooseProjectPath()
    return cppath
});