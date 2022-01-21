import getStaticPath from '../../../utils/getStaticPath'
import fs from 'fs'
import path from 'path'
import vm from 'vm'
import { ExtensionAPI } from './extension-api'
import event from '../event'
import platform from '@/renderer/utils/platform/platform'
import module from '../platform/desktop/module'

let instance = new Array()
let idList: any = new Array()

class ExtensionManager {
    allExtension: any
    constructor() {
        this.allExtension = []
    }

    /**
     * Load installed extension
     * @param {string} extensionPath NexWebEditor data path
     * @method i18n vue-i18n
     */
    LoadExtensionFromLocal(extensionPath: string, i18n?: any) {
        if (platform === "desktop") {
            const ExtensionInfo: any[] = []
            const extensionFolderPath = path.join(extensionPath)
            const extensionFolderList = fs.readdirSync(extensionFolderPath)
            extensionFolderList.forEach((ExtName) => {
                if (fs.statSync(path.join(extensionFolderPath, ExtName)).isDirectory()) {
                    const extensionSourcePath = path.join(extensionFolderPath, ExtName)
                    const extensionSource = fs.readdirSync(extensionSourcePath)
                    if (extensionSource.indexOf("info.json") != -1) {
                        var info = JSON.parse(fs.readFileSync(path.join(extensionSourcePath, "info.json")).toString())
                        info.path = path.join(extensionSourcePath)
                        this.allExtension.push(info)

                        //load locale
                        if (Boolean(i18n) && extensionSource.indexOf("locales") != -1) {
                            const locales = fs.readdirSync(path.join(extensionSourcePath, 'locales'))
                            const messages: any = []
                            locales.forEach(key => {
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
     * @param {String} sourcePath Extension path
     */
    runExtension(extensionInfo: { id: any }, sourcePath: string) {
        const id = extensionInfo.id
        const mod = module.loadModule(path.resolve(sourcePath, "main.js"), sourcePath)
        new Function(mod(new ExtensionAPI(extensionInfo)))
        instance.push(mod)
        idList[id] = instance.length - 1
    }
}


const extensionManager = new ExtensionManager()

export default {
    extensionManager,
    instance
}

export { extensionManager, instance }