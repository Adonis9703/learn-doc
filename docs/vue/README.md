---
title: Vue 相关
---

# Vue 相关

## 虚拟DOM

虚拟DOM就是用JS去按照DOM结构来实现树形结构的对象，也可以叫做DOM对象。

#### 创建虚拟DOM

```javascript
/**
 * @description 虚拟DOM元素的类，构建实例对象，用来描述DOM
 */
class Element {
  constructor(type, props, children) {
    this.type = type
    this.props = props
    this.children = children
  }
}
/**
 * 创建虚拟DOM， 返回虚拟节点
 * @param type 指定元素的标签类型，如li,div,a等
 * @param props 表示指定元素身上的属性，如class,style,自定义属性等
 * @param children 表示指定元素是否由子节点，参数以数组形式传入
 * @returns {Element}
 */
function createElement(type, props, children) {
  return new Element(type, props, children)
}
```
类和方法都定义好了，创建一个虚拟DOM试试。
```javascript
let virtualDom = createElement('ul', {class: 'list'}, [
  createElement('li', {class: 'item'}, ['狗狗']),
  createElement('li', {class: 'item'}, ['猫猫']),
  createElement('li', {class: 'item'}, ['猪猪']),
])
console.log(virtualDom)
```
输出如下

![avater](/vdom-2.png)

创建虚拟DOM后，就要进行下一步，将其渲染成真实的DOM

#### 渲染虚拟DOM

先定义几个关键的方法

```javascript
/**
 * render方法将虚拟DOM转化为真实DOM
 * @param domObj
 * @returns {any}
 */
function render(domObj) {
  //根据type类型来创建对应的元素
  let el = document.createElement(domObj.type)

  //遍历props属性对象，然后给创建的元素el设置属性
  for (const propsKey in domObj.props) {
    setAttr(el, propsKey, domObj.props[propsKey])
  }

  //遍历子节点
  //如果是虚拟DOM，就递归渲染
  //如果不是，就直接创建
  domObj.children.forEach(child => {
    child = (child instanceof Element) ? render(child) : document.createTextNode(child)
    //添加到对应元素内
    el.appendChild(child)
  })
  return el
}

/**
 * 设置节点属性
 * @param node
 * @param key
 * @param value
 */
function setAttr(node, key, value) {
  switch (key) {
    case 'value':
      //node是一个input或者textarea就直接设置其value即可
      if (node.tagName.toLowerCase() === 'input' 
        || node.tagName.toLowerCase() === 'textarea') {
        node.value = value
      } else {
        node.setAttribute(key, value)
      }
      break
    case 'style':
      //直接赋值行内样式
      node.style.cssText = value
      break
    default:
      node.setAttribute(key, value)
      break
  }
}

//将元素插入到页面内
function renderDom(el, target) {
  target.appendChild(el)
}
```
在这里我们需要一个节点作为测试，并把代码整合到一起
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>手写虚拟DOM</title>
</head>
<body>
    <div id="root"></div>
</body>
<script>
    class Element {
      constructor(type, props, children) {
        this.type = type
        this.props = props
        this.children = children
      }
    }
    
    function createElement(type, props, children) {
      return new Element(type, props, children)
    }
    
    function render(domObj) {
      let el = document.createElement(domObj.type)
      for (const propsKey in domObj.props) {
        setAttr(el, propsKey, domObj.props[propsKey])
      }
      domObj.children.forEach(child => {
        child = (child instanceof Element) ? render(child) : document.createTextNode(child)
        el.appendChild(child)
      })
      return el
    }
    
    function setAttr(node, key, value) {
      switch (key) {
        case 'value':
          if (node.tagName.toLowerCase() === 'input' 
               || node.tagName.toLowerCase() === 'textarea') {
            node.value = value
          } else {
            node.setAttribute(key, value)
          }
          break
        case 'style':
          node.style.cssText = value
          break
        default:
          node.setAttribute(key, value)
          break
      }
    }
    
    function renderDom(el, target) {
      target.appendChild(el)
    }
    
    let virtualDom = createElement('ul', {class: 'list'}, [
      createElement('li', {class: 'item'}, ['狗狗']),
      createElement('li', {class: 'item'}, ['猫猫']),
      createElement('li', {class: 'item'}, ['猪猪']),
    ])
    
    let el = render(virtualDom) //渲染虚拟DOM得到真实的DOM结构
    
    renderDom(el, document.getElementById('root'))

