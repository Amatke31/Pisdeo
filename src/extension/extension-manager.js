import fs from 'fs'
import path from 'path'
import vm from 'vm'
import { extensionApi } from './extension-api'
import extEvent from './extension-event'

const isDevelopment = process.env.NODE_ENV !== 'production'
var NWEExtensionPath = ''

var instance = new Array()
var idList = new Object()
var g_extensionInfo = new Array();

class ExtensionManager {
    /**
     * Load installed extension
     * @param {string} editorPath NexWebEditor data path
     * @method i18n vue-i18n
     */
    LoadExtensionFromLocal(editorPath, i18n) {
        NWEExtensionPath = isDevelopment ? './src/extension/extension' : path.join(__dirname, '..', 'extension')
        const ExtensionInfo = []
        const installedExtensionList = fs.readdirSync(path.join(editorPath, 'extensions'))
        const NWEExtensionList = fs.readdirSync(NWEExtensionPath)
        installedExtensionList.forEach((ExtName) => {
            if (fs.statSync(path.join(editorPath, "extensions", ExtName)).isDirectory()) {
                const extensionSource = fs.readdirSync(path.join(editorPath, "extensions", ExtName))
                if (extensionSource.indexOf("info.json") != -1) {
                    var info = JSON.parse(fs.readFileSync(path.join(editorPath, "extensions", ExtName, "info.json")))
                    info.path = path.join(editorPath, "extensions", ExtName)
                    ExtensionInfo.push(info)

                    //load locale
                    if (extensionSource.indexOf("locales") != -1) {
                        const locales = fs.readdirSync(path.join(editorPath, "extensions", ExtName, 'locales'))
                        const messages = {}
                        locales.forEach(key => {
                            var matched = key.match(/[A-Za-z0-9-_,\s]+\.json$/i)
                            if (matched) {
                                matched = path.basename(key, '.json');
                                const locale = JSON.parse(fs.readFileSync(path.join(editorPath, "extensions", ExtName, "locales", key)))
                                messages[matched] = locale
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
                    var info = JSON.parse(fs.readFileSync(path.join(NWEExtensionPath, ExtName, 'build', "info.json")))
                    info.path = path.join(NWEExtensionPath, ExtName, 'build')
                    ExtensionInfo.push(info)

                    //load locale
                    if (extensionSource.indexOf("locales") != -1) {
                        const locales = fs.readdirSync(path.join(NWEExtensionPath, ExtName, 'build', 'locales'))
                        const messages = {}
                        locales.forEach(key => {
                            var matched = key.match(/[A-Za-z0-9-_,\s]+\.json$/i)
                            if (matched) {
                                matched = path.basename(key, '.json');
                                const locale = JSON.parse(fs.readFileSync(path.join(NWEExtensionPath, ExtName, 'build', "locales", key)))
                                messages[matched] = locale
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
    runExtension(extensionInfo, sourcePath) {
        const nweExtensionAPI = extensionApi
        const id = extensionInfo.id
        const script = new vm.Script(fs.readFileSync(path.join(sourcePath, "main.js")));
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
    createProject(templateInfo, projectInfo) {
        var project = instance[idList[templateInfo.extension.id]]
        project.useTemplate(projectInfo, templateInfo, (res) => {
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