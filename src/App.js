import {} from "./assets/index.less"
import zModal from './zModal'

let App = new zModal({
    closeOnESC: true,
    data: {
        formName: 'Hello'
    },
    methods: {
        method (last) {
            
        }
    }
}).createModal('asd',{
    effect: 'slideup',
    callbackFunction () {
        console.log(this)
    },
    template: `
        <h1>{# formName #}</h1>
    `
})