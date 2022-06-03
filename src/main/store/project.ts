import { loadProject } from "../utils/project/loadProject";
import testProgram from "../../../test/testProgram/project.json";
import WebProject from "../project/web/web";
import JSZip from "jszip";

let supportExt = ["html", "htm", "css", "js"];

class ProjectSolution {
    solution: Object = {};

    constructor() {}

    getSolution(projectType: string): any {
        return this.solution[projectType];
    }

    addSolution(project: any): void {
        let type: Array<string> = [];
        if (typeof project.type == "string") {
            type = [project.type];
        } else {
            type = project.type;
        }
        type.forEach((type: string) => {
            if (this.solution.hasOwnProperty(type)) {
                this.solution[type].push(project);
            } else {
                this.solution[type] = [project];
            }
        });
    }
}

const solution = new ProjectSolution();
solution.addSolution(WebProject);

const project = {
    state() {
        return {
            project: {},
        };
    },
    getters: {
        currentFileContent: (state: any) => {
            return state.workspace.openFile[state.workspace.currentFile].content;
        },
    },
    mutations: {
        setInstance: (state: any, ins: any) => {
            state.project[state.name] = ins;
        },
    },
    actions: {
        loadProject({ state, dispatch, commit }) {
            return new Promise((resolve) => {
                loadProject(state, (result: any) => {
                    let instance = new WebProject({});
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
            let instance = new WebProject({});
            let testzip = new JSZip();
            testzip.file("project.json", JSON.stringify(testProgram));
            instance.loadProjectFromFile(testzip);
            commit("setInstance", instance);
            return new Promise((resolve) => {
                resolve({ code: 200 });
            });
        },
        unrender() {},
    },
};

export default project;
