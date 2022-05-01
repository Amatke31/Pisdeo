let allCssSelector = {};

function ObjToCSS(obj: any) {
    let out: string = "";
    obj.forEach((obj: any) => {
        out += obj.class;
        out += "{";
        obj.content.forEach((i) => {
            out += `${i.label}:${i.value};`;
        });
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
