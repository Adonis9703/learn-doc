---
title: 面试记录
---

# 面经

## 浏览器渲染步骤

大致分为以下几个步骤
1. HTML被HTML解析器解析成DOM Tree, CSS则被CSS解析器解析成CSSOM Tree
2. DOM Tree 和 CSSOM Tree合并形成渲染树 Render Tree
3. 节点信息计算，这个过程被称为Layout 或 Reflow，即根据渲染树计算每个节点的几何信息
4. 渲染绘制（重绘），这个过程被称为(Painting 或者 Repaint)。即根据计算好的信息绘制整个页面。

以上4步简述浏览器的一次渲染过程，理论上，每一次的dom更改或者css几何属性更改，都会引起一次浏览器的重排/重绘过程，而如果是css的非几何属性更改，则只会引起重绘过程。所以说重排一定会引起重绘，而重绘不一定会引起重排。

#### 重绘和回流

当元素的样式发生改变时，浏览器需要触发更新，重新绘制元素。在这个过程中，有两种类型的操作，即重绘和回流。

- 重绘（repaint）：当元素样式的改变不影响布局时，浏览器将使用重绘对元素进行更新，此时由于只需要UI层面的重新像素绘制，因此*损耗较少*
- 回流（reflow）： 当元素的尺寸、结构或触发某些属性时，浏览器会重新渲染页面，称为回流。此时浏览器需要重新计算，计算后重新进行页面布局，
消耗较大。以下行为会触发回流操作：
    - 页面初次渲染
    - 浏览器窗口大小改变
    - 元素尺寸、位置、内容发生变化
    - 元素字体大小变化
    - 添加或删除可见的dom元素
    - 激活CSS伪类（:hover）
    - 查询某些属性或调用某些方法：
        - clientWidth, clientHeight, clientTop, clientLeft
        - offsetWidth, offsetHeight, offsetTop, offsetLeft
        - scrollWidth, scrollHeight, scrollTop, scrollLeft
        - getComputedStyle(), getBoundingClientReact
        - scrollTo()

*回流必定触发重绘，重绘不一定触发回流。重绘开销较小，回流代价较高*

#### 最佳实践

- css
    - 避免使用`table`布局
    - 将动画效果应用到`position`属性为`absolute`或`fixed`的元素上

- javascript
    - 避免频繁操作样式，可以汇总后统一修改
    - 尽量使用`class`进行样式修改
    - 减少`dom`的删减次数，可使用字符串或者`documentFragment`一次性插入

## 浏览器存储

## 浏览器缓存策略

缓存分为强缓存和协商缓存。强缓存不过服务器，协商缓存需要过服务器，协商缓存返回的状态码是304。两类缓存机制可以同时存在，强缓存的优先级高于协商缓存。、
当执行强缓存时，如若缓存命中，则直接使用缓存数据库中的数据，不再进行缓存协商。

### 强缓存

#### Expires 

在HTTP/1.0时期，通过`Expires`来检查，而在HTTP/1.1中，使用的是`Cache-Control`。

`Expires`即过期时间，存在于服务端返回的*响应头*中，告诉浏览器在这个过期时间之前可以直接从缓存中获取数据而无需再次请求。

```
Expires: Wed, 22 Nov 2021 09:21:00 GMT
```
表示如果在上述时间过期后，需要向服务器重新请求资源。

由于使用的是绝对时间，如果服务端和客户端的时间产生偏差，那么会导致命中缓存产生偏差。

#### Cache-Control

在HTTP1.1中，采用了`Cache-Control`字段来控制缓存，其拥有很多属性：

- private：客户端可以缓存
- public：客户端和代理服务器都可以缓存
- max-age=t：缓存将在t秒后失效
- no-cache：需要使用协商缓存来验证缓存数据
- no-store：所有内容都不会缓存

