<template>
    <div ref="htmlChooser" class="html-chooser">
        <div id="html-chooser"></div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
let supportExt = ["html", "htm", "css", "js"];
export default defineComponent({
    data() {
        return {
            html: [],
            click: "",
        };
    },
    watch: {
        html: function(e) {
            document
                .getElementById("html-chooser")!
                .appendChild(this.ObjToHtmlchooser(e));
        },
        click: function(e) {
            this.$store.state.project.workspace.htmlChooser = e;
        },
    },
    mounted: function() {
        this.html = this.$store.state.project.program.file[
            this.$store.state.project.workspace.currentFile
        ];
        this.$store.subscribe((mutation, state) => {
            if (
                mutation.type == "openFile" &&
                supportExt.includes(
                    state.project.workspace.currentFile.split(".").pop()
                )
            ) {
                switch (state.project.workspace.currentFile.split(".").pop()) {
                    case "html":
                        this.html =
                            state.project.program.file[
                                state.project.workspace.currentFile
                            ];
                        break;
                }
            }
        });
        document.addEventListener("click", (e: any) => {
            let chooseId = e.path[0].id;
            if (this.click) {
                if (e.path.includes(this.$refs.htmlChooser)) {
                    document.getElementById(this.click)!.className = `layer`;
                }
            }
            if (chooseId.indexOf("layer") == 0) {
                this.click = chooseId;
                document.getElementById(chooseId)!.className = `layer choose`;
            } else {
                if (e.path.includes(this.$refs.htmlChooser)) {
                    this.click = "";
                }
            }
        });
    },
    methods: {
        ObjToHtmlchooser: function(obj: any) {
            let out: HTMLElement = this.analysisObj(
                obj,
                document.createElement("div"),
                0,
                "layer",
                0
            );
            return out;
        },
        analysisObj: function(
            obj: any,
            element: HTMLElement,
            i: number,
            root: string,
            ans: number
        ): HTMLElement {
            let out: HTMLElement = document.createElement("div");
            out.innerText = obj.element;
            out.className = `layer`;
            out.id = `${root}-${ans}`;
            out.style.paddingLeft = `${i * 8 + 4}px`;
            element.appendChild(out);
            let ansaz = 0;
            for (let child in obj.children) {
                element = this.analysisObj(
                    obj.children[child],
                    element,
                    i + 1,
                    out.id,
                    ansaz
                );
                ansaz++;
            }
            return element;
        },
    },
});
</script>
<style lang="scss">
.html-chooser {
    margin: 2px;
    width: 20vw;
    height: 60vh;
    background-color: #222;
    border-radius: 8px;
    border: 1px solid #444;
    overflow: hidden;
}

.layer {
    width: 100%;
    font-size: 10px;
    padding: 2px 4px;
    cursor: pointer;
}

.layer:hover {
    background-color: #292929;
}

.layer.choose {
    background-color: #333;
    outline: 1px solid #222;
}
</style>
