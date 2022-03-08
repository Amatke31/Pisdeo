import { createApp } from 'vue'
import store from './store/index'
import App from './App.vue'
import i18n from './i18n'
import Msg from './components/msg.vue'
import axios from 'axios'
import component from './components/NexUI'
import vuetify from './plugins/vuetify'
import loadFonts from './plugins/webfontloader'
import installElementPlus from './plugins/element'
import './assets/css/element-plus.css'
import './assets/iconfont/iconfont.css'

loadFonts()

const app = createApp(App)
app.config.globalProperties.$axios = axios
installElementPlus(app)
app
    .use(i18n)
    .use(store)
    .use(component)
    .use(vuetify)
    .component('msg', Msg)
    .mount('#_nexwebdesigner')
