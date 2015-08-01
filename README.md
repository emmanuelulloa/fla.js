# fla.js

A framework for HTML5 banner development

##Initialization

```
fla.ready(function(){
  console.log('document is ready');
}
```  

function triggers when 'DOMContentLoaded' triggers or or the document ready state is complete.

```
console.log(fla.detect('html5'));
```

It will return true if addEventListener and querySelector is supported by the browser.

```
console.log(fla.detect('ie'));
```
It will return the Internet Explorer version or 0 if any other browser.

##Selectors

**fla.$('selector')** same as document.querySelector('selector').  Returns html element.

**fla.$$('selector')** same as document.querySelectorAll('selector').  Returns node list.

**fla.$id('id')** same as document.getElementById('id').  Returns html element.

**fla.$tag('p')** same as document.getElementsByTagName('p').  Returns node list.

**fla.$class('my-class')** same as document.getElementsByClassName('my-class'). Returns node list.

