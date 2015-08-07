/*                                      
_____________        ________        
___  __/__  /_____ _ ______(_)_______
__  /_ __  /_  __ `/ _____  /__  ___/
_  __/ _  / / /_/ /______  / _(__  ) 
/_/    /_/  \__,_/_(_)__  /  /____/  
                     /___/           
By Emmanuel Ulloa
Get it at: https://github.com/emmanuelulloa/fla.js
*/
var fla = (function() {
  var F = {
    UA : navigator.userAgent.toLowerCase(),
    DOC : document,
    WIN : window,
    DET : {},//detect
    T : {LOOPS:0}, //timeline
    X : {},//enterframe, tween
    MATH : {},
    MOUSE : {}
  };
  //detect
  F.DET.html5 = 'querySelector' in F.DOC && 'addEventListener' in F.WIN;
  F.DET.ie = (F.UA != -1) ? parseInt(F.UA.split('msie')[1]) : 0;
  //class manipulation
  //functions by Todd Motto
  function hasClass(elem, className) {
    return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
  }

  function addClass(elem, className) {
    if (!hasClass(elem, className)) {
      elem.className += ' ' + className;
    }
  }

  function removeClass(elem, className) {
    var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, ' ') + ' ';
    if (hasClass(elem, className)) {
      while (newClass.indexOf(' ' + className + ' ') >= 0) {
        newClass = newClass.replace(' ' + className + ' ', ' ');
      }
      elem.className = newClass.replace(/^\s+|\s+$/g, '');
    }
  }

  function toggleClass(elem, className) {
    var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, ' ') + ' ';
    if (hasClass(elem, className)) {
      while (newClass.indexOf(' ' + className + ' ') >= 0) {
        newClass = newClass.replace(' ' + className + ' ', ' ');
      }
      elem.className = newClass.replace(/^\s+|\s+$/g, '');
    } else {
      elem.className += ' ' + className;
    }
  }

  function getSetClass(el, c1){
    if(c1){
      el.className = c1;
    }
    return el.className;
  }
  
  function switchClass(el, c1, c2) {
    removeClass(el, c1);
    addClass(el, c2);
  }

  function _classManager(fn, dom, a, b, c) {
      if (dom.length) {
        var arr = [];
        for (var i = 0; i < dom.length; i++) {
          arr.push(fn(dom[i], a, b, c));
        }
        return arr;
      }
      return fn(dom, a, b, c);
    }
    //events
  function on(el, evt, fn) {
    el.addEventListener(evt, fn, false);
  }

  function off(el, evt, fn) {
    el.removeEventListener(evt, fn, false);
  }

  function _eventManager(fn, dom, evt, foo) {
      if (dom.length) {
        for (var i = 0; i < dom.length; i++) {
          fn(dom[i], evt, foo);
        }
        return;
      }
      fn(dom, evt, foo);
    }
    
    //each polyfill
  function each(arr, fn, arg) {
    var l = arr.length;
    while (l) {
      --l;
      fn.call(arg, l, arr[l], arr);
    }
  }
//timeline
  function timeline(t) {
    if(typeof t === 'string'){
      var map = {'loops':F.T.LOOPS,'duration':F.T.DUR, 'timeline':F.T.TL};
      return map[t];
    }
    if (typeof t === 'boolean' && t === false) {
      for (var i = 0; i < F.T.TOS.length; i++) {
        clearTimeout(F.T.TOS[i]);
      }
      return;
    }
    F.T.TOS = [];
    F.T.DUR = 0;
    F.T.TL = t;
    F.T.LOOPS++;
    for (var i = 0; i < t.length; i++) {
      F.T.TOS.push(setTimeout(t[i][0], F.T.DUR += t[i][1]));
    }
  }

