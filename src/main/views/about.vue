<template>
    <h1 style="display: flex;"><img style="width: 46px;" :src="logo" />Pisdeo</h1>
    <p>{{ $t("about.introduce") }}</p>
    <p>Version: {{ appVersionFull }}</p>
    <p>Compile Time: {{ compileTime }}</p>
    <p>Commit Hash: {{ commitHash }}</p>
    <p>Platform: {{ platform }}</p>
    <br />
    <p>Copyright © 2021-2022 Amatke31. All rights reserved.</p>
    <p>
        Released under the
        <a style="color:#58a6ff" href="https://www.gnu.org/licenses/agpl-3.0.txt" target="_blank"
            >AGPL-3.0</a
        >
    </p>
    <div class="link">
        <a style="color:#58a6ff" href="https://github.com/amatke31/pisdeo" target="_blank">
            <n-icon size="24"><Github /></n-icon>
        </a>
        <a style="color:#58a6ff" href="https://discord.gg/AKsk8DFZxz" target="_blank">
            <n-icon size="24"><Discord /></n-icon>
        </a>
        <a
            style="color:#58a6ff"
            href="https://qun.qq.com/qqweb/qunpro/share?_wv=3&_wwv=128&appChannel=share&inviteCode=1W7WlxO&businessType=9&from=181074&biz=ka&shareSource=5"
            target="_blank"
        >
            <n-icon size="24"><Qq /></n-icon>
        </a>
        <!-- <a style="color:#58a6ff" href="https://gitee.com/amatke31/pisdeo" target="_blank">
            {{ $t("about.gitee") }}
        </a> -->
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { appVersion, appVersionFull, compileTime, commitHash } from "@/main/lib/app-info";
import platform from "../lib/platform/platform";
import { Github, Discord, Qq } from "@vicons/fa";

export default defineComponent({
    name: "About",
    data() {
        return {
            appVersion,
            appVersionFull,
            compileTime,
            commitHash,
            platform: platform[0].toUpperCase() + platform.substr(1),
            logo: require("../../assets/pisdeo/logo_transparent_dark.png"),
        };
    },
    components: { Github, Discord, Qq },
});
</script>
<style lang="scss">
.link {
    padding: 10px 0;

    a {
        margin: 10px;
    }
}
</style>
