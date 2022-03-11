<template>
    <div class="workspace">
        <htmlChooser/>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import htmlChooser from './workspace/html-chooser.vue'
import fileChooser from './workspace/file-chooser.vue'
export default defineComponent({
    components: {htmlChooser,fileChooser}
})
</script>
