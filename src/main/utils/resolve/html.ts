const noChange = ["element", "children", "css", "script", "text", "elementName"];
const noCssChange = ["class"];
const singleElemenet = ["img", "input", "br"];

const arrRemove = function(it: any, arr: Array<any>) {
    it = Number(it);
    if (!arr || arr.length == 0) {
        return false;
    }
    const a = arr.slice(0, it);
    const b = arr.slice(it + 1, arr.length - a.length);
    return a.concat(b);
};

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
        if (!singleElemenet.includes(obj.element)) {
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
                        out.innerHTML = ObjToCSS(obj["css"]);
                        break;
                }
            }
        }
        if (!singleElemenet.includes(obj.element)) {
            for (let child in obj.children) {
                obj.children[child].element !== ".text"
                    ? out.appendChild(<HTMLElement>analysisObjWithElement(obj.children[child]))
                    : out.innerText == analysisObjWithElement(obj.children[child]);
            }
        }
        return out;
    }
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

function addElement(obj: any, path: any, layer: number, element: any) {
    if (path.length == 2) {
        return obj;
    } else if (path.length == layer) {
        let next = obj;
        if (!next.children) {
            next.children = [];
        }
        next.children.push(element);
        return next;
    } else {
        let out = obj;
        out.children[Number(path[layer])] = addElement(
            obj.children[Number(path[layer])],
            path,
            layer + 1,
            element
        );
        return out;
    }
}

function removeElement(obj: any, path: any, layer: number) {
    if (path.length == 2) {
        return obj;
    } else if (path.length == layer + 1) {
        let next = obj;
        next.children = arrRemove(path.pop(), next.children);
        return next;
    } else {
        let out = obj;
        out.children[Number(path[layer])] = removeElement(
            obj.children[Number(path[layer])],
            path,
            layer + 1
        );
        return out;
    }
}

export {
    ObjToHTML,
    analysisObj,
    ObjToElement,
    analysisObjWithElement,
    ObjToCSS,
    addElement,
    removeElement,
};
