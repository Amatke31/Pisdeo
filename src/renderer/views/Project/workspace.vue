<template>
    <div class="workspace">
        <div class="above">
            <htmlChooser />
            <viewer />
        </div>
        <div class="below"></div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import htmlChooser from "./workspace/html-chooser.vue";
import fileChooser from "./workspace/file-chooser.vue";
import viewer from "./workspace/viewer.vue";
export default defineComponent({
    components: { htmlChooser, fileChooser, viewer },
});
</script>
<style lang="scss" scoped>
.above {
    display: flex;
}
</style>