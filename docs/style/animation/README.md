---
title: Animation
---

# 动画

Css 动画主要包括 `transform` `transition` 和 `animation` 三个属性

## 1. Transform

### 前置属性

#### transform-origin

用于指定元素变形的中心点，用法：`transform-origin: x-offset y-offset z-offset`。默认中心点为元素的正中心，即XYZ轴的50% 50% 0处。
可以通过该属性改变元素在XYZ轴的中心点。

`x-offset / y-offset`可以设置的值有：`top / right / bottom / left / center`, px值, %百分比。

`z-offset`只能设置px值。

<notes-css-animation type='1'/>

`transform-origin` 指定变形中心点对translate位移没有影响。translate位移始终相对于元素正中心进行位移。

#### transform-style

这个属性只有两个值`flat`和`preserve-3d`。用于指定舞台是2D或是3D。

#### perspective

指定3D的视距。默认值none表示无3D效果。

```css
.x {
    transform: perspective(200px) rotateX(60deg);
}
.y {
    transform: perspective(200px) rotateY(60deg);
}
.z {
    transform: perspective(200px) rotateZ(60deg);
}
```
<notes-css-animation type='2'/>

如果将`perspective(200px)`去掉：

<notes-css-animation type='3'/>

`perspective`只能设置px值，值越小表示用户眼睛距离屏幕越近，反之值越大距离越远。

![avatar](/stage.png)

<notes-css-animation type='4'/>

#### perspective-origin

设置视距的基点。

![avatar](/stage2.png)

基点的默认值是50% 50%即`center`，表示视距基点在中心点不进行任何位移。该属性同样应该定义在父元素上，适用于整个3D舞台，它需要和`perspective`属性结合使用。

![avatar](/stage3.png)

center 示例：

```css
.center {
    transform-style: preserve-3d;
    perspective: 100px;
    perspective-origin: center;
}
```

### 2D变换

### 3D变换

