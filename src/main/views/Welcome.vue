<template>
    <n-window :open="true">
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
    </n-window>
    <div class="mask"></div>
</template>
<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { ElMessage } from "element-plus";
import { setLocale, getSystemLocale, inited } from "../utils/common";
import Legal from "../components/legal.vue";
import platform from "../utils/platform/platform";

export default defineComponent({
    name: "Welcome",
    emits: ["goStart"],
    components: { Legal },
    data() {
        return {
            step: 1,
            lang: "",
            supportLang: [] as any,
        };
    },
    created: async function() {
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
        if (this.lang.indexOf("zh") == 0) {
            this.$i18n.fallbackLocale = "zh_cn";
        } else {
            this.$i18n.fallbackLocale = "en_us";
        }
    },
    watch: {
        lang(lang) {
            this.$i18n.locale = lang;
            if (lang.indexOf("zh") == 0) {
                this.$i18n.fallbackLocale = "zh_cn";
            } else {
                this.$i18n.fallbackLocale = "en_us";
            }
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
.desktop {
    height: calc(100% - 28px);
    top: 28px;
}
</style>
