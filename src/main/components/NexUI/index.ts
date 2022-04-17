import NBtn from "./NBtn/NBtn";
import NWindow from "./NWindow/NWindow";
const component = {
    install: function (Vue: any) {
        Vue.component('n-btn', NBtn)
        Vue.component('n-window', NWindow)
    }
}

export default component