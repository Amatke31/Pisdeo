<template>
    <div class="start">
        <div class="nav">
            <div class="nav-left">
                <n-icon size="24" class="back" @click="$emit('goToStartPage')">
                    <BackIcon />
                </n-icon>
                <h1>{{ $t("setting.title") }}</h1>
            </div>
            <div class="nav-right"></div>
        </div>
        <div class="main">
            <n-space vertical>
                <n-layout has-sider>
                    <n-layout-sider
                        bordered
                        collapse-mode="width"
                        :collapsed-width="64"
                        :width="150"
                        show-trigger
                    >
                        <n-menu
                            v-model:value="option"
                            :collapsed-width="64"
                            :collapsed-icon-size="22"
                            :options="menuOptions"
                        />
                    </n-layout-sider>
                    <n-layout>
                        <div v-if="option == 'setting.general'" class="right scroll">
                            <div class="title">{{ $t("setting.general") }}</div>
                            <n-space align="center">
                                <div>{{ $t("setting.language") }}:</div>
                                <n-select
                                    v-model:value="lang"
                                    class="m-2 select"
                                    placeholder="Select"
                                    size="medium"
                                    :options="supportLang"
                                />
                            </n-space>
                            <div>
                                <n-btn @click="reset">
                                    {{ $t("setting.reset") }}
                                </n-btn>
                            </div>
                        </div>
                        <div v-else-if="option == 'setting.account'" class="right">
                            <div class="title">{{ $t("setting.account") }}</div>
                            <div></div>
                        </div>
                        <div v-else-if="option == 'setting.develop'" class="right">
                            <div class="title">{{ $t("setting.develop") }}</div>
                            <div style="display:block;max-width:300px">
                                <n-select
                                    v-model:value="toolState"
                                    class="m-2 select"
                                    placeholder="Select"
                                    size="large"
                                    :options="toolStateList"
                                />
                                <n-select
                                    v-model:value="openTestProjectInAppLoad"
                                    class="m-2 select"
                                    placeholder="Select"
                                    size="large"
                                    :options="openTestProjectInAppLoadStateList"
                                />
                                <n-btn @click="sendCommand('loadTestProject')">
                                    {{ $t("setting.loadTestProject") }}
                                </n-btn>
                            </div>
                        </div>
                        <div v-else-if="option == 'setting.about'" class="right">
                            <About />
                        </div>
                        <div
                            v-for="{ key } in menuOptions"
                            :key="key"
                            v-show="
                                option == key &&
                                    option != 'setting.general' &&
                                    option != 'setting.account' &&
                                    option != 'setting.develop' &&
                                    option != 'setting.about'
                            "
                            class="right"
                        ></div>
                    </n-layout>
                </n-layout>
            </n-space>
        </div>
    </div>
</template>
<script lang="ts">
import { Component } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { setLocale } from "../lib/common";
import platform from "../lib/platform/platform";
import { recovery } from "../lib/platform/web/file";
import { MenuOption, NIcon } from "naive-ui";
import {
    SettingsOutline as SettingIcon,
    PersonOutline as PersonIcon,
    HammerOutline as HammerIcon,
    InformationOutline as InfoIcon,
    ArrowBack as BackIcon,
} from "@vicons/ionicons5";
import { useI18n } from "vue-i18n";
import About from "./about.vue";

function renderIcon(icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) });
}

