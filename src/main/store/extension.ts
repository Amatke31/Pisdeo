import { CommonApi, UIApi } from "../utils/extension/extension-api";
import path from "path";
import fs from "fs";
import vm from "vm";
import platform from "@/main/utils/platform/platform";
import axios from "axios";
import JSZip from "jszip";

const extension = {
    state() {
        return {
            extension: {},
        };
    },
    mutations: {},
    actions: {
        loadExtension: async function({ state, commit }, { zipFile, i18n }) {
            const zipData = await JSZip.loadAsync(zipFile);
            let info: any = {};
            if ("info.json" in zipData.files) {
                info = JSON.parse(
                    await zipData.files["info.json"].async("text")
                );
                info.file = zipData.files;
                state.extension[info.id] = info;

                //load locale
                for (const fileName in zipData.files) {
                    const result = fileName.match(
                        /^locales\/([A-Za-z0-9_-]+)\/([A-Za-z0-9_-]+).json$/
                    );
                    if (result) {
                        i18n.mergeLocaleMessage(
                            result[1],
                            JSON.parse(
                                await zipData.files[fileName].async("text")
                            )
                        );
                    }
                }
            } else {
                throw new Error("Cannot find 'info.json' in nwdx extension");
            }

            if ("main.js" in zipData.files) {
                const script = new vm.Script(
                    await zipData.files["main.js"].async("text")
                );
                const context = vm.createContext({
                    module: { exports: {} },
                    console,
                });
                script.runInContext(context);
                const ExtensionPrototype = context.module.exports;
                const instance = new Function(
                    ExtensionPrototype(new CommonApi(info), new UIApi(info))
                );
                info.instance = instance;
            } else {
                throw new Error("Cannot find 'main.js' in nwdx extension");
            }
        },
        loadNWDExt: async function({ state, dispatch }, { i18n }) {
            if (platform === "desktop") {
            } else {
                await axios({
                    method: "get",
                    url:
                        "/extension/base/dist/org.nexwebdesigner.base@1.0.0.nwdx",
                    responseType: "arraybuffer",
                }).then(async (res) => {
                    dispatch("loadExtension", { zipFile: res.data, i18n });
                });
            }
        },
    },
};

export default extension;
