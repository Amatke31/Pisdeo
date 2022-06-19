import type { App } from "vue";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

export default (app: App<Element>): void => {
    app.use(ElementPlus)
}