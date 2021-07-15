//https://juejin.cn/post/6844903806132568072
/**
 * @description 虚拟DOM元素的类，构建实例对象，用来描述DOM
 */
class Element {
  constructor(type, props, children) {
    this.type = type
    this.props = props
    this.children = children
  }
}

/**
 * 创建虚拟DOM， 返回虚拟节点
 * @param type 指定元素的标签类型，如li,div,a等
 * @param props 表示指定元素身上的属性，如class,style,自定义属性等
 * @param children 表示指定元素是否由子节点，参数以数组形式传入
 * @returns {Element}
 */
function createElement(type, props, children) {
  return new Element(type, props, children)
}


/**
 * render方法将虚拟DOM转化为真实DOM
 * @param domObj
 * @returns {any}
 */
function render(domObj) {
  //根据type类型来创建对应的元素
  let el = document.createElement(domObj.type)

  //遍历props属性对象，然后给创建的元素el设置属性
  for (const propsKey in domObj.props) {
    setAttr(el, propsKey, domObj.props[propsKey])
  }

  //遍历子节点
  //如果是虚拟DOM，就递归渲染
  //如果不是，就直接创建
  domObj.children.forEach(child => {
    child = (child instanceof Element) ? render(child) : document.createTextNode(child)
    //添加到对应元素内
    el.appendChild(child)
  })
  return el
}

/**
 * 设置节点属性
 * @param node
 * @param key
 * @param value
 */
function setAttr(node, key, value) {
  switch (key) {
    case 'value':
      //node是一个input或者textarea就直接设置其value即可
      if (node.tagName.toLowerCase() === 'input' || node.tagName.toLowerCase() === 'textarea') {
        node.value = value
      } else {
        node.setAttribute(key, value)
      }
      break
    case 'style':
      //直接赋值行内样式
      node.style.cssText = value
      break
    default:
      node.setAttribute(key, value)
      break
  }
}

//将元素插入到页面内
function renderDom(el, target) {
  target.appendChild(el)
}



let virtualDom = createElement('ul', {class: 'list'}, [
  createElement('li', {class: 'item'}, ['狗狗']),
  createElement('li', {class: 'item'}, ['猫猫']),
  createElement('li', {class: 'item'}, ['猪猪']),
])

console.log(virtualDom)

let el = render(virtualDom) //渲染虚拟DOM得到真实的DOM结构
console.log(el)
renderDom(el, document.getElementById('root'))



















