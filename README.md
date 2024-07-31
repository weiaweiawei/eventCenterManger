EMCenter 使用介绍

install

```shell
npm install EMCenter
```

Import
ES6:

```js
import EMCenter from "emcenter";
```

CommonJS：

```js
const EMCenter = require("emcenter");
```
clear
Usage

```js
const emcenter = new EMCenter();

// 监听
emcenter.on("my_event", (e, ...args) => {});
// 广播事件
emcenter.emit("my_event", arg1, arg2);
```

好的，以下是将注释翻译成中文的代码文档：

---

## API

### on(event, callback, priority?)

- event: string，事件名称
- callback: function，事件处理函数
- priority: number，优先级，数值越大越早执行，默认为 10

```js
EMCenter.on('some_event', (e, name, age) => {
  if (name === 'dota') {
    e.stop()
  }
}, 13)

EMCenter.emit('some_event', name, age)
```

回调函数参数：

- e: 一个包含当前事件信息的对象
  - target: 通过 `emit` 传递的事件名称
  - event: 通过 `on` 注册的事件名称
  - callback: 事件处理函数
  - priority: 事件优先级
  - broadcast: 是否为广播事件
  - preventDefault: 函数，调用后当前事件的剩余回调将不会执行
  - stopPropagation: 函数，调用后子事件和父事件的回调将不会执行，但根事件的回调会执行
  - stopImmediatePropagation: 函数，调用后 `preventDefault` 和 `stopPropagation` 的效果都生效，同时根事件的回调也不会执行
  - stack: 错误堆栈，可以用于调试
- ...args: 通过 `emit` 传递的参数

**事件名称规则**

使用 `.` 连接深层路径。

```js
EMCenter.on('parent.child', fn)

EMCenter.emit('parent', data) // fn 不会被触发
EMCenter.emit('parent.child.subchild', data) // fn 会被触发
```

使用 `*` 表示根绑定。所有的 `emit` 调用都会触发 `*` 的回调，除非在某个回调内调用了 `stopImmediatePropagation`。

```js
EMCenter.on('*', fn)
```

### off(event, callback?)

如果不传递回调函数，将会移除该事件的所有回调。

注意：当不再需要事件回调时，必须调用 `off` 来移除它们！！！

### once(event, callback, priority?)

与 `on` 相同，但回调函数只会执行一次，执行后会自动移除。

### contain(event, callback?)

检查事件和回调是否已注册到 EMCenter 实例中。

```js
if (EMCenter.contain('parent', callback)) {
  // ...
}
```

### emit(broadcast?, event, ...args)

触发该事件的回调函数并传递参数。
将会传播到父事件和根事件。

`args` 会被 `on` 回调函数接收。

- broadcast: 是否广播到子事件？默认为 false
- event: 事件名称

```js
EMCenter.on('*', (e, ...args) => {
  console.log(0)
})
EMCenter.on('parent', (e, ...args) => {
  console.log(1)
})
EMCenter.on('parent.child', (e, ...args) => {
  console.log(2)
})
EMCenter.on('parent.child.sub', (e, ...args) => {
  console.log(3)
})

EMCenter.emit('parent.child', ...args) // 2 1 0
EMCenter.emit(true, 'parent.child', ...args) // 2 3 1 0 // 广播到子事件后再传播到父事件
```

### dispatch(broadcast?, event, ...args)

类似于 `emit`，但使用 *异步* 回调函数并返回一个 Promise：

```js
EMCenter.on('evt', async function f1() {})
EMCenter.on('evt', async function f2() {})
EMCenter.on('evt', async function f3() {})

await EMCenter.dispatch('evt').then(() => { // f1, f2, f3 会按顺序（串行）执行
  // ...
})
```

对于这段代码，f2 会在 f1 解析后运行，f3 会在 f2 解析后运行。如果 f1 失败，f2 和 f3 将不会运行。

注意：回调函数可以是异步函数，也可以不是。

### distribute(broadcast?, event, ...args)

类似于 `dispatch`，但在每个层级中并行执行。

```js
EMCenter.on('evt', async function f1() {})
EMCenter.on('evt', async function f2() {})
EMCenter.on('evt', async function f3() {})

await EMCenter.distribute('evt').then(() => { // f1, f2, f3 会在同一层级中并行执行
  // ...
})
```

每个层级（当前层级、传播层级、根层级）的回调将并行执行。
只有在所有回调都解析后，then 中的回调才会执行。
如果其中一个回调失败，不会影响其他回调，但整个过程会最终失败。

注意：回调函数可以是异步函数，也可以不是。

### silent(func|bool|array)

禁用在 `fn` 中触发回调。

```js
EMCenter.silent(() => {
  EMCenter.emit('some') // 不会触发任何回调
})
```

也可以传递布尔值来切换静默模式。

```js
EMCenter.silent(true)
EMCenter.emit('some')
EMCenter.silent(false)
```

或者传递一个包含事件名称的数组来禁用这些事件。

```js
EMCenter.silent(['some', 'one'])
EMCenter.emit('some')
EMCenter.emit('one')
EMCenter.silent(false)
```

传递的数组中的事件名称应与 emit 的事件名称匹配。

### scope(func|bool)

只在 `fn` 内触发自身的回调，永远不传播。

```js
EMCenter.scope(() => {
  EMCenter.emit('parent.child') // 父事件和根事件不会被触发
})
```

### destroy()

销毁实例。