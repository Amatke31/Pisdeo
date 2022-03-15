<template>
    <div class="window">
        <div v-if="step == 1">
            <i class="img iconfont icon-earth"></i>
            <div class="title">{{ $t("welcome.lang.choose") }}</div>
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
            <n-btn @click="setLanguage()" class="nS">{{
                $t("common.nextstep")
            }}</n-btn>
        </div>
        <div v-else-if="step == 2" style="height: 100%">
            <div class="title">{{ $t("welcome.legal") }}</div>
            <Legal style="height: 80%" />
            <n-btn @click="step++" class="nS">{{ $t("common.agree") }}</n-btn>
        </div>
        <div v-else-if="step == 3" style="height: 100%">
            <div class="title">{{ $t("welcome.complete") }}</div>
            <n-btn @click="complete()" class="et">{{
                $t("common.enter")
            }}</n-btn>
        </div>
        <div v-if="false">
            <i class="img iconfont icon-accountcircle"></i>
            <div class="title">{{ $t("welcome.account.ask") }}</div>
            <div
                style="
                    width: 60%;
                    margin: 64px 20%;
                    display: flex;
                    justify-content: space-between;
                "
            >
                <n-btn @click="step++">{{ $t("common.refuse") }}</n-btn>
                <n-btn @click="login()">{{ $t("common.agree") }}</n-btn>
            </div>
        </div>
    </div>
    <div class="mask"></div>
</template>
<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { ElMessage } from "element-plus";
import { setLocale, getSystemLocale, inited } from "../utils/common";
import Legal from "../components/legal.vue";
import platform from "../utils/platform/platform";

export default defineComponent({
    emits: ["goStart"],
    components: { Legal },
    data() {
        return {
            step: 1,
            lang: "",
            supportLang: [] as any,
        };
    },
    mounted: async function() {
        const systenLang = await getSystemLocale();
        this.lang = this.$i18n.availableLocales.includes(systenLang)
            ? systenLang
            : "en_us";
        this.$i18n.availableLocales.forEach((lang) => {
            this.supportLang.push({
                value: lang,
                label: this.$t(`language.${lang}`),
            });
        });
    },
    watch: {
        lang(lang) {
            this.$i18n.locale = lang;
        },
    },
    methods: {
        setLanguage: async function() {
            this.$i18n.locale = this.lang;
            if (platform === "desktop") {
                const setResult = await setLocale(this.lang);
                if (setResult == "successful") {
                    this.step++;
                } else {
                    ElMessage.error(this.$t("welcome.setlocaleerror"));
                }
            } else {
                setLocale(this.lang);
                this.step++;
            }
        },
        complete: async function() {
            if (platform === "desktop") {
                const setResult = await inited();
                if (setResult == "successful") {
                    this.$emit("goStart");
                } else {
                    ElMessage.error(this.$t("welcome.initerror"));
                }
            } else {
                inited();
                this.$emit("goStart");
            }
        },
    },
});
</script>
<style lang="scss" scoped>
.window {
    transform: scale(1);
    width: 750px;
    height: 600px;
    position: fixed;
    top: calc((100vh - 600px) / 2);
    border-radius: 15px;
    box-shadow: 0 5px 8px rgba(0, 0, 0, 0.05);
    z-index: 20;
    display: flex;
    flex-direction: column;
    background-color: rgb(50, 50, 50);
    padding: 36px;
    left: calc((100vw - 750px) / 2);
    opacity: 1;
    transition: 0.3s;
    padding-top: 96px;
    text-align: center;

    .img {
        font-size: 96px;
        text-align: center;
        width: 100%;
        display: block;
    }

    .title {
        font-weight: 500;
        font-size: 32px;
        text-align: center;
        width: 100%;
    }

    .select {
        width: 60%;
        text-align: center;
        margin: 30px 20%;

        .option {
            width: 60%;
        }
    }

    .et {
        margin: 50% 40%;
    }
}
@media (orientation: portrait) {
    .window {
        width: 100vw;
        height: 100vh;
        min-width: none;
        min-height: none;
        margin: 0;
        left: 0;
        top: 0;
        overflow-y: auto;
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
    z-index: 10;
    backdrop-filter: blur(2px);
    background-color: rgba(50, 50, 50, 0.7);
}
.desktop {
    height: calc(100% - 28px);
    top: 28px;
}
</style>
