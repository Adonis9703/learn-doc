---
title: Vue 相关
---

# Vue 相关

## vue-router原理
https://zhuanlan.zhihu.com/p/27588422
更新视图但不重新请求页面是前端路由原理的核心之一，目前在浏览器环境中这一功能的实现主要有两种方式：

1. 利用URL中的hash('#')
2. 利用History interface 在Html5中新增的方法

在vue-router 中是通过`mode`参数控制路由的实现方式：

```javascript
const router = new VueRouter({
  mode: 'hash',
  routes: [...]
})
```
创建VueRouter的实例对象时，mode以构造函数参数的形式传入。带着问题阅读源码，我们就可以从VueRouter类的定义入手。一般插件对外暴露的类都是定义在源码src根目录下的index.js文件中，打开该文件，可以看到VueRouter类的定义，摘录与mode参数有关的部分如下：
```javascript
export default class VueRouter {
  
  mode: string; // 传入的字符串参数，指示history类别
  history: HashHistory | HTML5History | AbstractHistory; // 实际起作用的对象属性，必须是以上三个类的枚举
  fallback: boolean; // 如浏览器不支持，'history'模式需回滚为'hash'模式
  
  constructor (options: RouterOptions = {}) {
    
    let mode = options.mode || 'hash' // 默认为'hash'模式
    this.fallback = mode === 'history' && !supportsPushState // 通过supportsPushState判断浏览器是否支持'history'模式
    if (this.fallback) {
      mode = 'hash'
    }
    if (!inBrowser) {
      mode = 'abstract' // 不在浏览器环境下运行需强制为'abstract'模式
    }
    this.mode = mode

    // 根据mode确定history实际的类并实例化
    switch (mode) {
      case 'history':
        this.history = new HTML5History(this, options.base)
        break
      case 'hash':
        this.history = new HashHistory(this, options.base, this.fallback)
        break
      case 'abstract':
        this.history = new AbstractHistory(this, options.base)
        break
      default:
        if (process.env.NODE_ENV !== 'production') {
          assert(false, `invalid mode: ${mode}`)
        }
    }
  }

  init (app: any /* Vue component instance */) {
    
    const history = this.history

    // 根据history的类别执行相应的初始化操作和监听
    if (history instanceof HTML5History) {
      history.transitionTo(history.getCurrentLocation())
    } else if (history instanceof HashHistory) {
      const setupHashListener = () => {
        history.setupListeners()
      }
      history.transitionTo(
        history.getCurrentLocation(),
        setupHashListener,
        setupHashListener
      )
    }

    history.listen(route => {
      this.apps.forEach((app) => {
        app._route = route
      })
    })
  }

  // VueRouter类暴露的以下方法实际是调用具体history对象的方法
  push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
    this.history.push(location, onComplete, onAbort)
  }

  replace (location: RawLocation, onComplete?: Function, onAbort?: Function) {
    this.history.replace(location, onComplete, onAbort)
  }
}
```
可以看出：

1. 作为参数的字符串属性mode只是一个标记，用来指示实际作用的对象属性history的实现类
2. 在初始化对应的history之前，会对mode做一些校验：若浏览器不支持HTML5History方式（通过supportsPushState变量判断），
则mode强制设为'hash'；若不是在浏览器环境下运行，则mode强制设为abstract
3. VueRouter类中的onReady(), push()等方法只是一个代理，实际是调用的具体history对象的对应方法，在init()方法中初始化时，
也是根据history对象具体的类别执行不同操作

### HashHistory

hash('#')符号本来的作用是加载URL中只是网页中的位置：
> http://www.example.com/index.html#print

'#'符号本身以及后面的字符称之为hash，可通过`window.location.hash`属性获取。它具有以下特点：

- hash虽然出现在URL中，但不会被包括在HTTP请求中。它是用来直到浏览器动作的，对服务器端完全无用，因此改变hash不会重新加载页面
- 可以为hash的改变添加监听事件：
```javascript
window.addEventListener('hashchange', handler, false)
```
- 每一次改变hash，都会在浏览器的访问历史中增加一个记录

利用hash的以上特点，就可以实现前端路由“更新视图但是不重新请求页面”的功能了。

