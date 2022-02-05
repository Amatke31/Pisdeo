import { createApp } from 'vue'
import App from './App.vue'
import i18n from './i18n'
import Msg from './components/msg.vue'
import fs from 'fs'
import axios from 'axios'
import platform from './utils/platform/platform'
import component from './components/NexUI'
import vuetify from './plugins/vuetify'
import loadFonts from './plugins/webfontloader'
import installElementPlus from './plugins/element'
import './assets/iconfont/iconfont.css'

loadFonts()

const app = createApp(App)
if (platform === "desktop") {
    app.config.globalProperties.$version = JSON.parse(fs.readFileSync('./package.json').toString()).version
}
app.config.globalProperties.$fs = fs
app.config.globalProperties.$axios = axios
installElementPlus(app)
app
    .use(i18n)
    .use(component)
    .use(vuetify)
    .component('msg', Msg)
    .mount('#_nexwebdesigner')
