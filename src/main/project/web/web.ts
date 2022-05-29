import { ObjToElement } from "@/main/utils/resolve/html";
import JSZip from "jszip";
import testProgram from "../../../../test/testProgram/project.json";
import Project from "../base/base";

class WebProject extends Project {
    type = "website";

    onOpenFile(filePath: string): void {
        const content = this.files[filePath];
        this.viewer = ObjToElement(content);
        console.log(this.viewer);
    }

    async loadProjectFromFile(content: JSZip): Promise<void> {
        let info = JSON.parse(await content.files["project.json"].async("text"));
        if (this.type != info.type) {
            throw new Error("Project type not match");
        }
        this.name = info.name;
        this.author = info.author;
        this.files = info.files;
        this.mainfile = info.mainfile;
        this.openFile(info.mainfile);
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

let test = new WebProject();
test.init("WebProject", "Amatke31");
// test.loadWithTemplate();
let testzip = new JSZip();
testzip.file("project.json", JSON.stringify(testProgram));
test.loadProjectFromFile(testzip);
