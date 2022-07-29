import platform from "../platform";

let ipcRenderer: any = {
    invoke: async function(msg: string) {
        return "Not desktop environment";
    },
    send: function(msg: string, msg2: string) {
        return "Not desktop environment";
    },
};

if (platform === "desktop") {
    ipcRenderer = window.ipc;
}

const ipc = {
    async getDocumentsPath(): Promise<string> {
        return await ipcRenderer.invoke("getDocumentsPath");
    },
    async getStorePath(): Promise<string> {
        return await ipcRenderer.invoke("getStorePath");
    },
    async getConfig(): Promise<string> {
        return await ipcRenderer.invoke("getConfig");
    },
    async getLocale(): Promise<string> {
        return await ipcRenderer.invoke("getLocale");
    },
    async setLocale(lang: string): Promise<string> {
        return await ipcRenderer.invoke("setLocale", lang);
    },
    async inited(): Promise<string> {
        return await ipcRenderer.invoke("inited");
    },
    async chooseProjectPath() {
        let cppath: string = "";
        await ipcRenderer.invoke("chooseProjectPath").then((path: any) => {
            if (path != ("cancel" || "error")) cppath = path;
        });
        return cppath;
    },
};

export default ipc;
