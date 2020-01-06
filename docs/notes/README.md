---
title: JavaScript
---

# 常用方法

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
