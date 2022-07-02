import { Component as vueComponent } from "vue";

type Component = {
    component: vueComponent;
    position_x: number;
    position_y: number;
    props: any;
    cols: number | string;
    show?: Boolean;
};

type Components = Array<Component>;

type WorkSpace = {
    grid_y: number;
    components: Array<Component>;
};

export default WorkSpace;
export { WorkSpace, Component, Components, vueComponent };
