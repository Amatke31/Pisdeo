import { createProject } from "../utils/project/createProject";

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
    },
    actions: {
        createProject({ state, commit }) {
            return new Promise((resolve) => {
                createProject(state, (result: any) => {
                    resolve(result)
                });
            });
        },
    },
};

export default project;