#### HashHistory.push()

HashHistory中的push()方法：

```javascript
push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
  this.transitionTo(location, route => {
    pushHash(route.fullPath)
    onComplete && onComplete(route)
  }, onAbort)
}

function pushHash (path) {
  window.location.hash = path
}
```

transitionTo()方法是父类中定义的是用来处理路由变化中的基础逻辑的，push()方法最主要的是对window的hash进行了直接赋值：
```javascript
window.location.hash = route.fullPath
```

hash的改变会自动添加到浏览器的访问历史记录中

那么视图的更新是怎么实现的呢，我们来看父类中History中transitionTo()方法中的一段：

```javascript
transitionTo (location: RawLocation, onComplete?: Function, onAbort?: Function) {
  const route = this.router.match(location, this.current)
  this.confirmTransition(route, () => {
    this.updateRoute(route)
    ...
  })
}

updateRoute (route: Route) {
  
  this.cb && this.cb(route)
  
}

listen (cb: Function) {
  this.cb = cb
}
```

可以看到，当路由变化时，调用了History中的this.cb方法，而this.cb方法时通过History.listen(cb)进行设置的。回到VueRouter类定义中，
找到了`init()`方法中对其进行了设置：
```javascript

```

## 双向绑定原理

vue2.x版本 采用数据劫持结合发布者-订阅者模式的方式，通过Object.defineProperty()来劫持各个属性的setter，getter，在数据变动的时候发布给订阅者

![avatar](/vue2.png)

1. 通过建立虚拟dom树`document.createDocumentFragment()`方法创建虚拟dom树

2. 一旦被监测的数据改变，会通过`Object.defineProperty`定义的数据拦截，截取到数据的变化

3. 截取到的数据变化，通过订阅——发布者模式，触发Watcher（观察者），从而改变虚拟dom中的具体数据

4. 最后，通过更新虚拟dom的元素值，从而改变最后渲染dom树的值，完成双向绑定 

#### 核心实现类

Observer：Observe扮演的角色是发布者，他的主要作用是调用`defineReactive`函数，在`defineReactive`函数中使用`Object.defineProperty`方法对对象的每一个子属性进行数据劫持/监听。

```javascript
function defineReactive(obj, key, val, customSetter, shallow){
    //监听属性key
    //关键点：在闭包中声明一个Dep实例，用于保存watcher实例
    var dep = new Dep();

    var getter = property && property.get;
    var setter = property && property.set;
    
    if(!getter && arguments.length === 2) {
        val = obj[key];
    }
    //执行observe，监听属性key所代表的值val的子属性
    var childOb = observe(val);
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() {
            //获取值
            var value = getter ? getter.call(obj) : val;
            //依赖收集：如果当前有活动的Dep.target(观察者--watcher实例)
            if(Dep.target) {
                //将dep放进当前观察者的deps中，同时，将该观察者放入dep中，等待变更通知
                dep.depend();
                if(childOb) {
                    //为子属性进行依赖收集
                    //其实就是将同一个watcher观察者实例放进了两个dep中
                    //一个是正在本身闭包中的dep，另一个是子属性的dep
                    childOb.dep.depend();
                }
            }
            return value
        },
        set: function reactiveSetter(newVal) {
            //获取value
            var value = getter ? getter.call(obj) : val;
            if(newVal === value || (newVal !== newVal && value !== value)) {
                return
            }
            if(setter) {
                setter.call(obj, newVal);
            } else {
                val = newVal;
            }
            //新的值需要重新进行observe，保证数据响应式
            childOb = observe(newVal);
            //关键点：遍历dep.subs，通知所有的观察者
            dep.notify();
        }
    });
}
```

Dep: Dep 扮演的角色是调度中心/订阅器，主要的作用就是收集观察者Watcher和通知观察者目标更新。每个属性拥有自己的消息订阅器dep，用于存放所有订阅了该属性的观察者对象，当数据发生改变时，会遍历观察者列表（dep.subs），通知所有的watch，让订阅者执行自己的update逻辑。

