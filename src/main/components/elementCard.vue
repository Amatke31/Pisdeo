<template>
    <v-card
        width="219"
        :title="$t(`element.${element}`)[0].toUpperCase() + $t(`element.${element}`).substr(1)"
        :text="element !== 'text' ? `<${element}>` : 'text'"
        variant="contained-text"
        class="element"
    >
        <v-card-actions>
            <div class="btn">
                <v-btn class="button" @click="addElement(element)">{{ $t(`common.add`) }}</v-btn>
            </div>
        </v-card-actions>
    </v-card>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    props: ["element"],
    emits: ["click"],
    methods: {
        addElement: function(element: string) {
            this.$emit("click", element);
        },
    },
});
</script>
<style lang="scss" scoped>
.element {
    background-color: #444;
    width: 219px;
    margin: 10px;
    display: inline-block;

    .itemChild {
        padding: 14px;
        display: flex;
        flex-direction: column;

        .info {
            text-align: left;
        }

        .btn {
            text-align: right;
        }
    }
}
</style>
