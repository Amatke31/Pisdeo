"use strict";

import { app, protocol, BrowserWindow, Menu, ipcMain, shell } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import path from "path";

const isDevelopment = process.env.NODE_ENV !== "production";
const isMac = process.platform === "darwin";

app.setAsDefaultProtocolClient("pisdeo");

protocol.registerSchemesAsPrivileged([
    { scheme: "pisdeo", privileges: { secure: true, standard: true } },
]);

async function createWindow(title: string, url: string = "./index.html") {
    const win = new BrowserWindow({
        width: 1366,
        height: 768,
        // minWidth: 1366,
        // minHeight: 768,
        // titleBarStyle: "hidden",
        title,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.resolve(path.join(__dirname, "preload.js")),
        },
    });
    // win.setMenuBarVisibility(false);
    const baseMenu: any = [
        ...(isMac
            ? [
                  {
                      label: app.name,
                      submenu: [
                          { role: "about" },
                          { type: "separator" },
                          { role: "services" },
                          { type: "separator" },
                          { role: "hide" },
                          { role: "hideOthers" },
                          { role: "unhide" },
                          { type: "separator" },
                          { role: "quit" },
                      ],
                  },
              ]
            : []),
        {
            label: "Help",
            submenu: [
                {
                    label: "Learn Pisdeo",
                    click: async () => {
                        await shell.openExternal("https://pisdeo.org/docs");
                    },
                },
                {
                    label: "Issues",
                    click: async () => {
                        await shell.openExternal("https://pisdeo.org/issues");
                    },
                },
                {
                    label: "Toggle Developer Tools",
                    click: () => {
                        win.webContents.openDevTools();
                    },
                },
                ,
                {
                    label: "Refresh Page",
                    click: async () => {
                        if (isDevelopment) {
                            await win.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}${url}`);
                        } else {
                            await win.loadURL(`app://${url}`);
                        }
                    },
                },
            ],
        },
    ];
    const menu = Menu.buildFromTemplate(baseMenu);
    Menu.setApplicationMenu(menu);

    if (isDevelopment) {
        await win.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}${url}`);
    } else {
        createProtocol("pisdeo");
        await win.loadURL(`pisdeo://${url}`);
    }
}

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("ready", async () => {
    createWindow("Pisdeo", "./index.html");
});

if (isDevelopment) {
    if (process.platform === "win32") {
        process.on("message", (data) => {
            if (data === "graceful-exit") {
                app.quit();
            }
        });
    } else {
        process.on("SIGTERM", () => {
            app.quit();
        });
    }
}

const appInfo = {
    path: {
        home: app.getPath("home"),
        temp: app.getPath("temp"),
        documents: app.getPath("documents"),
    },
    platform: process.platform,
};

ipcMain.on("Init", (event, arg) => {
    event.sender.send("Init", appInfo);
});

ipcMain.on("projectLoadComplete", function(event) {
    event.sender.send("projectLoadComplete");
});

ipcMain.on("exit", function() {
    app.quit();
});

import "./ipc/project";
import "./ipc/system";
import "./utils/configManager";
