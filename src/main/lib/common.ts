import Config from "@/types/Config";
import ipc from "./platform/desktop/ipc";
import platform from "./platform/platform";
import { getFile, setFile } from "./platform/web/file";

let userConfig: any = {};

const defaultConfig: Config = {
    init: false,
    configVersion: "Manual Build",
    language: "en_us",
    theme: "auto",
    updateCheck: "ask",
};

async function getConfig(callback: any) {
    if (platform === "desktop") {
        userConfig = await ipc.getConfig();
        callback(userConfig);
    } else if (platform === "web") {
        getFile("config", (result: any) => {
            if (result == "") {
                setFile("config", defaultConfig);
                callback(defaultConfig);
            } else {
                userConfig = JSON.parse(result);
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
        getConfig((result: Config) => {
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

export { getConfig, getSystemLocale, setLocale, inited };
