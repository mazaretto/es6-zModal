import {} from "./assets/index.less"
import zModal from './zModal'

new zModal({
    prefix: 'data-modal',
    openOnTag: 'a',
    eventOpen: 'click',
    closeOnEsc: true,
    closeOnPlaceholder: true
})