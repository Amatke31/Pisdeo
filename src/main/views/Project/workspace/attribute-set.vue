<template>
    <div class="attr-set">
        <h2 class="elementName">
            {{ $t(`element.${attribute.element.split(".").pop()}`) }}
        </h2>
        <span v-if="attribute.element !== '.text'">
            <div :class="attrBar">
                <div class="btn set" @click="attrPage = 'set'">
                    {{ $t("attr.set") }}
                </div>
                <div class="btn computed" @click="attrPage = 'computed'">
                    {{ $t("attr.computed") }}
                </div>
            </div>
            <div class="frame" v-if="attrPage == 'set'">
                <div id="generalFrame" :class="frame.general.class">
                    <div class="folder">
                        <icon-down
                            class="arrow"
                            theme="outline"
                            size="16"
                            fill="#aaa"
                            @click="fold('general')"
                        />
                        <div>{{ $t("attr.general") }}</div>
                    </div>
                    <el-collapse-transition>
                        <div class="content" v-show="frame.general.class == 'open'">
                            <div class="setDiv">
                                <div class="attrName">
                                    {{ $t("attr.elementName") + ":" }}
                                </div>
                                <el-input
                                    size="small"
                                    class="attrInput"
                                    v-model="vN['elementName']"
                                    @change="setAttr('elementName', vN['elementName'])"
                                />
                            </div>
                            <div class="setDiv">
                                <div class="attrName">
                                    {{ $t("attr.class") + ":" }}
                                </div>
                                <el-input
                                    size="small"
                                    class="attrInput"
                                    v-model="vN['class']"
                                    @change="setAttr('class', vN['class'])"
                                />
                            </div>
                            <div class="setDiv">
                                <div class="attrName">
                                    {{ $t("attr.id") + ":" }}
                                </div>
                                <el-input
                                    size="small"
                                    class="attrInput"
                                    v-model="vN['id']"
                                    @change="setAttr('id', vN['id'])"
                                />
                            </div>
                            <div class="setDiv">
                                <div class="attrName">
                                    {{ $t("attr.element") + ":" }}
                                </div>
                                <el-select
                                    size="small"
                                    class="attrInput"
                                    placeholder=" "
                                    v-model="vN['element']"
                                    @change="setAttr('element', vN['element'])"
                                    :disabled="['html', 'head', 'body'].includes(vN['element'])"
                                >
                                    <el-option
                                        v-for="item in allElement"
                                        :key="item"
                                        :label="$t(`element.${item}`)"
                                        :value="item"
                                    />
                                </el-select>
                            </div>
                        </div>
                    </el-collapse-transition>
                </div>
                <div id="attrFrame" :class="frame.attr.class">
                    <div class="folder">
                        <icon-down
                            class="arrow"
                            theme="outline"
                            size="16"
                            fill="#aaa"
                            @click="fold('attr')"
                        />
                        <div>{{ $t("attr.attr") }}</div>
                    </div>
                    <el-collapse-transition>
                        <div class="content" v-show="frame.attr.class == 'open'">
                            <div v-for="item in routine" :key="item.name" class="setDiv">
                                <div v-if="!item.custom" class="attrName">
                                    {{ $t(item.id) + ":" }}
                                </div>
                                <el-input
                                    v-else
                                    class="attrName custom"
                                    v-model="vT[item.name]"
                                    size="small"
                                    @change="setAttrT(item.name, vT[item.name])"
                                >
                                    {{ $t(item.id) + ":" }}
                                </el-input>
                                <el-input
                                    v-if="item.type == 'text' && !item.custom"
                                    size="small"
                                    class="attrInput"
                                    v-model="v[item.name]"
                                    @change="setAttr(item.name, v[item.name])"
                                />
                                <el-input
                                    v-if="item.type == 'text' && item.custom"
                                    size="small"
                                    class="attrInput"
                                    v-model="v[item.name]"
                                    @change="setAttr(vT[item.name], v[item.name])"
                                />
                                <el-checkbox
                                    v-if="item.type == 'checkbox'"
                                    class="attrInput"
                                    v-model="v[item.name]"
                                    size="small"
                                    @change="setAttrC(item.name, v[item.name])"
                                />
                                <el-select
                                    v-if="item.type == 'select'"
                                    size="small"
                                    class="attrInput"
                                    placeholder=" "
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
                                <icon-close-small
                                    :class="
                                        'attrDel' +
                                            (canDel(!item.custom ? item.name : vT[item.name])
                                                ? ''
                                                : ' disable')
                                    "
                                    theme="outline"
                                    size="16"
                                    @click="delAttr(!item.custom ? item.name : vT[item.name])"
                                    :fill="
                                        canDel(!item.custom ? item.name : vT[item.name])
                                            ? '#eee'
                                            : '#333'
                                    "
                                />
                            </div>
                        </div>
                    </el-collapse-transition>
                </div>
                <div id="styleFrame" :class="frame.style.class">
                    <div class="folder">
                        <icon-down
                            class="arrow"
                            theme="outline"
                            size="16"
                            fill="#aaa"
                            @click="fold('style')"
                        />
                        <div>{{ $t("attr.style") }}</div>
                    </div>
                    <el-collapse-transition>
                        <div class="content" v-show="frame.style.class == 'open'">
                            <div v-if="attribute.element == 'style'">
                                <div
                                    v-for="(selector, key) in vC"
                                    :key="selector"
                                    :class="'cssSelector ' + vCFolder[selector.class]"
                                >
                                    <div class="cssName">
                                        <icon-down
                                            class="arrow"
                                            theme="outline"
                                            size="16"
                                            fill="#aaa"
                                            @click="
                                                vCFolder[selector.class] =
                                                    vCFolder[selector.class] == 'fold'
                                                        ? 'open'
                                                        : 'fold'
                                            "
                                        />
                                        <el-input
                                            size="small"
                                            class="attrInput"
                                            v-model="vCT2[selector.class]"
                                            @change="setCSST(selector.class, key)"
                                        />
                                    </div>
                                    <el-collapse-transition>
                                        <div
                                            v-show="vCFolder[selector.class] == 'open'"
                                            class="cssFolder"
                                        >
                                            <div
                                                v-for="(item, key2) in css[selector.class]"
                                                :key="item.label"
                                                class="setDiv"
                                            >
                                                <el-input
                                                    size="small"
                                                    class="attrInput custom"
                                                    v-model="vCT[selector.class][item.label]"
                                                    @change="
                                                        setCSSTT(
                                                            selector.class,
                                                            key,
                                                            key2,
                                                            item.label
                                                        )
                                                    "
                                                />:
                                                <el-input
                                                    size="small"
                                                    class="attrInput"
                                                    v-model="vC[key].content[key2].value"
                                                    @change="setCSS()"
                                                />
                                            </div>
                                        </div>
                                    </el-collapse-transition>
                                </div>
                            </div>
                        </div>
                    </el-collapse-transition>
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
import { ElMessage } from "element-plus";
import { defineComponent } from "vue";
import { setAttribute, delAttribute, setAttributeT } from "../../../utils/resolve/attribute";

