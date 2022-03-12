let noChange = ["element", "children", "css", "script"];

function ObjToHTML(obj: any) {
    let out: string = "";
    out = analysisObj(obj);
    return out;
}

function analysisObj(obj: any): string {
    let out: string = "";
    out += `<${obj.element}`;
    for (let ref in obj) {
        if (noChange.indexOf(ref) == -1) out += ` ${ref}="${obj[ref]}"`;
    }
    out += `>`;
    for (let child in obj.children) {
        out += analysisObj(obj.children[child]);
    }
    out += `</${obj.element}>`;
    return out;
}

function ObjToElement(obj: any) {
    let out: Element = analysisObjWithElement(obj);
    return out;
}

function analysisObjWithElement(obj: any): Element {
    let out: Element = document.createElement(obj.element);
    for (let ref in obj) {
        if (noChange.indexOf(ref) == -1) out.setAttribute(ref, obj[ref]);
    }
    for (let child in obj.children) {
        out.appendChild(analysisObjWithElement(obj.children[child]));
    }
    return out;
}

export { ObjToHTML, analysisObj, ObjToElement, analysisObjWithElement };
