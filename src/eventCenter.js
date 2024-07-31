class EMCenter {
  constructor() {
    this._listeners = []; // 事件监听器数组
    this._isSilent = false; // 是否静默
    this._isScoped = false; // 是否作用域限制
  }

  // 订阅事件
  on(event, callback, priority = 10) {
    if (Array.isArray(event)) {
      event.forEach((e) => this.on(e, callback, priority));
      return this;
    }

    this._listeners.push({ event, callback, priority }); // 添加事件监听器
    sort(this._listeners); // 按优先级排序
    return this;
  }

  // 订阅一次性事件
  once(event, callback, priority = 10) {
    if (Array.isArray(event)) {
      event.forEach((e) => this.once(e, callback, priority));
      return this;
    }

    this._listeners.push({ event, callback, priority, once: true }); // 添加一次性事件监听器
    sort(this._listeners); // 按优先级排序
    return this;
  }

  // 取消订阅事件
  off(event, callback) {
    if (Array.isArray(event)) {
      event.forEach((e) => this.off(e, callback));
      return this;
    }

    this._listeners = this._listeners.filter(
      (item) =>
        item.event !== event ||
        (callback !== undefined && item.callback !== callback)
    ); // 从监听器数组中移除
    return this;
  }
  // 检查是否包含指定事件监听器
  contain(event, callback) {
    if (Array.isArray(event)) {
      return event.every((e) => this.contain(e, callback));
    }

    return this._listeners.some(
      (item) =>
        item.event === event &&
        (callback === undefined || item.callback === callback)
    );
  }

  // 设置静默模式
  silent(fn) {
    if (typeof fn === "boolean") {
      this._isSilent = fn;
      return;
    }

    if (Array.isArray(fn)) {
      this._isSilent = fn;
      return;
    }

    this._isSilent = true;
    const result = fn.call(this); // 执行传入的函数
    this._isSilent = false;
    return result;
  }

  // 设置作用域
  scope(fn) {
    if (typeof fn === "boolean") {
      this._isScoped = fn;
      return;
    }

    this._isScoped = true;
    const result = fn.call(this); // 执行传入的函数
    this._isScoped = false;
    return result;
  }

  // 触发事件
  emit(broadcast, event, ...args) {
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
    const events = this._listeners.filter((item) => item.event === event);
    const isSecret = this._isScoped;

    // 获取相关的事件监听器
    const parents = isSecret
      ? []
      : this._listeners.filter((item) => event.startsWith(item.event + "."));
    const children =
      broadcast && !isSecret
        ? this._listeners.filter((item) => item.event.startsWith(event + "."))
        : [];
    const roots = isSecret
      ? []
      : this._listeners.filter((item) => item.event === "*");

    // 标志位
    let isPreventDefault = false;
    let isStopPropagation = false;
    let isStopImmediatePropagation = false;

    // 辅助函数
    const preventDefault = () => {
      isPreventDefault = true;
    };
    const stopPropagation = () => {
      isStopPropagation = true;
    };
    const stopImmediatePropagation = () => {
      isStopImmediatePropagation = true;
    };

    // 处理回调函数
    const callback = (item) => {
      const e = {
        target: event,
        event: item.event,
        priority: item.priority,
        callback: item.callback,
        broadcast,
        preventDefault,
        stopPropagation,
        stopImmediatePropagation,
        stack: makeCodeStack(), // 创建错误堆栈
      };

      if (item.once) {
        this.off(item.event, item.callback); // 移除一次性事件监听器
      }

      item.callback(e, ...args);
    };

    // 触发事件
    for (const item of events) {
      if (isPreventDefault || isStopImmediatePropagation) break;
      callback(item);
    }

    // 传播事件
    for (const item of [...children, ...parents]) {
      if (isStopPropagation || isStopImmediatePropagation) break;
      callback(item);
    }

    // 触及根事件
    for (const item of roots) {
      if (isStopImmediatePropagation) break;
      callback(item);
    }
  }

  // 按顺序触发事件
  dispatch(broadcast, event, ...args) {
    return new Promise((resolve, reject) => {
      // 检查静默模式
      if (
        this._isSilent ||
        (Array.isArray(this._isSilent) && this._isSilent.includes(event))
      ) {
        return resolve();
      }

      // 处理广播标志和事件
      if (typeof broadcast !== "boolean") {
        [event, broadcast] = [broadcast, false];
      }

      // 获取所有相关事件监听器
      const events = this._listeners.filter((item) => item.event === event);
      const isSecret = this._isScoped;
      const parents = isSecret
        ? []
        : this._listeners.filter((item) => event.startsWith(item.event + "."));
      const children =
        broadcast && !isSecret
          ? this._listeners.filter((item) => item.event.startsWith(event + "."))
          : [];
      const roots = isSecret
        ? []
        : this._listeners.filter((item) => item.event === "*");

      let isPreventDefault = false;
      let isStopPropagation = false;
      let isStopImmediatePropagation = false;

      const preventDefault = () => {
        isPreventDefault = true;
      };
      const stopPropagation = () => {
        isStopPropagation = true;
      };
      const stopImmediatePropagation = () => {
        isStopImmediatePropagation = true;
      };

      // 执行事件回调
      const executeCallback = (item) => {
        const e = {
          target: event,
          event: item.event,
          priority: item.priority,
          callback: item.callback,
          broadcast,
          preventDefault,
          stopPropagation,
          stopImmediatePropagation,
          stack: makeCodeStack(), // 创建错误堆栈
        };
        const fn = toAsync(item.callback); // 转换为异步函数

        if (item.once) {
          this.off(item.event, item.callback); // 移除一次性事件监听器
        }

        return fn(e, ...args);
      };

      // 触发事件的通用函数
      const processEvents = (items) => {
        let index = 0;

        const processNext = () => {
          if (
            isPreventDefault ||
            isStopImmediatePropagation ||
            index === items.length
          ) {
            return Promise.resolve();
          }

          const item = items[index++];
          return executeCallback(item).then(processNext).catch(reject);
        };

        return processNext();
      };

      // 触发事件的执行流程
      processEvents(events)
        .then(() => processEvents([...children, ...parents]))
        .then(() => processEvents(roots))
        .then(resolve)
        .catch(reject);
    });
  }

  // 并行触发事件
  distribute(broadcast, event, ...args) {
    return new Promise((resolve, reject) => {
      // 判断是否处于静默模式
      if (
        this._isSilent ||
        (Array.isArray(this._isSilent) && this._isSilent.includes(event))
      ) {
        return resolve();
      }

      // 处理广播标志和事件
      if (typeof broadcast !== "boolean") {
        [event, broadcast] = [broadcast, false];
      }

      // 获取所有相关事件监听器
      const events = this._listeners.filter((item) => item.event === event);
      const isSecret = this._isScoped;
      const parents = isSecret
        ? []
        : this._listeners.filter((item) => event.startsWith(item.event + "."));
      const children =
        broadcast && !isSecret
          ? this._listeners.filter((item) => item.event.startsWith(event + "."))
          : [];
      const roots = isSecret
        ? []
        : this._listeners.filter((item) => item.event === "*");

      let isPreventDefault = false;
      let isStopPropagation = false;
      let isStopImmediatePropagation = false;

      const preventDefault = () => {
        isPreventDefault = true;
      };
      const stopPropagation = () => {
        isStopPropagation = true;
      };
      const stopImmediatePropagation = () => {
        isStopImmediatePropagation = true;
      };

      // 执行事件回调
      const executeCallback = (item) => {
        const e = {
          target: event,
          event: item.event,
          priority: item.priority,
          callback: item.callback,
          broadcast,
          preventDefault,
          stopPropagation,
          stopImmediatePropagation,
          stack: makeCodeStack(), // 创建错误堆栈
        };

        if (item.once) {
          this.off(item.event, item.callback); // 移除一次性事件监听器
        }

        return toAsync(item.callback)(e, ...args);
      };

      // 并行触发事件
      const trigger = (items) =>
        Promise.all(
          items.map((item) => {
            if (isPreventDefault || isStopImmediatePropagation)
              return Promise.resolve();
            return executeCallback(item);
          })
        );

      // 触发事件顺序：事件本身 -> 传播 -> 根事件
      trigger(events)
        .then(() => trigger(parents.concat(children)))
        .then(() => trigger(roots))
        .then(resolve)
        .catch(reject);
    });
  }

  // 销毁所有事件监听器
  destroy() {
    // 从全局命名空间中移除所有事件
    // 开发人员必须在使用命名空间时执行此操作
    // 否则将面临内存堆栈溢出
    this._listeners.length = 0;
  }
}

// 导出EMCenter类
export default EMCenter;

// 创建错误堆栈
export function makeCodeStack() {
  const e = new Error();
  const stack = e.stack || e.stacktrace;
  const stacks = stack.split("\n").slice(2).join("\n");
  return stacks;
}

// 将函数转换为异步
export function toAsync(fn) {
  return (...args) => {
    try {
      return Promise.resolve(fn(...args));
    } catch (e) {
      return Promise.reject(e);
    }
  };
}

// 按优先级排序
export function sort(items) {
  items.sort((a, b) => {
    if (a.priority > b.priority) {
      return -1;
    } else if (a.priority < b.priority) {
      return 1;
    } else {
      return 0;
    }
  });
}