请注意no-cache指令很多人误以为是不缓存，这是不准确的，no-cache的意思是可以缓存，但每次用应该去想服务器验证缓存是否可用。no-store才是不缓存内容。
当在首部字段Cache-Control 有指定 max-age 指令时，比起首部字段 Expires，会优先处理 max-age 指令。命中强缓存的表现形式：Firefox浏览器表现为一个灰色的200状态码。
Chrome浏览器状态码表现为200 (from disk cache)或是200 OK (from memory cache)。

### 协商缓存

协商缓存需要进行对比判断是否可以使用缓存。浏览器第一次请求数据时，服务器会将缓存标识与数据一起响应给客户端，客户端将它们备份至缓存中。
再次请求时，客户端会将缓存中的标识发送给服务器，服务器根据此标识判断。若未失效，返回304状态码，浏览器拿到此状态码就可以直接使用缓存数据了。

*Last-Modified*：服务器在响应请求时，会告诉浏览器资源的最后修改时间。
*if-Modified-Since*：浏览器再次请求服务器的时候，请求头会包含此字段，后面跟着在缓存中获得的最后修改时间。服务端收到此请求头发现有if-Modified-Since，
则与被请求资源的最后修改时间进行对比，如果一致则返回304和响应报文头，浏览器只需要从缓存中获取信息即可。
    - 如果真的被修改，那么开始传输响应一个整体，服务器返回：200 OK
    - 如果没有被修改，那么只需传输响应header，服务器返回：304 Not Modified

## Promise

> Promise 是异步编程的一种解决方案。

`Promise`对象有以下两个特点

1. 对象的状态不受外界影响。`Promise`对象代表一个异步操作，有三种状态：`pending`（进行中），`fulfilled`（已成功），
和`reject`（失败）。只有异步操作的结果，可以决定当前是哪一种状态，其他任何操作都无法改变这个状态。
2. 状态一旦改变，就不会再次改变。`Promise`对象的状态改变只有两种可能：从pending变为fulfilled和从pending变为
rejected，当状态确定后就会一直保持这个结果，此时成为resolved()

```javascript
let promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    if (Math.random() > 0.5) {
      resolve('resolved')
    } else {
      reject('rejected')
    }
  }, 1000)
})

promise.then(res => {
  console.log(res) //resolved
}, err => {
  console.log(err) //rejected
})
```

## 实现一个类

通过构造函数

```javascript
function Animal(name, age, color) {
  this.name = name
  this.age = age
  this.color = color
  //实例方法
  this.checkColor = function () {
    console.log('kind: ' + color)
  }
}
//原型方法
Animal.prototype.printInfo = function() {
  console.log('name:'+ this.name + ' age:' + this.age)
}

let cat = new Animal('Pound', 2, 'white')

cat.printInfo()
cat.checkColor()
```

ES6 语法糖 `class`

```javascript
class Person {
  constructor(name, age) {
    this.name = name
    this.age = age
  }
  printInfo() {
    console.log('name:'+ this.name + ' age:' + this.age)
  }
}

let me = new Person('adonis', 24)
me.printInfo()
```

## 原型和原型链

如何理解原型，先记住并理解下面的几条：

- 所有的引用类型（数组、对象、函数），都具有对象特性，即可自由扩展属性（null除外）
- 所有的引用类型（数组、对象、函数），都有一个`__proto__`属性，属性值是一个普通的对象
- 所有的函数，都有一个`prototype`属性，属性值也是一个普通的对象
- 所有的引用类型（数组、对象、函数），`__proto__`属性值指向它的构造函数的`prototype`属性

```javascript
let obj = {}
obj.a = 100

let arr = []
arr.push(1)
arr.a = 100
arr.b = 200

function func() {}
func.a = 100

console.log(obj, arr, func)
console.log(obj.__proto__) //引用类型的__proto__指向它的构造函数的prototype
console.log(Object.prototype) //Object() 是 obj 的构造函数
console.log(obj.__proto__ === Object.prototype) //true
console.log(arr.__proto__)
console.log(func.__proto__)
console.log(func.prototype) //函数具有 prototype
```
#### 原型
示例如下

