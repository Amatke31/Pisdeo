import { defineComponent, h, VNode, createElementVNode } from "vue";
import './NBtn.scss'

export default defineComponent({
    render() {
        return h('button', { class: 'n-btn' }, [
            this.genContent()
        ])
    },
    methods: {
        genContent(): VNode {
            return createElementVNode('span', {
                class: 'n-btn__content',
            }, this.$slots.default!()[0].children)
        }
    }
})