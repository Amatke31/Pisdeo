import JSZip from "jszip";

class Project {
    // info
    name = "";
    author = "";
    files = {};
    mainfile = "";
    type = "";

    // Solutioin
    static solutionName = "";
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
    set currentOpenFile(v) {
        this.openedFile[this._currentOpenFile] = v;
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
            let info = JSON.parse(await content.files["info.json"].async("text"));
            let project = JSON.parse(await content.files["project.json"].async("text"));
            this.name = info.name;
            this.author = info.author;
            this.files = project.files;
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

    /**
     * Export JSZip Class
     * @returns JSZip
     */
    get save(): JSZip {
        let pisp = new JSZip();
        pisp.file("info.json", JSON.stringify({ ...(<object>this.info) }));
        pisp.file("project.json", JSON.stringify({ files: this.files }));
        return pisp;
    }

    /**
     * Render Workspace
     * @returns any
     */
    renderWorkspace(): any {
        return [];
    }
}

export default Project;
