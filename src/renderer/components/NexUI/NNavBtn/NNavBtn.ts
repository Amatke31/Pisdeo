import { defineComponent, h, VNode, createElementVNode } from "vue";
import './NNavBtn.scss'

export default defineComponent({
    render() {
        return h('div', { class: 'n-navbtn' }, [
            this.genContent()
        ])
    },
    methods: {
        genContent(): VNode {
            return createElementVNode('span', {
                class: 'n-navbtn__content',
            }, this.$slots.default!()[0].children)
        }
    }
})