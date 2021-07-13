---
title: JavaScript
---

# JavaScript

## REST 参数

es6 引入了rest参数（形式：...变量名），用于获取函数的多余参数，这样就不需要使用arguments对象了。rest参数搭配的变量是一个数组，该变量将多余的参数放入数组中。

```javascript
function add(...values) {
  let sum = 0
  for (const val of values) {
    sum += val
  }
  return sum
}

console.log(add(1, 2, 3)) //6

const curry = (...a) => (...b) => (...c) => {
  let temp = [...a, ...b, ...c]
  let sum = 0
  for (const val of temp) {
    sum += val
  }
  return sum
}

console.log(curry(1, 2)(3, 4)(5, 6))
```

用rest参数替换arguments变量

```javascript
function sortNum() {
  // return Array.prototype.sort.apply(arguments) //如果这样写，返回将会是一个类数组对象
  return Array.prototype.slice.call(arguments).sort()
}
const sortRest = (...nums) => nums.sort()

console.log(sortNum(5,4,3,2,1))
console.log(sortRest(4,2,5,7,3))

```
arguments对象不是数组，而是一个类似数组的对象。所以为了使用数组的方法，必须使用Array.prototype.slice.call先将其转为数组。
rest参数就不存在这个问题，它就是一个真正的数组，数组特有的方法都可以使用。
下面是一个利用rest参数改写数组push方法的例子。

```javascript
function push(arr, ...items) {
  items.forEach(item => {
    arr.push(item)
  })
  console.log(arr)
}
push([], 1, 2, 3) //[1, 2, 3]
```

## EventLoop

先看例子

```html
<div id="example">{{msg}}</div>
<script>
const vm = new Vue({
    el: '#example',
    data: {
      msg: '123'
    }
})
vm.msg = 'new message'

console.log(1)
console.log(vm.$el.innerText)
console.log(2)
Vue.nextTick(() => {
  console.log(vm.$el.innerText)
})
console.log(3)
//输出结果
//1
//123
//2
//3
//new message
</script>
```
为什么最后打印的是'new message'而不是代码最后的3，为什么第一次打印vm.$el.innerText是123而不是赋值后的'new message'？

#### JavaScript EventLoop

JavaScript的最大特点就是单线程，虽然在h5中允许JavaScript脚本创建多个子线程，但是子线程完全收到主线程控制，且**不得**操作DOM，所以其本质依然是单线程。

#### 任务队列

单线程意味着所有任务需要排队，只有前一个任务结束，才会执行下一个任务。

于是，所有任务可以分成两种，一种是**同步任务（synchronous）**，另一种是**异步任务（asynchronous）**。同步任务指，在主线程上排队执行的任务，
只有前一个任务执行完毕，才能执行下一个任务；异步任务指的是，不进入主线程，而是进入**任务队列（task queue）**的任务，只有任务队列通知主线程，某个异步任务可以执行了，
该任务才会进入主线程执行。

具体来说，异步执行的运行机制如下（同步执行也如此，因为它可以被视为没有异步任务的异步执行）。

> 1. 所有同步任务都在主线程上执行，形成一个**执行栈（execution context stack）**
> 2. 主线程之外，还存在一个**任务队列（task queue）**。只要异步任务有了运行结果，就在**任务队列**中放置一个事件。
> 3. 一旦**执行栈**中所有的同步任务执行完毕，系统就会读取**任务队列**，看看里面有哪些事件。那些对应的异步任务结束等待状态，
进入执行栈，开始执行。
> 4. 主线程不断重复第三步。

![avater](/eventloop.png)

主线程在运行的时候会产生堆栈，堆用于存储变量，栈用于记录执行的顺序。如果碰到回调函数、dom操作比如click、hover等、setTimeout操作就会放到
任务队列，只有栈中的代码执行完毕才会从任务队列取出代码，进行执行。所以这就是为什么在上面的例子中，`console.log(3)`在代码最后，但是比nextTick
里的代码先输出。

#### 微任务、宏任务

上面的任务队列分为两种，执行顺序也有所差别，分别Macrotasks和Microtasks。