```javascript
//Dep构造函数
var Dep = function Dep() {
    this.id = uid++;
    this.subs = [];
};
//向dep的观察者列表subs添加观察者
Dep.prototype.addSub = function addSub(sub) {
    this.subs.push(sub);
};
//从dep的观察者列表subs移除观察者
Dep.prototype.removeSub = function removeSub(sub) {
    remove(this.subs, sub);
};
Dep.prototype.depend = function depend() {
    //依赖收集：如果当前有观察者，将该dep放进当前观察者的deps中
    //同时，将当前观察者放入观察者列表subs中
    if(Dep.target) {
        Dep.target.addDep(this);
    }
};
Dep.prototype.notify = function notify() {
    // 循环处理，运行每个观察者的update接口
    var subs = this.subs.slice();
    for(var i = 0, l = subs.length; i < l; i++) {
        subs[i].update();
    }
};

//Dep.target是观察者，这是全局唯一的，因为在任何时候只有一个观察者被处理。
Dep.target = null;
//待处理的观察者队列
var targetStack = [];

function pushTarget(_target) {
    //如果当前有正在处理的观察者，将他压入待处理队列
    if(Dep.target) {
        targetStack.push(Dep.target);
    }
    //将Dep.target指向需要处理的观察者
    Dep.target = _target;
}

function popTarget() {
    //将Dep.target指向栈顶的观察者，并将他移除队列
    Dep.target = targetStack.pop();
}
```

Watcher：Watcher扮演的角色是订阅者/观察者，他的主要作用是为观察属性提供回调函数以及收集依赖（如计算属性computed，vue会把该属性所依赖数据的dep添加到自身的deps中），当被观察的值发生变化时，会接收到来自dep的通知，从而触发回调函数。

Watcher类的实现比较复杂，因为他的实例分为：渲染watcher（render-watcher）、计算属性watcher（computed-watcher）、侦听器watcher（normal-watcher）三种，
这三个实例分别在三个函数中构建：`mountComponent`、`initComputed`和`Vue.prototype.$watch`。

**normal-watcher**：在组件钩子函数watch中定义的都属于这种类型，只要监听的属性改变了，都会触发定义好的回调函数，这类watch的expression是计算属性中的属性名。

**computed-watcher**: 在组建钩子函数computed中定义的都属于这种类型，每一个computed属性最后都会生成一个对应的watcher对象，但是这类watcher有个特点：当计算属性依赖于其他数据是，属性并不会立即重新计算，只有之后其他地方需要读取属性的时候，它才会真正计算，
即具备lazy（懒计算）特性。这类watch的expression是我们写的回调函数的字符串形式。

**render-watcher**：每一个组件都会有一个render-watcher，当computed中的属性改变的时候，会调用该render-watcher来更新组件的视图。
这类watch的expression是`fuction() {vm._update(vm._render(), hydrating)}`。

除了功能上有区别，这三种watcher也有固定的执行顺序，分别是：computed-render -> normal-watcher -> render-watcher。

这样安排的原因是可以尽可能的保证，在更新组件视图的时候，computed属性已经是最新值了。

