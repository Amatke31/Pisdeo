import path from "path";

export default class PathUtils {
    static startPath(): string {
        return path.join(__dirname, "..");
    }
    static resolvePath(dirPath: string): string {
        return path.join(this.startPath(), dirPath || ".");
    }
}
