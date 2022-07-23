import { ObjToElement } from "./resolve/html";
import Project from "../base/base";
import viewer from "./view/viewer.vue";
import htmlChooser from "./view/html-chooser.vue";
import attributeSet from "./view/attribute-set.vue";
import { arrRemove } from "@/main/utils/array";
import EventEmitter from "events";

class WebProject extends Project {
    static solutionName = "Website";
    static solutionId = "org.pisdeo.website";
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
    }
    private _addElement(obj: any, path: any, layer: number, element: any) {
        if (path.length == 2) {
        } else if (path.length == layer) {
            let next = obj;
            if (!next.children) {
                next.children = [];
            }
            next.children.push({ element });
            this.refreshChooser();
            this.htmlChoose = `${this.htmlChoose}-${next.children.length.toString() - 1}`;
            this.refreshViewer();
        } else {
            this._addElement(obj.children[Number(path[layer])], path, layer + 1, element);
        }
    }

    removeElement(): void {
        this._removeElement(this.currentOpenFile, this.htmlChoose.split("-"), 2);
    }
    private _removeElement(obj: any, path: any, layer: number) {
        if (path.length == 2) {
        } else if (path.length == layer + 1) {
            let next = obj;
            const last = path.pop();
            this.htmlChoose = this.htmlChoose.slice(0, this.htmlChoose.length - last.length - 1);
            next.children = arrRemove(last, next.children);
            this.refreshViewer();
            this.refreshChooser();
            this.refreshAttr();
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

    setAttribute(e: any, noRefresh: boolean = false) {
        this._setAttribute(this.currentOpenFile, this.htmlChoose.split("-"), 2, e, noRefresh);
    }
    private _setAttribute(obj: any, path: any, layer: number, changeAttr: any, noRefresh: boolean) {
        if (path.length == 2) {
        } else if (path.length == layer) {
            let next = obj;
            next[changeAttr.changeAttr] = changeAttr.value;
            if (changeAttr.changeAttr == "elementName" || changeAttr.changeAttr == "element") {
                this.refreshChooser();
            }
            this.refreshAttr();
            if (!noRefresh) {
                this.refreshViewer();
            }
        } else {
            this._setAttribute(
                obj.children[Number(path[layer])],
                path,
                layer + 1,
                changeAttr,
                noRefresh
            );
        }
    }

    delAttribute(e: any, noRefresh: boolean = false) {
        this._delAttribute(this.currentOpenFile, this.htmlChoose.split("-"), 2, e, noRefresh);
    }
    private _delAttribute(obj: any, path: any, layer: number, changeAttr: any, noRefresh: boolean) {
        if (path.length == 2) {
        } else if (path.length == layer) {
            let next = obj;
            delete next[changeAttr.changeAttr];
            this.refreshAttr();
            if (!noRefresh) {
                this.refreshViewer();
            }
        } else {
            this._delAttribute(
                obj.children[Number(path[layer])],
                path,
                layer + 1,
                changeAttr,
                noRefresh
            );
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
            this.refreshAttr();
            this.refreshViewer();
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
            grid_y: 1,
            components: [
                {
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
                    position_x: 1,
                    position_y: 1,
                },
                {
                    component: viewer,
                    props: {
                        getViewer: () => {
                            return this.viewerText;
                        },
                        event: this.event,
                    },
                    position_x: 2,
                    position_y: 1,
                    cols: 7,
                },
                {
                    component: attributeSet,
                    props: {
                        event: this.event,
                        setAttribute: (e: any, noRefresh: boolean = false) => {
                            this.setAttribute(e, noRefresh);
                        },
                        setAttributeT: (e: any) => {
                            this.setAttributeT(e);
                        },
                        delAttribute: (e: any) => {
                            this.delAttribute(e);
                        },
                    },
                    position_x: 3,
                    position_y: 1,
                    cols: 3,
                },
            ],
        };
    }
}

export default WebProject;
