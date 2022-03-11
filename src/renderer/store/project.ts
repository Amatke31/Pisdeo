import { createProject } from "../utils/project/createProject";
import { loadProject } from "../utils/project/loadProject";

const project = {
    state() {
        return {
            name: "",
            program: {
                name: "",
                author: "",
                file: {}
            },
            buffer: {
                openFile: [],
                currentFile: "",
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
        beforeLoadTestProject(state: any, info: any) {
            state.program = state.testProgram;
            state.buffer.currentFile = "index.html"
        },
        openFile(state: any, page: string) {},
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
            return new Promise((resolve) => {
                resolve({ code: 200 });
            });
        },
    },
};

export default project;
