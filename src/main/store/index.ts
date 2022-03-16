import { createStore } from 'vuex'
import project from './project'

const store = createStore({
    modules: {
        project
    }
})

export default store