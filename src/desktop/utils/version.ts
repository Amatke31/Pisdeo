import fs from "fs";
import getStaticPath from "../../utils/getStaticPath";
import path from "path";
import { app } from "electron";
import Version from "@/types/Version";

const version: Version = JSON.parse(
    fs.readFileSync(path.join(getStaticPath(), "version.json"), "utf-8")
);

if (!version.version) version.version = app.getVersion();

export default version;
