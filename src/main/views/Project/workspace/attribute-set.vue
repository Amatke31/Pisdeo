<template>
    <div class="attributeSet">
        <h2 style="user-select: none;">
            {{ $t(`element.${attribute.element.split(".").pop()}`) }}
        </h2>
        <div class="attrBar">
            <div class="btn">{{ $t('attr.set') }}</div>
            <div class="btn">{{ $t('attr.calc') }}</div>
        </div>
        <div class="textEdit" v-if="attribute.element == '.text'">
            <v-textarea
                :label="$t('attr.text')"
                v-model="text"
                color="text-white"
                variant="underlined"
            ></v-textarea>
        </div>
        <div class="frame" v-else>
            <div id="edgeFrame" :class="frame.edge.class">
                <div class="folder"></div>
                <div>
                    <div class="margin">
                    </div>
                    <div class="padding">
                    </div>
                    <div class="border">
                    </div>
                    <div class="outline">
                    </div>
                </div>
            </div>
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
                    height: "100px"
                },
            },
        };
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
.attributeSet {
    width: 15vw;
    height: 60vh;
    background-color: #222;
    overflow: hidden;
    padding: 0 4px;
}
</style>
