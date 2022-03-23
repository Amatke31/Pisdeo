<template>
    <div class="attributeSet"></div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { getAttribute } from "../../../utils/exchange/attribute";

export default defineComponent({
    data() {
        return {
            attribute: [],
        };
    },
    created: function() {
        this.$store.subscribe((mutation, state) => {
            if (mutation.type == "chooseElement") {
                let htmlChooser = state.project.workspace.htmlChooser.split(
                    "-"
                );
                console.log(
                    getAttribute(
                        state.project.program.file[
                            state.project.workspace.currentFile
                        ],
                        htmlChooser,
                        2
                    )
                );
            }
        });
    },
});
</script>
<style lang="scss" scoped>
.attributeSet {
    margin: 2px;
    width: 20vw;
    height: 60vh;
    background-color: #222;
    border-radius: 8px;
    border: 1px solid #444;
    overflow: hidden;
}
</style>
