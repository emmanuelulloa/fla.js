/*                                      
 _______  ___      _______            ___  _______ 
|       ||   |    |   _   |          |   ||       |
|    ___||   |    |  |_|  |          |   ||  _____|
|   |___ |   |    |       |          |   || |_____ 
|    ___||   |___ |       | ___   ___|   ||_____  |
|   |    |       ||   _   ||   | |       | _____| |
|___|    |_______||__| |__||___| |_______||_______|    
By Emmanuel Ulloa
Get it at: https://github.com/emmanuelulloa/fla.js
*/
var fla = (function() {
  //feature support
  var ua = navigator.userAgent.toLowerCase();
  var _detect = {
    html5: 'querySelector' in document && 'addEventListener' in window,
    ie: (ua != -1) ? parseInt(ua.split('msie')[1]) : 0
  };
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
    //timeline
    //each polyfill
  function each(arr, fn, arg) {
    var l = arr.length;
    while (l) {
      --l;
      fn.call(arg, l, arr[l], arr);
    }
  }
  var _t = 0,
    _tos = [];

  function timeline(t) {
    if (typeof t === 'boolean' && t === false) {
      for (var i = 0; i < _tos.length; i++) {
        clearTimeout(_tos[i]);
      }
    }
    for (var i = 0; i < t.length; i++) {
      _tos.push(setTimeout(t[i][0], _t += t[i][1]));
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
      fn = function(evt) {
        var _scroll = 0,
          _offset = 0;
        if (_cnt) {
          _scroll = _cnt.scrollTop;
          _offset = _cnt.getBoundingClientRect().top;
        } else {
          _scroll = document.body && document.body.scrollTop || document.documentElement && document.documentElement.scrollTop;
        }
        var _elemTop = el.getBoundingClientRect().top,
          info = {
            event: evt,
            scroll: _scroll,
            scrollTop: _elemTop,
            offset: _offset,
            distanceFromTop: _dft,
            target: el,
            scroller: _cnt || document
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
      on(_cnt || document, 'scroll', fn);
      return fn;
    }
    //ticker implementation
  var RAF, _w = window,
    _r = 'request' + 'AnimationFrame',
    _fps = 16;
  if (!_w[_r]) {
    _r = 'Request' + 'AnimationFrame';
    RAF = _w['webkit' + _r] || _w['moz' + _r] || _w['ms' + _r] || _w['o' + _r] || function(callback) {
      return _w.setTimeout(callback, _fps);
    }
  } else {
    RAF = _w[_r];
  }
  var TICKER = {
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
      var l = TICKER._ts.length;
      while (l--) {
        TICKER._ts[l]();
      }
      RAF(TICKER.tick);
    }
  };
  //enterframe
  var _ef;

  function enterframe(fn, fps) {
      _fps = (fps) ? 1000 / fps : 16;
      if (typeof fn === 'boolean' && fn === false) {
        TICKER.remove(_ef);
        return;
      }
      if (_ef) {
        TICKER.remove(_ef);
      }
      TICKER.add(_ef = fn);
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
      var _tween = TICKER.add(function() {
        if (t > dur) {
          for (var k in f) {
            o[k] = f[k];
          }
          if (c) {
            c(o);
          }
          TICKER.remove(_tween);
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
  var _seed = 1234;

  function middleSquare(seed) {
      _seed = (seed) ? seed : _seed;
      var sq = (_seed * _seed) + '';
      _seed = parseInt(sq.substring(0, 4));
      return parseFloat('0.' + _seed);
    }
    //mouse position
  var _mt, _mp = {
    x: 0,
    y: 0,
    pressed: false
  };

  function mouse(target) {
      if (!_mt) {
        on(_mt = target || document, 'mousemove', function(evt) {
          _mp.x = evt.clientX;
          _mp.y = evt.clientY;
        });
        on(_mt = target || document, 'mousedown', function(evt) {
          _mp.pressed = true;
        });
        on(_mt = target || document, 'mouseup', function(evt) {
          _mp.pressed = false;
        });
      }
      return _mp;
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
      return _detect[val];
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
    hasClass: function(dom, c1) {
      _classManager(hasClass, dom, c1);
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
