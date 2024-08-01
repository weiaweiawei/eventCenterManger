// emcenter v1.0.0 Copyright (c) 2024 hardey and contributors
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.emcenter = factory());
})(this, (function () { 'use strict';

  function _arrayLikeToArray(r, a) {
    (null == a || a > r.length) && (a = r.length);
    for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
    return n;
  }
  function _arrayWithoutHoles(r) {
    if (Array.isArray(r)) return _arrayLikeToArray(r);
  }
  function _classCallCheck(a, n) {
    if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
  }
  function _defineProperties(e, r) {
    for (var t = 0; t < r.length; t++) {
      var o = r[t];
      o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
    }
  }
  function _createClass(e, r, t) {
    return r && _defineProperties(e.prototype, r), Object.defineProperty(e, "prototype", {
      writable: !1
    }), e;
  }
  function _createForOfIteratorHelper(r, e) {
    var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
    if (!t) {
      if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e) {
        t && (r = t);
        var n = 0,
          F = function () {};
        return {
          s: F,
          n: function () {
            return n >= r.length ? {
              done: !0
            } : {
              done: !1,
              value: r[n++]
            };
          },
          e: function (r) {
            throw r;
          },
          f: F
        };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var o,
      a = !0,
      u = !1;
    return {
      s: function () {
        t = t.call(r);
      },
      n: function () {
        var r = t.next();
        return a = r.done, r;
      },
      e: function (r) {
        u = !0, o = r;
      },
      f: function () {
        try {
          a || null == t.return || t.return();
        } finally {
          if (u) throw o;
        }
      }
    };
  }
  function _iterableToArray(r) {
    if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _toConsumableArray(r) {
    return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
  }
  function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r);
      if ("object" != typeof i) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (String )(t);
  }
  function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
  }
  function _unsupportedIterableToArray(r, a) {
    if (r) {
      if ("string" == typeof r) return _arrayLikeToArray(r, a);
      var t = {}.toString.call(r).slice(8, -1);
      return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
    }
  }

  var EMCenter = /*#__PURE__*/function () {
    function EMCenter() {
      _classCallCheck(this, EMCenter);
      this._listeners = []; // 事件监听器数组
      this._isSilent = false; // 是否静默
      this._isScoped = false; // 是否作用域限制
    }

    // 订阅事件
    return _createClass(EMCenter, [{
      key: "on",
      value: function on(event, callback) {
        var _this = this;
        var priority = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
        if (Array.isArray(event)) {
          event.forEach(function (e) {
            return _this.on(e, callback, priority);
          });
          return this;
        }
        this._listeners.push({
          event: event,
          callback: callback,
          priority: priority
        }); // 添加事件监听器
        sort(this._listeners); // 按优先级排序
        return this;
      }

      // 订阅一次性事件
    }, {
      key: "once",
      value: function once(event, callback) {
        var _this2 = this;
        var priority = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
        if (Array.isArray(event)) {
          event.forEach(function (e) {
            return _this2.once(e, callback, priority);
          });
          return this;
        }
        this._listeners.push({
          event: event,
          callback: callback,
          priority: priority,
          once: true
        }); // 添加一次性事件监听器
        sort(this._listeners); // 按优先级排序
        return this;
      }

      // 取消订阅事件
    }, {
      key: "off",
      value: function off(event, callback) {
        var _this3 = this;
        if (Array.isArray(event)) {
          event.forEach(function (e) {
            return _this3.off(e, callback);
          });
          return this;
        }
        this._listeners = this._listeners.filter(function (item) {
          return item.event !== event || callback !== undefined && item.callback !== callback;
        }); // 从监听器数组中移除
        return this;
      }
      // 检查是否包含指定事件监听器
    }, {
      key: "contain",
      value: function contain(event, callback) {
        var _this4 = this;
        if (Array.isArray(event)) {
          return event.every(function (e) {
            return _this4.contain(e, callback);
          });
        }
        return this._listeners.some(function (item) {
          return item.event === event && (callback === undefined || item.callback === callback);
        });
      }

      // 设置静默模式
    }, {
      key: "silent",
      value: function silent(fn) {
        if (typeof fn === "boolean") {
          this._isSilent = fn;
          return;
        }
        if (Array.isArray(fn)) {
          this._isSilent = fn;
          return;
        }
        this._isSilent = true;
        var result = fn.call(this); // 执行传入的函数
        this._isSilent = false;
        return result;
      }

      // 设置作用域
    }, {
      key: "scope",
      value: function scope(fn) {
        if (typeof fn === "boolean") {
          this._isScoped = fn;
          return;
        }
        this._isScoped = true;
        var result = fn.call(this); // 执行传入的函数
        this._isScoped = false;
        return result;
      }

      // 触发事件
    }, {
      key: "emit",
      value: function emit(broadcast, event) {
        var _this5 = this;
        for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          args[_key - 2] = arguments[_key];
        }
        // 如果当前处于静默模式，则直接返回
        if (this._isSilent) return;

        // 如果 broadcast 不是布尔值，重置 event 和 broadcast
        if (typeof broadcast !== "boolean") {
          args.unshift(event);
          event = broadcast;
          broadcast = false;
        }

        // 如果当前事件在静默模式中，则直接返回
        if (Array.isArray(this._isSilent) && this._isSilent.includes(event)) return;

        // 获取匹配的事件监听器
        var events = this._listeners.filter(function (item) {
          return item.event === event;
        });
        var isSecret = this._isScoped;

        // 获取相关的事件监听器
        var parents = isSecret ? [] : this._listeners.filter(function (item) {
          return event.startsWith(item.event + ".");
        });
        var children = broadcast && !isSecret ? this._listeners.filter(function (item) {
          return item.event.startsWith(event + ".");
        }) : [];
        var roots = isSecret ? [] : this._listeners.filter(function (item) {
          return item.event === "*";
        });

        // 标志位
        var isPreventDefault = false;
        var isStopPropagation = false;
        var isStopImmediatePropagation = false;

        // 辅助函数
        var preventDefault = function preventDefault() {
          isPreventDefault = true;
        };
        var stopPropagation = function stopPropagation() {
          isStopPropagation = true;
        };
        var stopImmediatePropagation = function stopImmediatePropagation() {
          isStopImmediatePropagation = true;
        };

        // 处理回调函数
        var callback = function callback(item) {
          var e = {
            target: event,
            event: item.event,
            priority: item.priority,
            callback: item.callback,
            broadcast: broadcast,
            preventDefault: preventDefault,
            stopPropagation: stopPropagation,
            stopImmediatePropagation: stopImmediatePropagation,
            stack: makeCodeStack() // 创建错误堆栈
          };
          if (item.once) {
            _this5.off(item.event, item.callback); // 移除一次性事件监听器
          }
          item.callback.apply(item, [e].concat(args));
        };

        // 触发事件
        var _iterator = _createForOfIteratorHelper(events),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var _item = _step.value;
            if (isPreventDefault || isStopImmediatePropagation) break;
            callback(_item);
          }

          // 传播事件
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        for (var _i = 0, _arr = [].concat(_toConsumableArray(children), _toConsumableArray(parents)); _i < _arr.length; _i++) {
          var item = _arr[_i];
          if (isStopPropagation || isStopImmediatePropagation) break;
          callback(item);
        }

        // 触及根事件
        var _iterator2 = _createForOfIteratorHelper(roots),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var _item2 = _step2.value;
            if (isStopImmediatePropagation) break;
            callback(_item2);
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }

      // 按顺序触发事件
    }, {
      key: "dispatch",
      value: function dispatch(broadcast, event) {
        var _this6 = this;
        for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
          args[_key2 - 2] = arguments[_key2];
        }
        return new Promise(function (resolve, reject) {
          // 检查静默模式
          if (_this6._isSilent || Array.isArray(_this6._isSilent) && _this6._isSilent.includes(event)) {
            return resolve();
          }

          // 处理广播标志和事件
          if (typeof broadcast !== "boolean") {
            var _ref = [broadcast, false];
            event = _ref[0];
            broadcast = _ref[1];
          }

          // 获取所有相关事件监听器
          var events = _this6._listeners.filter(function (item) {
            return item.event === event;
          });
          var isSecret = _this6._isScoped;
          var parents = isSecret ? [] : _this6._listeners.filter(function (item) {
            return event.startsWith(item.event + ".");
          });
          var children = broadcast && !isSecret ? _this6._listeners.filter(function (item) {
            return item.event.startsWith(event + ".");
          }) : [];
          var roots = isSecret ? [] : _this6._listeners.filter(function (item) {
            return item.event === "*";
          });
          var isPreventDefault = false;
          var isStopImmediatePropagation = false;
          var preventDefault = function preventDefault() {
            isPreventDefault = true;
          };
          var stopPropagation = function stopPropagation() {
          };
          var stopImmediatePropagation = function stopImmediatePropagation() {
            isStopImmediatePropagation = true;
          };

          // 执行事件回调
          var executeCallback = function executeCallback(item) {
            var e = {
              target: event,
              event: item.event,
              priority: item.priority,
              callback: item.callback,
              broadcast: broadcast,
              preventDefault: preventDefault,
              stopPropagation: stopPropagation,
              stopImmediatePropagation: stopImmediatePropagation,
              stack: makeCodeStack() // 创建错误堆栈
            };
            var fn = toAsync(item.callback); // 转换为异步函数

            if (item.once) {
              _this6.off(item.event, item.callback); // 移除一次性事件监听器
            }
            return fn.apply(void 0, [e].concat(args));
          };

          // 触发事件的通用函数
          var processEvents = function processEvents(items) {
            var index = 0;
            var _processNext = function processNext() {
              if (isPreventDefault || isStopImmediatePropagation || index === items.length) {
                return Promise.resolve();
              }
              var item = items[index++];
              return executeCallback(item).then(_processNext)["catch"](reject);
            };
            return _processNext();
          };

          // 触发事件的执行流程
          processEvents(events).then(function () {
            return processEvents([].concat(_toConsumableArray(children), _toConsumableArray(parents)));
          }).then(function () {
            return processEvents(roots);
          }).then(resolve)["catch"](reject);
        });
      }

      // 并行触发事件
    }, {
      key: "distribute",
      value: function distribute(broadcast, event) {
        var _this7 = this;
        for (var _len3 = arguments.length, args = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
          args[_key3 - 2] = arguments[_key3];
        }
        return new Promise(function (resolve, reject) {
          // 判断是否处于静默模式
          if (_this7._isSilent || Array.isArray(_this7._isSilent) && _this7._isSilent.includes(event)) {
            return resolve();
          }

          // 处理广播标志和事件
          if (typeof broadcast !== "boolean") {
            var _ref2 = [broadcast, false];
            event = _ref2[0];
            broadcast = _ref2[1];
          }

          // 获取所有相关事件监听器
          var events = _this7._listeners.filter(function (item) {
            return item.event === event;
          });
          var isSecret = _this7._isScoped;
          var parents = isSecret ? [] : _this7._listeners.filter(function (item) {
            return event.startsWith(item.event + ".");
          });
          var children = broadcast && !isSecret ? _this7._listeners.filter(function (item) {
            return item.event.startsWith(event + ".");
          }) : [];
          var roots = isSecret ? [] : _this7._listeners.filter(function (item) {
            return item.event === "*";
          });
          var isPreventDefault = false;
          var isStopImmediatePropagation = false;
          var preventDefault = function preventDefault() {
            isPreventDefault = true;
          };
          var stopPropagation = function stopPropagation() {
          };
          var stopImmediatePropagation = function stopImmediatePropagation() {
            isStopImmediatePropagation = true;
          };

          // 执行事件回调
          var executeCallback = function executeCallback(item) {
            var e = {
              target: event,
              event: item.event,
              priority: item.priority,
              callback: item.callback,
              broadcast: broadcast,
              preventDefault: preventDefault,
              stopPropagation: stopPropagation,
              stopImmediatePropagation: stopImmediatePropagation,
              stack: makeCodeStack() // 创建错误堆栈
            };
            if (item.once) {
              _this7.off(item.event, item.callback); // 移除一次性事件监听器
            }
            return toAsync(item.callback).apply(void 0, [e].concat(args));
          };

          // 并行触发事件
          var trigger = function trigger(items) {
            return Promise.all(items.map(function (item) {
              if (isPreventDefault || isStopImmediatePropagation) return Promise.resolve();
              return executeCallback(item);
            }));
          };

          // 触发事件顺序：事件本身 -> 传播 -> 根事件
          trigger(events).then(function () {
            return trigger(parents.concat(children));
          }).then(function () {
            return trigger(roots);
          }).then(resolve)["catch"](reject);
        });
      }

      // 销毁所有事件监听器
    }, {
      key: "destroy",
      value: function destroy() {
        // 从全局命名空间中移除所有事件
        // 开发人员必须在使用命名空间时执行此操作
        // 否则将面临内存堆栈溢出
        this._listeners.length = 0;
      }
    }]);
  }(); // 导出EMCenter类

  // 创建错误堆栈
  function makeCodeStack() {
    var e = new Error();
    var stack = e.stack || e.stacktrace;
    var stacks = stack.split("\n").slice(2).join("\n");
    return stacks;
  }

  // 将函数转换为异步
  function toAsync(fn) {
    return function () {
      try {
        return Promise.resolve(fn.apply(void 0, arguments));
      } catch (e) {
        return Promise.reject(e);
      }
    };
  }

  // 按优先级排序
  function sort(items) {
    items.sort(function (a, b) {
      if (a.priority > b.priority) {
        return -1;
      } else if (a.priority < b.priority) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  return EMCenter;

}));
