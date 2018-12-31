export default class zModal {
    constructor (props) {
        // Set user props
        this.props = props || {}
        // placeholder modal
        this.placeholder = null
        // last modal
        this.last = null 
        // elements with class zmodal-close in last modal
        this.closingElements = []
        // array modals
        this.modals = new Array()
        // callback data-attribute. For example: (zmodaCallback)
        this.callbackAttribute = 'Callback'
        // default class
        this.defaultClass = 'zmodal'
        // last modal elements, which has class zmodal-close
        this.lastModalElementsClassList = this.defaultClass + '-close'
        // placeholder class
        this.placeholderClass = this.defaultClass + '-placeholder'
        // placeholder visible class
        this.placeholderVisibleClass = this.placeholderClass + '-visible'
        // hidden class
        this.hiddenClass = this.defaultClass + '-hidden' 
        // Snippet functions
        this.F = {
            // self {zModal}
            self: this,
            // check modal on open class
            isModalOpen (modal) {
                return !(modal.className.indexOf(this.self.hiddenClass) > -1)
            },
            // check modals array on length <= 0
            modalsArrayEmpty (c1,c2) {
                if(this.self.modals.length <= 0) return c1()
                else return c2()
            },
            // check, isset modal in array all modals
            isModalInArray (newModal) {
                const { modals } = this.self
                const findModal = modals.filter(modal => {
                    return modal === newModal
                })

                return findModal.length > 0
            },
            // get modal from data attribute
            getModal ({ dataset }) {
                return document.getElementById(dataset[this.self.prefix.replace('data-','')])
            },
            // get user options
            startCallback (target) {
                const { last } = this.self
                let lastText = last.childNodes

                try {
                    const CallbackFunction = target.dataset[this.self.defaultClass+this.self.callbackAttribute],
                           Method = this.self.methods[CallbackFunction]
                    Method.call(this.self.data, last)
                } catch (e) {}

                try {
                    for(let child in lastText) {
                        const Child = lastText[child]
                        const getPatternData = Child.textContent.match(/(\{#(.*)#\})/g)
                        if(getPatternData) {
                            getPatternData = getPatternData[0].replace(/ /g,'').replace(/#\}/g,'-').replace(/\{#/g,'').split('-')
                            getPatternData.forEach((pattern,i) => {
                                if(pattern !== '') {
                                    Child.textContent = Child.textContent.replace(eval(`/\{# ${pattern} #\}/`),eval(`window.zModal.data.${pattern}`))
                                }
                            })
                        }
                    }
                } catch (e) {}
            }
        }

        // Veryfy user props. and init plugin
        this._verifyProps()._addPlaceholder()._init()._watch()
    }

    /**
     * Check props
     * @return {zModal}
     */
    _verifyProps () {
        const { validTags, prefix, 
                eventOpen, timeOC, 
                fillPlaceholder, closeOnESC,
                closeOnPlaceholder, methods, data } = this.props
        
        // delete user props and replacing valid propses
        delete this.props
        // add valid properties in main class
        this.validTags = validTags || '*'
        // event on open modal
        this.eventOpen = eventOpen || 'click'
        // data-attribute
        this.prefix = prefix || 'data-zmodal'
        // time Opening and Closing modals.
        this.timeOC = timeOC || 300
        // background placeholder
        this.fillPlaceholder = fillPlaceholder || '#333'
        // where you press key ESC, modal hide.
        this.closeOnESC = closeOnESC || !1
        // where you click on placeholder, modal hide.
        this.closeOnPlaceholder = closeOnPlaceholder || 1
        // user callback methods
        this.methods = methods || {}
        // user data
        this.data = data || {}

        return this
    }

    /**
     * Open and check modal
     */
    open ({ target }) {
        const { F } = this
        const currentModal = F.getModal(target)
        if( !F.isModalOpen(currentModal) && !F.isModalInArray(currentModal) ) {
            // set global modal HTML
            currentModal.HTML = currentModal.innerHTML
            // push modal
            this._pushModal(currentModal).show()
            F.startCallback(target)
        }
    }
    
    /**
     * Close last modal
     */
    close () {     
        const { F } = this
        // modal removing
        const removingModal = this.modals.shift()
        // update last modal
        this._updateLast(removingModal)

        F.modalsArrayEmpty(() => {
            this.hide(1)            
        }, () => {
            this.hide(!1)
        })
    }

    /**
     * Show modal
     */
    show (last = this.last, placeholder = this.placeholder) {
        last.classList.remove(this.hiddenClass)
        placeholder.classList.remove(this.hiddenClass)
        this.doWithWait(() => {
            last.classList.add(`${this.defaultClass}-${this.effectClass}`)
            placeholder.classList.add(`${this.placeholderVisibleClass}`)
        })
    }

    /**
     * Timeout on open
     */
    doWithWait(callback, time = this.timeOC) {
        setTimeout(callback, time)
    }

    /**
     * Hide modal
     */
    hide (hidePlaceholder) {
        try {
            const { last } = this

            last.classList.remove(this.defaultClass + '-' + this.effectClass)
            
            if(hidePlaceholder) this.placeholder.classList.remove(this.placeholderVisibleClass)

            this.doWithWait(() => {
                last.classList.add(this.hiddenClass)
                // hide placeholder
                if(hidePlaceholder) this.placeholder.classList.add(this.hiddenClass)
                // set old innerhtml in modal (with patterns)
                last.innerHTML = last.HTML
            })
        } catch (e) {}
    }

    /**
     * Push modal in array modals
     */
    _pushModal (newModal) {
        this.modals.push(newModal)
        this.modals.reverse()
        this.effectClass = newModal.dataset.zmodalEffect
        this._updateLast()

        return this
    }

    /**
     * Update last modal
     */
    _updateLast (last) {
        this.last = last || this.modals[0]
    }

    /**
     * Add placeholder in document
     */
    _addPlaceholder () {
        const isPlaceholderCanCloseModal = (this.closeOnPlaceholder) ? this.placeholderClass + '-closing' : this.placeholderClass

        this.placeholder = document.createElement('div')
        // set default and user styles
        this.placeholder.style = `background-color: ${this.fillPlaceholder}`
        // set default classes
        this.placeholder.classList.add(this.placeholderClass, this.hiddenClass, isPlaceholderCanCloseModal)
        // add placeholder in document
        document.body.appendChild(this.placeholder)

        return this
    }

    /**
     * Watch click, hovers and other methods
     */
    _watch () {
        this.placeholder.addEventListener('click', this.close.bind(this))
        
        document.querySelectorAll(`.${this.lastModalElementsClassList}`).forEach(item => {
            item.addEventListener('click', this.close.bind(this))
        })

        if(this.closeOnESC) {
            window.onkeyup = e => {
                if(this.modals.length >= 1 && e.keyCode === 27) {
                    this.close()
                    return
                }
            }
        }
    }

    /**
     * Initialization Plugin
     */
    _init () {
        const { prefix, validTags, eventOpen } = this

        document.querySelectorAll(`${validTags}[${prefix}]`).forEach(item => {
            item.addEventListener(eventOpen, this.open.bind(this)) 
        })

        window.zModal = this

        return this
    }
}