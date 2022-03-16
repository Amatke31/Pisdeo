import NBtn from "./NBtn/NBtn";
import NNavBtn from "./NNavBtn/NNavBtn";
const component = {
    install: function (Vue: any) {
        Vue.component('n-btn', NBtn)
        Vue.component('n-navbtn', NNavBtn)
    }
}

export default component