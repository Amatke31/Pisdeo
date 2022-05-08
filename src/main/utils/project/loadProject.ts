import platform from "../platform/platform";
import { getFile } from "../platform/web/file";

function loadProject(info: any, callback: any) {
    if (platform === "desktop") {
    } else if (platform === "web") {
        getFile(`${info.path}`, (result: string) => {
            if (result == "") {
                callback({
                    code: 300,
                    msg: "cannot find file",
                });
            } else {
                callback({
                    code: 200,
                    program: JSON.parse(result),
                });
            }
        });
    }
}

export { loadProject };
