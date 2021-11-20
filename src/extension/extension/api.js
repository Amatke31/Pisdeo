/**
 * Define APIs.
 * @module API
 */

let hasInit = false;
let instance = null;

/**
 * Register an API.
 * [Dangerous] You should not call this function in your extension.
 * @param {object} api - API object.
 */
function registExtensionAPI(api) {
    if (hasInit) return;
    instance = api;
    hasInit = true;
}

const template = {
    copyTemplate(templatePath, project) {
        templatepath = path.join(extensionInfo.path, templatePath)
        nweExtensionAPI.copyTemplateToProject(templatepath, extensionInfo, project)
    },
    register(templateInfo) {
        templateInfo = {
            name: templateInfo.name,
            extension: extensionInfo
        }
        nweExtensionAPI.registerTemplate(templateInfo)
    }
}

module.exports = {
    template,
    registExtensionAPI
}