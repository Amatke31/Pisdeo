<template>
    <div class="html-chooser">
        <div class="elementBar">
            <n-dropdown
                trigger="hover"
                placement="bottom-start"
                :options="recentList"
                :disabled="!canAddElement"
                @select="_addElement"
                size="small"
            >
                <icon-plus
                    :class="add"
                    size="16"
                    @click="
                        if (canAddElement) {
                            openChooser = true;
                        }
                    "
                    :fill="!canAddElement ? '#333' : '#eee'"
                />
            </n-dropdown>
            <icon-minus
                :class="rm"
                size="16"
                @click="removeElement"
                :fill="!canRmElement ? '#333' : '#eee'"
            />
        </div>
        <div class="scroll">
            <component :is="htmlChooser"></component>
        </div>
        <n-window :open="openChooser" @close="openChooser = false" class="ew" style="padding:16px;">
            <n-tabs v-model:value="elementWindow" type="card" animated>
                <n-tab-pane name="recent" :tab="$t('common.recent')">
                    <div class="ewp scroll">
                        <element-card
                            v-for="item in recent"
                            :key="item"
                            :element="item"
                            @click="_addElement(item)"
                        />
                    </div>
                </n-tab-pane>
                <n-tab-pane name="basic" :tab="$t('common.basic')">
                    <v-text-field
                        :label="$t('common.search')"
                        variant="underlined"
                        v-model="search"
                    ></v-text-field>
                    <div v-if="search == ''" class="ewp scroll">
                        <element-card
                            v-for="item in canAddList"
                            :key="item"
                            :element="item"
                            @click="_addElement(item)"
                        />
                    </div>
                    <div v-else class="ewp scroll">
                        <element-card
                            v-for="item in canAddList.filter((e) => {
                                return (
                                    e.indexOf(search.toLowerCase()) != -1 ||
                                    $t(`element.${e}`).indexOf(search.toLowerCase()) != -1
                                );
                            })"
                            :key="item"
                            :element="item"
                            @click="_addElement(item)"
                        />
                    </div>
                </n-tab-pane>
                <n-tab-pane name="component" :tab="$t('common.component')"></n-tab-pane>
            </n-tabs>
        </n-window>
    </div>
