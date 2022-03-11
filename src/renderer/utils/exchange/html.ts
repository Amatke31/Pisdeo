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

export { ObjToHTML, analysisObj };
