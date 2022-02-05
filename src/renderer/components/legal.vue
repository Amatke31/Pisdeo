<template>
    <div id="legal" v-html="legal" style="overflow-y: scroll;" />
</template>
<script>
import ipc from "../utils/platform/desktop/ipc";
import platform from "../utils/platform/platform";
import MarkdownIt from "markdown-it";
export default {
    data() {
        return {
            legal: "loading...",
        };
    },
    mounted: async function () {
        let md = new MarkdownIt();
        if (platform === "desktop") {
            this.legal = md.render(await ipc.getLegal());
        }
    },
};
</script>
<style lang="scss">
#legal {
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
#legal {
    color: rgba(0, 0, 0, 0);
    transition: color 0.3s ease;
}
#legal:hover {
    color: rgba(0, 0, 0, 0.3);
}
</style>