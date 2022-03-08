<template>
    <div>
        <div
            v-show="showVirtualTitleBar"
            :class="showVirtualTitleBar ? 'titleBar desktop' : 'titleBar'"
        >
            <div class="window-title">
                {{ title }}
            </div>
        </div>
        <Welcome v-if="page === 'Welcome'" @goStart="page = 'Start'" />
        <Start
            v-else-if="page === 'Start'"
            :extension="ExtensionInfo"
            :isInit="startIsInit"
            :template="template"
            :homePath="homePath"
            :documentsPath="documentsPath"
            :templateRequire="templateRequire"
            @goToProjectPage="page = 'Project'"
            @openSetting="page = 'Setting'"
        />
        <Project
            v-else-if="page === 'Project'"
            :extension="ExtensionInfo"
            :isInit="projectIsInit"
            :project="project"
            :homePath="homePath"
            :documentsPath="documentsPath"
            :menu="projectMenu"
            @goToStartPage="page = 'Start'"
        />
        <Setting
            v-else-if="page === 'Setting'"
            @goToStartPage="page = 'Start'"
            :menuOption="settingMenuOption"
        />
        <div
            v-if="!(startIsInit || projectIsInit)"
            class="console"
            v-html="consoleText"
        ></div>
    </div>
    <Tool v-if="isDevelopment" :toolFunction="toolFunction" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import event from "./utils/event";
import Start from "./views/Start.vue";
import Project from "./views/Project.vue";
import Welcome from "./views/Welcome.vue";
import os from "os";
import { extensionManager } from "./utils/extension/extension-manager";
import platform from "./utils/platform/platform";
import Tool from "./components/developtool/tool.vue";
import Setting from "./views/Setting.vue";
import { getConfig, getVersion } from "./utils/common";

interface RequireForm {
    [propName: string]: any;
}

let userConfig: any = {
    init: false,
    configVersion: "Manual Build",
    language: "en_us",
    theme: "auto",
    updateCheck: "ask",
};

export default defineComponent({
    data() {
        return {
            showVirtualTitleBar:
                platform === "desktop" &&
                os &&
                (os.platform() == "darwin" || os.platform() == "win32"),
            ExtensionInfo: new Array(),
            homePath: "",
            template: new Array(),
            startIsInit: false,
            projectIsInit: false,
            consoleText: "<p>loading...</p>",
            documentsPath: "",
            templateRequire: new Object() as RequireForm,
            page: "Blank" as string,
            errorCode: "",
            warningShow: false,
            title: "NexWebDesigner",
            platform,
            version: "Manual Build",
            isDevelopment:
                process.env.NODE_ENV === "development" ? true : false,
            toolFunction: [
                {
                    label: "Start Page",
                    type: "btn",
                    command: () => {
                        this.pushPage("Start");
                    },
                },
                {
                    label: "Setting Page",
                    type: "btn",
                    command: () => {
                        this.pushPage("Setting");
                    },
                },
                {
                    label: "Welcome Page",
                    type: "btn",
                    command: () => {
                        this.pushPage("Welcome");
                    },
                },
                {
                    label: "Refresh",
                    type: "btn",
                    command: () => {
                        location.reload();
                    },
                },
            ],
            settingMenuOption: [
                ["setting.common", "mdi-cog", []],
                ["setting.account", "mdi-account-circle", []],
                ["setting.about", "mdi-information", []],
            ],
        };
    },
    components: {
        Start,
        Project,
        Welcome,
        Tool,
        Setting,
    },
    async created() {
        await getConfig((config: any) => {
            userConfig = config;
            this.page = userConfig.init ? "Start" : "Welcome";
            this.$i18n.locale = userConfig.language;
        });
    },
    async mounted() {
        // event
        event.on("addTemplate", (info) => {
            let isAdd = false;
            this.template.forEach((info) => {
                if (info.id) isAdd = true;
            });
            if (!isAdd) {
                this.template.push(info);
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
            }
        });
        event.on("projectLoaded", () => {
            this.projectIsInit = true;
        });

        event.on("addMenu", (data: any) => {
            this.settingMenuOption.push([data.id, data.icon, []]);
        });

        event.on("addElement", (data: any) => {
            this.settingMenuOption.forEach((key: any) => {
                if (key[0] == data.where) {
                    key[2].push({
                        type: data.type,
                        id: data.id,
                        run: data.run,
                    });
                }
            });
        });

        this.consoleText += "<p>[INFO]Load extension...</p>";
        let extensioninfo = await extensionManager.LoadNWDExt(this.$i18n);
        this.ExtensionInfo = extensioninfo;
        extensioninfo.forEach((ExtInfo: any) => {
            extensionManager.runExtension(ExtInfo);
        });
        this.consoleText += `<p>[INFO]${extensioninfo.length} extension detected</p>`;
        this.consoleText += `<p>[INFO]Complete</p>`;
        this.startIsInit = true;
    },
    methods: {
        pushPage: function (page: string) {
            this.page = page;
        },
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

html {
    overflow-y: hidden !important;
}

body {
    background-color: rgb(24, 24, 24) !important;
    min-height: 100vh;
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

*::-webkit-scrollbar,
*::-webkit-scrollbar-thumb {
    width: 26px;
    border-radius: 13px;
    background-clip: padding-box;
    border: 10px solid transparent;
}

*::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 0 10px;
}
</style>