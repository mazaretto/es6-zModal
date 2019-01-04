import {} from "./assets/index.less"
import zModal from './zModal'

let App = new zModal({
    closeOnESC: true,
    data: {
        formCallback: {
            title: 'asd',
            descr: `Предновогоднее веселье бьет ключом. 
                    Компании подводят итоги, подсчитывают кто прибыли, а кто убытки. 
                    Как и всегда, у всех очень разные итоги и результаты Что любопытно, и те и другие озвучивают одно и то же причиной: кризис, санкции, снижение покупательской способности `
        },
        callbackModalId: 'asd'
    }
}).createModal('asd', {
    effect: 'fadein',
    template: `
        <h1 class="zmodal-{# formCallback.title #}">{# formCallback.title #}</h1>
        <p>{# formCallback.descr #}</p>
        <div class="zmodal-close">{# formCallback.title #}</div>
    `
})