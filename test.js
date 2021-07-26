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
//   return function (v) {
//     clearTimeout(timer) //每当用户操作的时候便清除定时器
//     timer = setTimeout(() => { //创建一个新的定时器
//       fn.apply(this, v) //为了确保上下文环境为当前this，不能直接用fn
//     }, 500)
//   }
// }
//
// function check() {
//   console.log('防抖测试')
// }

// let input = document.getElementById('input')
// input.addEventListener('input', debounce(check))
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
//
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
function resolvePromise(promiseNext, val, resolve, reject) {
  // 自己等待自己是错误的实现，需要被结束promise
  if (promiseNext === val) {
    console.log('Chaining cycle detected for promise #<Promise>')
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  
  //如果是promise对象，则调用它的resolve或者reject方法，目的是改变它的状态
  if (val instanceof mPromise) {
    val.then(resolve, reject)
  } else {
    resolve(val)
  }
}

class mPromise {
  constructor(executor) {
    this.status = 'pending' //默认为pending
    this.resolved = undefined //成功状态 默认为undefined
    this.rejected = undefined //失败状态 默认为undefined
    
    this.onResolvedCallbacks = [] //存放成功的回调
    this.onRejectedCallbacks = [] //存放失败的回调
    
    let resolve = resolved => { //成功的方法
      if (this.status === 'pending') {
        this.status = 'fulfilled'
        this.resolved = resolved
        this.onResolvedCallbacks.forEach(fn => fn()) //依次执行回调函数
      }
    }
    
    let reject = rejected => {
      if (this.status === 'pending') {
        this.status = 'rejected'
        this.rejected = rejected
        this.onRejectedCallbacks.forEach(fn => fn())
      }
    }
    
    try {
      executor(resolve, reject) //尝试执行，将resolve和reject函数传给使用者
    } catch (e) {
      reject(e)
    }
  }
  
  //定义一个then方法，并接受两个参数，分别是成功和失败的回调。
  then(onFulFilled, onRejected) {
    onFulFilled = typeof onFulFilled === 'function' ? onFulFilled : resolved => resolved
    onRejected = typeof onRejected === 'function' ? onRejected : rejected => {
      throw  rejected
    }
    //为了链式调用，创建一个Promise对象，并抛出
    const promiseNext = new mPromise((resolve, reject) => {
      if (this.status === 'fulfilled') {
        //创建一个微任务等待 promiseNext 初始化完成
        queueMicrotask(() => {
          try {
            const val = onFulFilled(this.resolved)
            resolvePromise(promiseNext, val, resolve, reject)
          } catch (e) {
            reject(e) //如果失败直接reject
          }
        })
      }
      if (this.status === 'rejected') {
        queueMicrotask(() => {
          try {
            const val = onRejected(this.rejected)
            resolvePromise(promiseNext, val, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }
      if (this.status === 'pending') {
        //等待，因为不知道后面状态的变化，所以先将回调方法保存起来
        this.onResolvedCallbacks.push(() => {
          queueMicrotask(() => {
            try {
              const val = onFulFilled(this.resolved)
              resolvePromise(promiseNext, val, resolve, reject)
            } catch (e) {
              reject(e)
            }
          })
        })
        this.onRejectedCallbacks.push(() => {
          queueMicrotask(() => {
            try {
              const val = onRejected(this.rejected)
              resolvePromise(promiseNext, val, resolve, reject)
            } catch (e) {
              reject(e)
            }
          })
        })
      }
    })
    return promiseNext
  }
  
  static resolve(data) {
    if (data instanceof mPromise) {
      return data
    }
    return new mPromise((resolve, reject) => {
      resolve(data)
    })
  }
  
  static reject(err) {
    return new mPromise((resolve, reject) => {
      reject(err)
    })
  }
  
  //一起进行，并返回全部结果，如果有一个失败就则返回失败
  static all(values) {
    if (!Array.isArray(values)) {
      const type = typeof values
      return new TypeError(`TypeError: ${type} ${values} is not iterable`)
    }
    return new mPromise((resolve, reject) => {
      let resultArr = []
      let orderIndex = 0
      const processResultByKey = (value, index) => {
        resultArr[index] = value
        if (++orderIndex === values.length) {
          resolve(resultArr)
        }
      }
      for (let i = 0; i < values.length; i++) {
        let value = values[i]
        if (value && typeof value.then === 'function') {
          value.then(res => {
            processResultByKey(res, i)
          }, reject)
        } else {
          processResultByKey(value, i)
        }
      }
    })
  }
  
  //谁先完成就用谁的结果
  static race(promises) {
    return new mPromise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        let val = promises[i]
        if (val && typeof val.then === 'function') {
          val.then(resolve, reject)
        } else {
          resolve(val)
        }
      }
    })
  }
}

//catch 方法是 then 方法的语法糖，只接受 rejected 态的数据。
mPromise.prototype.catch = function (errorCallback) {
  return this.then(null, errorCallback)
}

// finally 方法，无论如何都会走到这里来的。
// 在 finally 方法里面，不接受成功态或失败态的数据，走一个过场，直接值穿透到下一个里面去。
// 适合把一些，成功态或失败态都有的逻辑放在这里面。
mPromise.prototype.finally = function (callback) {
  return this.then(res => {
    return mPromise.resolve(callback()).then(() => res)
  }, err => {
    return mPromise.resolve(callback()).then(() => {
      throw err
    })
  })
}

//测试 catch
mPromise.reject(123).catch(err => {
  console.log('catch', err) //123
})

//测试 finally
mPromise.reject(123).finally(() => {
  return new mPromise((resolve, reject) => {
    setTimeout(() => {
      resolve(456)
    }, 1000)
  })
}).then(res => {
  console.log('finally', res) //123
}, err => {
  console.log('finally', err)
})

//测试 race
let r1 = new mPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('300')
  }, 300)
})
let r2 = new mPromise((resolve, reject) => {
  setTimeout(() => {
    reject('400')
  }, 400)
})

