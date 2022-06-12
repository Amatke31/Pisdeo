import { defineComponent, reactive, watch } from "vue";
import "./NWindow.scss";

export default defineComponent({
    name: "NWindow",

    emits: ["close"],

    props: {
        open: Boolean,
        style: Object,
    },

    setup(props: any, { slots, emit }) {
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
                    <div class={["n-window"]} style={props.style}>
                        {slots.default?.()}
                    </div>
                    <div
                        class={["n-window___mask"]}
                        onClick={() => {
                            emit("close");
                        }}
                    ></div>
                </div>
            );
        };
    },
});