```javascript
function Watcher(vm, expOrFn, cb, options, isRenderWatcher) {
    this.vm = vm;
    if(isRenderWatcher) {
        vm._watcher = this;
    }
    vm._watchers.push(this);
    // options
    if(options) {
        this.deep = !!options.deep; //是否启用深度监听
        this.user = !!options.user; //主要用于错误处理，侦听器 watcher的 user为true，其他基本为false
        this.lazy = !!options.lazy; //惰性求职，当属于计算属性watcher时为true
        this.sync = !!options.sync; //标记为同步计算，三大类型暂无
    } else {
        this.deep = this.user = this.lazy = this.sync = false;
    }
    //初始化各种属性和option
    
    //观察者的回调
    //除了侦听器 watcher外，其他大多为空函数
    this.cb = cb;
    this.id = ++uid$1; // uid for batching
    this.active = true;
    this.dirty = this.lazy; // for lazy watchers
    this.deps = [];
    this.newDeps = [];
    this.depIds = new _Set();
    this.newDepIds = new _Set();
    this.expression = expOrFn.toString();
    // 解析expOrFn，赋值给this.getter
    // 当是渲染watcher时，expOrFn是updateComponent，即重新渲染执行render（_update）
    // 当是计算watcher时，expOrFn是计算属性的计算方法
    // 当是侦听器watcher时，expOrFn是watch属性的名字，this.cb就是watch的handler属性
    
    //对于渲染watcher和计算watcher来说，expOrFn的值是一个函数，可以直接设置getter
    //对于侦听器watcher来说，expOrFn是watch属性的名字，会使用parsePath函数解析路径，获取组件上该属性的值（运行getter）
    
    //依赖（订阅目标）更新，执行update，会进行取值操作，运行watcher.getter，也就是expOrFn函数
    if(typeof expOrFn === 'function') {
        this.getter = expOrFn;
    } else {
        this.getter = parsePath(expOrFn);
    }
    this.value = this.lazy ? undefined : this.get();
};    
//取值操作
Watcher.prototype.get = function get() {
    //Dep.target设置为该观察者
    pushTarget(this);
    var vm = this.vm;
    //取值
    var value = this.getter.call(vm, vm);
    //移除该观察者
    popTarget();
    return value
};
Watcher.prototype.addDep = function addDep(dep) {
    var id = dep.id;
    if(!this.newDepIds.has(id)) {
        //为观察者的deps添加依赖dep
        this.newDepIds.add(id);
        this.newDeps.push(dep);
        if(!this.depIds.has(id)) {
            //为dep添加该观察者
            dep.addSub(this);
        }
    }
};
//当一个依赖改变的时候，通知它update
Watcher.prototype.update = function update() {
    //三种watcher，只有计算属性 watcher的lazy设置了true，表示启用惰性求值
    if(this.lazy) {
        this.dirty = true;
    } else if(this.sync) {
        //标记为同步计算的直接运行run，三大类型暂无，所以基本会走下面的queueWatcher
        this.run();
    } else {
        //将watcher推入观察者队列中，下一个tick时调用。
        //也就是数据变化不是立即就去更新的，而是异步批量去更新的
        queueWatcher(this);
    }
};

//update执行后，运行回调cb
Watcher.prototype.run = function run() {
    if(this.active) {
        var value = this.get();
        if(
            value !== this.value ||
            isObject(value) ||
            this.deep
        ) {
            var oldValue = this.value;
            this.value = value;
            //运行 cb 函数，这个函数就是之前传入的watch中的handler回调函数
            if(this.user) {
                try {
                    this.cb.call(this.vm, value, oldValue);
                } catch(e) {
                    handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
                }
            } else {
                this.cb.call(this.vm, value, oldValue);
            }
        }
    }
};

//对于计算属性，当取值计算属性时，发现计算属性的watcher的dirty是true
//说明数据不是最新的了，需要重新计算，这里就是重新计算计算属性的值。
Watcher.prototype.evaluate = function evaluate() {
    this.value = this.get();
    this.dirty = false;
};

//收集依赖
Watcher.prototype.depend = function depend() {
    var this$1 = this;

    var i = this.deps.length;
    while(i--) {
        this$1.deps[i].depend();
    }
};
```

#### 总结

Observe是对数据进行监听，Dep是一个订阅器，每一个被监听的数据都有一个Dep实例，Dep实例里面存放了N多个订阅者（观察者）对象watcher。
   
被监听的数据进行取值操作时（getter），如果存在Dep.target（某一个观察者），则说明这个观察者是依赖该数据的（如计算属性中，计算某一属性会用到其他已经被监听的数据，就说该属性依赖于其他属性，会对其他属性进行取值），就会把这个观察者添加到该数据的订阅器subs里面，留待后面数据变更时通知（会先通过观察者id判断订阅器中是否已经存在该观察者），同时该观察者也会把该数据的订阅器dep添加到自身deps中，方便其他地方使用。
   
被监听的数据进行赋值操作时（setter）时，就会触发dep.notify()，循环该数据订阅器中的观察者，进行更新操作。

## 简易双向绑定

核心属性`Object.defineProperty()`

> `Object.defineProperty()`方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回这个对象。
语法：`Object.defineProperty(obj, prop, descriptor)`

