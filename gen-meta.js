const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");
const moment = require("moment");

const isProduction = process.env.NODE_ENV === "production";
const time = new Date();
const appMainVersion = "0.0.2";

let commitHash = "unknown";
try {
    commitHash = childProcess
        .execSync("git show -s --format=%h")
        .toString()
        .trim();
} catch (err) {
    console.warn("WARNING: Can't get last commit hash. Use 'unknown' instead.");
}

const code = `// Generated by gen-meta.js
const appName = 'Pisdeo';

const isProd = ${isProduction};
const appVersion = '${appMainVersion}';
const appVersionFull = '${appMainVersion}-${commitHash}-b${moment
    .utc(time)
    .format("YYYYMMDDHHmm")}';
const compileTime = '${moment.utc(time).format("YYYY/MM/DD HH:mm:ss")}';
const commitHash = '${commitHash}';

export {
    isProd, appVersion, appVersionFull, compileTime, commitHash
};
`;

fs.writeFileSync(path.join(__dirname, "src/main/lib/app-info.js"), code);
