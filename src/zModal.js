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
        // last modal nodes
        this.lastModalOldNodes = []
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
            getModalFromId (modalId) {
                return document.getElementById(modalId)
            },
            getModal ({ dataset }) {
                return this.getModalFromId(dataset[this.self.prefix.replace('data-','')])
            },

            createModalDOM (id) {
                const modalDiv = document.createElement('div')
                modalDiv.id = id
                return modalDiv
            },

            setModalCallback (modal,callbackName) {
                modal.dataset.zmodalCallback = callbackName
            },

            getModalCallback (modalId) {
                return this.getModalFromId(modalId).dataset.zmodalCallback
            },
            getTypeURLVideo (url) {
                const isEmbedVideo = new RegExp(/(https|http)\:\/\/(www\.youtube\.com\/embed\/(.*))/g).test(url)
                const isWatchVideo = new RegExp(/(https|http)\:\/\/(www\.youtube\.com\/watch\?v\=(.*))/g).test(url)
                const isYOUTUbeVideo = new RegExp(/(https|http)\:\/\/(youtu\.be\/(.*))/g).test(url)

                if(isEmbedVideo) return 'embed'
                if(isWatchVideo) return 'watch'
                if(isYOUTUbeVideo) return 'youtu.be'

                return false
            },

            createValidYoutubeUrl (id, autoplay) {
                return 'https://www.youtube.com/embed/' + id + ((autoplay) ? '?autoplay=1' : '')
            },

            convertYoutubeURLtoIframe (modal, { url, w = 400, h = 400, autoplay = false }, typeVideo) {
                const   youtubeIframe = document.createElement('iframe')
                        youtubeIframe.frameborder = "0"
                        youtubeIframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        youtubeIframe.width = w
                        youtubeIframe.height = h

                let     youtubeVideoId = url.replace(/(http|https)\:\/\/((youtu\.be)|(www\.youtube\.com))\/((watch\?v\=)|(embed\/)|())/g,'').trim(),
                        validUrlVideo = this.createValidYoutubeUrl(youtubeVideoId, autoplay)

                youtubeIframe.src = validUrlVideo
                modal.dataset.zmodalVideo = validUrlVideo
                modal.video = youtubeIframe
            },
            setModalOptions (modal, opts) {
                const { url } = opts.youtubeVideo

                if(opts.callbackFunction) {
                    this.setModalCallback(modal, opts.callbackFunction)
                } else {
                    (opts.extendCallback !== undefined) ? this.setModalCallback(modal, this.getModalCallback(opts.extendCallback)) : null
                }

                if(url) {
                    switch(this.getTypeURLVideo(url)) {
                        case 'watch':
                            this.convertYoutubeURLtoIframe(modal, opts.youtubeVideo,0)
                            break;
                        case 'embed':
                            this.convertYoutubeURLtoIframe(modal, opts.youtubeVideo,1)
                            break;
                        case 'youtu.be':
                            this.convertYoutubeURLtoIframe(modal, opts.youtubeVideo,2)
                            break;
                        default:
                            console.warn('zModal #2 - Youtube video url in not correct form!')
                            break;
                    }
                }
                modal.innerHTML = opts.template
                modal.dataset.zmodalEffect = opts.effect
                modal.classList.add(this.self.defaultClass, this.self.hiddenClass)

                return modal
            },

            appendModal(modal) {
                document.body.appendChild(modal)
                return this
            },

            appendVideo () {

                const videoContainer = this.self.last.querySelector(`.${this.self.defaultClass}-video-container`)

                if (videoContainer) {
                   videoContainer.appendChild( this.self.last.video )
                } else {
                    console.warn(`zModal #1 - Video container not found! Add element with className zmodal-video-container in modal *${this.self.last.id}*.`)
                }
            },
            // get user options
            startCallback (target) {
                // last modal
                const { last } = this.self
                // textNode last modal
                let lastText = last.childNodes
                // start video script
                if (last.video) {
                    this.appendVideo()
                }
                // Callbacks script
                try {
                    // callback function from data-attribute (data-zmodal-callback)
                    const CallbackFunction = target.dataset[this.self.defaultClass+this.self.callbackAttribute],
                            Method = this.self.methods[CallbackFunction] // method callback from attribute
                    Method.call(this.self) // call method
                } catch (e) {}

                // Patterns script
                try {
                    for(let child in lastText) {
                        const Child = lastText[child]
                        // get main pattern {# variable #}
                        let getPatternData = Child.textContent.match(/(\{#(.*)#\})/g)
                        if(getPatternData) {
                            // split and replace pattern
                            getPatternData = getPatternData[0].replace(/ /g,'').replace(/#\}/g,'-').replace(/\{#/g,'').split('-')
                            getPatternData.forEach((pattern,i) => {
                                if(pattern !== '') {
                                    // update textNode from parent node
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

    createModal (modalId, opts = {}) {
        const { F } = this
        let fnName, fnValue, fnCreate, callbackFunction, effect, template, youtubeVideo

        template = (opts.template) ? opts.template : ``
        effect = (opts.effect) ? opts.effect : 'fadein'
        callbackFunction = (opts.callbackFunction) ? opts.callbackFunction : false
        youtubeVideo = (opts.youtubeVideo) ? opts.youtubeVideo : false

        if(callbackFunction instanceof Function) {
            fnName = 'zModalCallback_'+Math.floor((Math.random()+2)*50), // create new function name
            fnValue = callbackFunction.toString().replace(/((.*)\{)/g,'').replace(/\}| /g,'').trim()
            fnCreate = eval(`(() => { return function ${fnName} () {${fnValue}} })()`);
        }

        const creatingModal = F.createModalDOM(modalId)
        const addUserOptions = F.setModalOptions(creatingModal, {
            template, effect, callbackFunction: fnName, extendCallback: opts.extendCallback, youtubeVideo
        })

        // add function on callback methods zModal
        this.methods[fnName] = fnCreate
        F.appendModal(addUserOptions)

        return this
    }

    /**
     * Open and check modal
     */
    open ({ target }) {
        const { F } = this
        const currentModal = F.getModal(target)
        this.openModal(currentModal)
    }

    openModal (currentModal) {
        const { F } = this
        const target = (currentModal.target) ? currentModal.target : currentModal
        if( !F.isModalOpen(currentModal) && !F.isModalInArray(currentModal) ) {
            // get old content modal
            let oldContent = Object.getOwnPropertyNames(currentModal.childNodes).map(
                item => ({
                    el: currentModal.childNodes[item],
                    content: (currentModal.childNodes[item].nodeName == '#text') ? currentModal.childNodes[item].textContent : currentModal.childNodes[item].innerHTML
                })
            )
            // set old content to global zModal object
            window.zModal.lastModalOldNodes.push({
                modal: currentModal,
                oldContent
            })
            // push modal
            this._pushModal(currentModal).show()
            // start callbacks and pattern engines
            F.startCallback(target)

            return true
        }
        return false
    }

    openModalFromId (id, callback, time = false) {
        const { F } = this
        const findModal = F.getModalFromId(id)
        const openFunction = () => {
            if(this.openModal(findModal)) {
                (callback instanceof Function) ? callback.apply(this) : null;
            }
        }

        if(typeof time === "number") {
            this.doWithWait(() => {
                openFunction()
            }, time)
        } else {
            openFunction()
        }

        return this
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
    doWithWait(callback, time) {
        time = (typeof time === "number") ? time : this.timeOC
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
                // replace HTML in last modal
                window.zModal.lastModalOldNodes.forEach((node,i) => {
                    if(node.modal === last) {
                        // clear last modal HTML
                        node.modal.innerHTML = ''
                        // each content
                        node.oldContent.forEach(item => {
                            if(item.el.nodeName === '#text') {
                                item.el.textContent = item.content
                            } else {
                                item.el.innerHTML = item.content
                            }
                            // add childs in modal
                            node.modal.appendChild(item.el)
                        })
                    }
                })
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
     * @param {*} last (DOM element)
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

    // placeholder click 
    clickPlaceholder() {
        this.placeholder.addEventListener('click', this.close.bind(this))
    }
    // press ESC
    pressESC () {
        if(this.closeOnESC) {
            window.onkeyup = e => {
                if(this.modals.length >= 1 && e.keyCode === 27) {
                    this.close()
                    return
                }
            }
        }
    }
    // click on closing items
    clickClosingItems () {
        document.querySelectorAll(`.${this.lastModalElementsClassList}`).forEach(item => {
            item.addEventListener('click', this.close.bind(this))
        })
    }
    /**
     * Watch click, hovers and other methods
     */
    _watch () {
        this.pressESC()
        this.clickPlaceholder()
        this.clickClosingItems()
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