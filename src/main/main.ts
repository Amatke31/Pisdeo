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
import { install } from "@icon-park/vue-next/es/all";
import "./assets/iconfont/iconfont.css";
import "@icon-park/vue-next/styles/index.css";

loadFonts();

const app = createApp(App);
app.config.globalProperties.$axios = axios;
installElementPlus(app);
install(app);
app.use(i18n)
    .use(store)
    .use(component)
    .use(vuetify)
    .component("msg", Msg)
    .mount("#_nexwebdesigner");
