import Project from "../base/base";

class WebProject extends Project {
    type = "website";

    loadFile(content: any | string): void {
        if (typeof content !== "string") {
            // load file
        } else {
            // create file
            this.viewer = document.createElement("div");
        }
    }
}

export default WebProject;

let test = new WebProject();
test.init("WebProject", "Amatke31");
console.log(test.info, test);
