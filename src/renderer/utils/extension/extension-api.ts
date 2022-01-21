import event from '../event';

class ExtensionAPI {
    extensionInfo: object;
    constructor(extensionInfo: object) {
        this.extensionInfo = extensionInfo
    }

    addTemplate(templateInfo: any) {
        templateInfo = {
            name: templateInfo.name,
            id: templateInfo.id,
            require: templateInfo.require ? templateInfo.require : [],
            framework: templateInfo.framework ? templateInfo.framework : "",
            extension: this.extensionInfo
        }
        event.emit('addTemplate', templateInfo)
    }
}

export {
    ExtensionAPI
}