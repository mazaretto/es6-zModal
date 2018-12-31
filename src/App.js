import {} from "./assets/index.less"
import zModal from './zModal'

new zModal({
    closeOnESC: true,
    data: {
        hello: {
            a: 1
        }
    },
    methods: {
        method (last) {
            this.asd = 'hello'
        }
    }
})