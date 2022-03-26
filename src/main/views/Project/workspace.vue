<template>
    <div class="workspace">
        <div class="above">
            <htmlChooser />
            <viewer :viewer="viewer" />
            <attributeSet :attribute="attribute" />
        </div>
        <div class="below"></div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import htmlChooser from "./workspace/html-chooser.vue";
import fileChooser from "./workspace/file-chooser.vue";
import viewer from "./workspace/viewer.vue";
import attributeSet from "./workspace/attribute-set.vue";
export default defineComponent({
    props: {
        attribute: {
            type: Object,
        },
        viewer: {
            type: String,
        },
    },
    components: { htmlChooser, fileChooser, viewer, attributeSet },
});
</script>
<style lang="scss" scoped>
.above {
    display: flex;
}
</style>
