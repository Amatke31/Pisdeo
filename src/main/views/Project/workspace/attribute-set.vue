<template>
    <div class="attributeSet">
        <div class="textEdit">
            <v-text-field
                :label="$t('attr.text')"
                v-model="text"
                color="text-white"
            ></v-text-field>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        attribute: {
            type: Object,
        },
    },
    data() {
        return {
            text: "",
        };
    },
    watch: {
        attribute: function(n) {
            this.text = n.text ? n.text : "";
        },
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

.textEdit {
    // display: flex;
}
</style>