const noAttr = ["children", "element", "elementName", "class", "css"];

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
                general: {
                    class: "fold",
                    height: "100px",
                },
                attr: {
                    class: "fold",
                    height: "100px",
                },
                style: {
                    class: "open",
                    height: "100px",
                },
            },
            attrPage: "set",
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
                button: [
                    { name: "autofocus", type: "checkbox", id: "button.autofocus" },
                    { name: "disabled", type: "checkbox", id: "button.disabled" },
                ],
                input: [
                    {
                        name: "autocomplete",
                        type: "select",
                        id: "input.autocomplete",
                        default: "on",
                        select: [
                            { name: "on", id: "input.autocomplete.on" },
                            { name: "off", id: "input.autocomplete.off" },
                        ],
                    },
                ],
                div: [],
            },
            v: {} as any,
            vT: {},
            vN: {
                class: "",
                id: "",
                elementName: "",
                element: "",
            },
            vC: [] as Array<any>,
            vCT: {},
            vCT2: {},
            vCFolder: {},
        };
    },
    computed: {
        attrBar() {
            return `attrBar ${this.attrPage}`;
        },
        routine() {
            let main = this.allRoutine[this.attribute!.element]
                ? this.allRoutine[this.attribute!.element]
                : [];
            let other: Array<Object> = [];
            for (let i in this.v) {
                if (
                    noAttr.indexOf(i) == -1 &&
                    main.find(function(obj: any) {
                        return obj.name == i;
                    }) == undefined
                ) {
                    other.push({
                        name: i,
                        id: `nt.${i}`,
                        type: "text",
                        custom: true,
                    });
                    this.vT[i] = i;
                }
            }
            let out = [...other, ...main];
            out.sort(function(a, b) {
                return a.name.toLowerCase().charCodeAt(0) - b.name.toLowerCase().charCodeAt(0);
            });
            return out;
        },
        css() {
            let out = {};
            this.vCT = {};
            this.vCT2 = {};
            this.vC.forEach((i) => {
                out[i.class] = [];
                this.vCT[i.class] = {};
                this.vCT2[i.class] = i.class;
                i.content.forEach((j) => {
                    out[i.class].push(j);
                    this.vCT[i.class][j.label] = j.label;
                });
            });
            return out;
        },
        allElement() {
            let out: Array<string> = [];
            for (let item in this.allRoutine) {
                out.push(item);
            }
            return out;
        },
    },
    watch: {
        attribute: function(n) {
            this.refreshAttr(n);
        },
        text: function(n) {
            if (!this.lock) {
                this.$store.dispatch(
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
        setAttr: function(attr: string, value: string | Boolean) {
            if (!this.lock) {
                this.$store.dispatch(
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
        delAttr: function(attr: string) {
            if (!this.lock) {
                if (this.canDel(attr)) {
                    this.$store.dispatch(
                        "refreshViewWithCode",
                        delAttribute(
                            this.$store.getters.currentFileContent,
                            this.$store.getters.getHTMLChooserLayer,
                            2,
                            {
                                changeAttr: attr,
                            }
                        )
                    );
                    this.refreshAttr(this.attribute);
                }
            }
        },
        setAttrT: function(attr: string, value: string) {
            if (!this.lock) {
                let main = this.allRoutine[this.attribute!.element]
                    ? this.allRoutine[this.attribute!.element]
                    : [];
                if (
                    main.find(function(obj: any) {
                        return obj.name == value;
                    }) !== undefined ||
                    this.attribute![value] !== undefined
                ) {
                    this.refreshAttr(this.attribute);
                    ElMessage({
                        showClose: true,
                        message: this.$t("attr.warning.repeat"),
                        type: "error",
                    });
                } else if (value == "") {
                    this.refreshAttr(this.attribute);
                    ElMessage({
                        showClose: true,
                        message: this.$t("attr.warning.null"),
                        type: "error",
                    });
                } else {
                    this.$store.dispatch(
                        "refreshViewWithCode",
                        setAttributeT(
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
            }
        },
        setAttrC: function(attr: string, value: Boolean) {
            if (!this.lock) {
                if (value == true) {
                    this.setAttr(attr, true);
                } else if (value == false) {
                    this.delAttr(attr);
                }
            }
        },
        canDel: function(attr: string) {
            if (this.attribute![attr] == undefined) {
                return false;
            } else {
                return true;
            }
        },
        refreshAttr: function(n: any) {
            this.lock = true;
            this.text = n.text ? n.text : "";
            setTimeout(() => {
                this.lock = false;
            }, 100);
            this.v = {};
            (this.allRoutine[this.attribute!.element]
                ? this.allRoutine[this.attribute!.element]
                : []
            ).forEach((attr: any) => {
                this.v[attr.name] = attr.default
                    ? attr.default
                    : attr.type !== "checkout"
                    ? ""
                    : false;
            });
            this.v = { ...this.v, ...this.attribute };
            this.vN = {
                elementName: this.attribute!.elementName ? this.attribute!.elementName : "",
                class: this.attribute!.class ? this.attribute!.class : "",
                id: this.attribute!.id ? this.attribute!.id : "",
                element: this.attribute!.element,
            };

            //style css

            this.vC = [];
            this.vCFolder = {};
            if (this.attribute!.css) {
                this.attribute!.css.forEach((e: any) => {
                    this.vC.push(e);
                    this.vCFolder[e.class] = "open";
                });
            }

            //element css

            const css = this.$store.state.project.workspace.css;
            let cssHave: Array<string> = [];
            for (let i in css) {
                cssHave.push(i);
            }
            const className = this.v.class ? this.v.class : "";
            const classNames = className.split(" ");
            classNames.forEach((i: string) => {
                if (cssHave.includes(`.${i}`)) {
                    console.log(cssHave.indexOf(`.${i}`), css);
                    this.vC.push(css[cssHave[cssHave.indexOf(`.${i}`)]]);
                }
            });
            console.log(this.vC);
        },
        setCSS: function() {
            this.$store.dispatch(
                "refreshViewWithCode",
                setAttribute(
                    this.$store.getters.currentFileContent,
                    this.$store.getters.getHTMLChooserLayer,
                    2,
                    {
                        changeAttr: "css",
                        value: this.vC,
                    }
                )
            );
        },
        setCSST: function(selector: string, key: string) {
            this.vC[key].class = this.vCT2[selector];
            this.vCFolder[this.vCT2[selector]] = "open";
            this.setCSS();
        },
        setCSSTT: function(selector: string, key: string, key2: string, item: string) {
            this.vC[key].content[key2].label = this.vCT[selector][item];
            this.setCSS();
        },
    },
});
</script>
<style lang="scss" scoped>
.elementName {
    margin: 0 4px;
    user-select: none;
}

.content {
    overflow: hidden;
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

    .attrBar.set .btn.set {
        background-color: #444;
        border-bottom: 2px solid #999;
    }

    .attrBar.computed .btn.computed {
        background-color: #444;
        border-bottom: 2px solid #999;
    }

    .textEdit {
        user-select: text;
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
            cursor: pointer;

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
}

.content {
    display: flex;
    flex-direction: column;

    .setDiv {
        display: flex;
        margin: 7px auto;
        align-items: center;

        * {
            font-size: 12px;
        }

        .attrName {
            width: 100px;

            &.custom {
                padding: 0 4px;
            }
        }

        .attrInput {
            width: calc(20vw - 10px - 100px - 20px);
        }

        .attrDel {
            width: 16px;
            margin: 4px;
            transition: 0.3s;
            border-radius: 4px;
            cursor: pointer;

            &:hover {
                background-color: #444;
            }

            &.disable {
                background-color: unset;
                cursor: default;
            }
        }
    }

    .cssSelector {
        .cssName {
            height: 24px;
            background-color: #292929;
            display: flex;

            .arrow {
                margin: 3px;
                padding: 1px;
                transform: rotate(-90deg);
                border-radius: 4px;
                transition: 0.1s;
                cursor: pointer;

                &:hover {
                    background-color: #333;
                }
            }
        }

        .cssFolder {
            .setDiv {
                justify-content: space-evenly;
            }
        }

        &.open {
            .arrow {
                transform: rotate(0deg);
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
                                width: 43px;
                            }

                            .paddingNum {
                                width: 43px;
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
