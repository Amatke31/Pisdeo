<template>
    <div class="html-chooser"></div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { ObjToHTML } from "../../../utils/exchange/html";
export default defineComponent({
    data() {
        return {
            html: [],
        };
    },
    watch: {
        html: function(e) {
            console.log(e);
            console.log(ObjToHTML(e))
        },
    },
    mounted: function() {
        this.html = this.$store.state.project.program.file[
            this.$store.state.project.buffer.currentFile
        ];
    },
});
</script>
<style lang="scss" scoped>
.html-chooser {
    margin: 4px;
    width: 20vw;
    height: 60vh;
    background-color: #222;
    border-radius: 8px;
    border: 1px solid #555;
}
</style>
