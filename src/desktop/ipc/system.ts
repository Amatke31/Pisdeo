import { ipcMain } from "electron";
import { app } from "electron";

import { getConfig, saveConfigFile } from "../utils/configManager";

ipcMain.handle("getConfig", () => getConfig());
ipcMain.handle("inited", async () => {
    try {
        getConfig().init = true;
        await saveConfigFile();
        return "successful";
    } catch {
        return "error";
    }
});
ipcMain.handle("getLocale", () => app.getLocale());
ipcMain.handle("getStorePath", () => app.getPath("userData"));
ipcMain.handle("getDocumentsPath", () => app.getPath("documents"));
ipcMain.handle("setLocale", async (event, lang) => {
    try {
        getConfig().language = lang;
        await saveConfigFile();
        return "successful";
    } catch {
        return "error";
    }
});