```javascript
function Foo(name, age) {
  this.name = name
  this.age = age
}
Foo.prototype.printName = function () {
  console.log(this.name)
}

let obj = new Foo('Adonis', 10)

obj.printAge = function () {
  console.log(this.age)
}

obj.printAge()  //10
console.log(obj) // {name: 'Adonis', age: 10, printAge: f}
obj.printName() // Adonis
```
当试图获得一个对象的某个属性时，如果这个对象本身没有这个属性，那么会去它的`__proto__`(即它的构造函数的`prototype`)
中寻找，因此`obj.printName`就会找到 `Foo.prototype.printName`

那么如何判断某个属性是否是对象本身的属性？可以使用 `hasOwnProperty`，常用于遍历一个对象的时候。
```javascript
for(const item in obj) {
  //某些高级浏览器已经在for in 中屏蔽了来自原型的属性，但这里加上判断可以保证代码的健壮性
  if (obj.hasOwnProperty(item)) {
    console.log(item + ':' + obj[item])
  }
}
```

#### 原型链
接上述的例子
```javascript
console.log(obj.toString()) //[object Object]
```
因为obj本身没有`toString`，并且`obj.__proto__`（`Foo.prototype`）也没有`toString`，因此将继续在`obj.__proto__.__proto__`中寻找。

1. `obj.__proto__ `即`Foo.prototype`，没有`toString`，继续向上寻找
2. `obj.__proto__.__proto__ `即`Foo.prototype.__proto__`，即普通的Object对象，因此`Foo.prototype.__proto__ `=== `Object.prototype`,在这里可以找到`toString`
3. 因此`obj.toString` 最终对应的是`Object.prototype.toString`

这样一直往上找，你会发现是一个链式的结构，所以叫做“原型链”。如果一直找到最上层都没有找到，那么就宣告失败，返回`undefined`。
## Call Apply Bind

可以通过`call`、`apply`、`bind`来改变函数调用时的上下文。

```javascript
function Fruits() {}

Fruits.prototype = {
  color: 'red',
  say: function () {
    console.log(this.color)
  }
}
let apple = new Fruits()

apple.say() //red

let banana = {color: 'yellow'}

apple.say.call(banana) //yellow
apple.say.apply(banana) //yellow

let arr1 = [12, 'foo']
let arr2 = ['bar', 20]

Array.prototype.push.call(arr1, 'add', 123123)
Array.prototype.pop.apply(arr2)

console.log(arr1, arr2) //[12, 'foo', 'add', 123123] ['bar']

let Bar = function () {
  console.log(this.x)
}
let foo = {x: 100}

let newFunc = Bar.bind(foo)
newFunc() //100
```

## 继承

首先定义一个父类

```javascript
function Animal(name, age, color) {
  this.name = name
  this.age = age
  this.color = color
  //实例方法
  this.checkColor = function () {
    console.log('kind: ' + color)
  }
}
//原型方法
Animal.prototype.printInfo = function() {
  console.log('name:'+ this.name + ' age:' + this.age)
}
```

1. 构造函数绑定

```javascript
function Cat(name, age, color) {
  Animal.apply(this, arguments)
}
let pound = new Cat('pound', 2, 'white')
pound.checkColor()
console.log(pound)
```

2. 原型链继承

```javascript
Cat.prototype = new Animal()
Cat.prototype.name = 'newPound'

let cat = new Cat()
console.log(cat)
```

3. 实例继承（原型式继承）

```javascript
function Cat(name, age, color) {
  return new Animal(...arguments)
}
let pound = new Cat('pound', 2, 'white')
console.log(pound)
```

4.组合继承

