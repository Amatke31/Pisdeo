import { ObjToElement, ObjToHTML } from "../utils/exchange/html";
import { createProject } from "../utils/project/createProject";
import { loadProject } from "../utils/project/loadProject";
import testProgram from "../../../test/testProgram/project.json"

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
        };
    },
    getters: {
        currentFileContent: (state: {
            workspace: {
                openFile: { [x: string]: { content: any } };
                currentFile: string;
            };
        }) => {
            return state.workspace.openFile[state.workspace.currentFile].content;
        },
        getHTMLChooserLayer: (state: { workspace: { htmlChooser: string } }) => {
            return state.workspace.htmlChooser.split("-");
        },
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
            state.program = testProgram;
        },
        chooseElement(state: any, e: any) {
            state.workspace.htmlChooser = e.element;
        },
        refreshView(state: any) {
            state.workspace.viewer = ObjToHTML(state.program.file[state.workspace.currentFile]);
        },
        refreshViewWithCode(state: any, code: any) {
            state.workspace.openFile[state.workspace.currentFile].content = code;
            state.workspace.viewer = ObjToHTML(state.program.file[state.workspace.currentFile]);
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
                    content: state.program.file[filePath],
                };
            }
            if (supportExt.includes(state.workspace.currentFile.split(".").pop())) {
                switch (state.workspace.currentFile.split(".").pop()) {
                    case "html":
                        commit("refreshView");
                        break;
                }
            }
        },
    },
};

export default project;