- Macrotasks: setTimeout, setInterval, setImmediate, I/O, UI rendering
- Microtasks: process.nextTick, Promise, Object.observe(废弃), MutationObserver

```javascript
console.log(1)
setTimeout(() => {
  console.log(2)
}, 0)
Promise.resolve().then(() => {
  console.log(3)
}).then(()=> {
  console.log(4)
})
console.log(5)
//输出结果：
//1
//5
//3
//4
//2
```
`Promise.then()`方放的函数会被推入microtasks队列，而`setTimeout`的任务会被推入macrotasks队列。
在每一次的事件循环中，macrotasks只会提取一个执行，而microtasks会一直提去，直到microtasks队列清空。

1. microtask会优先macrotask执行
2. microtasks会被循环提取到执行引擎主线程的执行栈，知道microtasks任务队列清空，才会执行macrotask

```javascript
 console.log('script start') 
  async function async1() {
    await async2() 
    console.log('async1 end')
  }
  async function async2() {
    console.log('async2 end')
  }
  async1() 
  setTimeout(() => {
    console.log('setTimeout')
  }, 0)

  new Promise(resolve => { 
    console.log('Promise') 
    resolve()
  }).then(() => {
    console.log('promise1')
  }).then(() => {
    console.log('promise2')
  })
  console.log('script end') 
   //输出结果
    //script start
    //async2 end
    //Promise
    //script end
    //async1 end
    //promise1
    //promise2
    //setTimeout
```

尝试理清以上代码的执行顺序，解答如下：

```javascript
  console.log('script start')  //第1步 打印'script start'

  async function async1() {
    await async2() //第2.5步 运行async2 并把下一句代码推入microtasks队列 
    console.log('async1 end')
     //此处相当于 Promise.then(()=>{ console.log('async1 end') }) 第6步 打印
  }

  async function async2() {
    console.log('async2 end') //第3步 打印'async2 end'
  }

  async1() //第2步 运行async1
  
  setTimeout(() => { //第3.5步 将setTimeout推入macrotasks队列
    console.log('setTimeout') //第9步
  }, 0)

  new Promise(resolve => { 
    console.log('Promise') //第4步 打印'Promise' 
    // 注意：是Promise.then()之后的任务会被推入队列
    resolve()
  }).then(() => { //第4.5步 将后续Promise.then()推入microtasks队列
    console.log('promise1') //第7步
  }).then(() => {
    console.log('promise2') //第8步
  })
  console.log('script end') //第5步 打印'script end' 此时主线程完成，
                            // 接着将microtasks和macrotasks中的任务顺序执行
```
## 几种数组方法的区别

```javascript
let arr = [1, 2, 3, 4, 5, 6, 7]
```

- forEach()
```javascript
/**
* 没有返回值，只针对每个元素调用func
* 无法break, return终止循环
**/
arr.forEach((item, index) => {
  console.log(item) // 1, 2, 3, 4, 5, 6, 7
})
```

- map()
```javascript
/** 
* 有返回值，返回一个新的数组，每个元素为调用func后的结果
**/
let newArr = arr.map((item, index) => {
  return item * 2
})

console.log(newArr) // [2, 4, 6, 8, 10, 12, 14]
```

- some()
```javascript
/**
* 返回一个Boolean, 判断是否有元素符合func，如果有一个符合条件，就会终止循环，返回true
**/

arr.some((item, index) => {
  return item > 5 //true
})
```
- every()
```javascript
/**
* 返回一个Boolean，判断每一个元素是否都符合func，如果有一个不符合，就会终止循环，返回false
**/
arr.every((item, index) => {
  return item < 10
})
```
- filter()
```javascript
/** 
* 有返回值，返回一个符合func条件的数组的集合
**/
let newArr = arr.filter((item, index) => {
  return item > 3
})

console.log(newArr) // [4, 5, 6, 7]
```
- reduce()
```javascript
/**
* 让数组中的前项和后项做某种运算，并返回运算结果
**/
let res = arr.reduce((prev, next) => {
  return prev+next
})
console.log(res) //28
```
- find()
```javascript
/**
* 不创建新数组，不改变原数组
* 在判断中一旦某个元素符合func，立马跳出循环，返回当前符合条件的元素
**/
let res = arr.find((item, index) => {
  return item > 3
})

console.log(res) //4
```

