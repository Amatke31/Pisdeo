function Uint8ArrayToString(fileData: Uint8Array) {
    var dataString = "";
    if (fileData && fileData.length) {
        for (var i = 0; i < fileData.length; i++) {
            dataString += String.fromCharCode(fileData[i]);
        }
    }
    return dataString;
}

function stringToUint8Array(str: string) {
    var arr = [] as Array<number>;
    for (var i = 0, j = str.length; i < j; ++i) {
        arr.push(str.charCodeAt(i));
    }

    var tmpUint8Array = new Uint8Array(arr);
    return tmpUint8Array;
}

export default { Uint8ArrayToString, stringToUint8Array };
export { Uint8ArrayToString, stringToUint8Array };
