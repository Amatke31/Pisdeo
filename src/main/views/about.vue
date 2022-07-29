<template>
    <h1>Pisdeo</h1>
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
    <div>
        <a style="color:#58a6ff" href="https://github.com/amatke31/pisdeo" target="_blank">
            <n-icon size="32"><LogoGithub /></n-icon>
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
import { LogoGithub } from "@vicons/ionicons5";

export default defineComponent({
    name: "About",
    data() {
        return {
            appVersion,
            appVersionFull,
            compileTime,
            commitHash,
            platform: platform[0].toUpperCase() + platform.substr(1),
        };
    },
    components: { LogoGithub },
});
</script>
