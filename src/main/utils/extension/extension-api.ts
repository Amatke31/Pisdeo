import event from '../event';

class CommonApi {
    extensionInfo: object;
    constructor(extensionInfo: object) {
        this.extensionInfo = extensionInfo
    }

    addTemplate(templateInfo: any) {
        templateInfo = {
            name: templateInfo.name,
            id: templateInfo.id,
            cover: templateInfo.cover,
            require: templateInfo.require ? templateInfo.require : [],
            framework: templateInfo.framework ? templateInfo.framework : "",
            extension: this.extensionInfo
        }
        event.emit('addTemplate', templateInfo)
    }
}

class UIApi {
    extensionInfo: object;
    constructor(extensionInfo: object) {
        this.extensionInfo = extensionInfo
    }

    addMenu(where: string, id: string, icon: string) {
        event.emit('addMenu', { where, id, icon })
    }

    addElement(where: string, id: string, type: string, run: any) {
        event.emit('addElement', { where, id, type, run })
    }
}

export {
    CommonApi,
    UIApi,
}