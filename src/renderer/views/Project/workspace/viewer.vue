<template>
    <div class="viewer">
        <iframe ref="viewer"> </iframe>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    data() {
        return {
            viewer: null,
        };
    },
    mounted: function() {
        this.viewer = this.$store.state.project.workspace.viewer;
        let iframe = this.$refs.viewer;
        let iDoc: any = (<HTMLIFrameElement>iframe).contentDocument;
        console.log(this.viewer);
        iDoc.open();
        iDoc.write(this.viewer);
        iDoc.close();
    },
});
</script>
<style lang="scss" scoped>
.viewer {
    margin: 2px;
    width: 60vw;
    height: 60vh;
    background-color: #fff;
    border-radius: 8px;
    border: 1px solid #444;
    overflow: hidden;
}

iframe {
    width: 100%;
    height: 100%;
    border: unset;
}
</style>
