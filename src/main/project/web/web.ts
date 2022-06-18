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
        this.refreshAttr();
    }

    addElement(element: string): void {
        this._addElement(this.currentOpenFile, this.htmlChoose.split("-"), 2, element);
        this.refreshViewer();
        this.refreshChooser();
    }
    private _addElement(obj: any, path: any, layer: number, element: any) {
        if (path.length == 2) {
        } else if (path.length == layer) {
            let next = obj;
            if (!next.children) {
                next.children = [];
            }
            next.children.push({ element });
        } else {
            this._addElement(obj.children[Number(path[layer])], path, layer + 1, element);
        }
    }

    removeElement(): void {
        this._removeElement(this.currentOpenFile, this.htmlChoose.split("-"), 2);
        this.refreshViewer();
        this.refreshChooser();
    }
    private _removeElement(obj: any, path: any, layer: number) {
        if (path.length == 2) {
        } else if (path.length == layer + 1) {
            let next = obj;
            const last = path.pop();
            this.htmlChoose = this.htmlChoose.slice(0, this.htmlChoose.length - last.length - 1);
            next.children = arrRemove(last, next.children);
        } else {
            this._removeElement(obj.children[Number(path[layer])], path, layer + 1);
        }
    }

    get getAttribute() {
        const out = this._getAttribute(this.currentOpenFile, this.htmlChoose.split("-"), 2);
        return out;
    }
    private _getAttribute(obj: any, path: any, layer: number) {
        if (path.length == 2) {
            return obj;
        } else if (path.length == layer) {
            return obj;
        } else {
            return this._getAttribute(obj.children[Number(path[layer])], path, layer + 1);
        }
    }

    setAttribute(e: any) {
        this._setAttribute(this.currentOpenFile, this.htmlChoose.split("-"), 2, e);
        this.refreshViewer();
    }
    private _setAttribute(obj: any, path: any, layer: number, changeAttr: any) {
        if (path.length == 2) {
        } else if (path.length == layer) {
            let next = obj;
            next[changeAttr.changeAttr] = changeAttr.value;
            if (changeAttr.changeAttr == "elementName") {
                this.refreshChooser();
            }
        } else {
            this._setAttribute(obj.children[Number(path[layer])], path, layer + 1, changeAttr);
        }
    }

    delAttribute(e: any) {
        this._delAttribute(this.currentOpenFile, this.htmlChoose.split("-"), 2, e);
    }
    private _delAttribute(obj: any, path: any, layer: number, changeAttr: any) {
        if (path.length == 2) {
        } else if (path.length == layer) {
            let next = obj;
            console.log(next)
            delete next[changeAttr.changeAttr];
        } else {
            this._delAttribute(obj.children[Number(path[layer])], path, layer + 1, changeAttr);
        }
    }

    setAttributeT(e: any) {
        this._setAttributeT(this.currentOpenFile, this.htmlChoose.split("-"), 2, e);
    }
    private _setAttributeT(obj: any, path: any, layer: number, changeAttr: any) {
        if (path.length == 2) {
        } else if (path.length == layer) {
            let next = obj;
            next[changeAttr.value] = next[changeAttr.changeAttr];
            delete next[changeAttr.changeAttr];
        } else {
            this._setAttributeT(obj.children[Number(path[layer])], path, layer + 1, changeAttr);
        }
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
        this.event.emit("refreshAttr", this.getAttribute, this.htmlChoose);
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
                                event: this.event,
                                setAttribute: (e: any) => {
                                    this.setAttribute(e);
                                },
                                setAttributeT: (e: any) => {
                                    this.setAttributeT(e);
                                },
                                delAttribute: (e: any) => {
                                    this.delAttribute(e);
                                },
                            },
                        },
                    ],
                },
            ],
        };
    }
}

export default WebProject;
