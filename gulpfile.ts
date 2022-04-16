const { spawn } = require("child_process");
const { src, task, series, parallel } = require("gulp");
const inquirer = require("inquirer");
const fs = require("fs");
const os = require("os");

const shell = os.platform() === "win32" ? "powershell.exe" : "zsh";

declare namespace NodeJS {
    export interface Process {
        stdout: any;
    }
}

function build(cb) {
    inquirer
        .prompt([
            {
                type: "input",
                message: "type version",
                name: "version",
            },
            {
                type: "list",
                message: "choose channel",
                name: "channel",
                choices: ["Develop", "Alpha", "Beta", "RC", "Release"],
            },
        ])
        .then((answers) => {
            fs.writeFile(
                "./static/version.json",
                JSON.stringify({
                    isProduction: answers.channel != "Alpha" || "Develop",
                    buildTime: new Date().getTime(),
                    version: answers.version,
                    channel: answers.channel,
                }),
                (err) => {
                    console.log('Building...')
                    var ptyProcess = spawn(
                        os.platform() !== "win32"
                            ? "vue-cli-service"
                            : "vue-cli-service.cmd",
                        ["build"]
                    );

                    ptyProcess.on("close", () => {
                        fs.writeFile(
                            "./static/version.json",
                            JSON.stringify({
                                isProduction: false,
                                buildTime: "Manual Build",
                                version: "Manual Build",
                                channel: "Develop",
                            }),
                            (err) => {
                                cb();
                            }
                        );
                    });
                }
            );
        });
}

module.exports.build = build;
module.exports.default = module.exports.build;
