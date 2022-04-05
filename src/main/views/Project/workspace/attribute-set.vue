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
                    <div class="folder">
                        <icon-down
                            class="arrow"
                            theme="outline"
                            size="16"
                            fill="#aaa"
                            @click="fold('edge')"
                        />
                        <div>{{ $t("attr.edge") }}</div>
                    </div>
                    <div class="content">
                        <div class="Show">
                            <div class="marginFrame">
                                <span class="flexItem">
                                    <span class="marginTip">margin</span>
                                    <span class="marginNum">0</span>
                                    <span class="marginTip"></span>
                                </span>
                                <span class="flexItem">
                                    <span class="marginNum">0</span>
                                    <div class="borderFrame">
                                        <span class="flexItem">
                                            <span class="marginTip"
                                                >border</span
                                            >
                                            <span class="marginNum">0</span>
                                            <span class="marginTip"></span>
                                        </span>
                                        <span class="flexItem">
                                            <span class="marginNum">0</span>
                                            <div class="paddingFrame">
                                                <span class="flexItem">
                                                    <span class="marginTip"
                                                        >padding</span
                                                    >
                                                    <span class="marginNum"
                                                        >0</span
                                                    >
                                                    <span
                                                        class="marginTip"
                                                    ></span>
                                                </span>
                                                <span class="flexItem">
                                                    <span class="marginNum"
                                                        >0</span
                                                    >
                                                    <div
                                                        class="contentFrame"
                                                    ></div>
                                                    <span class="marginNum"
                                                        >0</span
                                                    >
                                                </span>
                                                <span class="flexItem">
                                                    <span
                                                        class="marginTip"
                                                    ></span>
                                                    <span class="marginNum"
                                                        >0</span
                                                    >
                                                    <span
                                                        class="marginTip"
                                                    ></span>
                                                </span>
                                            </div>
                                            <span class="marginNum">0</span>
                                        </span>
                                        <span class="flexItem">
                                            <span class="marginTip"></span>
                                            <span class="marginNum">0</span>
                                            <span class="marginTip"></span>
                                        </span>
                                    </div>
                                    <span class="marginNum">0</span>
                                </span>
                                <span class="flexItem">
                                    <span class="marginTip"></span>
                                    <span class="marginNum">0</span>
                                    <span class="marginTip"></span>
                                </span>
                            </div>
                        </div>
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
    methods: {
        fold: function(which: string) {
            this.frame[which].class =
                this.frame[which].class == "fold" ? "open" : "fold";
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
        border-bottom: 2px solid #999;
    }

    .attrBar.computed .btn.computed {
        background-color: #444;
        border-bottom: 2px solid #999;
    }
}

.frame {
    border-top: 1px solid rgba(204, 204, 204, 0.2);
    box-shadow: #000000 0 6px 6px -6px inset;

    .folder {
        height: 22px;
        background-color: #292929;
        display: flex;

        .arrow {
            margin: 3px;
            padding: 1px;
            transform: rotate(-90deg);
            border-radius: 4px;

            &:hover {
                background-color: #333;
            }
        }
    }

    .open .folder {
        height: 22px;
        background-color: #292929;
        display: flex;

        .arrow {
            transform: rotate(0deg);
        }

        .content {
            display: block;
        }
    }

    .content {
        display: none;
    }

    .open .content {
        display: block;
    }
}

.content {
    .Show {
        height: 240px;
        display: flex;
        justify-content: center;
        align-items: center;

        * {
            color: #333;
        }

        .marginFrame {
            background-color: rgb(216, 173, 120);
            height: 180px;
            width: 220px;
            display: flex;
            flex-direction: column;

            .flexItem {
                width: 100%;
                display: flex;
                justify-content: space-around;

                .marginTip {
                    width: 73px;
                    font-size: 14px;
                }

                .marginNum {
                    width: 24px;
                    font-size: 14px;
                    text-align: center;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .borderFrame {
                    width: 190px;
                    height: 140px;
                    background-color: rgb(232, 202, 126);
                    border: 1px solid #292929;

                    .paddingFrame {
                        width: 160px;
                        height: 96px;
                        background-color: rgb(150, 219, 131);
                        border: 1px solid #292929;

                        .contentFrame {
                            width: 200px;
                            height: 52px;
                            background-color: rgb(131, 187, 219);
                            border: 1px solid #292929;
                        }
                    }
                }
            }
        }
    }
}
</style>
