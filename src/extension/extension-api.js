import fs from 'fs'
import path from 'path'
import { ipcRenderer } from "electron";
import extEvent from './extension-event';

function copyDir(src, dist, callback) {
    fs.access(dist, function (err) {
        if (err) {
            fs.mkdirSync(dist);
        }
        _copy(null, src, dist);
    });

    function _copy(err, src, dist) {
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
    copyTemplateToProject(templatePath, extensionInfo, project) {
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
            copyDir(templatePath, projectPath)
        }
    }

    registerTemplate(info) {
        extEvent.emit('addTemplate', info)
    }
}

const extensionApi = new ExtensionAPI()

export {
    extensionApi
}