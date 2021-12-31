import { createI18n } from 'vue-i18n'

/**
 * Load locale messages
 */
 function loadLocaleMessages() {
  const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  const messages: any = []
  locales.keys().forEach(key => {
      const langMatched = key.match(/\/([A-Za-z0-9-_-]+)\//i)
      const matched = key.match(/([A-Za-z0-9-_]+)\./i)
      if (langMatched && langMatched.length > 1 && matched && matched.length > 1) {
          const locale = langMatched[1]
          messages[locale] = messages[locale] ? messages[locale]: {translation: {}}
          messages[locale].translation = {[matched[1]]: locales(key)}
      }
  })
  return messages
}

export default createI18n({
  locale: 'zh_cn',
  fallbackLocale: 'en_us',
  messages: loadLocaleMessages(),
  silentTranslationWarn: true,
  silentFallbackWarn: true,
})
