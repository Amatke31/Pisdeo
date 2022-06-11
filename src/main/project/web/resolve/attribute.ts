function getAttribute(obj: any, path: any, layer: number) {
    if (path.length == 2) {
        return obj;
    } else if (path.length == layer) {
        return obj;
    } else {
        return getAttribute(obj.children[Number(path[layer])], path, layer + 1);
    }
}

function setAttribute(obj: any, path: any, layer: number, changeAttr: any) {
    if (path.length == 2) {
        return obj;
    } else if (path.length == layer) {
        let next = obj;
        next[changeAttr.changeAttr] = changeAttr.value;
        return next;
    } else {
        let out = obj;
        out.children[Number(path[layer])] = setAttribute(
            obj.children[Number(path[layer])],
            path,
            layer + 1,
            changeAttr
        );
        return out;
    }
}

function delAttribute(obj: any, path: any, layer: number, changeAttr: any) {
    if (path.length == 2) {
        return obj;
    } else if (path.length == layer) {
        let next = obj;
        delete next[changeAttr.changeAttr];
        return next;
    } else {
        let out = obj;
        out.children[Number(path[layer])] = delAttribute(
            obj.children[Number(path[layer])],
            path,
            layer + 1,
            changeAttr
        );
        return out;
    }
}

function setAttributeT(obj: any, path: any, layer: number, changeAttr: any) {
    if (path.length == 2) {
        return obj;
    } else if (path.length == layer) {
        let next = obj;
        next[changeAttr.value] = next[changeAttr.changeAttr];
        delete next[changeAttr.changeAttr];
        return next;
    } else {
        let out = obj;
        out.children[Number(path[layer])] = setAttributeT(
            obj.children[Number(path[layer])],
            path,
            layer + 1,
            changeAttr
        );
        return out;
    }
}

export { getAttribute, setAttribute, delAttribute, setAttributeT };
