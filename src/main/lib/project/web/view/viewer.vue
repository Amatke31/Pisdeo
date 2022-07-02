<template>
    <div class="viewer">
        <div id="viewerMenu">
            <icon-refresh class="btn" theme="outline" size="16" fill="#eee" @click="reload" />
        </div>
        <iframe v-if="!refreshing" ref="viewer" id="viewer"></iframe>
    </div>
</template>
<script lang="ts">
import { Ref } from "vue";
import EventEmitter from "events";

export default defineComponent({
    props: {
        getViewer: {
            type: Function,
            default: () => {},
        },
        event: {
            type: EventEmitter,
            default: new EventEmitter(),
        },
    },
    setup(props, {}) {
        const refreshing = ref(false);
        const viewer: Ref<HTMLIFrameElement | null> = ref(null);
        const asyncView = function() {
            let iDoc: any = (<HTMLIFrameElement>viewer.value).contentDocument;
            if (iDoc && iDoc.children) {
                iDoc.children[0].innerHTML = props.getViewer();
            }
        };
        const reload = function() {
            refreshing.value = true;
            nextTick(() => {
                refreshing.value = false;
                nextTick(() => {
                    setTimeout(() => {
                        asyncView();
                    }, 1);
                });
            });
        };
        nextTick(() => {
            reload();
        });
        props.event.on("refreshViewer", () => {
            asyncView();
        });
        return { refreshing, asyncView, viewer, reload };
    },
});
</script>
<style lang="scss" scoped>
.viewer {
    height: 100%;
    background-color: #fff;
    border: 1px solid #444;
    overflow: hidden;

    #viewerMenu {
        height: 26px;
        padding: 0;
        background-color: #333;
        display: flex;

        .btn {
            margin: 3px;
            padding: 2px;
            border-radius: 4px;
            cursor: pointer;

            &:hover {
                background-color: #444;
            }
        }
    }

    #viewer {
        width: 100%;
        height: 100%;
        border: unset;
    }
}
</style>
