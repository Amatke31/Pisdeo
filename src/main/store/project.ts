import { ObjToHTML } from "../utils/exchange/html";
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
                openFile: {},
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
                                                class: "*",
                                                margin: "0",
                                                padding: "0",
                                            },
                                            {
                                                class: ".menu-bar",
                                                width: "100%",
                                                height: "auto",
                                                padding: "4px",
                                                color: "#fff",
                                                "background-color": "#222",
                                                "box-sizing": "border-box",
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
                                        elementName: "MenuBar",
                                        children: [
                                            {
                                                element: ".text",
                                                text: "Test"
                                            }
                                        ]
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
        },
        chooseElement(state: any, e: any) {
            state.workspace.htmlChooser = e.element;
        },
        refreshView(state: any) {
            state.workspace.viewer = ObjToHTML(
                state.program.file[state.workspace.currentFile]
            );
        },
        refreshViewWithCode(state: any, code: any) {
            state.workspace.openFile[state.workspace.currentFile].context = code;
            state.workspace.viewer = ObjToHTML(
                state.program.file[state.workspace.currentFile]
            );
        },
    },
    actions: {
        createProject({ state }) {
            return new Promise((resolve) => {
                createProject(state, (result: any) => {
                    resolve(result);
                });
            });
        },
        loadProject({ state }) {
            return new Promise((resolve) => {
                loadProject(state, (result: any) => {
                    resolve(result);
                });
            });
        },
        loadTestProject({ dispatch }) {
            dispatch("openFile", "index.html");
            return new Promise((resolve) => {
                resolve({ code: 200 });
            });
        },
        openFile({ state, commit }, filePath: string) {
            state.workspace.currentFile = filePath;
            if (!state.workspace.openFile[filePath]) {
                state.workspace.openFile[filePath] = {
                    file: filePath,
                    context: state.program.file[filePath],
                };
            }
            if (
                supportExt.includes(
                    state.workspace.currentFile.split(".").pop()
                )
            ) {
                switch (state.workspace.currentFile.split(".").pop()) {
                    case "html":
                        commit('refreshView')
                        break;
                }
            }
        },
    },
};

export default project;
