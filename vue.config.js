const path = require("path");

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    chainWebpack: (config) => {
        config.resolve.alias
            .set("@", resolve("./renderer/src"))
    },
    pluginOptions: {
        i18n: {
            locale: 'zh_cn',
            fallbackLocale: 'en_us',
            localeDir: 'locales',
            enableLegacy: true,
            runtimeOnly: false,
            compositionOnly: true,
            fullInstall: true
        },
        electronBuilder: {
            mainProcessFile: 'src/myBackgroundFile.js',
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