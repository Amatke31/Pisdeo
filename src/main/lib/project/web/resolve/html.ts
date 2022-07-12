import { ObjToCSS, clearCss } from "./css";
const noChange = ["element", "children", "css", "script", "text", "elementName"];
const singleElemenet = ["img", "input", "br"];

function ObjToElement(obj: any) {
    let out: HTMLElement = <HTMLElement>analysisObjWithElement(obj);
    return out;
}

function analysisObjWithElement(obj: any): HTMLElement | string {
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
                    ? out.appendChild(<HTMLElement>analysisObjWithElement(obj.children[child]))
                    : (out.innerText = <string>analysisObjWithElement(obj.children[child]));
            }
        }
        return out;
    }
}

export { ObjToElement, analysisObjWithElement };