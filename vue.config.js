const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
    pages: {
        index: {
            entry: "./src/main/main.ts",
        },
    },
    pluginOptions: {
        i18n: {
            locale: "zh_cn",
            fallbackLocale: "en_us",
            localeDir: "locales",
            enableLegacy: true,
            runtimeOnly: false,
            compositionOnly: true,
            fullInstall: true,
        },
        electronBuilder: {
            mainProcessFile: "src/desktop/index.ts",
            nodeIntegration: true,
            builderOptions: {
                asar: false,
                appId: "org.pisdeo.pisdeo",
                extraResources: [],
            },
            preload: "src/desktop/preload.js",
        },
        transpileDependencies: ["vuetify"],
    },
    configureWebpack: {
        resolve: {
            fallback: {
                path: require.resolve("path-browserify"),
                vm: require.resolve("vm-browserify"),
                fs: false,
                os: require.resolve("./other/os-browser/index"),
            },
        },
        plugins: [
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: "test/testProgram",
                        to: "test",
                    },
                ],
            }),
        ],
    },
    chainWebpack: (config) => {
        config.module
            .rule("md")
            .test(/\.md/)
            .use("vue-loader")
            .loader("vue-loader")
            .end()
            .use("vue-markdown-loader")
            .loader("vue-markdown-loader/lib/markdown-compiler")
            .options({
                raw: true,
            });
        config.resolve.alias.set("vue-i18n", "vue-i18n/dist/vue-i18n.cjs.js");
    },
};
