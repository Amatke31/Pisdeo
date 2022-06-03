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
            :isInit="startIsInit"
            :template="template"
            :documentsPath="documentsPath"
            :templateRequire="templateRequire"
            @createProject="createProject"
            @openSetting="page = 'Setting'"
        />
        <Project v-else-if="page === 'Project'" @goToStartPage="page = 'Start'" />
        <Setting
            v-else-if="page === 'Setting'"
            @goToStartPage="page = 'Start'"
            @sendCommand="SettingCommand"
            :menuOption="settingMenuOption"
        />
        <div v-if="!startIsInit" class="console" v-html="consoleText"></div>
    </div>
    <Tool
        v-if="openNWDDevTool == 'always' || (openNWDDevTool == 'development' && isDevelopment)"
        :toolFunction="toolFunction"
    />
    <el-dialog v-model="loadProjectWithDebugDialog" title="Tool" width="30%">
        <span>Load Project</span>
        <el-input v-model="loadProjectPath" placeholder="Project Path" />
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="loadProjectWithDebugDialog = false">Cancel</el-button>
                <el-button type="primary" @click="loadProjectWithDebug">Confirm</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Start from "./views/Start.vue";
import Project from "./views/Project";
import Welcome from "./views/Welcome.vue";
import os from "os";
import platform from "./utils/platform/platform";
import Tool from "./components/developtool/tool.vue";
import Setting from "./views/Setting.vue";
import { getConfig } from "./utils/common";
import { ElLoading, ElMessage } from "element-plus";
import "./project/web/web";

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
            showVirtualTitleBar: platform === "desktop",
            os: os.platform() ? os.platform() : "web",
            template: new Array(),
            startIsInit: false,
            consoleText: "<p>loading...</p>",
            documentsPath: "",
            templateRequire: new Object() as RequireForm,
            page: "Blank" as string,
            errorCode: "",
            warningShow: false,
            title: "NexWebDesigner",
            platform,
            version: "Manual Build",
            isDevelopment: process.env.NODE_ENV === "development" ? true : false,
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
                    label: "Load Project",
                    type: "btn",
                    command: () => {
                        this.openLoadProjectWithDebug();
                    },
                },
                {
                    label: "Load Test Project",
                    type: "btn",
                    command: () => {
                        this.loadTestProject();
                    },
                },
                {
                    label: "Refresh",
                    type: "btn",
                    command: () => {
                        location.reload();
                    },
                },
                {
                    label: "Close DevTool",
                    type: "btn",
                    command: () => {
                        this.closeDevToolOneTime();
                    },
                },
            ],
            settingMenuOption: [
                ["setting.general", "mdi-cog", []],
                ["setting.account", "mdi-account-circle", []],
                ["setting.develop", "mdi-hammer-screwdriver", []],
                ["setting.about", "mdi-information", []],
            ],
            loadProjectWithDebugDialog: false,
            loadProjectPath: "",
            openNWDDevTool: "development",
            loadTestProjectAuto: "close",
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
            if (userConfig.language.indexOf("zh") == 0) {
                this.$i18n.fallbackLocale = "zh_cn";
            } else {
                this.$i18n.fallbackLocale = "en_us";
            }
            if (localStorage.getItem("ltpwal")) {
                this.loadTestProjectAuto = localStorage.getItem("ltpwal") as string;
                if (this.loadTestProjectAuto == "open") {
                    this.$nextTick(() => {
                        this.loadTestProject();
                    });
                }
            } else {
                localStorage.setItem("ltpwal", "close");
                this.loadTestProjectAuto = "close";
            }
        });
    },
    watch: {
        page(n) {
            if (n !== "Project") {
                this.$store.dispatch("unrender");
            }
        },
    },
    async mounted() {
        if (localStorage.getItem("nwddevtool")) {
            this.openNWDDevTool = localStorage.getItem("nwddevtool") as string;
        } else {
            localStorage.setItem("nwddevtool", "development");
            this.openNWDDevTool = "development";
        }

        this.$store.subscribe((mutation, state) => {
            if (mutation.type == "addTemplate") {
                this.template = state.extension.template;
                this.templateRequire[mutation.payload.id] = mutation.payload.require;
            }
        });
        this.$store.dispatch("loadNWDExt", { i18n: this.$i18n });
        this.startIsInit = true;
    },
    methods: {
        pushPage: function(page: string) {
            this.page = page;
        },
        createProject: function() {
            const loading = ElLoading.service({
                lock: true,
                text: "Loading",
                background: "rgba(0, 0, 0, 0.7)",
            });
            this.$store.dispatch({ type: "createProject" }).then((result) => {
                loading.close();
                if (result.code == 200) {
                    this.page = "Project";
                } else if (result == "exist") {
                    ElMessage({
                        showClose: true,
                        message: this.$t("project.exist"),
                        type: "error",
                    });
                }
            });
        },
        openLoadProjectWithDebug: function() {
            this.loadProjectWithDebugDialog = true;
        },
        loadProjectWithDebug: function() {
            this.loadProjectWithDebugDialog = false;
            const loading = ElLoading.service({
                lock: true,
                text: "Loading",
                background: "rgba(0, 0, 0, 0.7)",
            });
            this.$store.commit({
                type: "beforeLoadProjectWithDebug",
                path: this.loadProjectPath,
            });
            this.$store.dispatch("loadProject", this.loadProjectPath).then((result) => {
                loading.close();
                if (result.code == 200) {
                    this.page = "Project";
                } else if (result.code == 300) {
                    ElMessage({
                        showClose: true,
                        message: this.$t("project.cannotfind"),
                        type: "error",
                    });
                }
            });
        },
        loadTestProject: function() {
            this.loadProjectWithDebugDialog = false;
            const loading = ElLoading.service({
                lock: true,
                text: "Loading",
                background: "rgba(0, 0, 0, 0.7)",
            });
            // this.$store.commit({
            //     type: "beforeLoadTestProject",
            // });
            this.$store.dispatch({ type: "loadTestProject" }).then((result) => {
                loading.close();
                if (result.code == 200) {
                    this.page = "Project";
                } else if (result.code == 300) {
                    ElMessage({
                        showClose: true,
                        message: this.$t("project.cannotfind"),
                        type: "error",
                    });
                }
            });
        },
        SettingCommand: function(command: string) {
            switch (command) {
                case "setToolState.always":
                    localStorage.setItem("nwddevtool", "always");
                    this.openNWDDevTool = "always";
                    break;
                case "setToolState.development":
                    localStorage.setItem("nwddevtool", "development");
                    this.openNWDDevTool = "development";
                    break;
                case "setToolState.never":
                    localStorage.setItem("nwddevtool", "never");
                    this.openNWDDevTool = "never";
                    break;
                case "setAutoOpenTestProject.open":
                    localStorage.setItem("ltpwal", "open");
                    this.loadTestProjectAuto = "open";
                    break;
                case "setAutoOpenTestProject.close":
                    localStorage.setItem("ltpwal", "close");
                    this.loadTestProjectAuto = "close";
                    break;
                case "loadTestProject":
                    this.loadTestProject();
                    break;
                default:
                    console.log(`Cannot find command '${command}'`);
            }
        },
        closeDevToolOneTime: function() {
            this.openNWDDevTool = "23333333333333";
        },
    },
});
</script>

<style lang="scss">
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
    height: 26px;
    border-radius: 13px;
    background-clip: padding-box;
    border: 10px solid transparent;
}

*::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 0 10px;
}

*::-webkit-scrollbar-corner {
    background: unset;
}

.scroll {
    color: rgba(0, 0, 0, 0);
    transition: color 0.3s ease;

    &:hover {
        color: rgba(0, 0, 0, 0.3);
    }
}

input,
select {
    &:focus-visible {
        outline: none;
    }
}
</style>