```javascript
let Person = {}
let temp = null

Object.defineProperty(Person, 'name', {
  get() {
    console.log('触发get')
    return temp //get 需要return一个值
  },
  set(newVal) {
    console.log('触发set', newVal)
    temp = newVal
  }
})

Person.name = 'ADONIS'
Person.sex = 'M'
console.log(Person)
```
![avater](/img-1.png)
注意：注意name和sex的区别

https://www.cnblogs.com/chris-oil/p/11268659.html

简易双向绑定的实现
```html
<input type="text" id="a">
<span id="b"></span>
<script>
    let obj = {}
    Object.defineProperty(obj, 'hello', {
      set(newVal) {
        document.getElementById('a').value = newVal
        document.getElementById('b').innerHTML = newVal
      }
    })
    
    document.addEventListener('keyup', function(e) {
      obj.hello = e.target.value
    })
</script>
```

## Vue3 中的实现方式

https://www.jianshu.com/p/1fbffbd0a80c
在Vue3中放弃使用了`Object.defineProperty`, 选用了更快的原生`Proxy`

这将会消除在Vue2.x中基于`Object.defineProperty`的实现存在很多的限制：无法监听**属性的添加和删除、数组索引和长度的变更**，并可以支持
`Map`、`Set`、`WeakMap`和`WeakSet`

#### Proxy?

> `Proxy`对象用于定义基本操作的自定义行为（如属性查找、赋值、枚举、函数调用等）。

通过代理的方式，不操作对象本身，反而通过操作**代理对象**来间接操作对象。

```javascript
let obj = { a: 1}
let proxyObj = new Proxy(obj, {
  get: function(target, prop) {
    return prop in target ? target[prop] : 0 //注释1
  },
  set: function(target, prop, newVal) {
    target[prop] = newVal
    return true //需要return 一个Boolean 设置成功为true 设置失败为false
  }
})

console.log(proxyObj.a) //1
console.log(proxyObj.b) //0

proxyObj.a = 666
console.log(proxyObj.a) //666
```
>注释1 `in`关键字 可以判断对象是否是数组/对象的元素/属性
>格式：（value in Array|Object）
>当‘对象’为数组时，‘变量’指的是数组的索引
>当‘对象’为对象时，‘变量’指的是对象的key。
> ```javascript
>let arr = [a, b, 1, 2, 'str']
>console.log('a' in arr) //false
>console.log(4 in arr)   //true
>
>let obj = {a: 'one', b: 'tow', c: 'three'}
>console.log(2 in obj)   //false
>console.log('b' in obj) //true
>```

es6中提供的`Proxy`语法如下：

`let proxy = new Proxy(target, handler)`

参数`target`是用`Proxy`包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至是另一个代理），参数`handler`也是一个对象，
其属性是当执行一个操作时定义代理的行为的函数，也就是自定义的行为。

`handler`可以是空对象`{}`，则表示对代理`proxy`的操作即是对目标对象`target`操作，例如：

```javascript
let obj = {}
let proxyObj = new Proxy(obj, {})

proxyObj.a = 1
proxyObj.fn = function() {
  console.log('it is a function')
}

console.log(proxyObj.a) //1
console.log(obj.a)      //1
console.log(obj.fn())   //it is a function
```

#### 通过Proxy实现简单双向数据绑定

```html
<input id="input" type="text">
<span id="span"></span>

<script>
    const input = document.getElementById('input')
    const span = document.getElementById('span')
    
    //需要代理的对象
    const obj = {
      text: 'hello world'
    } //注释2
    
    const handler = {
      set: function(target, prop, value) {
        if (prop === 'text') {
          console.log('代理拦截 set: ', value)
          target[prop] = value
          span.innerHTML = value
          input.value = value
          console.log('修改后的obj', obj)
          return true
        } else {
          return false
        }
      }
    }
    //建立代理
    const proxyObj = new Proxy(obj, handler)
    input.addEventListener('input', function(e) {
      proxyObj.text = e.target.value
    }, false)
</script>
```
![avater](/img-2.png)

> 注释2 const在声明引用类型变量时（数组或对象），不可变的只是变量绑定的内存地址，而对象的属性可以任意改变

