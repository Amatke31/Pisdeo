const noCssChange = ["class"];

let allCssSelector = {};

function ObjToCSS(obj: any) {
    let out: string = "";
    obj.forEach((obj: any) => {
        out += obj.class;
        out += "{";
        for (let ref in obj) {
            if (!noCssChange.includes(ref)) out += `${ref}:${obj[ref]};`;
        }
        out += "}";
        allCssSelector[obj.class] = obj;
    });
    return out;
}

function getAllCssSelector() {
    return allCssSelector;
}

function clearCss() {
    allCssSelector = {};
}

export { ObjToCSS, getAllCssSelector, clearCss };
