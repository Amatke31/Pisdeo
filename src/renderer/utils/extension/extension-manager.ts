import path from 'path'
import fs from 'fs'
import vm from 'vm'
import { ExtensionAPI } from './extension-api'
import platform from '@/renderer/utils/platform/platform'
import axios from 'axios'
import JSZip from 'jszip'

let instance = new Array()
let idList: any = new Array()

class ExtensionManager {
    allExtension: any
    constructor() {
        this.allExtension = []
    }

    /**
     * Load NWD extension
     * @method i18n vue-i18n
     */
    async LoadNWDExt(i18n?: any) {
        if (platform === "desktop") {
            const isDevelopment = process.env.NODE_ENV !== "development"
            let extensionPath = isDevelopment
                ? path
                    .join(__dirname, "/extension/")
                    .replace(/\\/g, "\\\\")
                : path.join(process.cwd(), "/src/extension/")
            const extensionFolderPath = path.join(extensionPath)
            const extensionFolderList = fs.readdirSync(extensionFolderPath)
            extensionFolderList.forEach((ExtName: any) => {
                if (fs.statSync(path.join(extensionFolderPath, ExtName, 'build')).isDirectory()) {
                    const extensionSourcePath = path.join(extensionFolderPath, ExtName)
                    const extensionSource = fs.readdirSync(extensionSourcePath)
                    if (extensionSource.indexOf("info.json") != -1) {
                        var info = JSON.parse(fs.readFileSync(path.join(extensionSourcePath, "info.json")).toString())
                        info.path = path.join(extensionSourcePath)
                        info.content = fs.readFileSync(path.join(extensionSourcePath, "main.js")).toString()
                        this.allExtension.push(info)

                        //load locale
                        if (Boolean(i18n) && extensionSource.indexOf("locales") != -1) {
                            const locales = fs.readdirSync(path.join(extensionSourcePath, 'locales'))
                            const messages: any = []
                            locales.forEach((key: any) => {
                                var matched = key.match(/[A-Za-z0-9-_,\s]+\.json$/i)
                                if (matched) {
                                    const langClass = path.basename(key, '.json');
                                    const locale = JSON.parse(fs.readFileSync(path.join(extensionSourcePath, "locales", key)).toString())
                                    messages[langClass] = locale
                                    i18n.mergeLocaleMessage(matched, locale)
                                }
                            })
                        }
                    }
                    else {
                        console.log(`Cannot find "info.json" in ${ExtName}`)
                    }
                }
            })
        }
        else {
            await axios({
                method: 'get',
                url: '/extension/base/dist/org.nexwebdesigner.base@1.0.0.nwdx',
                responseType: 'arraybuffer'
            })
                .then(async (res) => {
                    const file = res.data
                    const zipData = await JSZip.loadAsync(file);
                    if ('info.json' in zipData.files) {
                        let info: any = JSON.parse(await zipData.files['info.json'].async('text'));
                        info.url = '/extension/base/dist/org.nexwebdesigner.base@1.0.0.nwdx'
                        info.content = await zipData.files['main.js'].async('text')
                        this.allExtension.push(info)

                        //load locale
                        const locale = {};
                        for (const fileName in zipData.files) {
                            const result = fileName.match(/^locales\/([A-Za-z0-9_-]+)\/([A-Za-z0-9_-]+).json$/);
                            if (result) {
                                i18n.mergeLocaleMessage(result[1], JSON.parse(await zipData.files[fileName].async('text')))
                            }
                        }
                    }
                    else {
                        console.log(`Init Error`)
                    }
                })
        }
        return this.allExtension
    }

    /**
     * Load installed extension
     * @param {string} extensionPath NexWebDesigner data path
     * @method i18n vue-i18n
     */
    async LoadExtensionFromLocal(extensionPath: string, i18n?: any) {
        if (platform === "desktop") {
            const extensionFolderPath = path.join(extensionPath)
            const extensionFolderList = fs.readdirSync(extensionFolderPath)
            extensionFolderList.forEach((ExtName: any) => {
                if (fs.statSync(path.join(extensionFolderPath, ExtName)).isDirectory()) {
                    const extensionSourcePath = path.join(extensionFolderPath, ExtName)
                    const extensionSource = fs.readdirSync(extensionSourcePath)
                    if (extensionSource.indexOf("info.json") != -1) {
                        var info = JSON.parse(fs.readFileSync(path.join(extensionSourcePath, "info.json")).toString())
                        info.path = path.join(extensionSourcePath)
                        info.content = fs.readFileSync(path.join(extensionSourcePath, "main.js")).toString()
                        this.allExtension.push(info)

                        //load locale
                        if (Boolean(i18n) && extensionSource.indexOf("locales") != -1) {
                            const locales = fs.readdirSync(path.join(extensionSourcePath, 'locales'))
                            const messages: any = []
                            locales.forEach((key: any) => {
                                var matched = key.match(/[A-Za-z0-9-_,\s]+\.json$/i)
                                if (matched) {
                                    const langClass = path.basename(key, '.json');
                                    const locale = JSON.parse(fs.readFileSync(path.join(extensionSourcePath, "locales", key)).toString())
                                    messages[langClass] = locale
                                    i18n.mergeLocaleMessage(matched, locale)
                                }
                            })
                        }
                    }
                    else {
                        console.log(`Cannot find "info.json" in ${ExtName}`)
                    }
                }
            })
        }
        return this.allExtension
    }

    /**
     * Run Extension
     * @param {Object} info Extension info
     */
    runExtension(extensionInfo: any) {
        const id = extensionInfo.id
        const script = new vm.Script(extensionInfo.content);
        const context = vm.createContext({ module: { exports: {} }, console });
        script.runInContext(context);
        const ExtensionPrototype = context.module.exports;
        const ins = new Function(ExtensionPrototype(new ExtensionAPI(extensionInfo)))
        instance.push(ins)
        idList[id] = instance.length - 1
    }
}


const extensionManager = new ExtensionManager()

export default {
    extensionManager,
    instance
}

export { extensionManager, instance }