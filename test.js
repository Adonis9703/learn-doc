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
function plus(a, b, c) {
  console.log(arguments)
  return a + b + c
}

function add(a) {
  return function (b) {
    return function (c) {
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

console.log(plus(1, 2, 3))
console.log(add(1)(2)(3))
console.log(Add(1)(2)(3))

//柯里化 封装正则

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

console.log(checkNumber('123asd'))
console.log(checkChars('123asd'))

