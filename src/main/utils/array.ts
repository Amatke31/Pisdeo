const arrRemove = function(it: any, arr: Array<any>) {
    it = Number(it);
    if (!arr || arr.length == 0) {
        return false;
    }
    const a = arr.slice(0, it);
    const b = arr.slice(it + 1, arr.length);
    return a.concat(b);
};

export { arrRemove };
