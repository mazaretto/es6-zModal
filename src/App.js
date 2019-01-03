import {} from "./assets/index.less"
import zModal from './zModal'

let App = new zModal({
    closeOnESC: true,
    data: {
        videoSource: 'hello'
    }
}).createModal('asd',{
    effect: 'zoomin',
    youtubeVideo: {
        url: 'https://www.youtube.com/embed/F0aaybngOBQ',
        w: 500,
        h: 500,
        autoplay: false
    },
    template: `
        <p>{# videoSource #}</p>
    `
}).createModal('asd123',{
    effect: 'slideup',
    extendCallback: 'asd',
    template: `
        <h1>{# formName #}</h1>
    `
})