<template>
    <el-card :body-style="{ padding: '0px' }" class="element">
        <div class="itemChild">
            <span class="info">{{
                $t(`element.${element}`) + (element !== "text" ? `<${element}>` : "")
            }}</span>
            <div class="btn">
                <el-button class="button" @click="addElement(element)">{{
                    $t(`common.add`)
                }}</el-button>
            </div>
        </div>
    </el-card>
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
