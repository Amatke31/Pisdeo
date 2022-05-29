import { ObjToElement } from "@/main/utils/resolve/html";
import JSZip from "jszip";
import testProgram from "../../../../test/testProgram/project.json";
import Project from "../base/base";

class WebProject extends Project {
    type = "website";
    supportExt = ["html", "htm", "css", "js"];

    onOpenFile(filePath: string, content: any): void {
        const ext = filePath.split(".")[1];
        if (this.supportExt.includes(ext)) {
            switch (ext) {
                case "html":
                    this.viewer[filePath] = ObjToElement(content);
                    console.log(this.viewer);
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

let test = new WebProject();
test.init("WebProject", "Amatke31");
// test.loadWithTemplate();
let testzip = new JSZip();
testzip.file("project.json", JSON.stringify(testProgram));
test.loadProjectFromFile(testzip);
