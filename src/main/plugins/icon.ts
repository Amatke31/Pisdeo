import { NIcon } from "naive-ui";
import { Component } from "vue";

function renderIcon(icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) });
}

export default renderIcon;
