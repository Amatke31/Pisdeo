import { ObjToCSS, clearCss } from "../css/selector";
import { arrRemove } from "@/main/utils/array";
const noChange = ["element", "children", "css", "script", "text", "elementName"];
const singleElemenet = ["img", "input", "br"];

function ObjToElement(obj: any) {
    let out: HTMLElement = <HTMLElement>analysisObj(obj);
    return out;
}

function analysisObj(obj: any): HTMLElement | string {
    clearCss();
    if (obj.element == ".text") {
        return obj.text;
    } else {
        let out: HTMLElement = document.createElement(obj.element);
        for (let ref in obj) {
            if (!noChange.includes(ref)) {
                out.setAttribute(ref, Array.isArray(obj[ref]) ? obj[ref].join(" ") : obj[ref]);
            }
        }
        for (let ref in obj) {
            if (noChange.includes(ref)) {
                switch (ref) {
                    case "css":
                        out.innerHTML = ObjToCSS(obj["css"], "");
                        break;
                }
            }
        }
        if (!singleElemenet.includes(obj.element)) {
            for (let child in obj.children) {
                obj.children[child].element !== ".text"
                    ? out.appendChild(<HTMLElement>analysisObj(obj.children[child]))
                    : (out.innerText = <string>analysisObj(obj.children[child]));
            }
        }
        return out;
    }
}

class ElementControl {
    currentOpenFile = null;
    htmlChoose = "layer-0";
    refreshChooser = () => {};
    refreshViewer = () => {};
    refreshAttr = () => {};
    constructor(that: any) {
        this.currentOpenFile = that.currentOpenFile;
        this.htmlChoose = that.htmlChoose;
        this.refreshChooser = that.refreshChooser;
        this.refreshViewer = that.refreshViewer;
        this.refreshAttr = that.refreshAttr;
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
            next.children.push(element);
            this.refreshChooser();
            setTimeout(() => {
                this.htmlChoose = `${this.htmlChoose}-${next.children.length.toString() - 1}`;
            }, 1);
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
            setTimeout(() => this.refreshChooser(), 1);
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
}

export { ObjToElement, ElementControl };
