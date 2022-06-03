import path from 'path'

export default class PathUtils {
    public static startPath = path.join(__dirname, "..");

    public static resolvePath = (dirPath) => {
        return path.join(PathUtils.startPath, dirPath || ".");
    };
}
