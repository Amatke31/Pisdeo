let allCssSelector = {};

function ObjToCSS(obj: any, layer: string) {
    let out: string = "";
    obj.forEach((obj: any) => {
        out += obj.class;
        out += "{";
        obj.content.forEach((i: any) => {
            out += `${i.label}:${i.value};`;
        });
        out += "}";
        allCssSelector[obj.class] = obj;
        allCssSelector[obj.class].layer = layer;
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
