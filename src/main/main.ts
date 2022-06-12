import { createApp } from "vue";
import store from "./store/index";
import App from "./App.vue";
import i18n from "./plugins/i18n";
import Msg from "./components/msg.vue";
import axios from "axios";
import component from "./components/NexUI";
import vuetify from "./plugins/vuetify";
import loadFonts from "./plugins/webfontloader";
import installElementPlus from "./plugins/element";
import naive from "naive-ui";
import { install } from "@icon-park/vue-next/es/all";
import "./assets/iconfont/iconfont.css";
import "@icon-park/vue-next/styles/index.css";

class NexWebDesigner {
    app: any = null;
    constructor(el: string) {
        this.app = createApp(App);
        loadFonts();
        this.app.config.globalProperties.$axios = axios;
        installElementPlus(this.app);
        install(this.app);
        this.app
            .use(i18n)
            .use(store)
            .use(component)
            .use(vuetify)
            .use(naive)
            .component("msg", Msg)
            .mount(el);
    }
}

new NexWebDesigner("#_nexwebdesigner");