/* NON VITAL METHODS START */
  function _getArgs(val) {
    var arr = ((val.indexOf(',') != -1) ? val.split(',') : [val]);
    return arr;
  }

  function _getFn(val) {
    return {
      foo: (val.length > 1) ? val[0] : 'addClass',
      arg: (val.length > 1) ? _getArgs(val[1]) : _getArgs(val[0])
    }
  }

  function scroller(el, params) {
      /*
      fla.scroller(fla.$('.scroll-target'), {container:fla.$('.my-scroller'), trueFunction:function(el){fla.addClass(el,'redtext')}});
      */
      var _tf, _ff, _dft = 0,
        _cnt, fn;
      if (params) {
        if (params.container) {
          _cnt = params.container
        }
        if (params.yes) {
          _tf = params.yes
        }
        if (params.no) {
          _ff = params.no
        }
        if (params.distanceFromTop) {
          _dft = Math.abs(params.distanceFromTop)
        }

      }
      var DOC = F.DOC;
      fn = function(evt) {
        var _scroll = 0,
          _offset = 0;
        if (_cnt) {
          _scroll = _cnt.scrollTop;
          _offset = _cnt.getBoundingClientRect().top;
        } else {
          _scroll = DOC.body && DOC.body.scrollTop || DOC.documentElement && DOC.documentElement.scrollTop;
        }
        var _elemTop = el.getBoundingClientRect().top,
          info = {
            event: evt,
            scroll: _scroll,
            scrollTop: _elemTop,
            offset: _offset,
            distanceFromTop: _dft,
            target: el,
            scroller: _cnt || DOC
          };
        if (_elemTop < (_scroll - _offset) + _dft) {
          if (_tf) {
            _tf(info);
          }
        } else {
          if (_ff) {
            _ff(info);
          }
        }
      }
      on(_cnt || F.DOC, 'scroll', fn);
      return fn;
    }
    //ticker implementation
  F.X.RAF = null;
  F.X.FPS = 16;
  var req = 'request' + 'AnimationFrame';
  if (!F.WIN[req]) {
    req = 'Request' + 'AnimationFrame';
    F.X.RAF = F.WIN['webkit' + req] || F.WIN['moz' + req] || F.WIN['ms' + req] || F.WIN['o' + req] || function(callback) {
      return F.WIN.setTimeout(callback, F.X.FPS);
    }
  } else {
    F.X.RAF = F.WIN[req];
  }
