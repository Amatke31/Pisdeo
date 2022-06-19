import { NIcon } from "naive-ui";
import { h, Component } from "vue";

function renderIcon(icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) });
}

export default renderIcon;
