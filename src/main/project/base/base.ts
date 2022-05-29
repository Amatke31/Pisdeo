import JSZip from "jszip";

class Project {
    // info
    name = "";
    author = "";
    type = "";
    files = {};
    mainfile = "";

    // workspace
    openedFile = {};
    viewer: HTMLElement | null = null;

    // state
    inited = false;

    init(name: string, author: string): void {
        this.name = name;
        this.author = author;
        this.onInit();
        this.inited = true;
    }

    onInit(): void {}

    /**
     * load file from zip
     * @param content JSZip Class
     */
    loadProjectFromFile(content: JSZip): void {}

    /**
     * create project with template
     */
    loadWithTemplate(): void {}

    openFile(filePath: string): void {
        this.openedFile[filePath] = this.files[filePath];
        this.onOpenFile(filePath);
    }

    onOpenFile(filePath: string): void {}

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
    get export(): JSZip {
        let nwdp = new JSZip();
        nwdp.file("project.json", JSON.stringify({ ...(<object>this.info), file: this.files }));
        return nwdp;
    }
}

export default Project;
