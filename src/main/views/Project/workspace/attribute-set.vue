<template>
    <div class="attributeSet">
        <div class="textEdit">
            <v-text-field
                :label="$t('attr.text')"
                v-model="text"
                color="text-white"
                variant="underlined"
                v-if="attribute.element == '.text'"
            ></v-text-field>
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
    padding: 10px 4px;
}
</style>
