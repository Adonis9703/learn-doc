//https://www.kancloud.cn/freya001/interview/1224405

//rest
// function add(...values) {
//   let sum = 0
//   for (const val of values) {
//     sum += val
//   }
//   return sum
// }
//
// console.log(add(1, 2, 3)) //6
//
// const curry = (...a) => (...b) => (...c) => {
//   let temp = [...a, ...b, ...c]
//   let sum = 0
//   for (const val of temp) {
//     sum += val
//   }
//   return sum
// }
//
// console.log(curry(1, 2)(3, 4)(5, 6))
//
// function sortNum() {
//   // return Array.prototype.sort.apply(arguments)
//   return Array.prototype.slice.call(arguments).sort()
// }
//
// const sortRest = (...nums) => nums.sort()
//
// console.log(sortNum(5, 4, 3, 2, 1))
// console.log(sortRest(4, 2, 5, 7, 3))
//
// function push(arr, ...items) {
//   items.forEach(item => {
//     arr.push(item)
//   })
//   console.log(arr)
// }
//
// push([], 1, 2, 3) //[1, 2, 3]

// call apply bind
// function Fruits() {}
//
// Fruits.prototype = {
//   color: 'red',
//   say: function () {
//     console.log(this.color)
//   }
// }
// let apple = new Fruits()
//
// apple.say()
//
// let banana = {color: 'yellow'}
//
// apple.say.call(banana)
// apple.say.apply(banana)
//
// let arr1 = [12, 'foo']
// let arr2 = ['bar', 20]
//
// Array.prototype.push.call(arr1, 'add', 123123)
// Array.prototype.pop.apply(arr2)
//
// console.log(arr1, arr2)
//
// let Bar = function () {
//   console.log(this.x)
// }
// let foo = {x: 100}
//
// let newFunc = Bar.bind(foo)
//
// newFunc()

//函数柯里化
// function plus(a, b, c) {
//   console.log(arguments)
//   return a + b + c
// }
//
// function add(a) {
//   return function (b) {
//     return function (c) {
//       return a + b + c
//     }
//   }
// }
//
// const Add = a => {
//   return b => {
//     return c => {
//       return a + b + c
//     }
//   }
// }
//
// console.log(plus(1, 2, 3))
// console.log(add(1)(2)(3))
// console.log(Add(1)(2)(3))

//柯里化 封装正则

// function check(reg, txt) {
//   return reg.test(txt)
// }
//
// check(/[a-z]/g, 'test') //true
//
// function curryCheck(reg) {
//   return function (txt) {
//     return reg.test(txt)
//   }
// }
//
// let checkNumber = curryCheck(/[0-9]/g)
// let checkChars = curryCheck(/[a-z]/g)
//
// console.log(checkNumber('123asd'))
// console.log(checkChars('123asd'))

//函数调用四种方法 1.一般形式的函数调用。2.作为对象的方法调用。3.使用call和apply动态调用。4.使用new关键词间接调用。

//1.一般形式函数调用
// function Func(x, y) {
//   return x * y
// }
//
// console.log(Func(1, 2))
//
// function Func2(x) {
//   return function (y) {
//     return x * y
//   }
// }
//
// console.log(Func2(1)(2))
//
// //2.作为对象方法调用
// let obj = {
//   val: 0,
//   plus: function (n) {
//     this.val += typeof n === 'number' ? n : 1
//   }
// }
//
// obj.plus()
// console.log(obj.val)
//
// obj.plus(2)
// console.log(obj.val)

//3.使用call、apply
//
// function.call(this, args...)
// function.apply(this, [args])
//
//
// function Func(x, y) {
// return x + y
// }
//
// console.log(Func.call(null, 1, 2))
// console.log(Func.apply(null, [1, 2]))


//4. new命令间接调用
//
// function Func(x, y) {
//   console.log(x + y)
// }
//
// let newF = new Func(1, 2)


