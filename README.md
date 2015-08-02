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

##HTML Element manipulation

**fla.hide(el)** it will hide the element.

**fla.show(el)** it will show the element as long as display is not equal to 'hidden' in any of the applied classes.

**fla.text(el, stringValue)** it will rewrite the text content.  If no string value is passed it will return the current text.

**fla.html(el, stringValue)** it will rewrite the html content of the element.  If no string value is passed it will return the current text.

**fla.attr(el, attributeName, attributeValue )** it will rewrite the attribute value if attribute value is passed otherwise it will return the current attribute value.

**fla.css(el, stylePropertyName, stylePropertyValue)** it will rewrite the style object property if a style property is passed, otherwise it will return the computed style value.

**fla.transform(el,transformString)** shortcut method to access and overwrite the current transformation.  Same as el.style.transform.

**fla.rect(el)** same as el.getBoundingClientRect().

##Class manipulation

Functions by Todd Motto

**fla.hasClass(el, 'classname')** returns true or false wether classname is applied to the element.

**fla.addClass(el, 'classname')** if is not already present it will add the classname to the element.

**fla.removeClass(el, 'classname')** if is present it will remove the class from the element.

**fla.toggleClass(el, 'classname')** it will remove or add the class depending if it is already present or not.

###Utility class manipulation methods

**fla.switchClass(el, 'first', 'second')** it will switch the first class with the second class.

**fla.eventClass(eventName, triggerElement, classname, targetElement)** specialty method to apply different animations on object events.  
```
fla.eventClass('onmouseover', fla.$('a'), 'bounce', fla.$('.cta')); 
```
This code is equivalent to say IF onmouseover ON anchor elements, then DO addClass('bounce') TO all elements with the .cta class applied.

Inspired by AniJS.

##Javascript animation methods

**fla.enterframe(fn,fps)**
```
fla.enterframe(function(){
 console.log('continuosly triggering animation');
});
```
This function will continously trigger every 60 frames (or every 16 milliseconds).  If another functions is passed later on the first one will be removed.  If false is passed the current animation will stop.  The fps argument is used to change the default 60 fps value.

**fla.timeline(frameArray)**
```
fla.timeline([
  [function(){console.log('frame 1');},2000],
  [function(){console.log('frame 2');},8000]
]);
```
Specialty method to trigger several setTimeout() calls one after the other.  Each frame is represented by a function and a time delay in milliseconds.  The first one will trigger after 2 seconds, the second one after 10 seconds (2 of the first one plus 8 of the second one).

**fla.tween(object, duration, animationObject, parametersObject)**
```
var $logo = fla.$('div .logo');
var fadeOutLeft = {alpha:0, x:-500};
var fadeIn = {alpha:1, y:0};
function bounceOut(t) {
	if (t < (1/2.75)) {
		return (7.5625*t*t);
	} else if (t < (2/2.75)) {
		return (7.5625*(t-=(1.5/2.75))*t + .75);
	} else if (t < (2.5/2.75)) {
		return (7.5625*(t-=(2.25/2.75))*t + .9375);
	} else {
		return (7.5625*(t-=(2.625/2.75))*t + .984375);
	}
}
fla.tween(fadeOutLeft, 2000, fadeIn, {
  ease: bounceOut,
  complete:function(){console.log('animation end');},
  update:function(animationTarget){
    $logo.css('opacity', animationTarget.opacity);
    $logo.transform('translateX(' + animationTarget.x + 'px)');
  }
});
```
Specialty method to make simple tweening animations.  Notice that the animation is applied over a javascript object and not an HTML element.  Use the **update** function in the parameters object to apply the changes to a visual element.  This methodology is recommended on dynamic animations or browsers that do not support CSS3 animations.

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

