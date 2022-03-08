<template>
    <div>
        
    </div>
</template>

<style lang="scss" scoped>
.mask {
    transition: 0.3s;
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    opacity: 1;
    overflow: hidden;
    z-index: 2000;
    backdrop-filter: blur(2px);
    background-color: rgba(50, 50, 50, 0.7);
    padding: 36px;
    font-size: 36px;
    .cancel {
        width: 130px;
        height: 40px;
        color: rgb(209, 209, 209);
        border-radius: 5px;
        font-family: "Lato", sans-serif;
        font-weight: 500;
        background: transparent;
        cursor: pointer;
        transition: all 0.3s ease;
        position: absolute;
        display: inline-block;
        outline: none;
        padding: 0;
        border: none;
        margin-top: 10px;
    }

    .cancel.btn-1 {
        line-height: 42px;
        background: rgb(37, 37, 37);
    }

    .cancel.btn-1 span {
        color: rgb(240, 240, 240);
        position: relative;
        display: block;
        width: 100%;
        height: 100%;
        margin: 0;
        font-size: 20px;
    }

    .cancel.btn-1:hover {
        background: rgb(59, 59, 59);
        box-shadow: inset 2px 2px 2px 0px rgba(51, 51, 51, 0.5),
            7px 7px 20px 0px rgba(0, 0, 0, 0.1),
            4px 4px 5px 0px rgba(0, 0, 0, 0.1);
    }
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
    data() {
        return {
            menuFocus: "",
            submenuShow: false,
        };
    },
    props: {
        menu: {},
    },
    mounted() {},
    methods: {
        goToStartPage: function () {
            this.$emit("goToStartPage");
        },
    },
});
</script>