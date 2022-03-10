import { createProject } from "../utils/project/createProject";
import { loadProject } from "../utils/project/loadProject";

const project = {
    state() {
        return {
            name: "",
            program: {},
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
    },
};

export default project;
