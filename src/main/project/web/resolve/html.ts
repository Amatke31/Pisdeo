import { ObjToCSS, clearCss } from "./css";
const noChange = ["element", "children", "css", "script", "text", "elementName"];
const singleElemenet = ["img", "input", "br"];

function ObjToHTML(obj: any) {
    clearCss();
    let out: string = "";
    out = analysisObj(obj, "layer-0");
    return out;
}

function analysisObj(obj: any, layer: string): string {
    let out: string = "";
    if (obj.element == ".text") {
        out += obj.text;
    } else {
        out += `<${obj.element}`;
        for (let ref in obj) {
            if (!noChange.includes(ref)) {
                if (Array.isArray(obj[ref])) {
                    out += ` ${ref}="`;
                    obj[ref].forEach((item: string, key: number) => {
                        out += item;
                        if (key != obj[ref].length - 1) {
                            out += " ";
                        }
                    });
                    out += `"`;
                } else {
                    out += ` ${ref}="${obj[ref]}"`;
                }
            }
        }
        if (!singleElemenet.includes(obj.element)) {
            out += `>`;
            for (let ref in obj) {
                if (noChange.includes(ref)) {
                    switch (ref) {
                        case "css":
                            out += ObjToCSS(obj["css"], layer);
                            break;
                    }
                }
            }
            let ans = 0;
            for (let child in obj.children) {
                out += analysisObj(obj.children[child], `${layer}-${ans}`);
                ans++;
            }
            out += `</${obj.element}>`;
        } else {
            out += "/>";
        }
    }
    return out;
}

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
            if (!noChange.includes(ref)) out.setAttribute(ref, obj[ref]);
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

export { ObjToHTML, analysisObj, ObjToElement, analysisObjWithElement };
