import { defineComponent } from "vue";
import "./NBtn.scss";

export default defineComponent({
    name: "NBtn",

    setup(props, { attrs, slots }) {
        return () => {
            return (
                <button class={["n-btn"]}>
                    <span class={["n-btn__content"]}>{slots.default?.()}</span>
                </button>
            );
        };
    },
});
