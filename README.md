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

##HTML Element manipulation

**fla.hide(el)** it will hide the element.

**fla.show(el)** it will show the element as long as display is not equal to 'hidden' in any of the applied classes.

**fla.text(el, stringValue)** it will rewrite the text content.  If no string value is passed it will return the current text.

**fla.html(el, stringValue)** it will rewrite the html content of the element.  If no string value is passed it will return the current text.

**fla.attr(el, attributeName, attributeValue )** it will rewrite the attribute value if attribute value is passed otherwise it will return the current attribute value.

**fla.css(el, stylePropertyName, stylePropertyValue)** it will rewrite the style object property if a style property is passed, otherwise it will return the computed style value.

**fla.transform(el,transformString)** shortcut method to access and overwrite the current transformation.  Same as el.style.transform.

**fla.rect(el)** same as el.getBoundingClientRect().