</script>
</html>
```
页面渲染后的结果如下

![avater](/vdom-1.png)

## diff & patch

### diff

diff算法的意义：给定任意两棵树，采用**先序深度优先遍历**的算法找到最少的转换步骤。

Dom-diff比较两个虚拟DOM的区别，就是比较两个对象之间的区别。

```javascript
function diff(oldTree, newTree) {
  //声明变量patches用来存放补丁的对象
  let patches = {}
  //第一次比较应该是树的第0个索引
  let index = 0
  //递归树 比较过的结果放到补丁里
  walk(oldTree, newTree, index, patches)
  return patches
}

function walk(oldNode, newNode, index, patches) {
  //每一个元素都有一个补丁
  let current = []
  if (!newNode) { //新的DOM节点不存在
    current.push({type: 'REMOVE', index})
  } else if (isString(oldNode) && isString(newNode)) {
    //判断文本是否一致
    if (oldNode !== newNode) {
      current.push({type: 'TEXT', text: newNode})
    }
  } else if (oldNode.type === newNode.type) {
    //比较属性是否有更改
    let attr = diffAttr(oldNode.props, newNode.props)
    if (Object.keys(attr).length > 0) {
      current.push({type: 'ATTR', attr})
    }
    //如果有子节点，遍历子节点
    diffChildren(oldNode.children, newNode.children, patches)
  } else { //说明节点背替换了
    current.push({type: 'REPLACE', newNode})
  }
  
  //当前元素确实有补丁存在
  if (current.length) {
    //将元素和补丁对应起来，放到大补丁包中
    patches[index] = current
  }
}

function isString(obj) {
  return typeof obj === 'string'
}

function diffAttr(oldAttrs, newAttrs) {
  let patch = {}
  //判断新老属性的关系
  for (let key in oldAttrs) {
    if (oldAttrs[key] !== newAttrs[key]) {
      patch[key] = newAttrs[key] //有可能还是undefined
    }
  }
  for (let key in newAttrs) {
    if (!oldAttrs.hasOwnProperty(key)) {
      patch[key] = newAttrs[key]
    }
  }
  return patch
}

//所有都基于一个序号来实现
let num = 0

function diffChildren(oldChildren, newChildren, patches) {
  // 比较老的第一个和新的第一个
  oldChildren.forEach((child, index) => {
    walk(child, newChildren[index], ++num, patches)
  })
}
```

以上是一个简单的diff算法实现，让我们仔细看看有哪些规则

#### 比较规则

- 新的DOM节点不存在 `{type: 'REMOVE', index}`
- 文本变化 `{type: 'TEXT', text: 1}`
- 当节点类型相同时，去看一下属性是否相同，产生一个属性的补丁包 `{type: 'ATTR', attr: {class: 'list-group'}}`
- 节点类型不相同，直接采用替换模式 `{type: 'REPLACE', newNode}`

根据规则，来看看`walk`方法都做了什么

1. 每个元素都有一个补丁，所以需要创建一个存放当前补丁的数组
2. 如果没有新节点的话，就直接将REMOVE类型的补丁放入数组
```javascript
 if(!newNode) {
    current.push({type: 'REMOVE', index})
 }
```
3. 如果新老节点是文本的话，判断一下文本是否一致，再指定类型TEXT并把新节点放到当前补丁中

```javascript
 else if (isString(oldNode) && isString(newNode)) {
  if(oldNode !== newNode) {
    current.push({type: 'TEXT', text: newNode})
  }
 }
```
4. 如果新老节点的类型相同，那么就来比较他们的属性props
    - 属性比较
        - `diffAttr`
            - 比较新老Attr是否相同
            - 把newAttr的键值对赋给patch对象并返回此对象
    - 如果有子节点的话就再比较一下子节点的不同，再调一次walk（递归）
        - `diffChildren`
            - 遍历oldChildren，然后递归调用walk再通过child和`newChildren[index]`去diff        
            
```javascript
else if(oldNode.type === newNode.type) {
  //比较属性是否有更改
      let attr = diffAttr(oldNode.props, newNode.props)
      if (Object.keys(attr).length > 0) {
        current.push({type: 'ATTR', attr})
      }
      //如果有子节点，遍历子节点
      diffChildren(oldNode.children, newNode.children, patches)
}

let num = 0

