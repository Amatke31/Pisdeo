import { defineComponent } from "vue";
import "./NNavBtn.scss";

export default defineComponent({
    name: "NavBtn",

    setup(props, { attrs, slots }) {
        return () => {
            return (
                <div class={["n-navbtn"]}>
                    <span>{slots.default?.()}</span>
                </div>
            );
        };
    },
});
