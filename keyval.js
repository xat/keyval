!function(glob) {

  var keyval = function(cfg) {

    cfg = extend({
      engine: 'memory'
    }, cfg);

    var data = {};
    var engine, api;

    if (typeof cfg.engine == 'string') {
      engine = engines[cfg.engine]();
    } else if (typeof cfg.engine == 'function') {
      engine = cfg.engine();
    } else {
      engine = engines[cfg.engine.name](cfg.engine);
    }

    api = extend({

      get: function(key) {
        return data[key];
      },

      set: function(key, val, save) {
        var event = this.has(key) ? 'update' : 'add';
        this.emit(event + ':' + key, data[key], key);
        this.emit(event, data[key], key);
        data[key] = val;
        save && this.save();
      },

      has: function(key) {
        return key in data;
      },

      remove: function(key, save) {
        this.emit('remove:' + key, data[key], key);
        this.emit('remove', data[key], key);
        delete data[key];
        save && this.save();
      },

      each: function(fn) {
        for (var k in data) {
          if (!data.hasOwnProperty(k)) continue;
          fn(data[k], k);
        }
      },

      getAll: function() {
        return data;
      },

      removeAll: function(save) {
        var that = this;
        this.each(function(val, key) {
          that.remove(key);
        });
        save && this.save();
      },

      save: function() {
        this.emit('save', data);
        engine.save(data);
      },

      load: function() {
        var that = this;
        data = engine.restore();
        this.emit('load', data);
        this.each(function(val, key) {
          that.emit('add:' + key, data[key], key);
          that.emit('add', data[key], key);
        });
      }

    }, emitty);

    return api;
  };

  var engines = {

    memory: function() {

      return {
        save: noop,
        restore: function() {
          return {};
        }
      };

    },

    session: function(cfg) {
      cfg = extend(cfg, {
        name: 'keyval.default'
      });

      return {

        save: function(data) {
          window.sessionStorage.setItem(cfg.name, JSON.stringify(data));
        },

        restore: function() {
          return JSON.parse(window.sessionStorage.getItem(cfg.name)) || {};
        }

      };
    },

    local: function(cfg) {
      cfg = extend(cfg, {
        name: 'keyval.default'
      });

      return {

        save: function(data) {
          window.localStorage.setItem(cfg.name, JSON.stringify(data));
        },

        restore: function() {
          return JSON.parse(window.localStorage.getItem(cfg.name)) || {};
        }

      };
    }

  };

  function noop() {}

  // thanks raynos!
  // https://github.com/Raynos/xtend
  function extend() {
    var target = {};
    for (var i = 0; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (source.hasOwnProperty(key)) {
          target[key] = source[key]
        }
      }
    }
    return target;
  }


  // thanks again raynos!
  // https://github.com/Raynos/eventemitter-light
  var emitty = {

    on: function (ev, handler) {
      var events = this._events();
      (events[ev] || (events[ev] = [])).push(handler)
    },
    off: function (ev, handler) {
      var array = this._events(ev);
      array && array.splice(array.indexOf(handler), 1)
    },
    emit: function (ev) {
      var args = [].slice.call(arguments, 1),
        array = this._events()[ev] || [];

      for (var i = 0, len = array.length; i < len; i++) {
        array[i].apply(this, args);
      }
    },
    once: function (ev, handler) {
      this.on(ev, remover);

      function remover() {
        handler.apply(this, arguments);
        this.off(ev, remover);
      }
    },
    _events: function() {
      if (!this.__events) this.__events = {};
      return this.__events;
    }

  };

  // Node.js / browserify
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = keyval;
  }
  // <script>
  else {
    glob.keyval = keyval;
  }

}(this);