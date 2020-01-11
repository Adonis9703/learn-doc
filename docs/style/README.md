---
title: Style
---

# STYLE

## Flex

使用flex布局首先要设置父容器 `display: flex`，然后再设置 `justify-content: center` 实现水平居中，最后设置 `align-items: center`实现垂直居中。

flex的核心概念是 **容器** 和 **轴**。容器包括外层的 **父容器** 和 内层的 **子容器**，轴包括 **主轴** 和 **交叉轴**。
flex布局涉及到12个CSS属性（不含display: flex），其中父容器、子容器各6个。常用的属性只有4个，父子各2各。

### 1.容器

父级可以统一设置子容器的排列方式，子容器也可以单独设置自身的排列方式，同时设置时以子容器为准。

#### 父容器

1. 设置子容器沿主轴排列：**justify-content**

`justify-content` 属性用于定义如何沿着主轴方向排列子容器。

```css
.parent {
    display: flex;
    align-items: center;
    justify-content: center | space-around | space-between | flex-start | flex-end;
}
```
- **center**：居中对齐

<notes-css-flex type="1"/>

- **space-around**：子容器沿主轴均匀分布，位于首尾两端的子容器到父容器的距离是子容器间距的一半。

<notes-css-flex type="3"/>

- **space-between**：子容器沿主轴均匀分布，位于首尾两端的子容器与父容器相切。

<notes-css-flex type="2"/>

- **flex-start**：起始端对齐

<notes-css-flex type="4"/>

- **flex-end**：末尾端对齐

<notes-css-flex type="5"/>

2. 设置子容器如何沿交叉轴排列：**align-item**

`align-items`属性用于定义如何沿着交叉轴方向分配子容器的间距。

```css
.parent {
    display: flex;
    justify-content: space-around;
    align-items: center | baseline | stretch | flex-start | flex-end;
}
```
- **center**：居中对齐

<notes-css-flex type="6"/>

- **baseline**：基线对齐，这里的 `baseline` 默认是指首行文字，即 `first baseline`，所有子容器向基线对齐，
交叉轴起点到元素元素基线距离最大的子容器将会于交叉轴起始端相切以确定基线。

<notes-css-flex type="7"/>

- **stretch**：子容器沿交叉轴方向的尺寸拉伸至父容器一致，若子容器设定高则无效。

<notes-css-flex type="8"/>

- **flex-start**：起始端对齐

<notes-css-flex type="9"/>

- **flex-end**：末尾端对齐

<notes-css-flex type="10"/>

#### 子容器

1. 在主轴上如何伸缩：**flex**

子容器是有弹性的，它们会自动填充剩余空间，子容器的伸缩比例由 `flex` 属性确定。

`flex`的值可以试无单位数字（1，2，3），也可以是有单位数字（15px，30px），还可以是 `none`关键字。
子容器会按照 `flex` 定义的尺寸比例自动伸缩，如果取值为 `none` 则不伸缩。

<notes-css-flex type="11"/>

2. 单独设置子容器如何沿交叉轴排列：**align-self**

每个子容器也可以单独定义沿交叉轴排列的方式，此属性的可选值与父容器 align-items 属性完全一致，如果两者同时设置则以子容器的 align-self 属性为准。

```css
.parent {
    display: flex;
    align-items: center;
}
.child {
    align-self: flex-start;
}
```
<notes-css-flex type="12"/>

### 2.轴

轴包括**主轴**和**交叉轴**，`justify-content`属性决定子容器沿主轴的排列方式，`align-items`属性决定子容器沿着交叉轴的排列方式。
在flex布局中，`flex-direction`属性决定主轴的方向，交叉轴的方向由主轴确定。

![avatar](/axis.png)

 #### 主轴
 
 主轴的起始端由`flex-start`表示，末尾端由`flex-end`表示。不同的主轴方向对应的起始端、末尾端的位置也不同。
 
 ```css
.parent {
    display: flex;
    flex-direction: row（向右）| column（向下） | row-reverse（向左）| column-reverse（向上）
}
```
- **row**

<notes-css-flex type="13"/>

- **row-reverse**

<notes-css-flex type="15"/>

- **column**

<notes-css-flex type="14"/>

- **column-reverse**

<notes-css-flex type="16"/>

## Flex进阶

#### 父容器

1. 设置换行方式：**flex-wrap**

决定子容器是否换行排列，不但可以顺序换行而且支持逆序换行。

```css
.parent {
    display: flex;
    flex-wrap: nowrap | wrap | wrap-reverse
}
```
- **nowrap**：不换行

<notes-css-flex type="17"/>

- **wrap**：换行

<notes-css-flex type="18"/>

- **wrap-reverse**：逆序换行

<notes-css-flex type="19"/>

2. 多行沿交叉轴对齐：**align-content**

当子容器多行排列时，设置行与行之间的对齐方式。

```css
.parent {
    display: flex;
    align-content: center | space-around | space-between | flex-start | flex-end | stretch;
}
```
- **center**： 居中

<notes-css-flex type="20"/>

- **space-around**：等边距均匀分布

<notes-css-flex type="21"/>

- **space-spacebetween**：等间距均匀分布

<notes-css-flex type="22"/>

- **flex-start**：起始端对齐

<notes-css-flex type="23"/>

- **flex-end**：末尾端对齐

<notes-css-flex type="24"/>

- **stretch**：拉伸对齐

<notes-css-flex type="25"/>

#### 子容器

1. 设置基准大小：flex-basis

2. 设置扩展比例：flex-grow

3. 设置收缩比例：flex-shrink
