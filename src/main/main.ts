import { createApp } from "vue";
import "vue-global-api";
import { createPinia } from "pinia";
import App from "./App.vue";
import i18n from "./plugins/i18n";
import Msg from "./components/msg.vue";
import component from "./components/NexUI";
import vuetify from "./plugins/vuetify";
import loadFonts from "./plugins/webfontloader";
import installElementPlus from "./plugins/element";
import naive from "naive-ui";
import "./assets/iconfont/iconfont.css";
import "element-plus/theme-chalk/dark/css-vars.css";

class Pisdeo {
    app = createApp(App);
    constructor(el: string) {
        loadFonts();
        installElementPlus(this.app);
        this.app
            .use(i18n)
            .use(createPinia())
            .use(component)
            .use(vuetify)
            .use(naive)
            .component("msg", Msg)
            .mount(el);
    }
    provide(key: string | Symbol, value: any) {
        this.app.provide(key, value);
    }
    unmount() {
        this.app.unmount();
    }
}

new Pisdeo("#_pisdeo");
