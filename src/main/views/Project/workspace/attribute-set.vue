<template>
    <div class="attr-set">
        <h2 class="elementName">
            {{ $t(`element.${attribute.element.split(".").pop()}`) }}
        </h2>
        <span v-if="attribute.element !== '.text'">
            <div :class="attrBar">
                <div class="btn style" @click="attrPage = 'style'">
                    {{ $t("attr.style") }}
                </div>
                <div class="btn attr" @click="attrPage = 'attr'">
                    {{ $t("attr.attr") }}
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
                    <el-collapse-transition>
                        <div class="content" v-show="frame.edge.class == 'open'"></div>
                    </el-collapse-transition>
                </div>
            </div>
            <div class="attrFrame" v-if="attrPage == 'attr'">
                <div v-for="item in routine" :key="item.name" class="setDiv">
                    <div class="attrName">{{ $t(item.id) + ":" }}</div>
                    <el-input
                        v-if="item.type !== 'select'"
                        size="small"
                        class="attrInput"
                        v-model="v[item.name]"
                        @change="setAttr(item.name, v[item.name])"
                    />
                    <el-select
                        v-if="item.type == 'select'"
                        size="small"
                        class="attrInput"
                        v-model="v[item.name]"
                        @change="setAttr(item.name, v[item.name])"
                    >
                        <el-option
                            v-for="item in item.select"
                            :key="item.name"
                            :label="$t(item.id)"
                            :value="item.name"
                        />
                    </el-select>
                </div>
            </div>
            <div class="frame" v-if="attrPage == 'computed'">
                <div class="edgeShow">
                    <div class="marginFrame">
                        <div class="flexItemTop">
                            <div class="marginTip">margin</div>
                            <div class="marginNum">0</div>
                            <div class="marginTip"></div>
                        </div>
                        <div class="flexItemMiddle">
                            <div class="marginNum">0</div>
                            <div class="borderFrame">
                                <div class="flexItemTop">
                                    <div class="borderTip">border</div>
                                    <div class="borderNum">0</div>
                                    <div class="borderTip"></div>
                                </div>
                                <div class="flexItemMiddle">
                                    <div class="borderNum">0</div>
                                    <div class="paddingFrame">
                                        <div class="flexItemTop">
                                            <div class="paddingTip">
                                                padding
                                            </div>
                                            <div class="paddingNum">
                                                0
                                            </div>
                                            <div class="paddingTip"></div>
                                        </div>
                                        <div class="flexItemMiddle">
                                            <div class="paddingNum">
                                                0
                                            </div>
                                            <div class="contentFrame">
                                                1x1
                                            </div>
                                            <div class="paddingNum">
                                                0
                                            </div>
                                        </div>
                                        <div class="flexItemBottom">
                                            <div class="paddingTip"></div>
                                            <div class="paddingNum">
                                                0
                                            </div>
                                            <div class="paddingTip"></div>
                                        </div>
                                    </div>
                                    <div class="borderNum">0</div>
                                </div>
                                <div class="flexItemBottom">
                                    <div class="borderTip"></div>
                                    <div class="borderNum">0</div>
                                    <div class="borderTip"></div>
                                </div>
                            </div>
                            <div class="marginNum">0</div>
                        </div>
                        <div class="flexItemBottom">
                            <div class="marginTip"></div>
                            <div class="marginNum">0</div>
                            <div class="marginTip"></div>
                        </div>
                    </div>
                </div>
            </div>
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
import { setAttribute } from "../../../utils/resolve/attribute";

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
                    class: "open",
                    height: "100px",
                },
            },
            attrPage: "style",
            unit: [
                {
                    label: "px",
                    value: "px",
                },
                {
                    label: "em",
                    value: "em",
                },
                {
                    label: "vw",
                    value: "vw",
                },
                {
                    label: "vh",
                    value: "vh",
                },
            ],
            allRoutine: {
                a: [
                    { name: "download", type: "text", id: "a.download" },
                    { name: "href", type: "text", id: "a.href" },
                    {
                        name: "target",
                        type: "select",
                        id: "a.target",
                        default: "_self",
                        select: [
                            { name: "_self", id: "a.target.self" },
                            { name: "_blank", id: "a.target.blank" },
                            { name: "_parent", id: "a.target.parent" },
                            { name: "_top", id: "a.target.top" },
                        ],
                    },
                ],
            },
            v: {},
        };
    },
    computed: {
        attrBar() {
            return `attrBar ${this.attrPage}`;
        },
        routine() {
            return this.allRoutine[this.attribute!.element];
        },
    },
    watch: {
        attribute: function(n) {
            this.lock = true;
            this.text = n.text ? n.text : "";
            setTimeout(() => {
                this.lock = false;
            }, 100);
            this.v = {};
            this.allRoutine[this.attribute!.element].forEach((attr: any) => {
                this.v[attr.name] = attr.default ? attr.default : "";
            });
            this.v = { ...this.v, ...this.attribute };
        },
        text: function(n) {
            if (!this.lock) {
                this.$store.commit(
                    "refreshViewWithCode",
                    setAttribute(
                        this.$store.getters.currentFileContent,
                        this.$store.getters.getHTMLChooserLayer,
                        2,
                        {
                            changeAttr: "text",
                            value: n,
                        }
                    )
                );
            }
        },
    },
    methods: {
        fold: function(which: string) {
            this.frame[which].class = this.frame[which].class == "fold" ? "open" : "fold";
        },
        setAttr: function(attr: string, value: string) {
            if (!this.lock) {
                this.$store.commit(
                    "refreshViewWithCode",
                    setAttribute(
                        this.$store.getters.currentFileContent,
                        this.$store.getters.getHTMLChooserLayer,
                        2,
                        {
                            changeAttr: attr,
                            value: value,
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

.attr-set {
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

    .attrBar.attr .btn.attr {
        background-color: #444;
        border-bottom: 2px solid #999;
    }

    .textEdit {
        user-select: text;
    }
}

.attrFrame {
    border-top: 1px solid rgba(204, 204, 204, 0.2);
    box-shadow: #000000 0 6px 6px -6px inset;
    display: flex;
    flex-direction: column;

    .setDiv {
        display: flex;
        margin: 7px auto;

        * {
            font-size: 12px;
        }

        .attrName {
            width: 100px;
        }

        .attrInput {
            width: calc(20vw - 10px - 100px);
        }
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
            transition: 0.1s;

            &:hover {
                background-color: #333;
            }
        }
    }

    .open .folder {
        .arrow {
            transform: rotate(0deg);
        }
    }
}

#edgeFrame .content {
    display: flex;
    align-items: center;
    flex-direction: column;

    * {
        font-size: 10px;
    }

    input {
        padding: 2px 4px;
    }
    select {
        padding: 2px 2px;
    }
    .input {
        margin: 2px;
        border: 1px solid #444;
        border-radius: 8px;
    }
    .double {
        display: flex;

        .maininput {
            width: 70%;
        }

        .subinput {
            width: 30%;
        }
    }

    .num {
        width: 60px;

        &.double {
            .maininput {
                width: 60%;
            }

            .subinput {
                width: 40%;
            }
        }
    }
}

.edgeShow {
    height: 160px;
    display: flex;
    justify-content: center;

    * {
        color: #333;
        font-size: 14px;
    }

    .marginFrame {
        background-color: rgb(216, 173, 120);
        height: 150px;
        width: 190px;
        display: flex;
        flex-direction: column;
        border: 1px dashed #292929;

        .flexItemTop,
        .flexItemBottom {
            display: flex;
            justify-content: space-around;
            height: 20px;

            .marginTip {
                padding: 0 4px;
                width: 73px;
            }

            .marginNum {
                width: 73px;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }

        .flexItemMiddle {
            display: flex;
            justify-content: space-around;
            height: 160px;

            .marginNum {
                width: 15px;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .borderFrame {
                width: 160px;
                height: 110px;
                background-color: rgb(232, 202, 126);
                border: 1px solid #292929;
                display: flex;
                flex-direction: column;

                .flexItemTop,
                .flexItemBottom {
                    display: flex;
                    justify-content: space-around;
                    height: 20px;

                    .borderTip {
                        padding: 0 4px;
                        width: 63px;
                    }

                    .borderNum {
                        width: 63px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                }

                .flexItemMiddle {
                    display: flex;
                    justify-content: space-around;
                    height: 120px;

                    .borderNum {
                        width: 15px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                    .paddingFrame {
                        width: 130px;
                        height: 68px;
                        background-color: rgb(150, 219, 131);
                        border: 1px dashed #292929;
                        display: flex;
                        flex-direction: column;

                        .flexItemTop,
                        .flexItemBottom {
                            display: flex;
                            justify-content: space-around;
                            height: 20px;

                            .paddingTip {
                                padding: 0 4px;
                                width: 53px;
                            }

                            .paddingNum {
                                width: 53px;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                            }
                        }

                        .flexItemMiddle {
                            display: flex;
                            justify-content: space-around;
                            height: 120px;

                            .paddingNum {
                                width: 15px;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                            }

                            .contentFrame {
                                width: 100px;
                                height: 26px;
                                background-color: rgb(131, 187, 219);
                                border: 1px solid #292929;
                                padding: 1px;
                                display: flex;
                                justify-content: center;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
