import { Ref, resolveComponent, VNode } from "vue";
import { Components, Component, WorkSpace } from "@/types/Workspace";
import projectStore from "../store/project";
import { solution } from "../store/project";
import "./workspace.scss";

const project = {};
let currentProject = "";
function getIns() {
    return project[currentProject];
}

export { getIns };

export default defineComponent({
    name: "workspace",

    setup(props: any, {}) {
        const VCol: any = resolveComponent("v-col");
        const VRow: any = resolveComponent("v-row");
        const VContainer: any = resolveComponent("v-container");

        const workspace: Ref<WorkSpace> = shallowRef({ grid_y: 1, components: [] });
        const components: Ref<Components> = shallowRef([]);

        const projectstore = projectStore();
        const unsub = projectstore.$onAction(({ name, store, args, after, onError }) => {
            if (name == "loadProject") {
                workspace.value = { grid_y: 1, components: [] };
                components.value = [];
                let instance = new solution.allSolution[args[0].solution]({});
                instance
                    .loadProjectFromFile(args[0].content)
                    .then(() => {
                        const r: WorkSpace = instance.renderWorkspace();
                        r.components.forEach((c: Component) => {
                            components.value.push({
                                ...c,
                                show: c.position_x >= 1 && c.position_y >= 1,
                            });
                        });
                        workspace.value = r;
                        project[args[0].name] = instance;
                        currentProject = args[0].name;
                    })
                    .catch(() => {});
            }
        });

        const renderWorkspace = computed(() => {
            const outy: Array<VNode> = [];
            for (let y = 1; y !== workspace.value.grid_y + 1; y++) {
                const outx: Array<VNode> = [];
                const allX: Components = components.value
                    .filter((e) => e.position_y == y)
                    .sort((a, b) => {
                        return a.position_x - b.position_x;
                    });
                for (let x = 0; allX && allX.length && x !== allX.length; x++) {
                    outx.push(
                        h(
                            VCol,
                            { cols: allX[x].cols ? allX[x].cols : false },
                            {
                                default: () => h(allX[x].component, allX[x].props),
                            }
                        )
                    );
                }
                outy.push(
                    h(VRow, { "no-gutters": true, align: "stretch" }, { default: () => outx })
                );
            }
            return outy;
        });

        return () => {
            return (
                <div>
                    <VContainer
                        style={{
                            padding: "0px",
                            "max-width": "unset",
                            height: "100vh",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        {renderWorkspace.value}
                    </VContainer>
                </div>
            );
        };
    },
});
