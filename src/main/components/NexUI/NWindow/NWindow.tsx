import { defineComponent, reactive, watch } from "vue";
import "./NWindow.scss";

export default defineComponent({
    name: "NWindow",

    emits: ["close"],

    props: {
        open: Boolean,
    },

    setup(props, { slots, emit }) {
        let state = reactive({ Wcss: props.open ? "" : "hide none" });
        watch(
            () => props.open,
            (n) => {
                if (n) {
                    state.Wcss = "hide";
                    setTimeout(() => {
                        state.Wcss = "";
                    }, 50);
                } else {
                    state.Wcss = "hide";
                    setTimeout(() => {
                        state.Wcss = "hide none";
                    }, 300);
                }
            }
        );
        return () => {
            return (
                <div class={[state.Wcss]}>
                    <div class={["n-window"]}>{slots.default?.()}</div>
                    <div
                        class={["n-window___mask"]}
                        onClick={(e) => {
                            emit("close");
                        }}
                    ></div>
                </div>
            );
        };
    },
});