```javascript
function Cat(name, age, color) {
  Animal.apply(this, arguments)
}
Cat.prototype = new Animal()
Cat.prototype.constructor = Cat

let pound = new Cat('pound', 2, 'white')
console.log(pound)
```

5. 寄生组合继承

```javascript
function Cat() {
  //继承父类属性
  Animal.apply(this, arguments)
}

(function () {
  //创建空类
  let Super = function () {
  }
  Super.prototype = Animal.prototype
  //父类的实例作为子类的原型
  Cat.prototype = new Super()
})()
//修复构造函数指向问题
Cat.prototype.constructor = Cat
let pound = new Cat('pound', 2, 'white')
console.log(pound)
```

6. ES6`extends`继承

```javascript
class Animal {
  constructor(name, age, color) {
    this.name = name
    this.age = age
    this.color = color
  }

  checkColor() {
    console.log('color: ' + this.color)
  }
}

class Cat extends Animal {
  constructor(name, age, color) {
    super(...arguments)
  }

  checkColor() {
    super.checkColor()
  }
}

let pound = new Cat('pound', 2, 'white')

console.log(pound)
```

## 函数柯里化

> 柯里化又称部分求值，核心思想是把多参数传入的函数拆成单参数（或部分）函数，内部再返回调用下一个参数的函数，以此依次处理剩余参数。

柯里化有三个常见的作用：
1. 参数复用
2. 提前返回
3. 延迟计算/运行

```javascript
function plus(a, b, c) {
  return a+b+c
}
function add(a) {
  return function(b) {
    return function(c) {
      return a + b + c 
    }
  }
}
const Add = a => {
  return b => {
    return c => {
      return a + b + c
    }
  }
}

console.log(plus(1,2,3))  //6
console.log(add(1)(2)(3)) //6
console.log(Add(1)(2)(3)) //6
```
柯里化 封装正则
```javascript
function check(reg, txt) {
  return reg.test(txt)
}

check(/[a-z]/g, 'test') //true

function curryCheck(reg) {
  return function (txt) {
    return reg.test(txt)
  }
}

let checkNumber = curryCheck(/[0-9]/g)
let checkChars = curryCheck(/[a-z]/g)

console.log(checkNumber('123asd')) //true
console.log(checkChars('123asd'))  //true
```

## 函数的四种调用方式

一般形式函数调用

```javascript
function Func(x, y) {
  return x * y
}

console.log(Func(1, 2))

function Func2(x) {
  return function (y) {
    return x * y
  }
}

console.log(Func2(1)(2))
```
作为对象方法调用
```javascript
let obj = {
  val: 0,
  plus: function (n) {
    this.val += typeof n === 'number' ? n : 1
  }
}

obj.plus()
console.log(obj.val)

obj.plus(2)
console.log(obj.val)
```
使用`call`, `apply`
```javascript
function Func(x, y) {
return x + y
}

console.log(Func.call(null, 1, 2))
console.log(Func.apply(null, [1, 2]))
```
`new`命令间接调用
```javascript
function Func(x, y) {
  console.log(x + y)
}

let newF = new Func(1, 2)
```

## 防抖
> 触发高频事件后n秒内函数只会执行一次，如果n秒内高频事件在此触发，则重新计算时间

```html
<div>
    <button id="btn">防抖</button>
</div>
```
```javascript
function debounce(fn) {
  let timer = null //创建一个标记用来存放定时器
  return function () {
    clearTimeout(timer) //每当用户操作的时候便清除定时器
    timer = setTimeout(() => { //创建一个新的定时器
      fn.apply(this, arguments) //为了确保上下文环境为当前this，不能直接用fn
    }, 500)
  }
}

function check() {
  console.log('防抖测试')
}

let btn = document.getElementById('btn')
btn.addEventListener('click', debounce(check))
```
## 节流
> 高频事件触发 但在n秒内只会执行一次，所以节流会稀释函数的执行频率

