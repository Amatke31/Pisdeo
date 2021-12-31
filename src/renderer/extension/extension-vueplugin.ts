import extM from "./extension-manager"

const extensionManager = extM.extensionManager

export default {
    install: (app: any, options: any) => {
        const i18n = app.__VUE_I18N__.global
        app.config.globalProperties.$extension = {
            extensionManager: {
                LoadExtensionFromLocal: (editorPath: string) => {
                    return extensionManager.LoadExtensionFromLocal(editorPath, i18n)
                },
                runExtension: (extensionInfo: { id: any }, sourcePath: string) => {
                    extensionManager.runExtension(extensionInfo, sourcePath)
                },
                InitExt: () => {
                    extensionManager.InitExt()
                },
                createProject: (id: { extension: { id: string | number } }, projectInfo: any) => {
                    extensionManager.createProject(id, projectInfo)
                }
            }
        }
    }
}
