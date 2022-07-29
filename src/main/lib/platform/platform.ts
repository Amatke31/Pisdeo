let platform = "web";

const ua = navigator.userAgent;

if (window.isDesktop) {
    platform = "desktop";
}

console.log(global);

export default platform;
