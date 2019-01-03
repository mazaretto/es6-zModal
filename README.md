zModal
====
Documentation
---

**Add JS and CSS files in your html:**
```html
<script type="text/javascript" src="zmodal.min.js" defer></script>
```
**Initialize the plugin (params are optional):**
```javascript
new zModal(Object)
```
**Plugin settings:**
```javascript
// default options
new zModal({
    closeOnESC: true,
    data: {
        myFirstModalWindow: 'Hello World!'
    }  
}).createModal('modalId', {
    effect: 'fadein',
    template: `<p>{# myFirstModalWindow #}</p>`
})
```
**All options:**
```javascript
new zModal({
    closeOnESC: Boolean, 
    closeOnPlaceholder: Boolean,
    data: Object,
    methods: Object,
    validTags: String, 
    prefix: String, 
    fillPlaceholder: String,
    eventOpen: String,
    timeOC: Number
})
```
####Properties:
* closeOnEsc - `close the modal window when pressing ESC`
    * default - **false**
* closeOnPlaceholder - `close the modal window when clicking on the background`
    * default - **true**
* data - `required object for templates and data properties`
    * default - **{}**
* methods - `necessary object for callback functions when opening a modal window`
    * default - **{}**
* validTags - `tags to be associated with the plugin`
    * default - **all**
* prefix - `data attribute that indicates modal window id`
    * default - **data-zmodal**
* fillPlaceholder - `cover background color`
    * default - **#333**
* eventOpen - `an event that will straggle on valid tags`
    * default - **click**
* timeOC - `opening and closing time of the modal window`
    * default - **500 (ms)**

####Methods:
```javascript
// creating a modal window
zModal.createModal(String <modalId>, <Object> {
    effect: String,
    template: String,
    youtubeVideo: <Object> {
        w: Number,
        h: Number,
        url: String,
        autoplay: boolean
    }
})
// open a modal window
zModal.openModalFromId(String <modalId>, Function <callback>, Time <Number>)
```

Introduction
---
zModal is a minimalist and easy-to-use modal plugin written in native JavaScript.
* No dependencies required
* You can customize effects via CSS
* Simple API
* No extra files to download
* Pattern support to simplify development

Contribute
---
```javascript
$ git clone https://github.com/mazaretto/es6-zModal.git
$ cd es6-zModal
$ npm run start:dev || yarn start:dev
```