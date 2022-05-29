<template>
    <LegalZH v-if="lang == 'zh'" class="legal scroll" style="overflow-y: scroll" />
    <LegalEN
        v-else-if="lang == 'en'"
        class="legal scroll"
        style="overflow-y: overlay"
    />
</template>
<script>
import Legal_zh from "../../legal/legal_zh.md";
import Legal_en from "../../legal/legal_en.md";
export default {
    components: { LegalZH: Legal_zh, LegalEN: Legal_en },
    data() {
        return {
            lang: "en",
        };
    },
    mounted: function() {
        let lang = this.$i18n.locale;
        if (lang.indexOf("zh_") == 0) this.lang = "zh";
        else this.lang = "en";
    },
};
</script>
<style lang="scss">
.legal {
    h1 {
        font-size: 22px;
    }
    h2 {
        font-size: 20px;
    }
    h3 {
        font-size: 18px;
    }
    h4 {
        font-size: 16px;
    }
    h5 {
        font-size: 14px;
    }
    h6 {
        font-size: 12px;
    }
    p {
        font-size: 15px;
    }
}
</style>