mPromise.race([r1, r2]).then(res => {
  console.log(res)
})

//测试resolve
mPromise.resolve().then(() => {
  console.log(0)
  return mPromise.resolve(1)
}).then(res => {
  console.log(res)
})

//测试all
let p1 = new mPromise(resolve => {
  setTimeout(() => {
    resolve('p1')
  }, 200)
})
let p2 = new mPromise(resolve => {
  setTimeout(() => {
    resolve('p2')
  }, 200)
})

let p3 = new mPromise((resolve, reject) => {
  setTimeout(() => {
    reject('p3')
  }, 500)
})
mPromise.all([1, 2, p1, p2, p3]).then(res => {
  console.log('all', res)
}, err => {
  console.log('reject', err)
}) // [1, 2, 'p1', 'p2']


// const promise = new mPromise((resolve, reject) => {
//   setTimeout(() => {
//     resolve('成功')
//   }, 1000)
// }).then(res => {
//   console.log('success', res)
//   return promiseNext()
// }).then(res => {
//   console.log(res)
// })

// const promiseNext = function () {
//   new mPromise((resolve, reject) => {
//     setTimeout(() => {
//       resolve('又成功了')
//     }, 1000)
//   }).then(res => {
//     console.log('success', res)
//   })
// }

// const promise = new mPromise(resolve => {
//   setTimeout(() => {
//     resolve('success')
//   }, 1000)
// })
//
// promise.then(res => {
//   console.log(1)
//   console.log('resolve', res)
//   return res
// }).then(res => {
//   console.log(2)
//   console.log('resolve', res)
// })

// promise.then().then().then(res => {
//   console.log(res)
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
// const sub = document.getElementById('subscribe')
// const emit = document.getElementById('emit')
// const off = document.getElementById('off')
//
// sub.addEventListener("click", () => {
//   event.on('check', handle)
// })
// // event.on('check', handle)
// emit.addEventListener("click", () => {
//   event.emit('check', 'emit success')
// })
// off.addEventListener("click", () => {
//   event.off('check', handle)
// })
// event.emit('check', 'success')

// 观察者模式

// 观察者
class Observer {
  constructor() {
  }
  
  update(...args) {
    console.log('do something', args)
  }
}

//目标
class Subject {
  constructor() {
    this.observers = [] //维护一个观察者列表
  }
  
  //添加观察者
  add(observer) {
    this.observers.push(observer)
  }
  
  remove(observer) {
    this.observers = this.observers.filter(ob => ob !== observer)
  }
  
  //发布消息
  notify(...args) {
    this.observers.forEach(observer => observer.update(...args))
  }
}

const subject = new Subject()
subject.add(new Observer())
subject.add(new Observer())

subject.notify('a', 'b')

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
// const fib = function(n) {
//   if (n == 0) {
//     return 0
//   }
//   let a1 = 0
//   let a2 = 1
//   for (let i = 1; i < n; i++) {
//     [a1, a2] = [a2, a1 + a2]
//   }
//   return a2
// }
// console.log(fib(6))

