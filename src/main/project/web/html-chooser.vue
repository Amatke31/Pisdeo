<template>
    <div class="html-chooser">
        <div class="elementBar">
            <el-dropdown size="small" @command="addElement" :disabled="!canAddElement">
                <icon-plus
                    :class="add"
                    size="16"
                    @click="
                        if (canAddElement) {
                            openChooser = true;
                        }
                    "
                    :fill="!canAddElement ? '#333' : '#eee'"
                />
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item v-for="item in recent" :key="item" :command="item">{{
                            $t(`element.${item}`)[0].toUpperCase() + $t(`element.${item}`).substr(1)
                        }}</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <icon-minus
                :class="rm"
                size="16"
                @click="removeElement"
                :fill="!canRmElement ? '#333' : '#eee'"
            />
        </div>
        <div ref="htmlChooser" id="html-chooser" class="scroll" @click="htmlChoose"></div>
        <n-window :open="openChooser" @close="openChooser = false" class="ew" style="padding:16px;">
            <el-tabs v-model="elementWindow" type="card">
                <el-tab-pane :label="$t('common.recent')" name="recent">
                    <div class="ewp scroll">
                        <element-card
                            v-for="item in recent"
                            :key="item"
                            :element="item"
                            @click="addElement(item)"
                        />
                    </div>
                </el-tab-pane>
                <el-tab-pane :label="$t('common.basic')" name="basic">
                    <v-text-field
                        :label="$t('common.search')"
                        variant="underlined"
                        v-model="search"
                    ></v-text-field>
                    <div v-if="search == ''" class="ewp scroll">
                        <element-card
                            v-for="item in canAddList"
                            :key="item"
                            :element="item"
                            @click="addElement(item)"
                        />
                    </div>
                    <div v-else class="ewp scroll">
                        <element-card
                            v-for="item in canAddList.filter((e) => {
                                return (
                                    e.indexOf(search.toLowerCase()) != -1 ||
                                    $t(`element.${e}`).indexOf(search.toLowerCase()) != -1
                                );
                            })"
                            :key="item"
                            :element="item"
                            @click="addElement(item)"
                        />
                    </div>
                </el-tab-pane>
                <el-tab-pane :label="$t('common.component')" name="component"></el-tab-pane>
            </el-tabs>
        </n-window>
    </div>
