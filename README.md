# fla.js

A framework for HTML5 banner development

##Initialization
**fla.ready**
```
fla.ready(function(){
  console.log('document is ready');
}
```  

function triggers when 'DOMContentLoaded' triggers or or the document ready state is complete.

**fla.detect(propertyToDetect)**
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

##Class manipulation

Functions by Todd Motto

**fla.hasClass(el, 'classname')** returns true or false wether classname is applied to the element.

**fla.addClass(el, 'classname')** if is not already present it will add the classname to the element.

**fla.removeClass(el, 'classname')** if is present it will remove the class from the element.

**fla.toggleClass(el, 'classname')** it will remove or add the class depending if it is already present or not.

###Utility class manipulation methods

**fla.switchClass(el, 'first', 'second')** it will switch the first class with the second class.

**fla.eventClass(eventName, triggerElement, classname, targetElement)** specialty method to apply different animations on object events.  Inspired by AniJS.



##HTML Element manipulation

**fla.hide(el)** it will hide the element.

**fla.show(el)** it will show the element as long as display is not equal to 'hidden' in any of the applied classes.

**fla.text(el, stringValue)** it will rewrite the text content.  If no string value is passed it will return the current text.

**fla.html(el, stringValue)** it will rewrite the html content of the element.  If no string value is passed it will return the current text.

**fla.attr(el, attributeName, attributeValue )** it will rewrite the attribute value if attribute value is passed otherwise it will return the current attribute value.

**fla.css(el, stylePropertyName, stylePropertyValue)** it will rewrite the style object property if a style property is passed, otherwise it will return the computed style value.

**fla.transform(el,transformString)** shortcut method to access and overwrite the current transformation.  Same as el.style.transform.

**fla.rect(el)** same as el.getBoundingClientRect().

##Utility methods
**fla.each()**
```
fla.each(array, function(index, element){
  console.log([index,element]);
});
```
Shortcut method for loop operations.  Since this method might be used for particles system relies in the while loop and looping is reversed (from length to 0).

**fla.delay()**
```
var myTimeout = fla.delay(function(){
  console.log('delay triggered');
}, 5000);
```
A wrapper method for the setTimeout javascript function.  It returns an id that can be used for avoid triggering the function with clearTimeout(myTimeout).

**fla.bingo(async)** this is a Math.random() replacement method (that might not be allowed in certain rich media platforms).  If async is equal to true it will rely on the current time to generate a random number.

**fla.mouse(target)** returns an object with x, y and 'pressed' values with the current mouse position if an html element is passed it will return the coordinates for that target element.