function diffChildren(oldChildren, newChildren, patches) {
  // 比较老的第一个和新的第一个
  oldChildren.forEach((child, index) => {
    walk(child, newChildren[index], ++num, patches)
  })
}
```
5. 如果上述条件都没有发生，就代表节点单纯的被替换了，type为REPLACE，直接使用newNode替换即可
```javascript
else {
  current.push({type: 'REPLACE', newNode })
}
```
6. 如果当前补丁里有值，就将对应的补丁放进大补丁包中
```javascript
if (current.length > 0) {
  patches[index] = current
} 
```

diff之后，就需要打补丁了

### patch 补丁更新

打补丁需要传入两个参数，一个是要打补丁的元素，另一个是要打的补丁

```javascript
let allPatches
let index = 0 //默认哪个需要打补丁

function patch(node, patches) {
  allPatches = patches
  patchWalk(node)
}

function patchWalk(node) {
  let current = allPatches[index++]
  let childNodes = node.childNodes
  
  //先序深度，继续遍历递归子节点
  childNodes.forEach(child => patchWalk(child))
  
  if (current) {
    doPatch(node, current) //打补丁
  }
}

function doPatch(node, patches) {
  //遍历所有打过的补丁
  patches.forEach(patch => {
    switch (patch.type) {
      case 'ATTR':
        for (const key in patch.attr) {
          let val = patch.attr[key]
          if (val) {
            setAttr(node, key, val)
          } else {
            node.removeAttribute(key)
          }
        }
        break;
      case 'TEXT':
        node.textContent = patch.text
        break
      case 'REPLACE':
        let newNode = patch.newNode
        newNode = (newNode instanceof Element) ? render(newNode) : document.createTextNode(newNode)
        node.parentNode.replaceChild(newNode, node)
        break
      case 'REMOVE':
        node.parentNode.removeChild(node)
        break
      default:
        break
    }
  })
}
```
#### patch做了什么

- 用一个变量来得到传递过来的所有补丁allPatches
- `patch`方法接受两个参数node和patches
    - 在方法内部调用`patchWalk`反复来给某个节点打补丁
- `patchWalk`方法里获取所有的子节点
    - 给子节点也进行先序深度优先遍历，递归`patchWalk`
    - 如果当前的补丁是存在的，那么就对其打补丁（`doPatch`）
- `doPatch`打补丁方法会根据传递的patches进行遍历
    - 判断补丁的类型来进行不同的操作
       1. 属性ATTR：通过玄幻去遍历attrs对象，如果当前key值存在，就直接设置属性setAttr；
       如果不存在对应的key值那就直接删除这个key键的属性
       2. 文字TEXT：直接将补丁的text赋值给node节点的`textContent`即可
       3. 替换REPLACE： 新节点替换老节点，首先需要判断新节点是不是Element的实例，
       是的话就调用`render`方法渲染新节点；不是的话就表明新节点是文本节点，直接创建一个文本节点就可以了。
       之后再调用父级`parentNode`的`replaceChild`方法替换为新的节点
       4. 删除REMOVE：直接调用父级的removeChild方法删除改节点
       5. todo 新增  
       
### 回归

创建一个新的节点并测试diff和patch是否生效

```javascript
let virtualDom2 = createElement('ul', {class: 'list'}, [
  createElement('li', {class: 'item active'},  ['狗狗']),
  createElement('li', {class: 'item'}, ['英镑']),
  createElement('li', {class: 'item'}, [createElement('h1', {class: 'item'}, ['新猪猪'])]),
])

let patches = diff(virtualDom, virtualDom2)

console.log('patch',patches)

