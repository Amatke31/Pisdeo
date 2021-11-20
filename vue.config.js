module.exports = {
  pluginOptions: {
    i18n: {
      locale: 'zh_cn',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableLegacy: true,
      runtimeOnly: false,
      compositionOnly: true,
      fullInstall: true
    },
    electronBuilder: {
      nodeIntegration: true, 
      builderOptions: {
        asar: false,
        appId: "org.nexwebeditor.nexwebeditor",
        extraResources: {
          from: "./src/extension/extension/",
          to: "./extension/"
        }
      }
    }
  }
}
