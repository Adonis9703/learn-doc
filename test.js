//https://www.kancloud.cn/freya001/interview/1224405

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




























