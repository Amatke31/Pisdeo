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

ipcMain.handle('chooseProjectPath', async () => {
    await dialog.showOpenDialog({
        defaultPath: path.join(appInfo.path.documents),
        properties: ['openDirectory']
    }).then(result => {
        if (!result.canceled) {
            console.log(result.filePaths[0])
            return result.filePaths[0]
        }
    }).catch(err => {
        console.log(err)
    })
});