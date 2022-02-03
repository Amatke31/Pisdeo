import type { App } from "vue";
import ElementPlus from 'element-plus'
import 'element-theme-dark';

export default (app: App<Element>): void => {
  app.use(ElementPlus)
}