## Array.reduce()

`Array.reduce()` 接收两个参数：一个是对数组每个元素执行的回调方法，一个是初始值。

回调方法接收4个参数，前两个参数是：`accumulator`是当前聚合值，`current`是数组循环时的当前元素。
无论当前返回什么值，都将作为累加器提供给循环中的下一个元素，初始值将作为第一次循环的累加器。
```javascript
let newArr = [].reduce((accumulator, current => {
  return accumulator
}), 0)
```
要理解 reducer 的第一点也是最重要的一点是它永远返回一个值，这个值可以是数字、字符串、数组或对象，但它始终只能是一个。reducer 对于很多场景都很适用，但是它们对于将一种逻辑应用到一组值中并最终得到一个单一结果的情况特别适用。
另外需要说明：reducer 本质上不会改变你的初始值；相反，它们会返回一些其他的东西。

- 数组求和
 ```javascript
let total = [1, 2, 3].reduce((sum, cur) => {
  return sum + cur
}, 0)
// 6
```

- 合并数据至单个数组
```javascript
let cats = [{name: 'Alex'}, {name: 'Bob',}, {name: 'Candy'}];
let weights = {Alex: '3.0kg', Bob: '2.5kg', Candy: '4.2kg'};

let newCats = cats.reduce((arr, cat) => {
  let key = cats.name;
  if (weights[key]) {
    cat.weight = weights[key]
  } else {
    cat.weight = '0kg'
  }
  arr.push(cat);
  return arr
}, [])
//给定一个空数组作为初始值
// [{name: 'Alex', weights: '3.0kg},...]
```
- 数组元素统计
```javascript
let nums = [1, 33, 2, 4, 1, 1, 33, 2, 5]
let counts = nums.reduce((obj, num) =>{
  obj[num] ? obj[num]++ : obj[num] = 1 //已存在该元素时+1，不存在时添加该元素并设为1
  return obj
}, {})
//给定一个空对象{}作为初始值
// {'1': 3, '2': 2, '4': 1, '5': 1, '33': 2}
```
- 数组扁平化
用 `reduce` 实现 `flat`
```javascript
let arr = [1, 2, 3, [4, 5, [6,7]], '8', {num: 9}]

const flat = arr => {
  return arr.reduce((pre, cur) => {
    return pre.concat(Array.isArray(cur) ? flat(cur) : cur); //递归展开
  }, []);
};
// [1, 2, 3, 4, 5, 6, 7, '8', {num: 9}]
```
> ES2019中引入了扁平化数组的新方法 `flat()`, 完整语法是：
```javascript
array.flat([depth]) //depth: 深度值 1 - Infinity

const deep = [1, 2, [3 , [4, 5, [6]]]]

deep.flat()         // [1, 2, 3 , [4, 5, [6]]
deep.flat(2)        // [1, 2, 3, 4, 5, [6]]
deep.flat(Infinity) // [1, 2, 3, 4, 5, 6]
```

## 数组去重
```javascript
let arr = [1, 1, 2, 2, 3 ,3];
arr = Array.from([...new Set(arr)])
// arr = [1, 2, 3]
```

## 深拷贝
```javascript
function deepCopy(source, target) {
  target = target || {};
  for (let i in source) {
    if (typeof source[i] === 'object') {
      target[i] = (source[i].constructor === Array) ? [] : {};
      deepCopy(source[i], target[i]) //递归
    } else  {
      target[i] = source[i]
    }
  }
  return target
}
```


## 正则校验
```javascript
let mobile = /^1[3|4|5|7|8|9][0-9]\d{8}$/ //手机号
let email = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/ //邮箱

export const validate = {
   isMobile(str) {
    mobile.test(str)
  },
  isEmail(str) {
     email.test(str)
  }
}
```
