import { defineComponent, h, reactive } from "vue";
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
        const components = reactive([]) as Array<any>;
        const addComponent = (component: any, props) => {
            components.push({ component, props });
        };

        let render = reactive(h("div")) as any;

        const store = useStore();
        store.subscribeAction(async ({ type, payload }, state) => {
            if (type == "loadProject") {
                let instance = new solution.allSolution[payload.solution]({
                    component: addComponent,
                });
                instance
                    .loadProjectFromFile(payload.content)
                    .then(() => {
                        render = instance.renderWorkspace();
                        project[payload.name] = instance;
                        currentProject = payload.name;
                    })
                    .catch(() => {});
            }
        });
        return () => {
            var renderComponents = () => {
                var res: Array<any> = [];
                for (var i = 0; components[i]; i++) {
                    res.push(h(components[i].component, components[i].props));
                }
                return res;
            };
            return h("div", renderComponents());
        };
    },
});
