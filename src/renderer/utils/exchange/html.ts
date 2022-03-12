let noChange = ["element", "children", "css", "script", "text"];

function ObjToHTML(obj: any) {
    let out: string = "";
    out = analysisObj(obj);
    return out;
}

function analysisObj(obj: any): string {
    let out: string = "";
    out += `<${obj.element}`;
    for (let ref in obj) {
        if (!noChange.includes(ref)) out += ` ${ref}="${obj[ref]}"`;
    }
    out += `>`;
    for (let ref in obj) {
        if (noChange.includes(ref)) {
            switch (ref) {
                case "text":
                    out += obj[ref];
                    break;
            }
        }
    }
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

function analysisObjWithElement(obj: any): HTMLElement {
    let out: HTMLElement = document.createElement(obj.element);
    for (let ref in obj) {
        if (!noChange.includes(ref)) out.setAttribute(ref, obj[ref]);
    }
    for (let ref in obj) {
        if (noChange.includes(ref)) {
            switch (ref) {
                case "text":
                    out.innerText = obj[ref]
            }
        }
    }
    for (let child in obj.children) {
        out.appendChild(analysisObjWithElement(obj.children[child]));
    }
    return out;
}

export { ObjToHTML, analysisObj, ObjToElement, analysisObjWithElement };
