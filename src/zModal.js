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
        // main placeholder 
        this.placeholder = null
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
        // default class
        this.defaultClass = 'zmodal'
        // plugin initialization
        this._init()
    }

    /**
     * @return last modal in array modals
     */
    _getLastModal () {
        return this.modals.reverse()[0]
    }

    /**
     * 
     * @param {*} modal 
     * @default this.last - last opening modal in modals array
     */
    open (modal = this.last) {

    }

    /**
     * 
     * @param {*} modal 
     * @default this.last - last modal in modals array
     */
    close (modal = this.last) {

    }

    /**
     * @return appending styles in <head> tag
     */
    _initStyles () {
        
    }
    
    /**
     * @return placecholder for modals (with user opts)
     * @param {*} placeholder 
     */
    _addOptionsInPlaceholder (placeholder) {
        const opts = this.opts,
            { effect, duration, fill, opacity } = opts,
            defaultClass = this.defaultClass,
            closeOnPlaceholder = (opts.closeOnPlaceholder) ? defaultClass + '-placeholder-close' : defaultClass + '-placeholder-static';
        placeholder.classList.add(`${defaultClass}-placeholder`,
                                    `${defaultClass}-${effect || 'fadein'}`,
                                    closeOnPlaceholder)
        placeholder.style = `background: ${fill || this.defaultColorPlaceholder};
                             opacity: ${opacity || this.defaultOpacityPlaceholder};`

        return placeholder
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
     * @adding append placeholder in <body>
     */
    _addPlaceholder () {
        this.DOM.appendChild(
            this.createPlaceholder()
        )
    }

    /**
     * @return plugin initialization
     */
    _init () {
        this._initStyles()
        this._addPlaceholder()
    }
}

export default zModal