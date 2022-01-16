import fs from 'fs'
import path from 'path'
import { ipcRenderer } from "electron";
import extEvent from './extension-event';

function copyDir(src: string, dist: fs.PathLike, callback?: any) {
    fs.access(dist, function (err) {
        if (err) {
            fs.mkdirSync(dist);
        }
        _copy(null, src, dist.toString());
    });

    function _copy(err: null, src: fs.PathLike, dist: string) {
        if (err) {
            callback(err);
        } else {
            fs.readdir(src, function (err, paths) {
                if (err) {
                    callback(err)
                } else {
                    paths.forEach(function (path) {
                        var _src = src + '/' + path;
                        var _dist = dist + '/' + path;
                        fs.stat(_src, function (err, stat) {
                            if (err) {
                                callback(err);
                            } else {
                                if (stat.isFile()) {
                                    fs.writeFileSync(_dist, fs.readFileSync(_src));
                                } else if (stat.isDirectory()) {
                                    copyDir(_src, _dist, callback)
                                }
                            }
                        })
                    })
                }
            })
        }
    }
}

class ExtensionAPI {
    extensionInfo: object;
    constructor(extensionInfo: object) {
        this.extensionInfo = extensionInfo
    }

    copyTemplateToProject(templatePath: fs.PathLike, extensionInfo: any, project: { path: string; name: string; }) {
        console.log(extensionInfo)
        console.log(fs.readdirSync(templatePath))
        console.log(project)
        const projectPath = path.join(project.path, project.name)
        try {
            fs.mkdir(projectPath, (err) => {
                if (err) {
                    console.log(err)
                }
            })
        }
        finally {
            copyDir(templatePath.toString(), projectPath)
        }
    }

    addTemplate(templateInfo: any) {
        templateInfo = {
            name: templateInfo.name,
            id: templateInfo.id,
            require: templateInfo.require ? templateInfo.require : [],
            framework: templateInfo.framework ? templateInfo.framework : "",
            extension: this.extensionInfo
        }
        extEvent.emit('addTemplate', templateInfo)
    }
}

export {
    ExtensionAPI
}