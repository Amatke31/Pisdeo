import { ObjToElement } from "@/main/utils/resolve/html";
import Project from "../base/base";

class WebProject extends Project {
    type: any = ["website", "web"];
    static type: any = ["website", "web"];
    supportExt: Array<string> = ["html", "htm", "css", "js"];

    constructor(api: any) {
        super(api);
    }

    private _htmlChoose: Object = {};
    get htmlChoose(): string {
        return this._htmlChoose[this.currentOpenFile];
    }
    set htmlChoose(v) {
        this._htmlChoose[this.currentOpenFile] = v;
    }

    onOpenFile(filePath: string, content: any, exist: boolean): void {
        const ext = filePath.split(".")[1];
        if (this.supportExt.includes(ext)) {
            switch (ext) {
                case "html":
                    if (!exist) {
                        this.viewer[filePath] = ObjToElement(content);
                        this.htmlChoose = "layer-0";
                    }
                    break;
            }
        }
    }

    loadWithTemplate(): void {
        this.setFile("index.html", {
            element: "html",
            children: [
                {
                    element: "head",
                },
                {
                    element: "body",
                },
            ],
        });
        this.openFile("index.html");
    }
}

export default WebProject;

// let test = new WebProject();
// test.init("WebProject", "Amatke31");
// // test.loadWithTemplate();
// let testzip = new JSZip();
// testzip.file("project.json", JSON.stringify(testProgram));
// test.loadProjectFromFile(testzip);
