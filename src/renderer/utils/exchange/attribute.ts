function getAttribute(obj: any, path: any, layer: number) {
    if (path.length == 2) {
        return obj
    }
    else if (path.length == layer + 1) {
        return obj.children[Number(path[layer])];
    } else {
        return getAttribute(obj.children[Number(path[layer])], path, layer + 1);
    }
}

export { getAttribute };
