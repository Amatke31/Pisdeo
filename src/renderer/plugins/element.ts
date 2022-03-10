import type { App } from "vue";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// import 'element-theme-dark';
import 'element-plus-dark/index.scss'

export default (app: App<Element>): void => {
    app.use(ElementPlus)
}