</template>
<script lang="ts">
import { canAddList, cantAdd } from "../lib/html";
import elementCard from "../components/elementCard.vue";
import EventEmitter from "events";
import { useI18n } from "vue-i18n";
import { ChevronForward, ChevronDown } from "@vicons/ionicons5";
import { NIcon } from "naive-ui";
const disableAdd = [".text", "html", "style", "script", "img", "input", "br"];
export default defineComponent({
    props: {
        getEL: {
            type: Function,
            default: () => {},
        },
        addElement: {
            type: Function,
            default: (e: any) => {},
        },
        rmElement: {
            type: Function,
            default: () => {},
        },
        chooseElement: {
            type: Function,
            default: (e: any) => {},
        },
        event: {
            type: EventEmitter,
            default: new EventEmitter(),
        },
    },
    data() {
        return {
            attribute: {} as any,
            openChooser: false,
            elementWindow: "recent",
            canAddList,
            recent: ["div", "p", "a", "text", "style"] as Array<string>,
            search: "",
        };
    },
    components: { "element-card": elementCard },
    setup(props) {
        const { t } = useI18n();
        const click = ref("");
        const fold = ref({});
        const htmlChooser = shallowRef(h("div", null, { default: () => "" }));
        const elementToText = (element: string) => {
            switch (element) {
                case ".text":
                    return t("element.text");
                default:
                    return t(`element.${element}`);
            }
        };
        const ObjToHtmlchooser = (obj: any) => {
            const out = analysisObj(obj, 0, "layer", 0);
            return out;
        };
        const analysisObj = (obj: any, i: number, root: string, ans: number): any => {
            const id = `${root}-${ans}`;
            if (typeof fold.value[id] == "undefined") {
                fold.value[id] = false;
            }
            return h("div", {}, [
                h(
                    "div",
                    {
                        class: "layer",
                        id,
                        style: { paddingLeft: `${i * 8 + 4}px` },
                        tabIndex: 0,
                        onclick: () => {
                            click.value = id;
                        },
                    },
                    [
                        obj.children
                            ? fold.value[id]
                                ? h(NIcon, {
                                      size: 16,
                                      component: ChevronForward,
                                      onClick: () => {
                                          fold.value[id] = !fold.value[id];
                                          refreshChooser();
                                      },
                                  })
                                : h(NIcon, {
                                      size: 16,
                                      component: ChevronDown,
                                      onClick: () => {
                                          fold.value[id] = !fold.value[id];
                                          refreshChooser();
                                      },
                                  })
                            : null,
                        obj.elementName ? obj.elementName : elementToText(obj.element),
                    ]
                ),
                !fold.value[id]
                    ? h(
                          "div",
                          null,
                          obj.children
                              ? obj.children.map((item: any, key: number) => {
                                    return analysisObj(item, i + 1, id, key);
                                })
                              : null
                      )
                    : h("div"),
            ]);
        };

        const refreshChooser = () => {
            htmlChooser.value = ObjToHtmlchooser(props.getEL());
        };

        return {
            click,
            ObjToHtmlchooser,
            fold,
            refreshChooser,
            htmlChooser,
        };
    },
    computed: {
        canAddElement() {
            return !disableAdd.includes(this.attribute.element);
        },
        canRmElement() {
            return !cantAdd.includes(this.attribute.element);
        },
        add() {
            return this.canAddElement ? "addElement" : "addElement disable";
        },
        rm() {
            return this.canRmElement ? "addElement" : "addElement disable";
        },
        recentList() {
            return this.recent.map((e) => {
                return {
                    key: e,
                    label: this.$t(`element.${e}`),
                };
            });
        },
    },
    watch: {
        click: function(e, p) {
            try {
                document.getElementById(p)!.className = `layer`;
            } catch (e) {}
            try {
                document.getElementById(e)!.className = `layer choose`;
            } catch (e) {}
            this.chooseElement(e);
        },
    },
    mounted: function() {
        this.refreshChooser();
        this.click = "layer-0";
        this.event.on("refreshAttr", (n: any, e: string) => {
            this.refreshAttr(n);
            this.click = e;
        });
        this.event.on("refreshChooser", () => {
            this.refreshChooser();
        });
    },
    methods: {
        refreshAttr: function(n: any) {
            this.attribute = n;
        },
        _addElement: function(element: string) {
            if (this.canAddElement) {
                element = element === "text" ? ".text" : element;
                let addElementInfo: any = { element };
                switch (element) {
                    case ".text":
                        addElementInfo.text = "";
                        break;
                }
                this.addElement(element);
                element = element === ".text" ? "text" : element;
                if (!this.recent.includes(element)) {
                    this.recent.unshift(element);
                } else {
                    this.recent = this.recent.filter((e) => {
                        return e !== element;
                    });
                    this.recent.unshift(element);
                }
            }
        },
        removeElement: function() {
            if (this.canRmElement) {
                this.rmElement();
            }
        },
    },
});
</script>
<style lang="scss">
.html-chooser {
    height: 100%;
    background-color: #222;
    display: flex;
    flex-direction: column;
}

#html-chooser {
    height: 100%;
    overflow: overlay;
}

.elementBar {
    height: 22px;
    background-color: #292929;
    display: flex;

    .addElement {
        margin: 3px;
        width: 16px;
        height: 16px;
        background-color: #292929;
        border-radius: 4px;
        color: #fff;

        &:hover {
            background-color: #393939;
        }

        &.disable {
            color: #aaa;

            &:hover {
                background-color: #292929;
            }
        }
    }
}

.layer {
    width: 100%;
    font-size: 10px;
    padding: 2px 4px;
    border: unset;
    cursor: pointer;
    outline: none;
    display: flex;

    &:hover {
        background-color: #292929;
    }

    &:focus {
        padding: 1px 3px 1px 0;
        border: 1px solid #888;
        border-left: 0;
        border-right: 0;
    }

    &.choose {
        background-color: #444;

        &:focus {
            background-color: #555;
            padding: 1px 3px 1px 0;
            border: 1px solid #888;
            border-left: 0;
            border-right: 0;
        }
    }
}

.ew {
    padding: 16px;

    .ewp {
        height: 440px;
        overflow: auto;
    }
}
</style>
