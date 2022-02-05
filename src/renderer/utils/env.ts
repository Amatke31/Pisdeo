import ipc from "./platform/desktop/ipc";
import platform from "./platform/platform";

let version: string = 'Manual Build'
let userConfig: any = {}

async function getVersion() {
    if (platform === 'desktop') {
        version = await ipc.getVersion();
    }
    return version
}

async function getConfig() {
    if (platform === 'desktop') {
        version = await ipc.getConfig();
    }
    return version
}

async function setLocale(lang: string) {
    if (platform === 'desktop') {
        version = await ipc.setLocale(lang);
    }
    return version
}

async function inited() {
    if (platform === 'desktop') {
        version = await ipc.inited();
    }
    return version
}

async function getLocale() {
    if (platform === 'desktop') {
        version = await ipc.getLocale();
    }
    return version
}

export { getVersion, getConfig, getLocale, setLocale, inited }