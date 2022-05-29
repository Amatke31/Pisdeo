<template>
    <div :class="msgCss" id="_msg">
        <div class="msg" v-if="width == 'auto'" :style="'width:auto'">
            <div class="" v-html="html"></div>
        </div>
        <div
            class="msg"
            v-else
            :style="
                'width:' + width + ';margin-left:-' + width.slice(0, width.length - 2) / 2 + 'px;'
            "
        >
            <div class="" v-html="html"></div>
        </div>
        <div class="mask" @click="close"></div>
    </div>
</template>

<script>
export default {
    emits: ["close"],
    name: "Window",
    data() {
        return {
            msgCss: "hide none",
        };
    },
    props: {
        html: {
            type: String,
            default: "",
        },
        isShow: {
            type: Boolean,
            default: false,
        },
        width: {
            type: String,
            default: "500px",
        },
    },
    methods: {
        close: function() {
            this.$emit("close");
        },
    },
    watch: {
        isShow() {
            if (this.isShow == true) {
                this.msgCss = "hide";
                setTimeout(() => {
                    this.msgCss = "";
                }, 50);
            } else {
                this.msgCss = "hide";
                setTimeout(() => {
                    this.msgCss = "hide none";
                }, 300);
            }
        },
    },
};
</script>
<style lang="scss" scoped>
#_msg {
    display: unset;
}

.msg {
    width: 500px;
    height: auto;
    min-height: 200px;
    position: fixed;
    left: 50%;
    top: 10%;
    margin-left: -250px;
    background-color: #fff;
    border-radius: 15px;
    box-shadow: 0 5px 8px rgba(0, 0, 0, 0.05);
    z-index: 3000;
    display: flex;
    flex-direction: column;
    background-color: rgba(50, 50, 50, 0.9);
    padding: 36px;
    transition: 0.3s;
    max-height: 90vh !important;
    opacity: 1;
    max-width: 90vw;
    min-width: 500px;
}

.hide .msg {
    transform: scale(0.8);
    opacity: 0;
}

.mask {
    transition: 0.3s;
    position: fixed;
    width: 100%;
    height: calc(100% - 28px);
    left: 0;
    top: 28px;
    opacity: 1;
    overflow: hidden;
    z-index: 2000;
    backdrop-filter: blur(2px);
    background-color: rgba(50, 50, 50, 0.7);
}

.hide .mask {
    opacity: 0;
}

#_msg.none {
    display: none;
}
</style>
