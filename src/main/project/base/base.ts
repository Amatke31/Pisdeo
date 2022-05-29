class Project {
    name = "";
    author = "";
    type = "";
    inited = false;
    file = {};
    viewer: HTMLElement | null = null;

    init(name: string, author: string): void {
        this.name = name;
        this.author = author;
        this.onInit();
        this.inited = true;
    }

    onInit(): void {}

    get info(): object | string {
        return this.inited
            ? {
                  name: this.name,
                  author: this.author,
                  type: this.type,
              }
            : "Project not initialized";
    }
}

export default Project;
