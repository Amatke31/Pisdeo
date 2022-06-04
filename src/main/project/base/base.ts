import JSZip from "jszip";

class Project {
    // info
    name = "";
    author = "";
    files = {};
    mainfile = "";

    // Solutioin
    static solutionName = "";
    type: any = "";
    static type = "";

    // api
    api: any = null;
    constructor(api: any) {
        this.api = api;
        this.init();
    }

    // workspace
    openedFile = {};
    _viewer = {};
    _currentOpenFile = "";
    get currentOpenFile() {
        return this.openedFile[this._currentOpenFile];
    }
    set viewer(v) {
        this._viewer[this._currentOpenFile] = v;
    }
    get viewer() {
        return this._viewer[this._currentOpenFile];
    }

    // state
    inited = false;
    init(): void {
        this.onInit();
        this.inited = true;
    }

    onInit(): void {}

    /**
     * load file from zip
     * @param content JSZip Class
     */
    async loadProjectFromFile(content: JSZip): Promise<void> {
        return new Promise(async (resolve) => {
            let info = JSON.parse(await content.files["project.json"].async("text"));
            if (
                !(
                    (this.type.includes(info.type) && Array.isArray(this.type)) ||
                    (this.type == info.type && this.type == "string")
                )
            ) {
                console.error("Project type not match");
                return;
            }
            this.name = info.name;
            this.author = info.author;
            this.files = info.files;
            this.mainfile = info.mainfile;
            this.openFile(info.mainfile);
            resolve();
        });
    }

    /**
     * create project with template
     */
    loadWithTemplate(): void {}

    openFile(filePath: string): void {
        let exist = true;
        if (!this.openedFile[filePath]) {
            exist = false;
            this.openedFile[filePath] = this.files[filePath];
        }
        this._currentOpenFile = filePath;
        this.onOpenFile(filePath, this.files[filePath], exist);
    }

    onOpenFile(filePath: string, content: any, exist: boolean): void {}

    setFile(filePath: string, content: any) {
        this.files[filePath] = content;
    }

    get info(): object | string {
        return this.inited
            ? {
                  name: this.name,
                  author: this.author,
                  type: this.type,
              }
            : "Project not initialized";
    }

    registerComponent(component: Object, props: any): void {
        if (this.api.component) {
            this.api.component(component, props);
        } else {
            console.error("component api not found");
        }
    }

    /**
     * Export JSZip Class
     * @returns JSZip
     */
    get save(): JSZip {
        let nwdp = new JSZip();
        nwdp.file("project.json", JSON.stringify({ ...(<object>this.info), file: this.files }));
        return nwdp;
    }
}

export default Project;