var RAF = F.X.RAF;
F.X.TICKER = {
    _ts: [],
    _qty: 0,
    _ip: false,
    add: function(t) {
      this._qty = this._ts.push(t);
      if (!this._ip) {
        this.tick();
        this._ip = true;
      }
      return t;
    },
    remove: function(t) {
      var l = this._ts.length;
      while (l--) {
        if (t === this._ts[l]) {
          return this._ts.splice(l, 1);
        }
      }
      return;
    },
    tick: function() {
      var l = F.X.TICKER._ts.length;
      while (l--) {
        F.X.TICKER._ts[l]();
      }
      RAF(F.X.TICKER.tick);
    }
  };
  //enterframe
  F.X.OEF = null;

  function enterframe(fn, fps) {
      F.X.FPS = (fps) ? 1000 / fps : 16;
      if (typeof fn === 'boolean' && fn === false) {
        F.X.TICKER.remove(F.X.OEF);
        return;
      }
      if (F.X.OEF) {
        F.X.TICKER.remove(F.X.OEF);
      }
      F.X.TICKER.add(F.X.OEF = fn);
    }
    //tween
  function tween(o, d, f, params) {
      //target object, duration, final value object, ease, update function, complete function
      var t = 0,
        b = {},
        l = {},
        dur = (typeof d != 'string') ? Math.round(d / 16.666) : (d == "fast") ? 12 : (d == "slow") ? 32 : 24,
        ease = function(t) {
          return t * t * (3 - 2 * t);
        },
        u, c;
      if (params) {
        if (params.ease) {
          ease = params.ease
        }
        if (params.complete) {
          c = params.complete
        }
        if (params.update) {
          u = params.update
        }
      }
      for (var k in f) {
        b[k] = o[k];
        l[k] = f[k] - o[k]
      }
      var _tween = F.X.TICKER.add(function() {
        if (t > dur) {
          for (var k in f) {
            o[k] = f[k];
          }
          if (c) {
            c(o);
          }
          F.X.TICKER.remove(_tween);
        } else {
          for (var k in f) {
            o[k] = ease(t / dur) * l[k] + b[k];
          }
          if (u) {
            u(o);
          }
          ++t;
        }
      });
    }
    //middle-square
  F.MATH.SEED = 1234;
  function middleSquare(seed) {
      F.MATH.SEED = (seed) ? seed : F.MATH.SEED;
      var sq = (F.MATH.SEED * F.MATH.SEED) + '';
      F.MATH.SEED = parseInt(sq.substring(0, 4));
      return parseFloat('0.' + F.MATH.SEED);
    }
    //mouse position
  F.MOUSE.TARGET = null;
  F.MOUSE.INFO = {
    x: 0,
    y: 0,
    pressed: false
  };

  function mouse(target) {
      if (!F.MOUSE.TARGET) {
        F.MOUSE.TARGET = target
        on(F.MOUSE.TARGET || F.DOC, 'mousemove', function(evt) {
          F.MOUSE.INFO.x = evt.clientX;
          F.MOUSE.INFO.y = evt.clientY;
        });
        on(F.DOC, 'mousedown', function(evt) {
          F.MOUSE.INFO.pressed = true;
        });
        on(F.DOC, 'mouseup', function(evt) {
          F.MOUSE.INFO.pressed = false;
        });
      }
      return F.MOUSE.INFO;
    }
    //breakApart
  function breakApart(el, type) {
      var opts = {
          'letters': '',
          'words': ' ',
          'lines': '<br/>'
        },
        classname = {
          '': 'class="char',
          ' ': 'class="word',
          '<br/>': 'class="line'
        },
        splitter = (!type) ? '' : opts[type],
        html = '',
        o = '<span @@>',
        c = '</span>',
        raw = (splitter !== opts.lines) ? el.textContent.split(splitter) : el.innerHTML.split(splitter);
      for (var i = 0; i < raw.length; i++) {
        html += o.replace('@@', classname[splitter] + (i + 1) + '" ') + raw[i] + c;
      }
      el.innerHTML = html;
      return el.children;
    }
    //State Machine
  function _FSM() {
    this._state = '';
    this._obj = {};
    this._noFoo = function() {};
  }
  _FSM.prototype = {
    addState: function(name, enter, leave) {
      this._obj[name] = {
        e: enter || this._noFoo,
        l: leave || this._noFoo
      };
    },
    setState: function(state) {
      if (!state in this._obj) {
        return;
      }
      this._obj[this._state].l();
      this._obj[this._state = state].e();
    }
  }

  function stateMachine() {
      return new _FSM();
    }
  /* NON VITAL METHODS END */
    //API
  return {
    detect: function(val) {
      return F.DET[val];
    },
    ready: function(fn) {
      if (typeof fn !== 'function') {
        return;
      }
      if (document.readyState === 'complete') {
        return fn();
      }
      document.addEventListener('DOMContentLoaded', fn, false);
      return;
    },
    $id: function(id) {
      return document.getElementById(id);
    },
    $tag: function(tag) {
      return document.getElementsByTagName(tag);
    },
    $class: function(classname) {
      return document.getElementsByClassName(classname);
    },
    $: function(selector, el) {
      return (el || document).querySelector(selector);
    },
    $$: function(selector, el) {
      return (el || document).querySelectorAll(selector);
    },
    hide: function(el) {
      el.style.display = 'none';
    },
    show: function(el) {
      el.style.display = '';
    },
    text: function(el, val) {
      if (val) {
        el.textContent = val;
      }
      return el.textContent;
    },
    html: function(el, val) {
      if (val) {
        el.innerHTML = val;
      }
      return el.innerHTML;
    },
    attr: function(el, att, val) {
      if (val) {
        el.setAttribute(att, val);
      }
      return el.getAttribute(att);
    },
    css: function(el, prop, val) {
      var p = (prop).replace(/-([a-z])/g, function(g) {
        return g[1].toUpperCase();
      }).toLowerCase();
      if (val) {
        el.style[p] = val;
      }
      return getComputedStyle(el)[p];
    },
    rect: function(el) {
      return el.getBoundingClientRect();
    },
    transform: function(el, t) {
      if (t) {
        el.style.transform = t;
        el.style.webkitTransform = t;
      }
      return el.style.transform || el.style.webkitTransform;
    },
    delay: function(fn, time) {
      return setTimeout(fn, time || 1000);
    },
    class: function(dom, c1){
      return _classManager(getSetClass, dom, c1);
    },
    hasClass: function(dom, c1) {
      return _classManager(hasClass, dom, c1);
    },
    addClass: function(dom, c1) {
      _classManager(addClass, dom, c1);
    },
    removeClass: function(dom, c1) {
      _classManager(removeClass, dom, c1);
    },
    toggleClass: function(dom, c1) {
      _classManager(toggleClass, dom, c1);
    },
    switchClass: function(dom, c1, c2) {
      _classManager(switchClass, dom, c1, c2);
    },
    on: function(dom, eventname, fn) {
      _eventManager(on, dom, eventname, fn);
    },
    off: function(dom, eventname, fn) {
      _eventManager(off, dom, eventname, fn);
    },
    each: each,
    timeline: timeline,
    /* NON VITAL METHODS START */
    particles: function(qty, parent, classname, type) {
      var el = type || 'div',
        dom = [];
      for (var i = 0; i < qty; i++) {
        var o = document.createElement(el);
        o.id = 'particle' + i;
        o.className = classname || '';
        parent.appendChild(o);
        dom.push(o);
      }
      return dom;
    },
    bingo: function(async) {
      if (async) {
        return (new Date().getMilliseconds() + 1) / 1000;
      }
      return middleSquare();
    },
    eventClass: function(eventname, selector, classname, target) {
      //if('mouseover') on('.banner') do('shake') [to('.bubble')]
      var dom = (target) ? target : selector,
        me = this,
        fn = function(evt) {
          var o = _getFn(classname.split(':'));
          o.arg.unshift(dom);
          me[o.foo].apply(this, o.arg);
        };
      me.on(selector, eventname, fn);
    },
    breakApart: breakApart,
    mouse: mouse,
    scroller: scroller,
    enterframe: enterframe,
    tween: tween,
    stateMachine: stateMachine
    /* NON VITAL METHODS END */
  }
})();

/*
 __                  ___  __      __   __   __   ___ 
|__)  /\  |\ | |\ | |__  |__)    /  ` /  \ |  \ |__  
|__) /~~\ | \| | \| |___ |  \    \__, \__/ |__/ |___ 
                                                     
*/
