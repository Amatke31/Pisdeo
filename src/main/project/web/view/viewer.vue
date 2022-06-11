<template>
    <div class="viewer">
        <div id="viewerMenu">
            <icon-refresh class="btn" theme="outline" size="16" fill="#eee" @click="reload" />
        </div>
        <iframe v-if="!refreshing" ref="viewer" id="viewer"></iframe>
    </div>
</template>
<script lang="ts">
import EventEmitter from "events";
import { defineComponent } from "vue";

export default defineComponent({
    data() {
        return {
            refreshing: false,
        };
    },
    props: {
        viewer: {
            type: Function,
            default: () => {},
        },
        event: {
            type: EventEmitter,
            default: () => {},
        },
    },
    mounted: function() {
        this.$nextTick(() => {
            this.asyncView();
        });
        this.event.on("refreshViewer", () => {
            this.asyncView();
        });
    },
    methods: {
        asyncView: function() {
            let iframe = this.$refs.viewer;
            let iDoc: any = (<HTMLIFrameElement>iframe).contentDocument;
            iDoc.children[0].innerHTML = this.viewer();
        },
        reload: function() {
            this.refreshing = true;
            this.$nextTick(() => {
                this.refreshing = false;
                this.$nextTick(() => {
                    this.asyncView();
                });
            });
        },
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
