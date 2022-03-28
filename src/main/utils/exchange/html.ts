let noChange = ["element", "children", "css", "script", "text"];
let noCssChange = ["class"];

function ObjToHTML(obj: any) {
    let out: string = "";
    out = analysisObj(obj);
    return out;
}

function analysisObj(obj: any): string {
    let out: string = "";
    if (obj.element == ".text") {
        out += obj.text;
    } else {
        out += `<${obj.element}`;
        for (let ref in obj) {
            if (!noChange.includes(ref)) out += ` ${ref}="${obj[ref]}"`;
        }
        out += `>`;
        for (let ref in obj) {
            if (noChange.includes(ref)) {
                switch (ref) {
                    case "css":
                        out += ObjToCSS(obj["css"]);
                        break;
                }
            }
        }
        for (let child in obj.children) {
            out += analysisObj(obj.children[child]);
        }
        out += `</${obj.element}>`;
    }
    return out;
}

function ObjToElement(obj: any) {
    let out: Element = analysisObjWithElement(obj);
    return out;
}

function analysisObjWithElement(obj: any): HTMLElement {
    let out: HTMLElement = document.createElement(obj.element);
    if (obj.element == ".text") {
        out.innerText = obj.text;
    } else {
        for (let ref in obj) {
            if (!noChange.includes(ref)) out.setAttribute(ref, obj[ref]);
        }
        for (let ref in obj) {
            if (noChange.includes(ref)) {
                switch (ref) {
                }
            }
        }
        for (let child in obj.children) {
            out.appendChild(analysisObjWithElement(obj.children[child]));
        }
    }
    return out;
}

function ObjToCSS(obj: any) {
    let out: string = "";
    obj.forEach((obj: any) => {
        out += obj.class;
        out += "{";
        for (let ref in obj) {
            if (!noCssChange.includes(ref)) out += `${ref}:${obj[ref]};`;
        }
        out += "}";
    });
    return out;
}

function addElement(obj: any, path: any, layer: number, changeAttr: any) {
    if (path.length == 2) {
        return obj;
    } else if (path.length == layer) {
        let next = obj
        next[changeAttr.changeAttr] = changeAttr[changeAttr.changeAttr]
        return next;
    } else {
        let out = obj
        out.children[Number(path[layer])] = addElement(
            obj.children[Number(path[layer])],
            path,
            layer + 1,
            changeAttr
        );
        return out
    }
}

export {
    ObjToHTML,
    analysisObj,
    ObjToElement,
    analysisObjWithElement,
    ObjToCSS,
    addElement
};
