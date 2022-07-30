<template>
    <div style="height: 100%;">
        <div class="nav">
            <div class="nav-left">
                <h1>{{ $t("start.title") }}</h1>
                <n-btn v-if="isInit" @click="openStore" btnStyle="nav">{{
                    $t("start.extensions")
                }}</n-btn>
            </div>
            <div class="nav-right">
                <n-btn @click="openSetting" btnStyle="nav">{{ $t("start.setting") }}</n-btn>
            </div>
        </div>
        <div class="main">
            <div v-if="isInit" class="newProject">
                <h2 class="npt">{{ $t("start.pageNewproject") }}</h2>
                <div class="npc scroll">
                    <div
                        @click="
                            newProject({ name: 'project.website', solution: 'org.pisdeo.website' })
                        "
                        class="card"
                    >
                        <div class="img" :style="cardImg('assets/blankproject.svg')"></div>
                        <div class="title">{{ $t("project.website") }}</div>
                    </div>
                    <!-- <div @click="newProject('project.uilib')" class="card">
                        <div class="img" :style="cardImg('assets/uilib.svg')"></div>
                        <div class="title">{{ $t("project.uilib") }}</div>
                    </div>
                    <div @click="newProject('project.component')" class="card">
                        <div class="img" :style="cardImg('assets/component.svg')"></div>
                        <div class="title">{{ $t("project.component") }}</div>
                    </div> -->
                    <div
                        @click="newProject(item)"
                        v-for="item in template"
                        v-bind:key="item.name"
                        class="card"
                    >
                        <div class="img" :style="cardImg(item.cover)"></div>
                        <div class="title">{{ $t(item.name) }}</div>
                    </div>
                </div>
            </div>
        </div>
        <msg :isShow="msgIsShow" :html="msgHTML" @close="close"></msg>
        <div id="newProject">
            <n-window :open="openNWD" @close="closeNPW">
                <div class="title">
                    <h1>
                        {{
                            $t("newproject.title", {
                                solution: templateInfo.solution,
                                template: templateInfo.name,
                            })
                        }}
                    </h1>
                    <h5 style="color: #aaa">
                        {{
                            $t("newproject.madeby", {
                                author: templateInfo.extension
                                    ? templateInfo.extension.author
                                    : "Pisdeo",
                            })
                        }}
                    </h5>
                </div>
                <div class="form">
                    <div class="name">
                        <div>{{ $t("newproject.projectname") }}:</div>
                        <div v-if="platform !== 'web'">{{ $t("newproject.projectlocation") }}:</div>
                        <div
                            v-for="templateRequire in templateRequires[templateInfo.extension.id]"
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
                            v-for="templateRequire in templateRequires[templateInfo.extension.id]"
                            :key="templateRequire.name"
                            v-model="ProjectForm[templateRequire.name]"
                        />
                    </div>
                </div>
                <n-btn class="create" @click="createProject">
                    {{ $t("newproject.create") }}
                </n-btn>
            </n-window>
        </div>
    </div>
</template>
<script lang="ts">
import path from "path";
import ipc from "../lib/platform/desktop/ipc";
import platform from "../lib/platform/platform";
import getRecentList from "../lib/getRecentList";

let documentsPath: string = "";

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
            type: Object,
        },
        documentsPath: {
            type: String,
        },
        errorThrow: {
            type: Function,
        },
        templateRequires: {
            type: Object,
            default: [],
        },
    },
    data() {
        return {
            msgIsShow: false,
            errorCode: "",
            msgHTML: "",
            newProjectWCss: "hide none",
            openNWD: false,
            newProjectW: false,
            consoleText: "<p>loading...</p>",
            templateInfo: {
                name: "",
                solution: "",
                extension: {
                    author: "",
                    id: "",
                },
            } as RequireForm,
            ProjectForm: {
                name: "WebApp1",
                solution: "",
                path: "",
            } as RequireForm,
            platform,
            recentList: [] as Array<object>,
        };
    },
    async created() {
        if (platform === "desktop") {
            documentsPath = await ipc.getDocumentsPath();
        }
        getRecentList((result: Array<object>) => {
            this.recentList = result;
        });
    },
    methods: {
        newProject: function(info: {
            name: string;
            solution: string;
            extension?: { author: string; id: string };
            require?: any;
        }) {
            if (info.require) {
                info.require.forEach(
                    (parameter: { name: string; default: any; [propName: string]: any }) => {
                        this.ProjectForm[parameter.name] = parameter.default;
                    }
                );
            }
            this.templateInfo = info;
            this.ProjectForm.path = path.join(documentsPath, "Pisdeo");
            this.openNWD = true;
        },
        closeNPW: function() {
            this.openNWD = false;
        },
        close: function() {
            this.msgIsShow = false;
        },
        changePath: async function() {
            if (platform === "desktop") {
                const cppath = await ipc.chooseProjectPath();
                if (cppath != "") {
                    this.ProjectForm.path = cppath;
                }
            }
        },
        createProject: function() {
            this.closeNPW();
            this.$emit("createProject");
        },
        openStore: function() {},
        openSetting: function() {
            this.$emit("openSetting");
        },
        cardImg: function(img: string) {
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
.nav {
    padding: 12px;
    background-color: #222;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 72px;

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
    height: 100%;
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
</style>
