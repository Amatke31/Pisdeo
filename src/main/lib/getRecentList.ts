import platform from "./platform/platform";
import { getFile, getAllFile } from "./platform/web/file";

function getRecentList(callback: Function) {
    if (platform === "web") {
        getAllFile()
            .then((keys) => {
                keys = keys.filter((i: string) => {
                    return i.indexOf("project/") == 0;
                });
                if (keys == undefined) {
                    keys = [];
                }
                callback(keys);
            })
            .catch((err) => console.error(err));
    }
}

export default getRecentList;