// new操作符都做了什么
// function _new(func, ...args) {
//   let target = {}
//   target.__proto__ = func.prototype
//   let res = func.apply(target, args)
//   return res instanceof Object ? res : target
// }
//
// function Origin(sex, age) {
//   this.name = 'name'
//   this.age = age
//   this.sex = sex
// }
//
// let origin = new Origin('F', 10)
// console.log(origin)
// console.log(_new(Origin, 'M', 20))


//防抖
//触发高频事件后n秒内函数只会执行一次，如果n秒内高频事件再次触发，则重新计算时间
//
// function debounce(fn) {
//   let timer = null //创建一个标记用来存放定时器
//   return function () {
//     clearTimeout(timer) //每当用户操作的时候便清除定时器
//     timer = setTimeout(() => { //创建一个新的定时器
//       fn.apply(this, arguments) //为了确保上下文环境为当前this，不能直接用fn
//     }, 500)
//   }
// }
//
// function check() {
//   console.log('防抖测试')
// }
//
// // let input = document.getElementById('input')
// // input.addEventListener('input', debounce(check))
// let btn = document.getElementById('btn')
// btn.addEventListener('click', debounce(check))


//节流
//高频事件触发 但在n秒内只会执行一次，所以节流会稀释函数的执行频率
//动作绑定事件，动作发生后一段时间后触发事件，在这段时间内，如果动作又发生，则无视该动作，直到事件执行完后，才能重新触发。
// function throttle(fn) {
//   let canRun = true //标记是否可以进行 //此处为闭包
//   return function () {
//     if (!canRun) return
//     canRun = false
//     setTimeout(() => { //将传入的方法放在setTimeout中执行
//       // fn.apply(this, arguments)
//       fn.apply(this, arguments)
//       //关键在第一个参数，为了确保上下文环境为当前的this，所以不能直接用fn。
//       // 最后在setTimeout执行完毕后再把标记设置为true
//       //(关键)表示可以执行下一次循环了。
//       //当定时器没有执行的时候标记永远是false，在开头被return掉
//       canRun = true
//     }, 500)
//   }
// }
//
// function checkThrottle() {
//   console.log('节流测试')
// }
//
// let btn2 = document.getElementById('btn2')
// btn2.addEventListener('click', throttle(checkThrottle))

//判断是否为数组
//1.Object.prototype.toString.call()
// 每一个继承Object的对象都有 toString 方法，如果toString没有被重写，会返回[object type]
//这种方法可以适用于所有基本的数据类型
// const arr = [1, 2, 3]
// console.log(arr.toString()) //1,2,3
// console.log(Object.prototype.toString.call(arr)) //[object Array]

//2. instanceof
// instanceof的机制是通过判断对象的原型链中是不是能找到类型的prototype
//
// console.log([] instanceof Array)
// console.log([] instanceof Object)

//3. Array.isArray

// 原型 原型链
// let obj = {}
// obj.a = 100
//
// let arr = []
// arr.push(1)
// arr.a = 100
// arr.b = 200
//
// function func() {}
// func.a = 100
//
// console.log(obj, arr, func)
//
// console.log(obj.__proto__) //引用类型的__proto__指向它的构造函数的prototype
// console.log(Object.prototype) //Object() 是 obj 的构造函数
// console.log(obj.__proto__ === Object.prototype)
//
// console.log(arr.__proto__)
// console.log(func.__proto__)

// //函数具有 prototype
// console.log(func.prototype)

//原型

// function Foo(name, age) {
//   this.name = name
//   this.age = age
// }
// Foo.prototype.printName = function () {
//   console.log(this.name)
// }
//
// let obj = new Foo('Adonis', 10)
//
// obj.printAge = function () {
//   console.log(this.age)
// }
//
// obj.printAge()
// console.log(obj)
// obj.printName() //当试图获得一个对象的某个属性时，如果这个对象本身没有这个属性，那么会去它的__proto__(即它的构造函数的prototype)
//                 //中寻找，因此obj.printName 就会找到 Foo.prototype.printName
//
// //那么如何判断某个属性是否是对象本身的属性？可以使用 hasOwnProperty，常用于遍历一个对象的时候。
// for(const item in obj) {
//   //某些高级浏览器已经在for in 中屏蔽了来自原型的属性，但这里加上判断可以保证代码的健壮性
//   if (obj.hasOwnProperty(item)) {
//     console.log(item + ':' + obj[item])
//   }
// }

