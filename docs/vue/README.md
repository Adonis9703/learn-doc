---
title: Vue 相关
---

# Vue 相关

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
注意：修改的是**属性**而非内容（例如sex）

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
