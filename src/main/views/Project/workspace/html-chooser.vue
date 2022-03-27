<template>
    <div class="html-chooser">
        <div class="elementBar">
            <v-icon size="x-small" class="addElement">mdi-plus</v-icon>
        </div>
        <div ref="htmlChooser" id="html-chooser" @click="htmlChoose"></div>
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
            this.$store.commit({ type: "chooseElement", element: e });
        },
    },
    mounted: function() {
        this.html = this.$store.state.project.program.file[
            this.$store.state.project.workspace.currentFile
        ];
        this.$store.subscribe((mutation, state) => {
            if (
                mutation.type == "openFile" &&
                state.project.workspace.currentFile &&
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
            out.innerText = obj.elementName
                ? obj.elementName
                : this.elementToText(obj.element);
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
        htmlChoose: function(e: any) {
            let chooseId = e.target.id;
            if (this.click) {
                document.getElementById(this.click)!.className = `layer`;
            }
            if (chooseId.indexOf("layer") == 0) {
                this.click = chooseId;
                document.getElementById(chooseId)!.className = `layer choose`;
            } else {
                this.click = "";
            }
        },
        elementToText: function(element: string) {
            switch (element) {
                case ".text":
                    return this.$t("element.text");
                default:
                    return this.$t(`element.${element}`);
            }
        },
    },
});
</script>
<style lang="scss">
.html-chooser {
    width: 15vw;
    height: 60vh;
    background-color: #222;
    overflow: hidden;
}

.elementBar {
    height: 22px;
    background-color: #292929;
    display: flex;

    .addElement {
        margin: 3px;
        width: 16px;
        height: 16px;
        background-color: #292929;
        border-radius: 4px;

        &:hover {
            background-color: #393939;
        }
    }
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
