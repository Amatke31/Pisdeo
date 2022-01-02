<template>
    <div>
        <div class="titleBar">
            <div class="window-title">
                {{ title }}
            </div>
        </div>
        <Start
            v-if="page === 'Start'"
            :extension="ExtensionInfo"
            :isInit="startIsInit"
            :project="project"
            :homePath="homePath"
            :documentsPath="documentsPath"
            :errorThrow="errorThrow"
            :templateRequire="templateRequire"
            @goToProjectPage="page = 'Project'"
        />
        <Project
            v-else-if="page === 'Project'"
            :extension="ExtensionInfo"
            :isInit="projectIsInit"
            :project="project"
            :homePath="homePath"
            :documentsPath="documentsPath"
            :errorThrow="errorThrow"
            :menu="projectMenu"
            @goToStartPage="page = 'Start'"
        />
        <div
            v-if="!(startIsInit || projectIsInit)"
            class="console"
            v-html="consoleText"
        ></div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ipcRenderer } from "electron";
import extEvent from "../extension/extension-event";
import Start from "./views/Start.vue";
import Project from "./views/Project.vue";
import path from "path";
import fs from "fs";
import ipc from "./utils/ipc";
import { extensionManager } from "../extension/extension-manager";

let userConfig: any = {};

interface RequireForm {
    [propName: string]: any;
}

export default defineComponent({
    data() {
        return {
            ExtensionInfo: new Array(),
            homePath: "",
            project: new Array(),
            startIsInit: false,
            projectIsInit: false,
            consoleText: "<p>loading...</p>",
            documentsPath: "",
            templateRequire: new Object() as RequireForm,
            page: "Start",
            errorCode: "",
            warningShow: false,
            title: "NexWebEditor",
        };
    },
    components: {
        Start,
        Project,
    },
    async created() {
        userConfig = await ipc.getConfig();
        this.$i18n.locale = userConfig.language;
    },
    mounted() {
        // event
        extEvent.on("addTemplate", (info) => {
            this.project.push(info);
            let require = new Array();
            info.require.forEach((parameter: any) => {
                require.push(
                    typeof parameter === "object"
                        ? parameter
                        : { name: parameter }
                );
            });
            this.templateRequire[info.extension.id] = require;
        });
        extEvent.on("projectLoaded", () => {
            this.projectIsInit = true;
        });

        // scan folder
        const folder = ["extensions", "config", "tmp"];
        ipcRenderer.send("Init", "Start"); //
        ipcRenderer.on("Init", (event, appInfo) => {
            this.homePath = appInfo.path.home;
            this.documentsPath = appInfo.path.documents;
            this.consoleText += "<p>[INFO]Load extension...</p>";
            (this.ExtensionInfo = extensionManager.LoadExtensionFromLocal(
                process.env.NODE_ENV !== "development"
                    ? path
                          .join(__dirname, "/src/extension/extension")
                          .replace(/\\/g, "\\\\")
                    : path.join(process.cwd(), "/src/extension/extension"),
                true,
                this.$i18n
            )),
                this.ExtensionInfo.forEach((ExtInfo) => {
                    extensionManager.runExtension(ExtInfo, ExtInfo.path);
                });
            extensionManager.InitExt();
            this.consoleText += `<p>[INFO]${this.ExtensionInfo.length} extension detected</p>`;
            this.consoleText += `<p>[INFO]Complete</p>`;
            this.startIsInit = true;
        });
    },
});
</script>

<style>
* {
    font-family: Helvetica;
    margin: 0;
    padding: 0;
    color: #eee;
    box-sizing: border-box;
}

body {
    background-color: rgb(24, 24, 24);
}

a {
    text-decoration: none;
}

.titleBar {
    width: 100%;
    height: 28px;
    box-sizing: border-box;
    width: 100%;
    padding: 0 70px;
    overflow: hidden;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    user-select: none;
    -webkit-user-select: none;
    -webkit-app-region: drag;
    zoom: 1;
    line-height: 22px;
    display: flex;
    background-color: rgb(60, 60, 60);
}

.window-title {
    color: rgb(204, 204, 204);
    font-size: 12px;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    zoom: 1;
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0px);
    max-width: calc(100vw - 160px);
    flex: 0 1 auto;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-left: auto;
    margin-right: auto;
}

.console {
    transition: 0.3s;
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    opacity: 1;
    overflow: hidden;
    z-index: 2000;
    backdrop-filter: blur(2px);
    background-color: rgba(50, 50, 50, 0.7);
}

*::-webkit-scrollbar {
    width: auto;
    height: 5px;
    border-radius: 50px;
}
*::-webkit-scrollbar-thumb {
    background-color: rgb(196, 196, 196);
    border-radius: 50px;
}
*::-webkit-scrollbar-thumb:hover {
    background-color: rgb(151, 151, 151);
}
*::-webkit-scrollbar-track {
    background-color: rgb(68, 67, 67);
    border-radius: 50px;
}
</style>