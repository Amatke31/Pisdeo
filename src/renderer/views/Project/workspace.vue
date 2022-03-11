<template>
    <div class="workspace">
        <htmlChooser/>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import htmlChooser from './workspace/html-chooser.vue'
export default defineComponent({
    components: {htmlChooser}
})
</script>
