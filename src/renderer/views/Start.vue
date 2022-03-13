<template>
    <div class="start">
        <div class="nav">
            <div class="nav-left">
                <h1>{{ $t("start.title") }}</h1>
                <n-navbtn v-if="isInit" @click="openStore" class="n-btn-2">{{
                    $t("start.extensions")
                }}</n-navbtn>
            </div>
            <div class="nav-right">
                <n-navbtn @click="openSetting" class="n-btn-2">{{
                    $t("start.setting")
                }}</n-navbtn>
            </div>
        </div>
        <div class="main">
            <div v-if="isInit" class="newProject">
                <h2 class="npt">{{ $t("start.pageNewproject") }}</h2>
                <div class="npc">
                    <div
                        @click="newProject(item)"
                        v-for="item in template"
                        v-bind:key="item.name"
                        class="card"
                    >
                        <div
                            v-if="item.extension.author == 'NexWebDesigner'"
                            class="img"
                            :style="cardImg(item.extension.icon)"
                        ></div>
                        <div
                            v-else
                            class="img"
                            :style="
                                cardImg(
                                    item.extension.path +
                                        '/' +
                                        item.extension.icon
                                )
                            "
                        ></div>
                        <div class="title">{{ $t(item.name) }}</div>
                    </div>
                </div>
            </div>
        </div>
        <msg :isShow="msgIsShow" :html="msgHTML" @close="close"></msg>
        <div id="newProject" :class="newProjectWCss">
            <div class="window">
                <div class="title">
                    <h1>
                        {{
                            $t("newproject.title", {
                                framework: templateInfo.framework,
                                template: templateInfo.name,
                            })
                        }}
                    </h1>
                    <h5 style="color: #aaa">
                        {{
                            $t("newproject.madeby", {
                                author: templateInfo.extension.author,
                            })
                        }}
                    </h5>
                </div>
                <div class="form">
                    <div class="name">
                        <div>{{ $t("newproject.projectname") }}:</div>
                        <div v-if="platform !== 'web'">
                            {{ $t("newproject.projectlocation") }}:
                        </div>
                        <div
                            v-for="templateRequire in templateRequire[
                                templateInfo.extension.id
                            ]"
                            :key="templateRequire.name"
                        >
                            {{ $t(templateRequire.name) }}:
                        </div>
                    </div>
                    <div class="input">
                        <input spellcheck="false" v-model="ProjectForm.name" />
                        <input
                            spellcheck="false"
                            v-model="ProjectForm.path"
                            @click="changePath"
                            v-if="platform !== 'web'"
                        />
                        <input
                            spellcheck="false"
                            v-for="templateRequire in templateRequire[
                                templateInfo.extension.id
                            ]"
                            :key="templateRequire.name"
                            v-model="ProjectForm[templateRequire.name]"
                        />
                    </div>
                </div>
                <n-btn class="create" @click="createProject">
                    {{ $t("newproject.create") }}
                </n-btn>
            </div>
            <div class="mask" @click="closeNPW"></div>
        </div>
        <div :class="warningCss" id="_warning">
            <div class="warning" :style="'width:500px;margin-left:-250px;'">
                <div>
                    The application has crashed and may need to be repaired. If
                    you need help, you can view the
                    <a @click="openDoc(`problem/${errorCode}`)"
                        >documentation</a
                    >
                </div>
                <div>Error Code: {{ errorCode }}</div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import path from "path";
import ipc from "../utils/platform/desktop/ipc";
import { getVersion } from "../utils/common";
import platform from "../utils/platform/platform";

let documentsPath: string = "";
let version: any = "Manual Build";

interface RequireForm {
    [propName: string]: any;
}

export default defineComponent({
    emits: ["createProject", "openSetting"],
    name: "Start",
    props: {
        isInit: {
            type: Boolean,
        },
        template: {
            type: Array,
        },
        homePath: {
            type: String,
        },
        documentsPath: {
            type: String,
        },
        errorThrow: {
            type: Function,
        },
        templateRequire: {
            type: Object,
        },
    },
    data() {
        return {
            msgIsShow: false,
            warningShow: false,
            errorCode: "",
            msgHTML: "",
            newProjectWCss: "hide none",
            newProjectW: false,
            consoleText: "<p>loading...</p>",
            templateInfo: {
                name: "",
                framework: "",
                extension: {
                    author: "",
                    id: "",
                },
            } as RequireForm,
            ProjectForm: {
                name: "WebApp1",
                framework: "",
                path: "",
            } as RequireForm,
            warningCss: "hide none",
            platform,
        };
    },
    mounted: function () {},
    watch: {
        warningShow() {
            if (this.warningShow == true) {
                this.warningCss = "hide";
                setTimeout(() => {
                    this.warningCss = "";
                }, 50);
            } else {
                this.warningCss = "hide";
                setTimeout(() => {
                    this.warningCss = "hide none";
                }, 300);
            }
        },
    },
    async created() {
        if (platform === "desktop") {
            documentsPath = await ipc.getDocumentsPath();
        }
        version = await getVersion();
    },
    methods: {
        newProject: function (info: {
            name: string;
            framework: string;
            extension: { author: string; id: string };
            require: any;
        }) {
            info.require.forEach(
                (parameter: {
                    name: string;
                    default: any;
                    [propName: string]: any;
                }) => {
                    this.ProjectForm[parameter.name] = parameter.default;
                }
            );
            this.templateInfo = info;
            this.ProjectForm.path = path.join(documentsPath, "NexWebDesigner");
            this.newProjectWCss = "hide";
            setTimeout(() => {
                this.newProjectWCss = "window";
            }, 50);
        },
        closeNPW: function () {
            this.newProjectWCss = "hide";
            setTimeout(() => {
                this.newProjectWCss = "hide none";
            }, 300);
        },
        openAboutWindow: function () {
            this.msgHTML = `
                <h1>NexWebDesigner</h1>
                <p style="color:#ccc;">${this.$t("about.introduce")}</p>
                <p style="color:#ccc;font-size:14px">Version: ${version}</p>
                <p style="color:#ccc;font-size:14px">Environment: ${platform}</p><br>
                <p style="color:#ccc;">Released under the AGPL-3.0</p>
                <p style="color:#ccc;">Copyright © 2021-2022 Amatke31</p>
            `;
            this.msgIsShow = true;
        },
        close: function () {
            this.msgIsShow = false;
        },
        changePath: async function () {
            if (platform === "desktop") {
                const cppath = await ipc.chooseProjectPath();
                if (cppath != "") {
                    this.ProjectForm.path = cppath;
                }
            }
        },
        createProject: function () {
            this.closeNPW()
            this.$store.commit({
                type: 'beforeCreateProject',
                name: this.ProjectForm.name
            })
            this.$emit('createProject')
        },
        openStore: function () {},
        openSetting: function () {
            this.$emit("openSetting");
        },
        cardImg: function (img: string) {
            if (img != undefined) {
                return `background-image: url(${img})`;
            } else {
                return "";
            }
        },
    },
});
</script>

