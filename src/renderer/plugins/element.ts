import type { App } from "vue";
import ElementPlus from 'element-plus'

export default (app: App<Element>): void => {
  app.use(ElementPlus)
}
