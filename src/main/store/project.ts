import { ObjToHTML } from "../utils/resolve/html";
import { createProject } from "../utils/project/createProject";
import { loadProject } from "../utils/project/loadProject";
import testProgram from "../../../test/testProgram/project.json";
import { clearCss, getAllCssSelector } from "../utils/resolve/css";
import WebProject from "../project/web/web";
import JSZip from "jszip";

let supportExt = ["html", "htm", "css", "js"];

const project = {
    state() {
        return {
            name: "",
            path: "",
            program: {},
            workspace: {
                openFile: {},
                currentFile: "",
                htmlChooser: "",
                viewer: null,
                css: {},
            },
            project: {},
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
        getHTMLChooserLayer: (state: any) => {
            return state.project[state.name].htmlChoose.split("-");
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
            state.name = "Test";
            state.program = testProgram;
        },
        chooseElement(state: any, e: any) {
            state.workspace.htmlChooser = e.element;
            state.project[state.name].htmlChoose = e.element;
        },
        refreshView(state: any) {
            state.workspace.viewer = ObjToHTML(state.program.files[state.workspace.currentFile]);
            state.workspace.css = getAllCssSelector();
        },
        setInstance: (state: any, ins: any) => {
            state.project[state.name] = ins;
        },
    },
    actions: {
        createProject({ state, getters, dispatch }) {
            let instance = new WebProject();
            instance.init(state.name, "Amatke31");
            instance.loadWithTemplate();
            getters.getInstance = instance;
            return new Promise((resolve) => {
                createProject(state, (result: any) => {
                    if (result && result.code == 200) {
                        state.program = result.program;
                        dispatch("openFile", "index.html");
                    }
                    resolve(result);
                });
            });
        },
        loadProject({ state, dispatch, commit }) {
            clearCss();
            return new Promise((resolve) => {
                loadProject(state, (result: any) => {
                    let instance = new WebProject();
                    instance.init(state.name, "Amatke31");
                    let testzip = new JSZip();
                    testzip.file("project.json", JSON.stringify(result.program));
                    instance.loadProjectFromFile(testzip);
                    commit("setInstance", instance);
                    state.program = result.program;
                    dispatch("openFile", "index.html");
                    resolve(result);
                });
            });
        },
        loadTestProject({ state, dispatch, commit }) {
            let instance = new WebProject();
            instance.init(state.name, "Amatke31");
            let testzip = new JSZip();
            testzip.file("project.json", JSON.stringify(testProgram));
            instance.loadProjectFromFile(testzip);
            commit("setInstance", instance);
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
                    content: state.program.files[filePath],
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
        refreshViewWithCode({ state, commit }, code: any) {
            state.workspace.openFile[state.workspace.currentFile].content = code;
            commit("refreshView");
        },
        unrender() {},
    },
};

export default project;
