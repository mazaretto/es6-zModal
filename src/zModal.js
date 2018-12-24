/**
 * @class {zModal} 
 * @param {object} - initializtion object of plugin
 */
class zModal {
    /**
     * @param {*} userObject 
     */
    constructor (userObject) {
        // set options on modal
        this.opts = userObject
        // attribute on opening modal
        this.prefix = this.opts.prefix
        this.defaultPrefix = 'data-modal'
        // default class
        this.defaultClass = 'zmodal'
        // open modal on tag
        this.tagOpen = this.opts.openOnTag
        // main event on open modal
        this.tagEvent = this.opts.eventOpen
        // close modal on ESC key
        this.closeOnEsc = this.opts.closeOnEsc || false
        // main placeholder 
        this.placeholder = null
        // placeholder opacity
        this.placeholderOpacity = null
        // default background placeholder
        this.defaultColorPlaceholder = '#333'
        // default opacity placeholder
        this.defaultOpacityPlaceholder = '.5'
        // array of all modal windows
        this.modals = []
        // last modal in arary
        this.last = this._getLastModal()
        // Html document
        this.DOM = document.body
        // time close modal (ms)
        this.timeClose = 400
        // plugin initialization
        this._init()

        // inner modal methods
        this.ZM = {
            addClass (c) {
                let { prototype } = this
                document.body.classList.add(`${prototype.defaultClass}-denyoverflow`)
                this.modal.classList.add(c)
                this.placeholder.style.opacity = prototype.placeholderOpacity
            },
            rmClass (c) {
                let { prototype } = this
                this.modal = prototype.last
                this.placeholder = prototype.placeholder
                this.effectModal = this.modal.getAttribute('data-effect')
                this.placeholder.classList.remove(c)
                this.modal.classList.remove(c)
            },
            removeEffectClasses () {
                document.body.classList.remove(`${this.prototype.defaultClass}-denyoverflow`)
                return new Promise(resolve => {
                    this.placeholder.style.opacity = '0'
                    this.modal.classList.remove(`${this.prototype.defaultClass}-${this.effectModal}`)
                    setTimeout(resolve, this.prototype.timeClose)
                })
            },
            close () {
                this.prototype.close()
                this.removeEffectClasses().then(this.hideAll.bind(this))
            },
            hideAll () {
                let classHidden = `${this.prototype.defaultClass}-hidden`
                this.placeholder.classList.add(classHidden)
                this.modal.classList.add(classHidden)
            },
            open () {
                let defaultClass = this.prototype.defaultClass

                this.rmClass(`${defaultClass}-hidden`)
                setTimeout(() => {
                    this.addClass(`${defaultClass}-${this.effectModal}`)
                }, this.prototype.timeClose)
                return this
            },
            click (act) {
                this.addEventListener('click', act)
            },
            listen () {
                let self = this.prototype

                const iCanCloseModalAtClick = this.placeholder.className.indexOf(`${self.defaultClass}-placeholder-close`) > -1
                // find the elements that close the form
                const elems = this.modal.childNodes

                if(iCanCloseModalAtClick) this.click.call(this.placeholder, this.close.bind(this))
                if(elems) this.eachWithHandler(elems,this.close.bind(this))

                // close on escp
                if(self.closeOnEsc) this.pressESC()
            },
            pressESC () {
                window.addEventListener('keyup', ev => {
                    if(ev.keyCode === 27) this.close()
                    return
                })
            },
            eachWithHandler (items, handler) {
                // find items with class {defaultClass}-placeholder-close
                let findingItems = Object.getOwnPropertyNames(items).filter(item => {
                    if(items[item].nodeName !== '#text' && items[item].classList.value.indexOf(`${this.prototype.defaultClass}-itemclose`) > -1) return item
                }).map(item => { return items[item] })
                
                if(findingItems.length > 0) {
                    findingItems.forEach(item => { this.click.call(item, this.close.bind(this)) })
                }
                return this
            }
        }
        this.ZM.prototype = this
    }

    /**
     * @return last modal in array modals
     */
    _getLastModal () {
        return this.modals.reverse()[0]
    }

    /**
     * @default this.last - last opening modal in modals array
     */
    open () {
        this.ZM.open().listen()
    }

    /**
     * 
     * @param {*} modal 
     * @default this.last - last modal in modals array
     */
    close (modal = this.last) {
        return this.modals.pop()
    }

    /**
     * @return appending styles in <head> tag
     */
    _initStyles () {
        
    }

    /**
     * @return last item in modals array
     * @param {*} placeholder 
     */
    reloadLast () { 
        this.last = this._getLastModal()
        return this
    }
    
    /**
     * @return placecholder for modals (with user opts)
     * @param {*} placeholder 
     */
    _addOptionsInPlaceholder (placeholder) {
        const opts = this.opts,
            { fill, opacity } = opts,
            defaultClass = this.defaultClass,
            closeOnPlaceholder = (opts.closeOnPlaceholder) ? defaultClass + '-placeholder-close' : defaultClass + '-placeholder-static';
        
        placeholder.classList.add(`${defaultClass}-placeholder`,`${defaultClass}-hidden`,closeOnPlaceholder)
        placeholder.setAttribute(`data-${defaultClass}-opacity`,`${opacity || this.defaultOpacityPlaceholder}`)
        placeholder.style = `background: ${fill || this.defaultColorPlaceholder};`

        return placeholder
    }

    /**
     * @return this
     * @param {*} newModal 
     */
    _pushModal (newModal) {
        // checking on isset modal in modals array
        const isModalInArray = this.modals.filter(modal => {
            return modal === newModal
        })

        if(isModalInArray.length <= 0) {
            this.modals.push(newModal)
        }
        return this
    }

    /**
     * @param {id} - modal id
     */
    convertModal(id) {
        const currentModal = document.querySelector(`#${id}`)

        if( currentModal ) {
            this.reloadModals(currentModal)
                .reloadLast()
                .open()
        }
        return this 
    }
    /**
     * @param {*} newModal 
     * @return add new modal in array modals
     */
    reloadModals(newModal) {
        let isModalHidden = () => {
            return newModal.className.indexOf(this.defaultClass + '-hidden') > -1
        }
        if( isModalHidden ) {
            // push modal in modals array
            this._pushModal(newModal)
        }
        return this
    }

    /**
     * creating placeholder for modals
     * @return DOM element
     */
    createPlaceholder () {
        let placeholder = document.createElement('div')
            placeholder = this._addOptionsInPlaceholder(placeholder)

        return this.placeholder = placeholder
    }

    /**
     * @return append placeholder in <body>
     */
    _addPlaceholder () {
        this.DOM.appendChild(
            this.createPlaceholder()
        )
        this.placeholderOpacity = this.placeholder.getAttribute(`data-${this.defaultClass}-opacity`)
        return this
    }

    /**
     * foreach DOM elemnents from prefix
     */
    _openObjectsHandler (item) {
        item.addEventListener(`${this.tagEvent || 'click'}`, event => {
            event.preventDefault()
            const { target } = event,
                  modalId  = target.attributes[this.prefix].nodeValue
            this.convertModal(modalId)
        })
    }
    _initOpenObjects () {
        document.querySelectorAll(`${this.openOnTag || '*'}[${this.prefix || this.defaultPrefix}]`).forEach(this._openObjectsHandler.bind(this))
    }

    /**
     * @return plugin initialization
     */
    _init () {
        this._initStyles()
        this._addPlaceholder()
        this._initOpenObjects()
    }
}

export default zModal