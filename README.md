# fla.js

A framework for HTML5 banner development

##Initialization

```fla.ready(function(){console.log('document is ready');}```  

function triggers when 'DOMContentLoaded' triggers or or the document ready state is complete.

##Selectors

**fla.$('selector')** same as document.querySelector('selector').  Returns html element.

**fla.$$('selector')** same as document.querySelectorAll('selector').  Returns node list.

**fla.$id('id')** same as document.getElementById('id').  Returns html element.

**fla.$tag('p')** same as document.getElementsByTagName('p').  Returns node list.

**fla.$class('my-class')** same as document.getElementsByClassName('my-class'). Returns node list.

