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
    UA: navigator.userAgent.toLowerCase(),
    DOC: document,
    WIN: window,
    DET: {}, //detect
    T: {
      LOOPS: 0
    }, //timeline
    X: {}, //enterframe, tween
    MATH: {},
    EASE: {}, //tween, animate
    MOUSE: {}
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

  function getSetClass(el, c1) {
    if (c1) {
      el.className = c1;
    }
    return el.className;
  }

  function switchClass(el, c1, c2) {
      removeClass(el, c1);
      addClass(el, c2);
    }
    //events
  function on(el, evt, fn) {
    el.addEventListener(evt, fn, false);
  }

  function off(el, evt, fn) {
    el.removeEventListener(evt, fn, false);
  }

  function _selectorManager(fn, dom, args) {
    if (dom.length) {
      var retArray = [];
      for (var i = 0; i < dom.length; i++) {
        retArray.push(fn.apply(null, ([dom[i]]).concat(args)));
      }
      return retArray;
    }
    return fn.apply(null, ([dom]).concat(args));
  }

  function hide(el) {
    el.style.display = 'none';
  }

  function show(el) {
    el.style.display = '';
  }

  function text(el, val) {
    if (val) {
      el.textContent = val;
    }
    return el.textContent;
  }

  function html(el, val) {
    if (val) {
      el.innerHTML = val;
    }
    return el.innerHTML;
  }

  function attr(el, att, val) {
    if (val) {
      el.setAttribute(att, val);
    }
    return el.getAttribute(att);
  }

  function css(el, prop, val) {
    var p = (prop).replace(/-([a-z])/g, function(g) {
      return g[1].toUpperCase();
    }).toLowerCase();
    if (val) {
      el.style[p] = val;
    }
    return getComputedStyle(el)[p];
  }

  function rect(el) {
    return el.getBoundingClientRect();
  }

  function transform(el, t) {
      if (t) {
        el.style.transform = t;
        el.style.webkitTransform = t;
      }
      return el.style.transform || el.style.webkitTransform;
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
    if (typeof t === 'string') {
      var map = {
        'loops': F.T.LOOPS,
        'duration': F.T.DUR,
        'timeline': F.T.TL
      };
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
  F.MATH.getFrames = function(dur) {
    return (typeof dur != 'string') ? Math.round(dur / 16.666) : (dur == "fast") ? 12 : (dur == "slow") ? 32 : 24;
  };
  F.EASE = {
    DEFAULT : function(t) {
      return t * t * (3 - 2 * t);
    },
    LINEAR : function(t){
      return t;
    },
    OUT : function(t){
      return t * t;
    },
    IN : function(t){
      return Math.sin(Math.PI * t/2);
    },
    INOUT : function(t){
      return (Math.sin(t * Math.PI - Math.PI/2)+1)/2;
    }
  }
  //tween
  function tween(o, d, f, params) {
      //target object, duration, final value object, ease, update function, complete function
      var t = 0,
        b = {},
        l = {},
        dur = F.MATH.getFrames(d),
        ease = F.EASE.DEFAULT,
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
    //animate
  function animate(el, d, f, params) {
      //target element, duration, final value object, ease, update function, complete function
      var retArray = [],
        t = 0,
        b = {},
        l = {},
        dur = F.MATH.getFrames(d),
        ease = (params && params.ease) ? params.ease : F.EASE.DEFAULT,
        c = (params && params.complete) ? params.complet : null,
        pfx = {};
      for (var k in f) {
        var val = css(el, k);
        pfx[k] = ((f[k]).indexOf('px') !== -1) ? 'px' : ((f[k]).indexOf('%') !== -1) ? '%' : '';
        b[k] = parseFloat((val.indexOf('auto') !== -1) ? 0 : val);
        l[k] = parseFloat(f[k]) - b[k];
      }
      for (var i = 0; i <= dur; i++) {
        retArray.push((function() {
          var _s = '';
          for (var k in f) {
            if (i < dur) {
              _s = k + ' : ' + ((ease(t / dur) * l[k] + b[k])).toFixed(3) + pfx[k] + '; ';
            } else {
              _s = k + ' : ' + b[k] + pfx[k] + '; ';
            }
          }
          if (i == dur) {
            return setTimeout(function() {
              el.style.cssText = _s;
              if (c) {
                c(el);
              }
            }, dur * 16)
          }
          return setTimeout(function() {
            el.style.cssText = _s;
          }, i * 16);
        })());
        ++t;
      }
      return retArray;
    }
    //short animation methods
  F.X.fadeIn = function(el) {
    css(el, 'opacity', 0);
    animate(el, 1000, {
      opacity: 1
    });
  }
  F.X.fadeOut = function(el) {
    css(el, 'opacity', 1);
    animate(el, 1000, {
      opacity: 0
    });
  }
  F.X.slideUp = function(el) {
    animate(el, 1000, {
      height: '0px'
    });
  }
  F.X.slideDown = function(el, val) {
      css(el, 'height', '0px');
      animate(el, 1000, {
        height: val + 'px'
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
    hide: function(dom) {
      _selectorManager(hide, dom, []);
    },
    show: function(dom) {
      _selectorManager(show, dom, []);
    },
    text: function(dom, val) {
      return _selectorManager(text, dom, [val]);
    },
    html: function(dom, val) {
      return _selectorManager(html, dom, [val]);
    },
    attr: function(dom, att, val) {
      return _selectorManager(attr, dom, [att, val])
    },
    css: function(dom, prop, val) {
      return _selectorManager(css, dom, [prop, val])
    },
    rect: function(dom) {
      return _selectorManager(rect, dom, []);
    },
    transform: function(dom, t) {
      return _selectorManager(transform, dom, [t]);
    },
    delay: function(fn, time) {
      return setTimeout(fn, time || 1000);
    },
    class: function(dom, c1) {
      return _selectorManager(getSetClass, dom, [c1]);
    },
    hasClass: function(dom, c1) {
      return _selectorManager(hasClass, dom, [c1]);
    },
    addClass: function(dom, c1) {
      _selectorManager(addClass, dom, [c1]);
      return this;
    },
    removeClass: function(dom, c1) {
      _selectorManager(removeClass, dom, [c1]);
      return this;
    },
    toggleClass: function(dom, c1) {
      _selectorManager(toggleClass, dom, [c1]);
      return this;
    },
    switchClass: function(dom, c1, c2) {
      _selectorManager(switchClass, dom, [c1, c2]);
      return this;
    },
    on: function(dom, eventname, fn) {
      _selectorManager(on, dom, [eventname, fn]);
    },
    off: function(dom, eventname, fn) {
      _selectorManager(off, dom, [eventname, fn]);
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
    animate: animate,
    stateMachine: stateMachine
      /* NON VITAL METHODS END */
  }
})();

/*
 __                  ___  __      __   __   __   ___ 
|__)  /\  |\ | |\ | |__  |__)    /  ` /  \ |  \ |__  
|__) /~~\ | \| | \| |___ |  \    \__, \__/ |__/ |___ 
                                                     
*/