// //原型链 接着上述例子
//
// console.log(obj.toString()) //因为obj本身没有toString，并且obj.__proto__（Foo.prototype）也没有toString，因此将继续在
//obj.__proto__.__proto__中寻找。
//1. obj.__proto__ 即Foo.prototype，没有toString，继续向上寻找
//2. obj.__proto__.__proto__ 即Foo.prototype.__proto__，即普通的Object对象，因此Foo.prototype.__proto__ === Object.prototype,
//在这里可以找到toString
//3.因此obj.toString 最终对应的是Object.prototype.toString

//这种链式结构被称为原型链。如果在最上层也没有找到，则返回undefined。
//原型链中的this
//所有从原型或更高级原型中得到、执行的方法，其中的this在执行时，就指向了当前这个触发事件执行的对象。因此printName和alertName中的this都是f。
//

// let promise = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     if (Math.random() > 0.5) {
//       resolve('resolved')
//     } else {
//       reject('rejected')
//     }
//   }, 1000)
// })
//
// promise.then(res => {
//   console.log(res)
// }, err => {
//   console.log(err)
// })

// class Person {
//   constructor(name, age) {
//     this.name = name
//     this.age = age
//   }
//   printInfo() {
//     console.log('name:'+ this.name + ' age:' + this.age)
//   }
// }
//
// let me = new Person('adonis', 24)
// me.printInfo()

// function Animal(name, age, color) {
//   this.name = name
//   this.age = age
//   this.color = color
//   //实例方法
//   this.checkColor = function () {
//     console.log('kind: ' + color)
//   }
// }
//
// //原型方法
// Animal.prototype.printInfo = function () {
//   console.log('name:' + this.name + ' age:' + this.age)
// }

// let cat = new Animal('Pound', 2, 'white')
//
// cat.printInfo()
// cat.checkColor()

// 构造函数绑定
// function Cat(name, age, color) {
//   Animal.apply(this, arguments)
// }
// let pound = new Cat('pound', 2, 'white')
// pound.checkColor()
// console.log(pound)

//原型链继承
// function Cat() {}
//
// Cat.prototype = new Animal()
// Cat.prototype.name = 'newPound'
//
// let cat = new Cat()
// console.log(cat)

//实例继承（原型式继承）

// function Cat(name, age, color) {
//   return new Animal(...arguments)
// }
// let pound = new Cat('pound', 2, 'white')
// console.log(pound)

//组合式继承
// function Cat(name, age, color) {
//   Animal.apply(this, arguments)
// }
// Cat.prototype = new Animal()
// Cat.prototype.constructor = Cat
//
// let pound = new Cat('pound', 2, 'white')
// console.log(pound)

//寄生组合继承

// function Cat() {
//   //继承父类属性
//   Animal.apply(this, arguments)
// }
//
// (function () {
//   //创建空类
//   let Super = function () {
//   }
//   Super.prototype = Animal.prototype
//   //父类的实例作为子类的原型
//   Cat.prototype = new Super()
// })()
// //修复构造函数指向问题
// Cat.prototype.constructor = Cat
// let pound = new Cat('pound', 2, 'white')
// console.log(pound)

//ES6 继承

// class Animal {
//   constructor(name, age, color) {
//     this.name = name
//     this.age = age
//     this.color = color
//   }
//
//   checkColor() {
//     console.log('color: ' + this.color)
//   }
// }
//
// class Cat extends Animal {
//   constructor(name, age, color) {
//     super(...arguments)
//   }
//
//   checkColor() {
//     super.checkColor()
//   }
// }
//
// let pound = new Cat('pound', 2, 'white')
//
// console.log(pound)


// function debounce(fn) {
//   let timer = null
//   return function () {
//     clearTimeout(timer)
//     timer = setTimeout(() => {
//       fn.apply(this, arguments)
//     }, 500)
//   }
// }
//
// function throttle(fn) {
//   let flag = true
//   return function () {
//     if (!flag) return
//     flag = false
//     setTimeout(() => {
//       fn.apply(this, arguments)
//       flag = true
//     }, 500)
//   }
// }
//