export default defineComponent({
    name: "Setting",
    data() {
        return {
            option: "setting.general" as string,
            supportLang: [] as any,
            toolState: "development",
            toolStateList: [
                {
                    label: this.$t("setting.enableToolAlways"),
                    value: "always",
                },
                {
                    label: this.$t("setting.enableToolJustDevelopment"),
                    value: "development",
                },
                {
                    label: this.$t("setting.unableToolAlways"),
                    value: "never",
                },
            ],
            openTestProjectInAppLoad: "close",
            openTestProjectInAppLoadStateList: [
                {
                    label: "When load app, auto open the test project",
                    value: "open",
                },
                {
                    label: "Close",
                    value: "close",
                },
            ],
            platform: platform[0].toUpperCase() + platform.substr(1),
        };
    },
    async created() {
        this.toolState = localStorage.getItem("nwddevtool") as string;
        this.openTestProjectInAppLoad = localStorage.getItem("ltpwal") as string;
    },
    mounted: function() {
        this.lang = this.$i18n.locale;
        this.$i18n.availableLocales.forEach((lang) => {
            this.supportLang.push({
                value: lang,
                label: this.$t(`language.${lang}`),
            });
        });
    },
    watch: {
        lang: async function(lang) {
            const lastLang = this.$i18n.locale;
            this.$i18n.locale = lang;
            if (platform === "desktop") {
                const setResult = await setLocale(this.lang);
                if (setResult == "successful") {
                } else {
                    ElMessage.error(this.$t("welcome.setlocaleerror"));
                    this.$i18n.locale = lastLang;
                    if (lastLang.indexOf("zh") == 0) {
                        this.$i18n.fallbackLocale = "zh_cn";
                    } else {
                        this.$i18n.fallbackLocale = "en_us";
                    }
                }
            } else {
                setLocale(this.lang);
            }
            if (lang.indexOf("zh") == 0) {
                this.$i18n.fallbackLocale = "zh_cn";
            } else {
                this.$i18n.fallbackLocale = "en_us";
            }
        },
        toolState: function(n) {
            this.sendCommand(`setToolState.${n}`);
        },
        openTestProjectInAppLoad: function(n) {
            this.sendCommand(`setAutoOpenTestProject.${n}`);
        },
    },
    setup(props, { emit }) {
        const { t } = useI18n();
        let lang = ref("en_us");
        const menuOptions: MenuOption[] = [
            {
                label: () => t("setting.general"),
                key: "setting.general",
                icon: renderIcon(SettingIcon),
            },
            {
                label: () => t("setting.account"),
                key: "setting.account",
                icon: renderIcon(PersonIcon),
            },
            {
                label: () => t("setting.develop"),
                key: "setting.develop",
                icon: renderIcon(HammerIcon),
            },
            {
                label: () => t("setting.about"),
                key: "setting.about",
                icon: renderIcon(InfoIcon),
            },
        ];
        function sendCommand(command: string) {
            emit("sendCommand", command);
        }
        function reset() {
            ElMessageBox.confirm(t("setting.reset.warning"), "Warning", {
                confirmButtonText: t("common.confirm"),
                cancelButtonText: t("common.cancel"),
                type: "warning",
                beforeClose: (action: any, instance: any, done: any) => {
                    if (action === "confirm") {
                        instance.confirmButtonLoading = true;
                        instance.confirmButtonText = "Loading...";

                        if (platform == "desktop") {
                        } else if (platform == "web") {
                            recovery((success: Boolean) => {
                                if (success) {
                                    instance.confirmButtonLoading = true;
                                    done();
                                } else {
                                    ElMessage.error(t("setting.reseterror"));
                                    done();
                                }
                            });
                        }
                    } else {
                        done();
                    }
                },
            })
                .then(() => {
                    ElMessage({
                        type: "success",
                        message: t("setting.reset.success"),
                    });
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                })
                .catch(() => {});
        }
        return {
            menuOptions,
            sendCommand,
            reset,
            lang,
        };
    },
    components: { About, BackIcon },
});
</script>

<style lang="scss" scoped>
.nav {
    padding: 12px;
    background-color: #222;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 72px;

    .back {
        transition: 0.5s;
        width: 50px;
        height: 50px;
        padding: 13px 0;
        border-radius: 50%;

        &:hover {
            background-color: #333;
        }
    }

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
    display: flex;
    .menu {
        padding: 0;
        width: 205px;
        background-color: #181818;
        @media screen and (max-width: 600px) {
            width: 70px;
        }
    }
    .right {
        width: 100%;
        height: 100%;
        padding: 8px 16px;
        overflow-y: scroll;

        @media screen and (max-width: 600px) {
            width: calc(100% - 70px);
        }

        & > div {
            margin-bottom: 10px;

            div {
                display: inline-block;
                margin-right: 10px;
            }
        }

        & > div > div {
            margin-bottom: 10px;

            div {
                display: inline-block;
                margin-right: 10px;
            }
        }

        .title {
            font-size: 32px;
        }
    }
    .right {
        color: rgba(0, 0, 0, 0);
        transition: color 0.3s ease;
    }
    .right:hover {
        color: rgba(0, 0, 0, 0.3);
    }
}
</style>