## Reflect & Proxy

上一节介绍了`Proxy`，这里也提一下`Reflect`（反射）

`Reflect`存在的意义：

1. 将`Object`对象的一些内部方法，放到`Reflect`对象上。比如`Object.defineProperty`。也就是说，从Reflect对象上可以拿到语言内部的方法。
> 现阶段这些方法存在于`Object`和`Reflect`对象上，未来将只存在与`Reflect`对象上

2. 修改某些`Object`方法的返回结果，让其变得更合理。比如：`Object.defineProperty(obj, name, desc)`在无法定义属性时，会抛出一个错误，
定义成功时返回修改后的对象。而`Reflect.defineProperty(obj, name, desc)`在定义属性成功时返回`true`，在失败时返回`false`。

```javascript
//old
try {
  Object.defineProperty(target, property, attributes)
  //success
} catch (e) {
  //failure
}
//new
if (Reflect.defineProperty(target, property, attributes)) {
  // success
} else {
  //failure
}
```
3. 让`Object`操作都变成函数行为。某些`Object`操作是命令式的，比如`name in obj`和`delete obj[name]`，而`Reflect.has(obj, name)`
和`Reflect.deleteProperty(obj, name)`让它们变成了函数行为。

```javascript
//old
'assgin' in Object //true
//new
Reflect.has(Object, 'assign') //true
```
4. `Reflect`对象的方法与`Proxy`对象的方法一一对应，只要是`Proxy`对象的方法，就能在`Reflect`对象上找到对应的方法。
这就让`Proxy`对象可以方便地调用对应的`Reflect`方法，完成默认行为，作为修改行文的基础。也就是说，不管`Proxy`怎么修改默认行为，
总可以在`Reflect`上获取默认行为。

```javascript
let obj = {}
let proxyObj = new Proxy(obj, {
  get(target, name) {
    console.log('get', target, name)
    return Reflect.get(target, name)
  },
  has(target, name) {
    console.log('has' + name)
    return Reflect.has(target, name)
  }
}) 
```

## nextTick

Vue在更新DOM时是**异步**执行的。只要侦听到数据变化，Vue会开启一个队列，并缓冲在同一个事件循环中发生的所有数据变更。如果同一个
watcher被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作是非常重要的。
然后，在下一个的事件循环“tick”中，Vue 刷新队列并执行实际 (已去重的) 工作。
Vue 在内部对异步队列尝试使用原生的 Promise.then、MutationObserver 和 setImmediate，如果执行环境不支持，则会采用 setTimeout(fn, 0) 代替。

`nextTick`是Vue中的更新策略，也是性能优化手段。

#### 应用场景
1. 在`created()`钩子函数中进行dom操作时一定要在`nextTick()`的回调函数中。

2. 在数据变化后要执行的某个操作，而这个操作需要使用随数据改变而改变的dom结构的时候，这个操作都应该放进`nextTick()`的回调函数中。


## eventHub

eventHub || eventBus 用于不同组件实例间的数据传递

新增eventHub.js
```javascript
//eventHub.js
import Vue from 'vue'

const eventHub = new Vue()
export default eventHub
```

在A组件中
```javascript
//pageA.vue
import eventHub from '@/eventHub.js'

export default {
  methods: {
    test() {
      eventHub.$emit('test', 'hello')
    }
  }
}
```
在B组件中
```javascript
//pageB.vue
import eventHub from '@/eventHub.js'

export default {
  created() {
    eventHub.$on('test', this.callback)
  },
  methods: {
    callback(value) {
      console.log(value)
    }
  }
}
```

## 组件中的data必须是函数

一个组件的 data 选项必须是一个函数，因此每个实例可以维护一份被返回对象的独立的拷贝

在简单的Vue实例中，因为你app对象不存在复用，不会出现数据污染。

然而在组件中， 使用return包裹后数据中变量只在当前组件中生效，因为组件是可以被复用的，这样不会影响其他组件，所以为了不让多处的组件共享同一个data对象，只能返回函数 ，我们只是调用 了data函数生成的数据副本，避免了数据污染。
```javascript
data() {
  return {
    count: 0
  }
}
```