// function deepCopy(source, target) {
//   target = target || {}
//   for (const sourceKey in source) {
//     if (typeof source[sourceKey] === 'object') {
//       target[sourceKey] = source[sourceKey].constructor === Array ? [] : {}
//       deepCopy(source[sourceKey], target[sourceKey])
//     } else {
//       target[sourceKey] = source[sourceKey]
//     }
//   }
//   return target
// }
//
// let source1 = {
//   a: 1,
//   b: 'b',
//   c: [1, 2, 3, 4],
//   d: {deep: true}
// }
// let source2 = [
//   'a', 1, 2, {x: [5, 4, 3, 2, 1]}
// ]
// let target1 = {}
//
// deepCopy(source2, target1)
// // target1 = JSON.parse(JSON.stringify(source2))
// console.log(target1)


// window.name = 'ByteDance'
// function A() {
//   this.name = 123
// }
// A.prototype.getA = function () {
//   console.log(this)
//   console.log(this.name + 1) //ByteDance1
//   return this.name
// }
// let a = new A()
// let funcA = a.getA //丢失this
// funcA()

// window.name = 'ByteDance'
// class A {
//   constructor() {
//     this.name = 123
//   }
//   getA() {
//     console.log(this) //undefined 在类中强制使用严格模式 严格模式下this指向undefined
//     console.log(this.name + 1)
//     return this.name
//   }
// }
// let a = new A()
// let funcA = a.getA
// funcA()

// function a() {
//   console.log('a')
//   Promise.resolve().then(() => {
//     console.log('e')
//   })
// }
//
// function b() {
//   console.log('b')
// }
//
// function c() {
//   console.log('c')
// }
//
// function d() {
//   setTimeout(a, 0)
//   var temp = Promise.resolve().then(b)
//   setTimeout(c, 0)
//   console.log('d')
// }
//
// d() // d b a e c

// let arr = [1, [1, 2], [4, [5, [6]]]]
//
// function flat(arr) {
//   return arr.flat(Infinity)
// }
// console.log(flat(arr))

// const list = [1, 2, 3]
// const square = num => {
//   return new Promise((resolve,reject) => {
//     setTimeout(()=> {
//       resolve(num * num)
//     }, 1000)
//   })
// }
// async function test() {
//   for (let i = 0; i < list.length; i++) {
//     let res = await square(list[i])
//     console.log(res)
//   }
//   // list.forEach(async x => {
//   //   const res = await square(x)
//   //   console.log(res)
//   // })
// }
// test()

// function find(arr, target) {
//   // let result = []
//   // for (let i = 0; i < arr.length; i++) {
//   //   // let flag = arr[i]
//   //   for (let j = 1; j < arr.length; j++) {
//   //     if (arr[i] + arr[j] === target) {
//   //       if (!result.flat(Infinity).includes(arr[j])) {
//   //         result.push([arr[i], arr[j]])
//   //       }
//   //     }
//   //   }
//   // }
//   // console.log(result)
//   let hash = {}
//   let result = new Map()
//   for (let i = 0; i < arr.length; i++) {
//     let m = arr[i]
//     let diff = target - m
//     if (hash[m] && !result.has(diff)) {
//       result.set(diff, [diff, m])
//     }
//     hash[diff] = diff
//   }
//   console.log([...result.values()])
// }
//
// find([32, 3, 5, 1, 30, 76, 2, 10, 29], 31)

//手写promise

