<template>
    <n-config-provider :theme="darkTheme" :theme-overrides="themeOverrides">
        <n-message-provider>
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
                    :templateRequire="templateRequires"
                    @createProject="createProject"
                    @openSetting="page = 'Setting'"
                />
                <Setting
                    v-else-if="page === 'Setting'"
                    @goToStartPage="page = 'Start'"
                    @sendCommand="SettingCommand"
                />
                <Project v-show="page === 'Project'" @goToStartPage="page = 'Start'" />
                <div v-if="!startIsInit" class="console" v-html="consoleText"></div>
            </div>
            <Tool
                v-if="
                    openNWDDevTool == 'always' || (openNWDDevTool == 'development' && isDevelopment)
                "
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
            <n-window :open="WindowOpen" @close="WindowOpen = false">
                <div class="solution-container">
                    <div class="solution-title">{{ $t("start.choosesolution") }}</div>
                    <div class="solution-list">
                        <v-card
                            v-for="item in solution"
                            :key="item.solutionName"
                            width="300"
                            :title="item.solutionName"
                            :text="item.solutionDescription"
                            variant="contained-text"
                        >
                            <v-card-actions>
                                <v-btn @click="choosedSolution(item.solutionName)">
                                    {{
                                        createOrLoad == "create"
                                            ? $t("start.create")
                                            : $t("start.load")
                                    }}
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </div>
                </div>
            </n-window>
        </n-message-provider>
    </n-config-provider>
</template>

<script lang="ts">
import { Ref } from "vue";
import Start from "./views/Start.vue";
import Project from "./views/Project";
import Welcome from "./views/Welcome.vue";
import os from "os";
import platform from "./lib/platform/platform";
import Tool from "./components/developtool/tool.vue";
import Setting from "./views/Setting.vue";
import { getConfig } from "./lib/common";
import { ElLoading, ElMessage } from "element-plus";
import { darkTheme } from "naive-ui";
import "./lib/project/web/web";
import JSZip from "jszip";
import extension from "./store/extension";
import { useI18n } from "vue-i18n";
import Axios from "axios";
import project from "./store/project";

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

let projectContent: any = null;
let projectInfo: any = null;

export default defineComponent({
    data() {
        return {
            showVirtualTitleBar: platform === "desktop",
            os: os.platform() ? os.platform() : "web",
            startIsInit: false,
            consoleText: "<p>loading...</p>",
            documentsPath: "",
            errorCode: "",
            warningShow: false,
            title: "Pisdeo",
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
    async mounted() {
        if (localStorage.getItem("nwddevtool")) {
            this.openNWDDevTool = localStorage.getItem("nwddevtool") as string;
        } else {
            localStorage.setItem("nwddevtool", "development");
            this.openNWDDevTool = "development";
        }
        this.startIsInit = true;
    },
    setup() {
        const loadProjectWithDebugDialog = ref(false);
        const page: Ref<string> = ref("Blank");
        const createOrLoad = ref("create");
        const WindowOpen = ref(false);
        const solution: Ref<any> = ref([]);
        const i18n = useI18n();
        const t = i18n.t;
        const template = reactive({});
        const templateRequires = reactive({}) as RequireForm;
        const extstore = extension();
        const projectstore = project();
        extstore.loadNWDExt({ i18n });
        const unsub = extstore.$onAction(({ name, store, args, after, onError }) => {
            if (name == "addTemplate") {
                template[args[0].id] = args[0];
                templateRequires[args[0].id] = args[0].require;
            }
        });

        function loadTestProject() {
            loadProjectWithDebugDialog.value = false;
            const loading = ElLoading.service({
                lock: true,
                text: "Loading",
                background: "rgba(0, 0, 0, 0.7)",
            });
            Axios({
                method: "get",
                url: "/test/test.nwdp",
                responseType: "arraybuffer",
            }).then((res: any) => {
                const content = res.data;
                let nwdp = new JSZip();
                nwdp.loadAsync(content).then((nwdp) => {
                    projectContent = nwdp;
                    projectstore
                        .findSolution({ nwdp })
                        .then(({ allSolution, info }) => {
                            projectInfo = info;
                            createOrLoad.value = "load";
                            WindowOpen.value = true;
                            solution.value = allSolution;
                        })
                        .catch(() => {
                            ElMessage({
                                showClose: true,
                                message: t("project.cannotfindsolution"),
                                type: "error",
                            });
                        })
                        .finally(() => {
                            loading.close();
                        });
                });
            });
        }
        function choosedSolution(solution: string) {
            WindowOpen.value = false;
            projectstore
                .loadProject({
                    solution,
                    content: projectContent,
                    ...projectInfo,
                })
                .then(() => {
                    page.value = "Project";
                })
                .catch(() => {});
        }

        const themeOverrides = {
            common: {
                bodyColor: "rgb(24, 24, 24)",
                cardColor: "rgb(24, 24, 24)",
            },
            Menu: {
                itemIconColorActive: "#63e2b7",
            },
        };
        return {
            darkTheme,
            themeOverrides,
            template,
            templateRequires,
            loadTestProject,
            loadProjectWithDebugDialog,
            createOrLoad,
            WindowOpen,
            solution,
            choosedSolution,
            page,
        };
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

.solution-container {
    .solution-title {
        font-size: 30px;
        font-weight: 700;
    }

    .solution-list {
        margin-top: 10px;
    }
}
</style>
