import getStaticPath from '../utils/getStaticPath'
import fs from 'fs'
import path from 'path'
import vm from 'vm'
import { extensionApi } from './extension-api'
import extEvent from './extension-event'
import platform from '@/renderer/utils/platform/platform'

var instance = new Array()
var idList: any = new Array()
var g_extensionInfo = new Array();

class ExtensionManager {
    /**
     * Load installed extension
     * @param {string} extensionPath NexWebEditor data path
     * @method i18n vue-i18n
     */
    LoadExtensionFromLocal(extensionPath: string, develop?: boolean, i18n?: any) {
        if (platform === "desktop") {
            const ExtensionInfo: any[] = []
            const extensionFolderPath = path.join(extensionPath)
            const extensionFolderList = fs.readdirSync(extensionFolderPath)
            extensionFolderList.forEach((ExtName) => {
                if (fs.statSync(path.join(extensionFolderPath, ExtName)).isDirectory()) {
                    const extensionSourcePath = develop ? path.join(extensionFolderPath, ExtName, 'build') : path.join(extensionFolderPath, ExtName)
                    const extensionSource = fs.readdirSync(extensionSourcePath)
                    if (extensionSource.indexOf("info.json") != -1) {
                        var info = JSON.parse(fs.readFileSync(path.join(extensionSourcePath, "info.json")).toString())
                        info.path = path.join(extensionSourcePath)
                        g_extensionInfo.push(info)

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
        return g_extensionInfo
    }

    /**
     * Run Extension
     * @param {Object} info Extension info
     * @param {String} sourcePath Extension path
     */
    runExtension(extensionInfo: { id: any }, sourcePath: string) {
        const nweExtensionAPI = extensionApi
        const id = extensionInfo.id
        const script = new vm.Script(fs.readFileSync(path.join(sourcePath, "main.js")).toString());
        const context = vm.createContext({ module: { exports: {} }, nweExtensionAPI, extensionInfo, console, path });
        script.runInContext(context);
        const ExtensionPrototype = context.module.exports;
        instance.push(new ExtensionPrototype())
        idList[id] = instance.length - 1
    }

    /**
     * InitExt
     */
    InitExt() {
        var project = new Array()
        instance.forEach(
            (instance) => {
                if (instance.onInit) {
                    project.push(instance.onInit())
                }
            }
        )
    }

    /**
     * Create Project
     */
    createProject(templateInfo: any, projectInfo: any) {
        var project = instance[idList[templateInfo.extension.id]]
        project.useTemplate(projectInfo, templateInfo, (res: { complete: boolean }) => {
            extEvent.emit('projectLoaded', res.complete === true ? "successed" : "failed")
        })
    }
}


const extensionManager = new ExtensionManager()

export default {
    extensionManager,
    instance,
    g_extensionInfo
}

export { extensionManager, g_extensionInfo, instance }