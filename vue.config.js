module.exports = {
	pages: {
		index: {
			entry: './src/renderer/main.ts'
		}
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
			mainProcessFile: 'src/desktop/index.ts',
			nodeIntegration: true,
			builderOptions: {
				asar: false,
				appId: 'org.nexwebdeisgner.nexwebdeisgner',
				extraResources: [
					{
						from: './src/extension/',
						to: './extension/'
					},
					{
						from: './static/',
						to: './static/'
					}
				]
			}
		},
		transpileDependencies: [
			'vuetify'
		]
	},
	configureWebpack: {
		resolve: {
			fallback: { path: require.resolve("path-browserify"), vm: require.resolve("vm-browserify"), fs: false, os: false },
		},
	},
	chainWebpack: config => {
		config.module.rule('md')
			.test(/\.md/)
			.use('vue-loader')
			.loader('vue-loader')
			.end()
			.use('vue-markdown-loader')
			.loader('vue-markdown-loader/lib/markdown-compiler')
			.options({
				raw: true
			})
	}
}
