<template>
    <div class="project">
        <menubar />
        <workspace :attribute="attribute" :viewer="viewer" />
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { translCss } from "../utils/lib/css";
import workspace from "./Project/workspace.vue";
import menubar from "./Project/menubar.vue";
export default defineComponent({
    props: {
        attribute: {
            type: Object,
        },
        viewer: {
            type: String,
        },
    },
    components: { workspace, menubar },
    mounted() {
        translCss(this.$t);
    },
    methods: {
        goToStartPage: function() {
            this.$emit("goToStartPage");
        },
    },
});
</script>

<style lang="scss" scoped>
.project {
    height: 100vh;
}

.project * {
    user-select: none;
}
</style>
