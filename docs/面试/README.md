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
