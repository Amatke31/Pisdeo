<template>
    <div :class="fold ? '' : 'open'">
        <div class="folder">
            <icon-down class="arrow" theme="outline" size="16" fill="#aaa" @click="fold = !fold" />
            <div>{{ $props.title }}</div>
            <slot name="bar"></slot>
        </div>
        <n-collapse-transition class="content" v-show="!fold">
            <slot name="default"></slot>
        </n-collapse-transition>
    </div>
</template>
<script lang="ts">
export default defineComponent({
    props: {
        title: String,
        default: String,
    },
    setup(props, { expose }) {
        const fold = ref(true);
        if (default == 'open'){
            fold.value = false;
        }
        const close = () => (fold.value = false);
        const open = () => (fold.value = true);
        expose({ open, close });
        return { fold };
    },
});
</script>
<style lang="scss" scoped>
.folder {
    height: 22px;
    background-color: #292929;
    display: flex;
    align-items: center;

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
</style>
