class CommonApi {
    extensionInfo: object;
    store: any;
    constructor(extensionInfo: object, store: any) {
        this.extensionInfo = extensionInfo;
        this.store = store;
    }

    addTemplate(templateInfo: any) {
        templateInfo = {
            name: templateInfo.name,
            id: templateInfo.id,
            cover: templateInfo.cover,
            require: templateInfo.require ? templateInfo.require : [],
            framework: templateInfo.framework ? templateInfo.framework : "",
            extension: this.extensionInfo,
        };
        this.store.commit('addTemplate', templateInfo)
    }
}

class UIApi {
    extensionInfo: object;
    constructor(extensionInfo: object, store: any) {
        this.extensionInfo = extensionInfo;
    }
}

export { CommonApi, UIApi };
