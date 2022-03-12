import { ObjToElement, ObjToHTML } from "../utils/exchange/html";
import { createProject } from "../utils/project/createProject";
import { loadProject } from "../utils/project/loadProject";

let supportExt = ["html", "htm", "css", "js"];

const project = {
    state() {
        return {
            name: "",
            program: {
                name: "",
                author: "",
                file: {},
            },
            workspace: {
                openFile: [],
                currentFile: "",
                htmlChooser: "",
                viewer: null,
            },
            testProgram: {
                name: "Test",
                author: "Amatke31",
                file: {
                    "index.html": {
                        element: "html",
                        children: [
                            {
                                element: "head",
                                children: [
                                    {
                                        element: "style",
                                        css: [
                                            {
                                                class: "menu-bar",
                                                width: "100%",
                                                height: "32px",
                                                "background-color": "#222",
                                            },
                                        ],
                                    },
                                    {
                                        element: "script",
                                        script: [],
                                    },
                                ],
                            },
                            {
                                element: "body",
                                class: "dark",
                                children: [
                                    {
                                        element: "div",
                                        class: "menu-bar",
                                        text: "Test"
                                    },
                                ],
                            },
                        ],
                    },
                },
            },
        };
    },
    mutations: {
        beforeCreateProject(state: any, info: any) {
            state.name = info.name;
            state.program = {};
        },
        beforeLoadProjectWithDebug(state: any, info: any) {
            state.path = info.path;
        },
        beforeLoadTestProject(state: any) {
            state.program = state.testProgram;
            state.workspace.currentFile = "index.html";
        },
        openFile(state: any, filePath: string) {
            state.workspace.currentFile = filePath;
            if (!state.workspace.openFile.includes(filePath)) {
                state.workspace.openFile.push(filePath);
            }
            if (
                supportExt.includes(
                    state.workspace.currentFile.split(".").pop()
                )
            ) {
                switch (state.workspace.currentFile.split(".").pop()) {
                    case "html":
                        state.workspace.viewer = ObjToHTML(
                            state.program.file[
                                state.workspace.currentFile
                            ]
                        );
                        break;
                }
            }
        },
    },
    actions: {
        createProject({ state, commit }) {
            return new Promise((resolve) => {
                createProject(state, (result: any) => {
                    resolve(result);
                });
            });
        },
        loadProject({ state, commit }) {
            return new Promise((resolve) => {
                loadProject(state, (result: any) => {
                    resolve(result);
                });
            });
        },
        loadTestProject({ state, commit }) {
            commit('openFile', "index.html")
            return new Promise((resolve) => {
                resolve({ code: 200 });
            });
        },
    },
};

export default project;
