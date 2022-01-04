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

export { getVersion, getConfig }