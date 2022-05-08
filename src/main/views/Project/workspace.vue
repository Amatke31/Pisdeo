<template>
    <div class="workspace">
        <div class="above">
            <htmlChooser class="html-chooser" :attribute="attribute" />
            <viewer class="viewer" :viewer="viewer" />
            <attributeSet class="attr-set" :attribute="attribute" />
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
.workspace {
    height: 100%;
}

.above {
    display: flex;
    height: 100%;

    .html-chooser {
        width: 20vw;
    }
    .viewer {
        width: 60vw;
    }
    .attr-set {
        width: 20vw;
    }
}
</style>
