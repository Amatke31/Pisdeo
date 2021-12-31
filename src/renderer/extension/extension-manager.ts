import fs from 'fs'
import path from 'path'
import vm from 'vm'
import { extensionApi } from './extension-api'
import extEvent from './extension-event'

const isDevelopment = process.env.NODE_ENV !== 'production'
var NWEExtensionPath = ''

var instance = new Array()
var idList: any = new Array()
var g_extensionInfo = new Array();

class ExtensionManager {
    /**
     * Load installed extension
     * @param {string} editorPath NexWebEditor data path
     * @method i18n vue-i18n
     */
    LoadExtensionFromLocal(editorPath: string, i18n: { mergeLocaleMessage: (arg0: RegExpMatchArray | null, arg1: any) => void }) {
        NWEExtensionPath = isDevelopment ? './src/extension/extension' : path.join(__dirname, '..', 'extension')
        const ExtensionInfo: any[] = []
        const installedExtensionList = fs.readdirSync(path.join(editorPath, 'extensions'))
        const NWEExtensionList = fs.readdirSync(NWEExtensionPath)
        installedExtensionList.forEach((ExtName) => {
            if (fs.statSync(path.join(editorPath, "extensions", ExtName)).isDirectory()) {
                const extensionSource = fs.readdirSync(path.join(editorPath, "extensions", ExtName))
                if (extensionSource.indexOf("info.json") != -1) {
                    var info = JSON.parse(fs.readFileSync(path.join(editorPath, "extensions", ExtName, "info.json")).toString())
                    info.path = path.join(editorPath, "extensions", ExtName)
                    ExtensionInfo.push(info)

                    //load locale
                    if (extensionSource.indexOf("locales") != -1) {
                        const locales = fs.readdirSync(path.join(editorPath, "extensions", ExtName, 'locales'))
                        const messages: any = []
                        locales.forEach(key => {
                            var matched = key.match(/[A-Za-z0-9-_,\s]+\.json$/i)
                            if (matched) {
                                const langClass = path.basename(key, '.json');
                                const locale = JSON.parse(fs.readFileSync(path.join(editorPath, "extensions", ExtName, "locales", key)).toString())
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
        NWEExtensionList.forEach((ExtName) => {
            if (fs.statSync(path.join(NWEExtensionPath, ExtName)).isDirectory()) {
                const extensionSource = fs.readdirSync(path.join(NWEExtensionPath, ExtName, 'build'))
                if (extensionSource.indexOf("info.json") != -1) {
                    var info = JSON.parse(fs.readFileSync(path.join(NWEExtensionPath, ExtName, 'build', "info.json")).toString())
                    info.path = path.join(NWEExtensionPath, ExtName, 'build')
                    ExtensionInfo.push(info)

                    //load locale
                    if (extensionSource.indexOf("locales") != -1) {
                        const locales = fs.readdirSync(path.join(NWEExtensionPath, ExtName, 'build', 'locales'))
                        const messages: any = []
                        locales.forEach(key => {
                            var matched = key.match(/[A-Za-z0-9-_,\s]+\.json$/i)
                            if (matched) {
                                const langClass: string = path.basename(key, '.json');
                                const locale = JSON.parse(fs.readFileSync(path.join(NWEExtensionPath, ExtName, 'build', "locales", key)).toString())
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
        g_extensionInfo = ExtensionInfo
        return ExtensionInfo
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
    createProject(templateInfo: { extension: { id: string | number } }, projectInfo: any) {
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
    g_extensionInfo,
    extEvent
}