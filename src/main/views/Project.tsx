import { defineComponent, h, shallowRef } from "vue";
import { useStore } from "vuex";
import { solution } from "../store/project";

const project = {};
let currentProject = "";
function getIns() {
    return project[currentProject];
}

export { getIns };

export default defineComponent({
    name: "workspace",

    setup(props: any, {}) {
        let render: any = shallowRef({
            element: "div",
            attrs: { style: { height: "100vh" } },
            children: [],
        });

        const store = useStore();
        store.subscribeAction(async ({ type, payload }, state) => {
            if (type == "loadProject") {
                let instance = new solution.allSolution[payload.solution]({});
                instance
                    .loadProjectFromFile(payload.content)
                    .then(() => {
                        const r = instance.renderWorkspace();
                        render.value = {
                            element: "div",
                            attrs: { style: { height: "100vh" } },
                            children: [r],
                        };
                        project[payload.name] = instance;
                        currentProject = payload.name;
                    })
                    .catch(() => {});
            }
        });
        return () => {
            const renderComponents: any = (render: any) => {
                let out: any = analysisObjWithElement(render.value);
                return out;
            };

            const analysisObjWithElement = (obj: any) => {
                let children: any = [];
                if (obj && obj.children) {
                    for (let child in obj.children) {
                        children.push(analysisObjWithElement(obj.children[child]));
                    }
                }
                let out: any = h(
                    obj.isComponent ? obj.component : obj.element,
                    obj.isComponent ? obj.props : obj.attrs,
                    { default: () => children }
                );
                return out;
            };
            return renderComponents(render);
        };
    },
});