<style lang="scss" scoped>
#newProject.hide .mask {
    opacity: 0;
}

#newProject.none {
    display: none;
}

#newProject {
    display: unset;
}

#newProject {
    .window {
        transform: scale(1);
        width: 750px;
        height: 600px;
        position: fixed;
        top: 10%;
        border-radius: 15px;
        box-shadow: 0 5px 8px rgba(0, 0, 0, 0.05);
        z-index: 3000;
        display: flex;
        flex-direction: column;
        background-color: rgb(50, 50, 50);
        padding: 36px;
        top: calc((100vh - 600px) / 2);
        left: calc((100vw - 750px) / 2);
        opacity: 1;
        transition: 0.3s;

        .create {
            position: absolute;
            bottom: 43px;
            right: 43px;
        }

        .form {
            margin-top: 16px;
            display: flex;
            margin-bottom: 16px;
            overflow-y: auto;
            height: 360px;

            .name,
            .input {
                div,
                input {
                    padding: 16px;
                    outline: 0;
                    background: unset;
                    width: 100%;
                    border: 0;
                    height: 48px;
                    margin: 0 0 20px;
                    box-sizing: border-box;
                    font-size: 14px;
                    color: #fff;
                    transition: 0.2s;
                }

                input {
                    border-radius: 12px;
                    background-color: #383838;
                    &:hover {
                        background-color: #3f3f3f;
                    }
                    &:focus {
                        background-color: #454545;
                    }
                }
            }

            .name {
                text-align: right;
                width: 25%;
            }

            .input {
                text-align: left;
                width: 80%;
            }
        }
    }
}

#newProject.hide .window {
    transform: scale(0.95);
    opacity: 0;
}
.nav {
    padding: 12px;
    background-color: #222;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .nav-left {
        align-items: center;
        display: flex;
        * {
            display: inline;
            margin: 0 10px;
        }
    }
    .nav-right {
        align-items: center;
        display: flex;
        * {
            display: inline;
            margin: 0 10px;
        }
    }
}
.main {
    padding: 24px;
    .newProject {
        display: flex;
        flex-direction: column;
        .npt {
            margin: 10px;
        }
        .npc {
            display: inline-flex;
            overflow-x: auto;

            .card {
                background-color: #2c2c2c;
                min-width: 300px;
                width: 300px;
                height: 230px;
                border-radius: 8px;
                margin: 10px;
                display: inline-flex;
                flex-direction: column;
                transition: 0.5s;
                border-style: solid;
                border-color: #2c2c2c;
                .title {
                    height: 40px;
                    padding: 10px;
                }
                .img {
                    width: 100%;
                    height: 100%;
                    background-size: 80%;
                    background-repeat: no-repeat;
                    background-position: center;
                    transition: 0.5s;
                }
                &:hover {
                    border-color: #474747;
                    background-color: #242424;
                    .img {
                        transform: scale(1.03);
                    }
                }
            }
        }
    }
}

.mask {
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

#_warning {
    display: unset;

    .warning {
        width: 500px;
        height: auto;
        min-height: 200px;
        position: fixed;
        left: 50%;
        top: 10%;
        margin-left: -250px;
        background-color: #fff;
        border-radius: 15px;
        box-shadow: 0 5px 8px rgba(0, 0, 0, 0.05);
        z-index: 3000;
        display: flex;
        flex-direction: column;
        background-color: rgba(50, 50, 50, 0.7);
        padding: 36px;
        transition: 0.3s;
        max-height: 90vh !important;
        opacity: 1;
        max-width: 90vw;
        min-width: 500px;

        a:link {
            color: rgb(10, 95, 252);
        }

        a:visited {
            color: rgb(10, 95, 252);
        }
    }
}

#_warning.hide .warning {
    transform: scale(0.8);
    opacity: 0;
}

#_warning.none {
    display: none;
}

.desktop .mask {
    top: 28px;
    height: calc(100% - 28px);
}
</style>
