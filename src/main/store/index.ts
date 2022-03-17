import { createStore } from 'vuex'
import project from './project'
import extension from './extension'

const store = createStore({
    modules: {
        project,
        extension
    }
})

export default store