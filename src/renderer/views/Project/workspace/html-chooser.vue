<template>
    <div class="html-chooser">
        <div id="html-chooser"></div>
    </div>
</template>
<script lang="ts">
import { createElementBlock, defineComponent } from "vue";
import { ObjToElement } from "../../../utils/exchange/html";
export default defineComponent({
    data() {
        return {
            html: [],
        };
    },
    watch: {
        html: function(e) {
            console.log(e);
            document
                .getElementById("html-chooser")!
                .appendChild(this.ObjToHtmlchooser(e));
        },
    },
    mounted: function() {
        this.html = this.$store.state.project.program.file[
            this.$store.state.project.buffer.currentFile
        ];
    },
    methods: {
        ObjToHtmlchooser: function(obj: any) {
            let out: HTMLElement = this.analysisObj(
                obj,
                document.createElement("div"),
                1
            );
            return out;
        },
        analysisObj: function(
            obj: any,
            element: HTMLElement,
            i: number
        ): HTMLElement {
            let out: HTMLElement = document.createElement("div");
            out.innerText = obj.element;
            out.className = `layer`;
            out.style.paddingLeft = `${(i - 1) * 8 + 4}px`;
            element.appendChild(out);
            for (let child in obj.children) {
                element = this.analysisObj(obj.children[child], element, i + 1);
            }
            return element;
        },
    },
});
</script>
<style lang="scss">
.html-chooser {
    margin: 4px;
    width: 20vw;
    height: 60vh;
    background-color: #222;
    border-radius: 8px;
    border: 1px solid #555;
    overflow: hidden;
}

.layer {
    width: 100%;
    font-size: 10px;
    padding: 2px 4px;
    outline: 1px solid #222;
}

.layer:hover {
    background-color: #292929;
}
</style>
