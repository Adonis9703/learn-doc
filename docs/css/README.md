---
title: css
---
## 波浪

<wave/>

## 伪元素

<css-custom-nav/>

## 透视

<css-perspective/>

`perspective`属性有两种书写形式，一种是用在舞台元素上（动画元素的共同父级），
第二种就是用在当前动画元素上，与transform的其他属性现在一起。
```css
.stage {
    perspective: 600px;
}
```
或
```css
#stage .box {
    transform: perspective(600px) rotateY(45deg);
}
```

## 视差滚动

<css-disparity/>
