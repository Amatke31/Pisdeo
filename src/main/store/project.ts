import { defineStore } from "pinia";
import WebProject from "../project/web/web";

class ProjectSolution {
    allSolution: Object = {};
    _solution: Object = {};

    constructor() {}

    getSolution(projectType: string): any {
        return this._solution[projectType];
    }

    addSolution(project: any): void {
        this.allSolution[project.solutionName] = project;
        let type: Array<string> = [];
        if (typeof project.type == "string") {
            type = [project.type];
        } else {
            type = project.type;
        }
        type.forEach((type: string) => {
            if (this._solution.hasOwnProperty(type)) {
                this._solution[type].push({
                    solutionName: project.solutionName,
                    instance: project,
                });
            } else {
                this._solution[type] = [{ solutionName: project.solutionName, instance: project }];
            }
        });
    }
}

const solution = new ProjectSolution();
solution.addSolution(WebProject);

const project = defineStore("project", {
    state: () => {
        return {
            project: [] as any,
        };
    },
    getters: {},
    actions: {
        async findSolution(payload: any): Promise<any> {
            return new Promise(async (resolve) => {
                const content = payload.nwdp;
                let info = JSON.parse(await content.files["project.json"].async("text"));
                let preSolution: Array<any> = [];
                solution.getSolution(info.type).forEach((project: any) => {
                    preSolution.push({
                        solutionName: project.solutionName,
                        solutionDescription: project.instance.solutionDescription,
                    });
                });
                resolve({ allSolution: preSolution, info });
            });
        },
        async loadProject(payload: any): Promise<void> {
            let project = { ...payload };
            this.project.push(project);
            return new Promise((resolve) => {
                resolve();
            });
        },
    },
});

export default project;
export { solution };
