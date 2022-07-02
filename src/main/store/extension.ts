import { defineStore } from "pinia";
import { CommonApi, UIApi } from "../lib/extension/extension-api";
import vm from "vm";
import platform from "@/main/lib/platform/platform";
import axios from "axios";
import JSZip from "jszip";

const extension = defineStore("extension", {
    state() {
        return {
            extension: {},
            template: {},
        };
    },
    actions: {
        async addTemplate(info: any) {
            let isAdd = false;
            this.template.hasOwnProperty(info.id);
            if (!isAdd) {
                let require = new Array();
                if (info.require) {
                    info.require.forEach((parameter: any) => {
                        require.push(
                            typeof parameter === "object" ? parameter : { name: parameter }
                        );
                    });
                }
                let cover = await this.extension[info.extension.id].file[info.cover].async(
                    "base64"
                );
                let ext = info.cover.split(".").pop();
                switch (ext) {
                    case "svg":
                        ext = "svg+xml";
                        break;
                    case "jpg":
                        ext = "jpeg";
                        break;
                }
                cover = `data:image/${ext};base64,${cover}`;
                info.cover = cover;
                this.template[info.id] = info;
            }
        },
        loadExtension: async function({ zipFile, i18n }) {
            const zipData = await JSZip.loadAsync(zipFile);
            let info: any = {};
            if ("info.json" in zipData.files) {
                info = JSON.parse(await zipData.files["info.json"].async("text"));
                info.file = zipData.files;
                this.extension[info.id] = info;

                //load locale
                for (const fileName in zipData.files) {
                    const result = fileName.match(
                        /^locales\/([A-Za-z0-9_-]+)\/([A-Za-z0-9_-]+).json$/
                    );
                    if (result) {
                        i18n.mergeLocaleMessage(
                            result[1],
                            JSON.parse(await zipData.files[fileName].async("text"))
                        );
                    }
                }
            } else {
                throw new Error(`Cannot find 'info.json' in ${info.name}(${info.id}) extension`);
            }

            if ("main.js" in zipData.files) {
                const script = new vm.Script(await zipData.files["main.js"].async("text"));
                const context = vm.createContext({
                    module: { exports: {} },
                    console,
                });
                script.runInContext(context);
                const ExtensionPrototype = context.module.exports;
                const instance = new Function(
                    ExtensionPrototype(new CommonApi(info, this), new UIApi(info, this))
                );
            } else {
                throw new Error(`Cannot find 'main.js' in ${info.name}(${info.id}) extension`);
            }
        },
        loadNWDExt: async function({ i18n }) {
            if (platform === "desktop") {
            } else {
                await axios({
                    method: "get",
                    url: "/extension/base/dist/org.pisdeo.base@1.0.0.nwdx",
                    responseType: "arraybuffer",
                }).then(async (res) => {
                    this.loadExtension({ zipFile: res.data, i18n });
                });
            }
        },
    },
});

export default extension;