patch(el, patches)
```

结果如下

![avater](/vdom-3.png)

## key的作用

虚拟DOM中key的作用：

1. key是虚拟DOM对象的标识，当数据发生变化时，Vue会根据【新数据】生成新的【虚拟DOM】
2. 随后Vue进行对新旧虚拟DOM进行差异比较（diff算法），比较规则如下：
    - 在旧虚拟DOM找到了与新虚拟DOM相同的key
        - 若虚拟DOM中的内容没变，则直接复用之前的真实DOM
        - 若虚拟DOM中的内容变了，则生成新的真实DOM，随后替换掉页面中之前的真实DOM
    - 旧虚拟DOM中未找到与新虚拟DOM相同的key
        - 创建新的真实DOM，随后渲染到页面
3. 用index作为key可能会引发的问题：
    - 若对数据进行：逆序添加、逆序删除等破坏顺序的操作，会产生额米有必要的真实DOM更新
    - 有可能会引发错误DOM更新    
4. 开发时可以使用数据的唯一标识作为key

## vue-router原理

更新视图但不重新请求页面是前端路由原理的核心之一，目前在浏览器环境中这一功能的实现主要有两种方式：

1. 利用URL中的hash('#')
2. 利用History interface 在Html5中新增的方法:

#### hash

hash 是URL中'#'符号及其后面的部分，常用作锚点在页面内进行导航，改变URL中的hash不会引起页面刷新。

通过hashchange事件监听URL的变化，改变URL的方式只有这几种：
1. 通过浏览器进退改变URL
2. 通过`<a>`标签改变URL
3. 通过`window.location`改变URL

#### history

history提供了`pushState`和`replaceState`两个方法，这两个方法改变URL的path部分不会引起页面刷新

history提供类似hashchange事件的popstate事件，但popstate事件有些不同：

1. 通过浏览器进退改变URL时会触发popstate事件
2. 通过pushState/replaceState或`<a>`标签改变URL不会触发popstate事件
3. 好在我们可以拦截pushState/replaceState的调用和`<a>`标签的点击事件来检测URL变化
4. 通过js调用history的back、go、forward方法可以触发该事件

### 基于hash实现

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>手写前端路由</title>
</head>
<body>
<div>
    <ul>
        <li>
            <a href="#/home">home</a>
        </li>
        <li>
            <a href="#/about">about</a>
        </li>
        <div id="routeView"></div>
    </ul>
</div>
</body>
<script>
  const routerView = document.getElementById('routeView')
  window.addEventListener('hashchange', () => {
    routerView.innerHTML = location.hash
  })
  window.addEventListener('load', () => {
    if (!location.hash) {
      location.hash = '/' //如果不存在hash值，则重定向到 #/
    } else {
       //如果存在hash值，那就渲染对应的UI
      routerView.innerHTML = location.hash
    }
  })
</script>
</html>
```
1. 通过`<a>`标签的href属性来改变URL的hash值（通过浏览器的进退或者window.location赋值也能改变）
2. 通过监听`hashchange`事件，一旦事件触发，就改变routerView的内容，若是在Vue中，这改变就是`<router-view/>`组件的内容
3. 因为页面第一次加载不会触发hashchange，所以通过监听load事件来监听hash值，再将试图渲染成对应的内容

### 基于history实现

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>手写前端路由</title>
</head>
<body>
<div>
    <ul>
        <li>
            <a href="#/home">home</a>
        </li>
        <li>
            <a href="#/about">about</a>
        </li>
        <div id="routeView"></div>
    </ul>
</div>
</body>
<script>
  const routerView = document.getElementById('routeView')

  function onLoad() {
    routerView.innerHTML = location.pathname
    let linkList = document.querySelectorAll('a[href]')
    linkList.forEach(el => el.addEventListener('click', e => {
      e.preventDefault() //取消事件的默认动作 触发了点击但是不执行默认的点击事件
      history.pushState(null, '', el.getAttribute('href'))
      routerView.innerHTML = location.pathname
    }))
  }

  window.addEventListener('load', onLoad)
  window.addEventListener("popstate", () => {
    routerView.innerHTML = location.pathname
  })
</script>
</html>
```
1. 同样的，可以通过`<a>`标签的属性来改变URL的path值（或者浏览器的进退，`history.go`、`history.back`、`history.forward`来触发popState事件）。
这里需要注意到是，当改变path值时，默认会触发页面的跳转，所以需要拦截标签点击事件的默认行为，点击时使用pushState修改URL并手动更新UI从而实现点击链接
更新URL和UI的效果

2. 通过监听popState事件，来改变routerView内容

3. load事件同上

问题：hash模式，也可以用history.go,back,forward来触发hashchange事件吗？

A：也是可以的。因为不管什么模式，浏览器为保存记录都会有一个栈。
[参考](https://juejin.cn/post/6854573222231605256#heading-7)

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

#### Proxy

> `Proxy`对象用于定义基本操作的自定义行为（如属性查找、赋值、枚举、函数调用等）。

通过代理的方式，不操作对象本身，反而通过操作**代理对象**来间接操作对象。

```javascript
let obj = { a: 1 }
let proxyObj = new Proxy(obj, {
   //读取
   get (target, prop) {
     // return prop in target ? target[prop] : 0 //注释1
     return Reflect.get(target, prop)
   },
   //修改或新增
   set (target, prop, newVal) {
     // target[prop] = newVal
     return Reflect.set(target, prop, newVal)//需要return 一个Boolean 设置成功为true 设置失败为false
   },
   //删除
   deleteProperty(target, prop) {
     // return delete target[prop]
     return Reflect.deleteProperty(target, prop)
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
