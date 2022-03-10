import type { App } from "vue";
import ElementPlus from 'element-plus'
import tinycolor from 'tinycolor2'
import 'element-plus/dist/index.css'
import 'element-plus-dark/index.scss'
import './element.css'

export default (app: App<Element>): void => {
    app.use(ElementPlus)
}

function setSkin(darkBgColorBase) {
    if (!document.body.classList.contains('element-plus-dark')) {
      document.body.classList.add('element-plus-dark');
    }
    const rootStyle = document.body.style;
    rootStyle.setProperty('--dark-bg-color-base', darkBgColorBase);
    rootStyle.setProperty('--dark-bg-color-light-1', tinycolor(darkBgColorBase).lighten(5).toString());
    rootStyle.setProperty('--dark-bg-color-light-2', tinycolor(darkBgColorBase).lighten(10).toString());
    rootStyle.setProperty('--dark-bg-color-light-3', tinycolor(darkBgColorBase).lighten(15).toString());
    rootStyle.setProperty('--dark-bg-color-dark', tinycolor(darkBgColorBase).darken(5).toString());
    rootStyle.setProperty('$dark-bg-color-base-alpha', tinycolor(darkBgColorBase).setAlpha(0.1).toString());
  
    rootStyle.setProperty('--el-bg-color', tinycolor(darkBgColorBase).lighten(10).toString());
  
    rootStyle.setProperty('--el-text-color-disabled-base', tinycolor.mix(darkBgColorBase, '#fff', 80).toString());
  
    rootStyle.setProperty('--el-text-color-primary', tinycolor.mix(darkBgColorBase, '#fff', 98).toString());
    rootStyle.setProperty('--el-text-color-regular', tinycolor.mix(darkBgColorBase, '#fff', 95).toString());
    rootStyle.setProperty('--el-text-color-secondary', tinycolor.mix(darkBgColorBase, '#fff', 90).toString());
    rootStyle.setProperty('--el-text-color-placeholder', tinycolor.mix(darkBgColorBase, '#fff', 85).toString());
  
    rootStyle.setProperty('--el-border-color-base', tinycolor.mix(darkBgColorBase, '#fff', 50).toString());
    rootStyle.setProperty('--el-border-color-light', tinycolor.mix(darkBgColorBase, '#fff', 45).toString());
    rootStyle.setProperty('--el-border-color-lighter', tinycolor.mix(darkBgColorBase, '#fff', 40).toString());
    rootStyle.setProperty('--el-border-color-extra-light', tinycolor.mix(darkBgColorBase, '#fff', 35).toString());
  
    rootStyle.setProperty('--el-disabled-bg-color', tinycolor(darkBgColorBase).darken(5).toString());
}

setSkin('#222')