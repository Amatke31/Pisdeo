<template>
    <div class="start">
        <div class="nav">
            <div class="nav-left">
                <v-btn
                    @click="$emit('goToStartPage')"
                    variant="text"
                    size="large"
                    icon="mdi-arrow-left"
                />
                <h1>{{ $t("setting.title") }}</h1>
            </div>
            <div class="nav-right"></div>
        </div>
        <div class="main">
            <v-list v-model="option" class="menu">
                <v-list-item
                    v-for="([value, icon], i) in menuOption"
                    :key="i"
                    @click="option = value"
                    :title="$t(value)"
                    :prepend-icon="icon"
                ></v-list-item>
            </v-list>
            <div v-if="option == 'setting.general'" class="right scroll">
                <div class="title">{{ $t("setting.general") }}</div>
                <div>
                    <div>{{ $t("setting.language") }}:</div>
                    <el-select
                        v-model="lang"
                        class="m-2 select"
                        placeholder="Select"
                        size="large"
                    >
                        <el-option
                            v-for="item in supportLang"
                            class="option"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </div>
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
                <div>
                    <n-btn @click="enableToolAlways">
                        {{ $t("setting.enableToolAlways") }}
                    </n-btn>
                    <n-btn @click="enableToolJustDevelopment">
                        {{ $t("setting.enableToolJustDevelopment") }}
                    </n-btn>
                    <n-btn @click="unableToolAlways">
                        {{ $t("setting.unableToolAlways") }}
                    </n-btn>
                </div>
            </div>
            <div v-else-if="option == 'setting.about'" class="right">
                <h1>NexWebDesigner</h1>
                <p>{{ $t("about.introduce") }}</p>
                <p>Version: {{ version.version }}</p>
                <p>Channel: {{ version.channel }}</p>
                <p>Platform: {{ platform }}</p>
                <br />
                <p>Copyright © 2021-2022 Amatke31. All rights reserved.</p>
                <p>
                    Released under the
                    <a
                        style="color:#58a6ff"
                        href="https://www.gnu.org/licenses/agpl-3.0.txt"
                        target="_blank"
                        >AGPL-3.0</a
                    >
                </p>
                <div>
                    <a
                        style="color:#58a6ff"
                        href="https://gitee.com/amatke31-work/nexwebdesigner"
                        target="_blank"
                    >
                        {{ $t("about.gitee") }}
                    </a>
                </div>
            </div>
            <div
                v-for="[id, icon, child] in menuOption"
                :key="id"
                v-show="
                    option == id &&
                        option != 'setting.general' &&
                        option != 'setting.account' &&
                        option != 'setting.develop' &&
                        option != 'setting.about'
                "
                class="right"
            >
                <div style="display: none">{{ `防报错${icon}` }}</div>
                <div v-for="({ type, run }, i) in child" :key="i">
                    <h1 v-if="type.type == 'title'">{{ $t(id) }}</h1>
                    <p v-else-if="type.type == 'text'">{{ type.content }}</p>
                    <p v-else-if="type.type == 'textAsync'" v-text="run()"></p>
                    <n-btn v-else-if="type.type == 'btn'" @click="run()">{{
                        type.text
                    }}</n-btn>
                    <br v-else-if="type.type == 'br'" />
                    <div v-if="type.type == 'select'">{{ type.name }}:</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { ElMessage, ElMessageBox } from "element-plus";
import { defineComponent } from "vue";
import { getVersion, setLocale } from "../utils/common";
import platform from "../utils/platform/platform";
import { recovery } from "../utils/platform/web/file";

export default defineComponent({
    name: "Setting",
    props: ["menuOption"],
    data() {
        return {
            lang: "",
            option: "setting.general",
            supportLang: [] as any,
            version: {
                isProduction: false,
                buildTime: "Manual Build",
                version: "Manual Build",
                channel: "Develop",
            } as Object,
            platform: platform[0].toUpperCase() + platform.substr(1),
            resetDialog: false,
        };
    },
    async created() {
        this.version = await getVersion();
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
                        this.$i18n.fallbackLocale = "en";
                    }
                }
            } else {
                setLocale(this.lang);
            }
        },
    },
    methods: {
        reset: function() {
            ElMessageBox.confirm(this.$t("setting.reset.warning"), "Warning", {
                confirmButtonText: this.$t("common.confirm"),
                cancelButtonText: this.$t("common.cancel"),
                type: "warning",
                beforeClose: (action: any, instance: any, done: any) => {
                    if (action === "confirm") {
                        instance.confirmButtonLoading = true;
                        instance.confirmButtonText = "Loading...";
                        if (platform == "desktop") {
                        } else {
                            recovery((success: Boolean) => {
                                if (success) {
                                    instance.confirmButtonLoading = true;
                                    done();
                                } else {
                                    ElMessage.error(
                                        this.$t("setting.reseterror")
                                    );
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
                        message: this.$t("setting.reset.success"),
                    });
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                })
                .catch(() => {});
        },
        enableToolAlways: function() {
            localStorage.setItem("nwddevtool", "always");
            this.$emit("refreshToolStatus");
        },
        enableToolJustDevelopment: function() {
            localStorage.setItem("nwddevtool", "development");
            this.$emit("refreshToolStatus");
        },
        unableToolAlways: function() {
            localStorage.setItem("nwddevtool", "never");
            this.$emit("refreshToolStatus");
        },
    },
});
</script>

<style lang="scss" scoped>
.n-btn {
    margin: 4px;
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
        width: calc(100% - 205px);
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
</style>
