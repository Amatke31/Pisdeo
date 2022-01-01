'use strict'

import { app, protocol, BrowserWindow, Menu, ipcMain, dialog, shell } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import path from 'path'

const isDevelopment = process.env.NODE_ENV !== 'production'
const isMac = process.platform === 'darwin'

// app.setAsDefaultProtocolClient("nexwebeditor");

protocol.registerSchemesAsPrivileged([
  { scheme: 'nexwebeditor', privileges: { secure: true, standard: true, corsEnabled: true } }
])

async function createWindow(title: string, path: string) {
  const win = new BrowserWindow({
    width: 1366,
    height: 768,
    // minWidth: 1366,
    // minHeight: 768,
    titleBarStyle: 'hidden',
    title,
    webPreferences: {
      nodeIntegration: Boolean(process.env.ELECTRON_NODE_INTEGRATION),
      contextIsolation: Boolean(!process.env.ELECTRON_NODE_INTEGRATION),
    }
  })
  const baseMenu: any = [
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] : []),
    {
      label: 'Help',
      submenu: [
        {
          label: 'Learn NexWebEditor',
          click: async () => {
            await shell.openExternal('https://nexwebeditor.org/docs')
          }
        },
        {
          label: 'Issues',
          click: async () => {
            await shell.openExternal('https://nexwebeditor.org/issues')
          }
        },
        {
          label: 'Toggle Developer Tools',
          click: () => {
            win.webContents.openDevTools()
          }
        },
      ]
    }
  ]
  const menu = Menu.buildFromTemplate(baseMenu)
  Menu.setApplicationMenu(menu)

  if (isDevelopment) {
    await win.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}${path}`)
  } else {
    createProtocol('nexwebeditor')
    await win.loadURL(`nexwebeditor://${path}`)
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('ready', async () => {
  createWindow('NexWebEditor', './index.html')
})

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

const appInfo = {
  path: {
    home: app.getPath('home'),
    temp: app.getPath('temp'),
    documents: app.getPath('documents')
  },
  platform: process.platform
}

ipcMain.on('Init', (event, arg) => {
  event.sender.send("Init", appInfo)
})

ipcMain.on('openDoc', function (event, path) {
  createWindow('Document', 'docs/src/.vuepress/dist/index.html')
})

ipcMain.on('projectLoadComplete', function (event) {
  event.sender.send('projectLoadComplete')
})

ipcMain.on('exit', function () {
  app.quit()
})

import './ipc/project'
import './ipc/system'
