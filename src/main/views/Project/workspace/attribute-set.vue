<template>
    <div class="attributeSet">
        <h2 class="elementName">
            {{ $t(`element.${attribute.element.split(".").pop()}`) }}
        </h2>
        <span v-if="attribute.element !== '.text'">
            <div :class="attrBar">
                <div class="btn style" @click="attrPage = 'style'">
                    {{ $t("attr.style") }}
                </div>
                <div class="btn computed" @click="attrPage = 'computed'">
                    {{ $t("attr.computed") }}
                </div>
            </div>
            <div class="frame" v-if="attrPage == 'style'">
                <div id="edgeFrame" :class="frame.edge.class">
                    <div class="folder">{{ $t("attr.edge") }}</div>
                    <div>
                        <div class="margin"></div>
                        <div class="padding"></div>
                        <div class="border"></div>
                        <div class="outline"></div>
                    </div>
                </div>
            </div>
            <div class="frame" v-if="attrPage == 'computed'"></div>
        </span>
        <div class="textEdit" v-else>
            <v-textarea
                :label="$t('attr.text')"
                v-model="text"
                color="text-white"
                variant="underlined"
            ></v-textarea>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { setAttribute } from "../../../utils/exchange/attribute";

export default defineComponent({
    props: {
        attribute: {
            type: Object,
        },
    },
    data() {
        return {
            lock: false,
            text: "",
            frame: {
                edge: {
                    class: "fold",
                    height: "100px",
                },
            },
            attrPage: "style",
        };
    },
    computed: {
        attrBar() {
            return `attrBar ${this.attrPage}`;
        },
    },
    watch: {
        attribute: function(n) {
            this.lock = true;
            this.text = n.text ? n.text : "";
            setTimeout(() => {
                this.lock = false;
            }, 100);
        },
        text: function(n) {
            if (!this.lock) {
                let htmlChooser = this.$store.state.project.workspace.htmlChooser.split(
                    "-"
                );
                this.$store.commit(
                    "refreshViewWithCode",
                    setAttribute(
                        this.$store.state.project.workspace.openFile[
                            this.$store.state.project.workspace.currentFile
                        ].context,
                        htmlChooser,
                        2,
                        {
                            changeAttr: "text",
                            text: n,
                        }
                    )
                );
            }
        },
    },
});
</script>
<style lang="scss" scoped>
.elementName {
    margin: 0 4px;
    user-select: none;
}

.attributeSet {
    width: 15vw;
    height: 60vh;
    background-color: #222;
    overflow: hidden;

    .attrBar {
        height: 36px;
        background-color: #292929;
        display: flex;
        border-top: 1px solid rgba(204, 204, 204, 0.2);
        padding: 0 2px;

        .btn {
            padding: 5px 6px;
            margin: 2px 0px;
            font-size: 14px;
            cursor: pointer;

            &:hover,
            &:focus {
                background-color: #333;
            }
        }
    }

    .attrBar.style .btn.style {
        background-color: #444;
        border-bottom: 1px solid #999;
    }

    .attrBar.computed .btn.computed {
        background-color: #444;
        border-bottom: 1px solid #999;
    }
}

.frame {
    // margin-top: 10px;
    border-top: 1px solid rgba(204, 204, 204, 0.2);
    box-shadow: #000000 0 6px 6px -6px inset;

    .folder {
        height: 22px;
        background-color: #292929;
    }
}
</style>
