import { ObjToElement } from "@/main/utils/resolve/html";
import Project from "../base/base";
import viewer from "./viewer.vue";
import htmlChooser from "./html-chooser.vue";
import attributeSet from "./attribute-set.vue";

class WebProject extends Project {
    static solutionName = "Website";
    static solutionDescription = `A solution for creating and editing web pages.`;
    type: any = ["website"];
    static type: any = ["website"];
    supportExt: Array<string> = ["html", "htm", "css", "js"];

    constructor(api: any) {
        super(api);
        this.api = api;
    }

    private _htmlChoose: Object = {};
    get htmlChoose(): string {
        return this._htmlChoose[this._currentOpenFile];
    }
    set htmlChoose(v) {
        this._htmlChoose[this._currentOpenFile] = v;
    }
    private analysisAttr(obj: any, path: any, layer: number) {
        if (path.length == 2) {
            return obj;
        } else if (path.length == layer) {
            return obj;
        } else {
            return this.analysisAttr(obj.children[Number(path[layer])], path, layer + 1);
        }
    }
    get getAttribute() {
        const out = this.analysisAttr(this.currentOpenFile, this.htmlChoose.split("-"), 2);
        console.log(out);
        return out;
    }
    get viewerText(): HTMLElement {
        return this.viewer.innerHTML;
    }

    onOpenFile(filePath: string, content: any, exist: boolean): void {
        const ext = filePath.split(".")[1];
        if (this.supportExt.includes(ext)) {
            this._currentOpenFile = filePath;
            switch (ext) {
                case "html":
                    if (!exist) {
                        this.viewer = ObjToElement(content);
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

    renderWorkspace(): any {
        this.registerComponent(htmlChooser, {
            html: this.currentOpenFile,
            getAttribute: () => {
                return this.getAttribute;
            },
            chooseElement: (e: any) => {
                this.htmlChoose = e;
            },
        });
        this.registerComponent(viewer, { viewer: this.viewerText });
        // this.registerComponent(attributeSet);
    }
}

export default WebProject;