// class mPromise {
//   constructor(executor) {
//     this.status = 'pending' //默认为pending
//     this.resolved = undefined //成功状态 默认为undefined
//     this.rejected = undefined //失败状态 默认为undefined
//
//     this.onResolvedCallbacks = [] //存放成功的回调
//     this.onRejectedCallbacks = [] //存放失败的回调
//
//     let resolve = resolved => { //成功的方法
//       if (this.status === 'pending') {
//         this.status = 'fulfilled'
//         this.resolved = resolved
//         this.onResolvedCallbacks.forEach(fn => fn()) //依次执行回调函数
//       }
//     }
//
//     let reject = rejected => {
//       if (this.status === 'pending') {
//         this.status = 'rejected'
//         this.rejected = rejected
//         this.onRejectedCallbacks.forEach(fn => fn())
//       }
//     }
//
//     try {
//       executor(resolve, reject) //尝试执行，将resolve和reject函数传给使用者
//     } catch (e) {
//       reject(e)
//     }
//   }
//
//   //定义一个then方法，并接受两个参数，分别是成功和失败的回调。
//   then(onFulFilled, onRejected) {
//     if (this.status === 'fulfilled') {
//       onFulFilled(this.resolved)
//     }
//     if (this.status === 'rejected') {
//       onRejected(this.rejected)
//     }
//     // 如果promise的状态是 pending，需要将 onFulfilled 和 onRejected 函数存放起来，等待状态确定后，再依次将对应的函数执行
//     if (this.status === 'pending') {
//       this.onResolvedCallbacks.push(() => {
//         onFulFilled(this.resolved)
//       })
//       this.onRejectedCallbacks.push(() => {
//         onRejected(this.rejected)
//       })
//     }
//   }
// }
//
// const promise = new mPromise((resolve, reject) => {
//   setTimeout(() => {
//     resolve('成功')
//   }, 1000)
// }).then(res => {
//   console.log('success', res)
// }, err => {
// })


//手写 发布订阅模式 EventEmitter

// class EventEmitter {
//   constructor() {
//     this.events = {} //事件对象，存放订阅的名字和事件 如：{click: [handle1, handle2]
//   }
//
//   // 订阅事件的方法
//   on(eventName, callback) {
//     if (!this.events[eventName]) {
//       //一个事件名可以订阅多个事件函数
//       this.events[eventName] = [callback]
//     } else {
//       //存在则push到指定数组的尾部保存
//       this.events[eventName].push(callback)
//     }
//   }
//
//   //触发事件的方法
//   emit(eventName, ...args) {
//     //遍历执行所有订阅的事件
//     this.events[eventName] && this.events[eventName].forEach(fn => fn.apply(this, args))
//   }
//
//   //移除订阅事件
//   off(eventName, callback) {
//     if (this.events[eventName]) {
//       this.events[eventName] = this.events[eventName].filter(fn => fn !== callback)
//     }
//   }
//
//   //只执行一次订阅的事件，然后移除
//   once(eventName, callback) {
//     const fn = (...args) => {
//       callback.apply(this, args)
//       this.off(eventName, fn)
//     }
//     this.on(eventName, fn)
//   }
// }
//
// const event = new EventEmitter()
// const handle = (...payload) => console.log(...payload)
//
// event.on('check', handle)
//
// event.emit('check', 'success')

//闭包循环自运行函数定时器
// for (var i = 0; i < 5; i++) {
//   (function (time) {
//     setTimeout(() => {
//       console.log(time)
//     }, time * 1000)
//   })(i)
// } //间隔1s打印 1，2，3，4

// let obj = { a: 1 }
// let proxyObj = new Proxy(obj, {
//   //读取
//   get (target, prop) {
//     // return prop in target ? target[prop] : 0 //注释1
//     return Reflect.get(target, prop)
//   },
//   //修改或新增
//   set (target, prop, newVal) {
//     // target[prop] = newVal
//     return Reflect.set(target, prop, newVal)//需要return 一个Boolean 设置成功为true 设置失败为false
//   },
//   //删除
//   deleteProperty(target, prop) {
//     // return delete target[prop]
//     return Reflect.deleteProperty(target, prop)
//   }
// })
//
// console.log(proxyObj.a) //1
// // console.log(proxyObj.b) //0
//
// proxyObj.a = 666
// console.log(proxyObj.a) //666
const fib = function(n) {
  if (n == 0) {
    return 0
  }
  let a1 = 0
  let a2 = 1
  for (let i = 1; i < n; i++) {
    [a1, a2] = [a2, a1 + a2]
  }
  return a2
}
console.log(fib(6))