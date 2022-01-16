import { createApp } from 'vue'
import App from './App.vue'
import i18n from './i18n'
import Msg from './components/msg.vue'
import fs from 'fs'
import path from 'path'
import axios from 'axios'
import platform from './utils/platform/platform'

const app = createApp(App)
if (platform === "desktop") {
    app.config.globalProperties.$version = JSON.parse(fs.readFileSync('./package.json').toString()).version
}
app.config.globalProperties.$fs = fs
app.config.globalProperties.$path = path
app.config.globalProperties.$axios = axios
app.use(i18n).component('msg', Msg).mount('#_nexwebeditor')
