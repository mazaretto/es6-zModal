zModal
====
Documentation
---

**Add JS and CSS files in your html:**
```html
<link rel="stylesheet" type="text/css" href="zmodal.min.css" />
<script type="text/javascript" src="zmodal.min.js" defer></script>
```
**Initialize the plugin (params are optional):**
```javascript
new zModal(options <Object>)
```
**Plugin settings**
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
**More about properties:**
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

---
Introduction
---
zModal is a minimalist and easy-to-use modal plugin written in native JavaScript.
zModal is opnsource project.
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