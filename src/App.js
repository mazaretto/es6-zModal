import zModal from './zModal'

let App = new zModal({
    closeOnESC: true,
    data: {
        hello: 'World'
    }
}).createModal('helloworld', {
    callbackFunction () {
        console.log('Hello, ' + this.data.hello)
    },
    effect: 'fadein',
    template: `<h1>Hello, {# hello #}</h1>`
})