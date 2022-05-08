import platform from "../platform/platform";
import { getFile, setFile } from "../platform/web/file";

function createProject(info: any, callback: any) {
    if (platform === "desktop") {
    } else if (platform === "web") {
        getFile(`project/${info.name}`, (result: string) => {
            if (result == "") {
                setFile(`project/${info.name}`, {
                    name: info.name,
                    file: {
                        "index.html": {
                            element: "html",
                            children: [
                                {
                                    element: "head",
                                },
                                {
                                    element: "body",
                                },
                            ],
                        },
                    },
                });
                callback("ok");
            } else {
                callback("exist");
            }
        });
    }
}

export { createProject };
