<template>
    <div class="project">
        <workspace :attribute="attribute" :viewer="viewer" />
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import workspace from "./Project/workspace.vue";
export default defineComponent({
    props: {
        attribute: {
            type: Object,
        },
        viewer: {
            type: String,
        },
    },
    components: { workspace },
    mounted() {},
    methods: {
        goToStartPage: function() {
            this.$emit("goToStartPage");
        },
    },
});
</script>

<style lang="scss" scoped>
.project * {
    user-select: none;
}
</style>
