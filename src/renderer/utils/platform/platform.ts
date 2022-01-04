let platform = 'web'

const ua = navigator.userAgent

if (Boolean(window && window.process && window.process.versions && window.process.versions['electron'])) {
    platform = 'desktop'
}

export default platform