<template>
    <div class="viewer">
        <div id="viewerMenu">
            <icon-refresh class="btn" theme="outline" size="16" fill="#eee" @click="reload" />
        </div>
        <iframe ref="viewer" id="viewer"></iframe>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        viewer: {
            type: String,
        },
    },
    mounted: function() {
        this.$nextTick(() => {
            this.asyncView();
        });
    },
    watch: {
        viewer: function() {
            this.asyncView();
        },
    },
    methods: {
        asyncView: function() {
            let iframe = this.$refs.viewer;
            let iDoc: any = (<HTMLIFrameElement>iframe).contentDocument;
            iDoc.children[0].innerHTML = this.viewer;
        },
        reload: function() {
            let iframe = this.$refs.viewer;
            let iWindow: any = (<HTMLIFrameElement>iframe).contentWindow;
            iWindow.location.reload();
            setTimeout(() => {
                let iDoc: any = (<HTMLIFrameElement>iframe).contentDocument;
                iDoc.children[0].innerHTML = this.viewer;
            }, 100);
        },
    },
});
</script>
<style lang="scss" scoped>
.viewer {
    height: 60vh;
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
