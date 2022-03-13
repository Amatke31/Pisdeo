import ipc from "./platform/desktop/ipc";
import platform from "./platform/platform";
import { getFile, setFile } from "./platform/web/file";

let version: Object = {
    isProduction: false,
    buildTime: "Manual Build",
    version: "Manual Build",
    channel: "Develop",
};
let userConfig: any = {};

const defaultConfig: any = {
    init: false,
    configVersion: "Manual Build",
    language: "en_us",
    theme: "auto",
    updateCheck: "ask",
};

async function getVersion() {
    if (platform === "desktop") {
        version = JSON.parse(await ipc.getVersion());
    } else if (platform === "web") {
        version = require("../../../static/version.json");
    }
    return version;
}

async function getConfig(callback: any) {
    if (platform === "desktop") {
        userConfig = await ipc.getConfig();
        callback(userConfig);
    } else if (platform === "web") {
        getFile("config", (result: any) => {
            if (result == undefined) {
                setFile("config", defaultConfig);
                callback(defaultConfig);
            } else {
                userConfig = result;
                callback(userConfig);
            }
        });
    }
}

async function setLocale(lang: string) {
    let reback;
    if (platform === "desktop") {
        reback = await ipc.setLocale(lang);
    } else if (platform === "web") {
        userConfig.language = lang;
        setFile("config", userConfig);
    }
    return reback;
}

async function inited() {
    let reback;
    if (platform === "desktop") {
        reback = await ipc.inited();
    } else if (platform === "web") {
        getFile("config", (result: any) => {
            result.init = true;
            setFile("config", result);
        });
    }
    return reback;
}

async function getSystemLocale() {
    let reback = "en_us";
    if (platform === "desktop") {
        reback = await ipc.getLocale();
    } else if (platform === "web") {
        reback = navigator.language;
    }
    reback = reback.replace("-", "_").toLowerCase();
    return reback;
}

export { getVersion, getConfig, getSystemLocale, setLocale, inited };
