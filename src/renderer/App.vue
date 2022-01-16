<template>
    <div>
        <div v-show="platform === 'desktop'" class="titleBar">
            <div class="window-title">
                {{ title }}
            </div>
        </div>
        <Welcome v-if="page === 'Welcome'" />
        <Start
            v-else-if="page === 'Start'"
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
import extEvent from "./utils/extension/extension-event";
import Start from "./views/Start.vue";
import Project from "./views/Project.vue";
import Welcome from "./views/Welcome.vue";
import path from "path";
import ipc from "./utils/platform/desktop/ipc";
import { extensionManager } from "./utils/extension/extension-manager";
import platform from "./utils/platform/platform";

let userConfig: any = {
    language: "en_us",
};

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
            platform,
        };
    },
    components: {
        Start,
        Project,
        Welcome,
    },
    async created() {
        if (platform === "desktop") {
            userConfig = await ipc.getConfig();
        }
        this.$i18n.locale = userConfig.language;
    },
    mounted() {
        // event
        extEvent.on("addTemplate", (info) => {
            this.project.push(info);
            let require = new Array();
            if (info.require) {
                info.require.forEach((parameter: any) => {
                    require.push(
                        typeof parameter === "object"
                            ? parameter
                            : { name: parameter }
                    );
                });
            }
            this.templateRequire[info.extension.id] = require;
        });
        extEvent.on("projectLoaded", () => {
            this.projectIsInit = true;
        });

        this.consoleText += "<p>[INFO]Load extension...</p>";
        let extensioninfo = extensionManager.LoadExtensionFromLocal(
            process.env.NODE_ENV !== "development"
                ? path.join(__dirname, "/src/extension/").replace(/\\/g, "\\\\")
                : path.join(process.cwd(), "/src/extension/"),
            this.$i18n
        );
        this.ExtensionInfo = extensioninfo;
        extensioninfo.forEach((ExtInfo: any) => {
            extensionManager.runExtension(ExtInfo, ExtInfo.path);
        });
        extensionManager.InitExt();
        this.consoleText += `<p>[INFO]${extensioninfo.length} extension detected</p>`;
        this.consoleText += `<p>[INFO]Complete</p>`;
        this.startIsInit = true;
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