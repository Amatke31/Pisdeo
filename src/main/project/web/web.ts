import { ObjToElement } from "./resolve/html";
import Project from "../base/base";
import viewer from "./view/viewer.vue";
import htmlChooser from "./view/html-chooser.vue";
import attributeSet from "./view/attribute-set.vue";
import { arrRemove } from "@/main/utils/array";
import "./workspace.scss";
import EventEmitter from "events";

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

    addElement(element: string): void {
        this.currentOpenFile = this._addElement(
            this.currentOpenFile,
            this.htmlChoose.split("-"),
            2,
            element
        );
        this.refreshViewer();
        this.refreshChooser();
    }
    private _addElement(obj: any, path: any, layer: number, element: any) {
        if (path.length == 2) {
            return obj;
        } else if (path.length == layer) {
            let next = obj;
            if (!next.children) {
                next.children = [];
            }
            next.children.push({ element });
            return next;
        } else {
            let out = obj;
            out.children[Number(path[layer])] = this._addElement(
                obj.children[Number(path[layer])],
                path,
                layer + 1,
                element
            );
            return out;
        }
    }

    removeElement(): void {
        this.currentOpenFile = this._removeElement(
            this.currentOpenFile,
            this.htmlChoose.split("-"),
            2
        );
        this.refreshViewer();
        this.refreshChooser();
    }
    private _removeElement(obj: any, path: any, layer: number) {
        if (path.length == 2) {
            return obj;
        } else if (path.length == layer + 1) {
            let next = obj;
            next.children = arrRemove(path.pop(), next.children);
            return next;
        } else {
            let out = obj;
            out.children[Number(path[layer])] = this._removeElement(
                obj.children[Number(path[layer])],
                path,
                layer + 1
            );
            return out;
        }
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
    private _setAttribute(obj: any, path: any, layer: number, changeAttr: any) {
        if (path.length == 2) {
            return obj;
        } else if (path.length == layer) {
            let next = obj;
            next[changeAttr.changeAttr] = changeAttr.value;
            return next;
        } else {
            let out = obj;
            out.children[Number(path[layer])] = this._setAttribute(
                obj.children[Number(path[layer])],
                path,
                layer + 1,
                changeAttr
            );
            return out;
        }
    }
    get getAttribute() {
        const out = this.analysisAttr(this.currentOpenFile, this.htmlChoose.split("-"), 2);
        return out;
    }
    setAttribute(e: any) {
        this.currentOpenFile = this._setAttribute(
            this.currentOpenFile,
            this.htmlChoose.split("-"),
            2,
            e
        );
        this.refreshViewer();
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

    event = new EventEmitter();
    private refreshAttr() {
        this.event.emit("refreshAttr");
    }
    private refreshChooser() {
        this.event.emit("refreshChooser");
    }
    private refreshViewer() {
        this.viewer = ObjToElement(this.currentOpenFile);
        this.event.emit("refreshViewer");
    }

    renderWorkspace(): any {
        return {
            element: "div",
            attrs: { class: "workspace" },
            isComponent: false,
            children: [
                {
                    element: "div",
                    attrs: { class: "above" },
                    isComponent: false,
                    children: [
                        {
                            isComponent: true,
                            component: htmlChooser,
                            props: {
                                getEL: () => {
                                    return this.currentOpenFile;
                                },
                                getAttribute: () => {
                                    return this.getAttribute;
                                },
                                chooseElement: (e: string) => {
                                    this.htmlChoose = e;
                                },
                                rmElement: () => {
                                    this.removeElement();
                                },
                                addElement: (e: string) => {
                                    this.addElement(e);
                                },
                                event: this.event,
                            },
                        },
                        {
                            isComponent: true,
                            component: viewer,
                            props: {
                                viewer: () => {
                                    return this.viewerText;
                                },
                                event: this.event,
                            },
                        },
                        {
                            isComponent: true,
                            component: attributeSet,
                            props: {
                                getAttribute: () => {
                                    return this.getAttribute;
                                },
                                event: this.event,
                            },
                        },
                    ],
                },
            ],
        };
    }
}

export default WebProject;
