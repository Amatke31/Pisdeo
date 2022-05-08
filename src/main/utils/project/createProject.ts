import platform from "../platform/platform";
import { getFile, setFile } from "../platform/web/file";

function createProject(info: any, callback: any) {
    if (platform === "desktop") {
    } else if (platform === "web") {
        getFile(`project/${info.name}`, (result: string) => {
            const program = {
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
            };
            if (result == "") {
                setFile(`project/${info.name}`, program);
                callback({ code: 200, program });
            } else {
                callback("exist");
            }
        });
    }
}

export { createProject };