</template>
<script lang="ts">
import { defineComponent, toRaw } from "vue";
import { addElement, removeElement } from "../../utils/resolve/html";
import { canAddList, cantAdd } from "../../utils/lib/html";
import elementCard from "../../components/elementCard.vue";
const supportExt = ["html", "htm", "css", "js"];
const disableAdd = [".text", "html", "style", "script", "img", "input", "br"];
export default defineComponent({
    props: {
        attribute: {
            type: Object,
        },
    },
    data() {
        return {
            html: [],
            click: "",
            openChooser: false,
            elementWindow: "recent",
            canAddList,
            recent: ["div", "p", "a", "text", "style"] as Array<string>,
            search: "",
        };
    },
    components: { "element-card": elementCard },
    computed: {
        canAddElement() {
            return !disableAdd.includes(this.attribute!.element);
        },
        canRmElement() {
            return !cantAdd.includes(this.attribute!.element);
        },
        add() {
            return this.canAddElement ? "addElement" : "addElement disable";
        },
        rm() {
            return this.canRmElement ? "addElement" : "addElement disable";
        },
    },
    watch: {
        click: function(e) {
            this.$store.commit({ type: "chooseElement", element: e });
        },
    },
    mounted: function() {
        this.html = this.$store.getters.currentFileContent;
        this.refreshChooser();
        this.htmlChoose({ target: { id: "layer-0" } });
        const unsub = this.$store.subscribeAction((action, state) => {
            if (
                action.type == "openFile" &&
                state.project.workspace.currentFile &&
                supportExt.includes(state.project.workspace.currentFile.split(".").pop())
            ) {
                switch (state.project.workspace.currentFile.split(".").pop()) {
                    case "html":
                        this.html = this.$store.getters.currentFileContent;
                        this.refreshChooser();
                        break;
                }
            }
            if (
                action.type == "refreshViewWithCode" &&
                state.project.workspace.currentFile &&
                supportExt.includes(state.project.workspace.currentFile.split(".").pop())
            ) {
                switch (state.project.workspace.currentFile.split(".").pop()) {
                    case "html":
                        this.html = this.$store.getters.currentFileContent;
                        this.refreshChooser();
                        this.htmlChoose({ target: { id: this.click } });
                        break;
                }
            }
            if (action.type == "unrender") {
                unsub();
            }
        });
        document.onkeydown = (e: any) => {
            if (e.code == "Space" && e.target.id.indexOf("layer") == 0) {
                this.htmlChoose(e);
            }
        };
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
            out.innerText = obj.elementName ? obj.elementName : this.elementToText(obj.element);
            out.className = `layer`;
            out.id = `${root}-${ans}`;
            out.style.paddingLeft = `${i * 8 + 4}px`;
            out.setAttribute("tabindex", "0");
            element.appendChild(out);
            let ansaz = 0;
            if (obj.children) {
                for (let child in obj.children) {
                    element = this.analysisObj(obj.children[child], element, i + 1, out.id, ansaz);
                    ansaz++;
                }
            }
            return element;
        },
        htmlChoose: function(e: any) {
            let chooseId = e.target.id;
            if (chooseId.indexOf("layer") == 0) {
                if (this.click) {
                    document.getElementById(this.click)!.className = `layer`;
                }
                document.getElementById(chooseId)!.className = `layer choose`;
                this.click = chooseId;
            } else {
                document.getElementById(this.click)!.className = `layer`;
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
        addElement: function(element: string) {
            if (this.canAddElement) {
                element = element === "text" ? ".text" : element;
                let addElementInfo: any = { element };
                switch (element) {
                    case ".text":
                        addElementInfo.text = "";
                        break;
                }
                let htmlChooser = this.click.split("-");
                this.$store.dispatch(
                    "refreshViewWithCode",
                    addElement(
                        this.$store.getters.currentFileContent,
                        htmlChooser,
                        2,
                        addElementInfo
                    )
                );
                element = element === ".text" ? "text" : element;
                if (!this.recent.includes(element)) {
                    this.recent.unshift(element);
                } else {
                    this.recent = this.recent.filter((e) => {
                        return e !== element;
                    });
                    this.recent.unshift(element);
                }
            }
        },
        removeElement: function() {
            if (this.canRmElement) {
                let htmlChooser = this.click.split("-");
                this.htmlChoose({
                    target: {
                        id: this.click.slice(
                            0,
                            this.click.length - (this.click.split("-").pop()!.length + 1)
                        ),
                    },
                });
                this.$store.dispatch(
                    "refreshViewWithCode",
                    removeElement(toRaw(this.$store.getters.currentFileContent), htmlChooser, 2)
                );
            }
        },
        refreshChooser: function() {
            document.getElementById("html-chooser")!.innerHTML = this.ObjToHtmlchooser(
                this.html
            ).innerHTML;
        },
    },
});
</script>
<style lang="scss">
.html-chooser {
    height: 100%;
    background-color: #222;
    display: flex;
    flex-direction: column;
}

#html-chooser {
    height: 100%;
    overflow: overlay;
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
        color: #fff;

        &:hover {
            background-color: #393939;
        }

        &.disable {
            color: #aaa;

            &:hover {
                background-color: #292929;
            }
        }
    }
}

.layer {
    width: 100%;
    font-size: 10px;
    padding: 2px 4px;
    border: unset;
    cursor: pointer;
    outline: none;

    &:hover {
        background-color: #292929;
    }

    &:focus {
        padding: 1px 3px 1px 0;
        border: 1px solid #888;
        border-left: 0;
        border-right: 0;
    }

    &.choose {
        background-color: #444;

        &:focus {
            background-color: #555;
            padding: 1px 3px 1px 0;
            border: 1px solid #888;
            border-left: 0;
            border-right: 0;
        }
    }
}

.ew {
    padding: 16px;

    .ewp {
        height: 440px;
        overflow: overlay;
    }
}
</style>
