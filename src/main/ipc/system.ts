import { ipcMain } from 'electron'
import { app } from 'electron'

import { getConfig, saveConfigFile } from '../utils/configManager'
import version from '../utils/version'

ipcMain.handle('getVersion', () => version.version)
ipcMain.handle('getConfig', () => getConfig())
ipcMain.handle('getStorePath', () => app.getPath('userData'))