```javascript
function throttle(fn) {
  let canRun = true //标记是否可以进行 //此处为闭包
  return function () {
    if (!canRun) return
    canRun = false
    setTimeout(() => { //将传入的方法放在setTimeout中执行
      // fn.apply(this, arguments)
      fn.apply(this, arguments)
      //关键在第一个参数，为了确保上下文环境为当前的this，所以不能直接用fn。
      // 最后在setTimeout执行完毕后再把标记设置为true
      //(关键)表示可以执行下一次循环了。
      //当定时器没有执行的时候标记永远是false，在开头被return掉
      canRun = true
    }, 500)
  }
}

function checkThrottle() {
  console.log('节流测试')
}

let btn2 = document.getElementById('btn2')
btn2.addEventListener('click', throttle(checkThrottle))
```



## 水平垂直居中的方法

例子：

```html
<div class="container">
    <div class="content">content</div>
</div>
```

1. flex布局
```css
.container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.content {
    width: 100px;
    height: 100px;
    background: aliceblue;
}
```
2. absolute + 负margin 需要知道子元素的高宽
```css
  .container {
    position: relative;
    background-color: #f5ac97;
    width: 1000px;
    height: 300px;
  }
  .content {
    width: 100px;
    height: 100px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -50px; /*指定子元素的外边距为子元素宽度的一半的负值*/
    margin-top: -50px;
    background-color: antiquewhite;
  }
```
3. absolute + margin auto 需要知道子元素的高宽
```css
  .container {
    position: relative;
    background-color: #f5ac97;
    width: 1000px;
    height: 300px;
  }
  .content {
    background-color: antiquewhite;
    position: absolute;
    width: 100px;
    height: 100px;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
  }
```
4. 对行内元素可以使用`text-align:center`，`line-height`等

## flex 
参考 [Style/Flex](/style/flex/)

## BFC (Block Formatting Context)
参考 [BFC](https://blog.csdn.net/weixin_42490398/article/details/90547616?utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromMachineLearnPai2%7Edefault-1.base&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromMachineLearnPai2%7Edefault-1.base)

## Sticky
position:sticky是一个新的css3属性，它的表现类似position:relative和position:fixed的合体，在目标区域在屏幕中可见时，它的行为就像position:relative; 而当页面滚动超出目标区域时，它的表现就像position:fixed，它会固定在目标位置。

1. 父元素不能overflow:hidden或者overflow:auto属性。
2. 必须指定top、bottom、left、right4个值之一，否则只会处于相对定位
3. 父元素的高度不能低于sticky元素的高度
4. sticky元素仅在其父元素内生效


## new 操作符都做了些什么

1. 创建一个空对象
2. 将空对象的原型prototype指向构造函数的原型（_proto_属性只想构造函数的原型对象prototype）
3. 将构造函数的作用域赋值给新对象（this指向新对象）
4. 执行构造函数内部的代码，将属性添加给新对象
5. 返回新对象

```javascript
function _new(func, ...args) {
  let target = {} //新建空对象
  target.__proto__ = func.prototype //原型指向构造函数的原型
  let res = func.apply(target, args) //作用域赋给新对象
  return res instanceof Object ? res : target //返回新对象
}

function Origin(sex, age) {
  this.name = 'name'
  this.age = age
  this.sex = sex
}
let origin = new Origin('F', 10)
console.log(origin)
console.log(_new(Origin, 'M', 20))
```

## Babel 是如何把ES6转化为ES5的

大致分为三步

1. 将代码字符串解析成抽象语法树，即所谓的`AST(abstract syntax tree)`，是用来表示源代码语法的一种树形结构，树上的每个节点
都代表源码的一种结构。平时编辑器的代码高亮、代码检查都依靠的是AST。
2. 对AST进行处理，在这个阶段可以对ES6代码进行相应转换，即转成ES5代码。
3. 根据处理后的AST再生成代码字符串。
