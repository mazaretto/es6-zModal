import {} from "./assets/index.less"
import zModal from './zModal'

let App = new zModal({
    closeOnESC: true,
    data: {
        videoSource: 'hello'
    }
}).createModal('asd',{
    effect: 'slideup',
    youtubeVideo: {
        url: 'https://www.youtube.com/embed/F0aaybngOBQ',
        w: 500,
        h: 500,
        autoplay: false
    },
    template: `
        <p>{# videoSource #}</p>
        <div class="zmodal-video-container">
            
        </div>
    `
})