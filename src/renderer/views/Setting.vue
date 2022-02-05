<template>
    <div class="start">
        <div class="nav">
            <div class="nav-left">
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
                    :title="$t(`setting.${value.toLowerCase()}`)"
                    :prepend-icon="icon"
                ></v-list-item>
            </v-list>
            <div v-if="option == 'Common'" class="right">
                <div class="title">{{ $t("setting.common") }}</div>
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
            </div>
            <div v-else-if="option == 'Account'" class="right">
                <div class="title">{{ $t("setting.account") }}</div>
            </div>
            <div v-else-if="option == 'About'" class="right">
                <h1>NexWebDesigner</h1>
                <p>{{ $t("about.introduce") }}</p>
                <p>Version: {{ version }}</p>
                <p>Environment: {{ platform }}</p>
                <br />
                <p>Released under the AGPL-3.0</p>
                <p>Copyright © 2021-2022 Amatke31</p>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { ElMessage } from "element-plus";
import { defineComponent } from "vue";
import { getVersion, setLocale } from "../utils/env";
import platform from "../utils/platform/platform";

export default defineComponent({
    name: "Setting",
    data() {
        return {
            lang: "",
            option: "Common",
            menuOption: [
                ["Common", "mdi-cog"],
                ["Account", "mdi-account"],
                ["About", "mdi-information"],
            ],
            supportLang: [] as any,
            version: "",
            platform,
        };
    },
    async created() {
        this.version = await getVersion();
    },
    mounted: function () {
        this.lang = this.$i18n.locale;
        this.$i18n.availableLocales.forEach((lang) => {
            this.supportLang.push({
                value: lang,
                label: this.$t(`language.${lang}`),
            });
        });
    },
    watch: {
        lang: async function (lang) {
            const lastLang = this.$i18n.locale;
            this.$i18n.locale = lang;
            if (platform === "desktop") {
                const setResult = await setLocale(this.lang);
                if (setResult == "successful") {
                } else {
                    ElMessage.error(this.$t("welcome.setlocaleerror"));
                    this.$i18n.locale = lastLang;
                }
            }
        },
    },
});
</script>

<style lang="scss" scoped>
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
    display: flex;
    .menu {
        width: 205px;
    }
    .right {
        width: calc(100% - 205px);
        height: 100%;
        padding: 8px 16px;
        overflow-y: scroll;

        & > div {
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
