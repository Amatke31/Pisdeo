import localforage from "localforage";
import { stringToUint8Array, Uint8ArrayToString } from "../../../utils/unit8array";

let NWD_DB = localforage.createInstance({
    name: "NWD_DB",
});

/**
 * setFile
 * @param name
 * @param content
 */

function setFile(name: string, content: any) {
    if (typeof content !== "string") {
        switch (typeof content) {
            case "object":
                content = JSON.stringify(content);
                break;
            default:
                content = content.toString();
                break;
        }
    }
    NWD_DB.setItem(name, stringToUint8Array(content))
        .then(function(_value) {})
        .catch(function(err) {
            console.log(err);
        });
}

/**
 * getFile
 * @param name
 * @param callback
 */

function getFile(name: string, callback: any) {
    NWD_DB.getItem(name, (_err, result: Uint8Array | null) => {
        callback(Uint8ArrayToString(<Uint8Array>result));
    });
}

function getAllFile(): Promise<any> {
    return NWD_DB.keys();
}

function recovery(callback: any) {
    NWD_DB.clear()
        .then(function() {
            callback(true);
        })
        .catch(function(_err) {
            callback(false);
        });
}

export { setFile, getFile, recovery, getAllFile };
