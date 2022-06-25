import { ComponentCustomProperties } from 'vue'

declare module '@vue/runtime-core' {
  interface State {
    [x: string]: any
  }
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.nwdp'

declare module 'vuetify'
declare module 'vuetify/lib/components'
declare module 'vuetify/lib/directives'

declare module "element-plus"
