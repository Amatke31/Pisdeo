const { template, Extension } = require('nexwebeditor-extension')

class StaticExtension extends Extension {
    onInit() {
        template.add({
            name: 'My HomePage',
            id: "org.nexwebeditor.template.myhomepage"
        })
    }

    useTemplate(project, templateInfo, complete) {
        console.log(project)
        template.copyTemplate('./template', project)
        complete({
            complete: "success"
        })
    }
}

module.exports = StaticExtension
