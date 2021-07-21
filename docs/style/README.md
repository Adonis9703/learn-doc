---
title: CSS 相关
---

# CSS 技巧

## 如何实现三角形

使用CSS盒模型中的border即可实现三角形

####实现原理

首先来看在为元素添加厚边框时的样子

```css
.tri {
   width: 100px;
   height: 100px;
   border: 80px solid;
   border-color: #63e6eb #474cff #c895ab #ffc171;
}
```
![avater](/tri-1.png)

如果将元素的宽高设为0
 ```css
.tri {
   width: 0;
   height: 0;
   border: 80px solid;
   border-color: #63e6eb #474cff #c895ab #ffc171;
}
```
![avater](/tri-2.png)
 
由图可见，元素的border其实是由三角形拼接而成，所以如果想要得到三角形，只需将其中的三个边框设置为透明色
 
 ```css
.tri {
        width: 0px;
        height: 0px;
        border: 80px solid;
        border-color: transparent transparent #ffc171 ;
    }
```
![avater](/tri-3.png)

如果将某一边的border设为0，就可以得到以下效果

```css
.tri {
        width: 0px;
        height: 0px;
        border: 80px solid;
        border-left: 0;
        border-color: transparent transparent #ffc171 ;
    }
```
![avater](/tri-4.png)

## 画半圆

```css
.half-circle {
        width: 100px;
        height: 50px;
        background-color: #409eff;
        border-radius: 50px 50px 0 0;
    }
```
![avater](/half-circle.png)