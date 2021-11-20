import extM from "./extension-manager"

const extensionManager = extM.extensionManager

export default {
    install: (app, options) => {
        const i18n = app.__VUE_I18N__.global
        app.config.globalProperties.$extension = {
            extensionManager: {
                LoadExtensionFromLocal: (editorPath) => {
                    return extensionManager.LoadExtensionFromLocal(editorPath, i18n)
                },
                runExtension: (extensionInfo, sourcePath) => {
                    extensionManager.runExtension(extensionInfo, sourcePath)
                },
                InitExt: () => {
                    extensionManager.InitExt()
                },
                createProject: (id, projectInfo) => {
                    extensionManager.createProject(id, projectInfo)
                }
            }
        }
    }
}
