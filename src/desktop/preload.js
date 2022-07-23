import { ipcRenderer } from "electron";

window.isDesktop = true;
window.ipc = ipcRenderer;
window.system = {
    arch: process.arch,
    platform: process.platform,
};
