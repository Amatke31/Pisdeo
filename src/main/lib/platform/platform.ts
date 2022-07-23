let platform = "web";

const ua = navigator.userAgent;

if (window.isDesktop) {
    platform = "desktop";
}

export default platform;
