const { spawn } = require("child_process");
const { src, task, series, parallel } = require("gulp");
const inquirer = require("inquirer");
const fs = require("fs");

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
                choices: ["Alpha", "Beta", "RC", "Release"],
            },
        ])
        .then((answers) => {
            fs.writeFile(
                "./static/version.json",
                JSON.stringify({
                    isProduction: answers.channel != "Alpha",
                    buildTime: new Date().getTime(),
                    version: answers.version,
                    channel: answers.channel,
                }),
                (err) => {
                    const run = spawn("vue-cli-service", ["build"]);
                    run.stdout.on("data", (data) => {
                        console.log(`${data}`);
                    });
                    run.stderr.on("data", (data) => {
                        console.error(`${data}`);
                    });
                    run.on("close", () => {
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