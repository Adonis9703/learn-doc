---
title: 面试记录
---

# 面经

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
