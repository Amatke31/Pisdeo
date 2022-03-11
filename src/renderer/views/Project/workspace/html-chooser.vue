<template>
    <div class="html-chooser"></div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    data(){
        return {
            html: {}
        }
    },
    mounted: function() {
    },
});
</script>
<style lang="scss" scoped>
.html-chooser {
    margin: 4px;
    width: 20vw;
    height: 60vh;
    background-color: #222;
    border-radius: 8px;
    border: 1px solid #555;
}
</style>