//分治算法 归并排序
// const mergeSort = function (arr) {
//   const len = arr.length
//   if (len > 1) {
//     //对半分解 分
//     const middle = Math.floor(len / 2)
//     const left = arr.slice(0, middle)
//     const right = arr.slice(middle, len)
//     //分别对左右进行排序
//     mergeSort(left)
//     mergeSort(right)
//
//     //治
//     let i = 0
//     let j = 0
//     let k = 0
//     //逐一比较
//     while (i < left.length && j < right.length) {
//       if (left[i] < right[j]) {
//         arr[k] = left[i]
//         i++
//       } else {
//         arr[k] = right[j]
//         j++
//       }
//       k++
//     }
//     //处理剩余项 由于剩余项本身就已经被上一个递归排序好了 所以直接顺序赋值即可
//     while (i < left.length) {
//       arr[k] = left[i]
//       i++
//       k++
//     }
//     while (j < right.length) {
//       arr[k] = right[j]
//       j++
//       k++
//     }
//   }
//   return arr
// }
//
// console.log(mergeSort([8, 4, 5, 7, 1, 3, 6, 2]))
// 分
// [8,4,5,7]  [1,3,6,2]
// [8,4][5,7]   [1,3][6,2]
// 8 4   5 7   1 3   6 2

// 治
// [4,8] [5,7]   [1,3] [2,6]
// [4,5,7,8] [1,2,3,6]
// [1,2,3,4,5,6,7,8]

// const climbStairs = function (n) {
//   let a1 = 1
//   let a2 = 2
//   for (let i = 3; i <= n; i++) {
//     [a1, a2] = [a2, a1 + a2]
//   }
//   return a2
// }
//
// console.log(climbStairs(5))

// const findContentChildren = function (g, s) {
//   g.sort((a, b) => a - b)
//   s.sort((a, b) => a - b)
//   let gi = 0 //胃口值index
//   let sj = 0 //饼干尺寸index
//   let res = 0
//   while (gi < g.length && sj < s.length) {
//     if (s[sj] >= g[gi]) {
//       gi++
//       sj++
//       res++
//     } else {
//       sj++
//     }
//   }
//   return res
// }
//
// console.log(findContentChildren([1, 2], [1, 2, 3]))
//
// const letterCombinations = function (digits) {
//   if (!digits) {
//     return []
//   }
//   const len = digits.length
//   const map = new Map()
//   map.set('2', 'abc')
//     .set('3', 'def')
//     .set('4', 'ghi')
//     .set('5', 'jkl')
//     .set('6', 'mno')
//     .set('7', 'pqrs')
//     .set('8', 'tuv')
//     .set('9', 'wxyz')
//   const result = []
//
//   // console.log(map)
//   function generate(i, str) {
//     if (i == len) {
//       result.push(str)
//       return
//     }
//     const tmp = map.get(digits[i])
//     for (let r = 0; r < tmp.length; r++) {
//       generate(i + 1, str + tmp[r])
//     }
//   }
//
//   generate(0, '')
//   return result
// }
//
// console.log(letterCombinations('23'))

// let map = new Map()
// let m = {
//   name: 'm'
// }
// let f = function () {
//   console.log('function')
// }
// map.set(m, f)
// map.set(f, m)
// console.log(map)
//
// for (const [key, value] of map) {
//   console.log(`key:${key} value: ${value}`)
// }
//
// map.forEach((value, key) => {
//   console.log(`key:${key} value: ${value}`)
// })

// const curry = (...a) => (...b) => (...c) => (console.log(...a,...b,...c))

// curry(1,2)(3,4)(5,6)
//
// const add = function (a) {
//   function sum(b) {
//     a = a + b
//     return sum
//   }
//
//   sum.valueOf = function () {
//     return a
//   }
//   return sum
// }
//
// console.log(add(1).valueOf())
//
// const add2 = (...a) => {
//   let ars = a
//   let result = 0
//   const sum = (...b) => {
//     ars.push(...b || 0)
//     return sum
//   }
//   sum.valueOf = () => {
//     result = ars.reduce((pre, cur) => {
//       return pre + cur
//     }, 0)
//     return result
//   }
//   return sum
// }
//
//
// console.log(add2(1,2)(3,4).valueOf())


const all = (promises) => {
  return new Promise((resolve, reject) => {
    let results = []
    for (let i = 0; i < promises.length; i++) {
      let promise = promises[i]
      promise.then(res => {
        results.push(res)
        if (results.length === promises.length) {
          resolve(results)
        }
      }, reject)
    }
  })
}

const race = (promises) => {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(resolve, reject)
    }
  })
}

let pr1 = new Promise(resolve => {
  setTimeout(() => {
    resolve('pr1')
  }, 300)
})
let pr2 = new Promise(resolve => {
  setTimeout(() => {
    resolve('pr2')
  }, 500)
})

let pr3 = new Promise(resolve => {
  setTimeout(() => {
    resolve('pr3')
  }, 800)
})
console.log('test test')
all([pr1, pr2, pr3]).then(res => {
  console.log(res)
})
race([pr1, pr2, pr3]).then(res => {
  console.log('race', res)
})

// Promise.all([pr1, pr2, pr3]).then(res => {
//   console.log(res)
// })














