import { ipcMain } from 'electron'
import { app } from 'electron'

import { getConfig, saveConfigFile } from '../utils/configManager'
import version from '../utils/version'

ipcMain.handle('getVersion', () => version.version)
ipcMain.handle('getConfig', () => getConfig())
ipcMain.handle('getLocale', () => app.getLocale())
ipcMain.handle('getStorePath', () => app.getPath('userData'))
ipcMain.handle('getDocumentsPath', () => app.getPath('documents'))
ipcMain.handle('setLocale', (event, lang) => {
    try {
        getConfig().language = lang
        saveConfigFile()
        return 'successful'
    }
    catch {
        return 'error'
    }
})
