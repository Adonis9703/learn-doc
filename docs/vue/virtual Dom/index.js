//https://juejin.cn/post/6844903806132568072
/******************************* virtual Dom start *******************************/

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

/******************************* virtual Dom end *******************************/

/******************************* diff start *******************************/

function diff(oldTree, newTree) {
  //声明变量patches用来存放补丁的对象
  let patches = {}
  //第一次比较应该是树的第0个索引
  let index = 0
  //递归树 比较过的结果放到补丁里
  walk(oldTree, newTree, index, patches)
  return patches
}

function walk(oldNode, newNode, index, patches) {
  //每一个元素都有一个补丁
  let current = []
  if (!newNode) { //新的DOM节点不存在
    current.push({type: 'REMOVE', index})
  } else if (isString(oldNode) && isString(newNode)) {
    //判断文本是否一致
    if (oldNode !== newNode) {
      current.push({type: 'TEXT', text: newNode})
    }
  } else if (oldNode.type === newNode.type) {
    //比较属性是否有更改
    let attr = diffAttr(oldNode.props, newNode.props)
    if (Object.keys(attr).length > 0) {
      current.push({type: 'ATTR', attr})
    }
    //如果有子节点，遍历子节点
    diffChildren(oldNode.children, newNode.children, patches)
  } else { //说明节点背替换了
    current.push({type: 'REPLACE', newNode})
  }
  
  //当前元素确实有补丁存在
  if (current.length) {
    //将元素和补丁对应起来，放到大补丁包中
    patches[index] = current
  }
}

function isString(obj) {
  return typeof obj === 'string'
}

function diffAttr(oldAttrs, newAttrs) {
  let patch = {}
  //判断新老属性的关系
  for (let key in oldAttrs) {
    if (oldAttrs[key] !== newAttrs[key]) {
      patch[key] = newAttrs[key] //有可能还是undefined
    }
  }
  for (let key in newAttrs) {
    if (!oldAttrs.hasOwnProperty(key)) {
      patch[key] = newAttrs[key]
    }
  }
  return patch
}

//所有都基于一个序号来实现
let num = 0

function diffChildren(oldChildren, newChildren, patches) {
  // 比较老的第一个和新的第一个
  oldChildren.forEach((child, index) => {
    walk(child, newChildren[index], ++num, patches)
  })
}

/******************************* diff end *******************************/

/******************************* patch start *******************************/

let allPatches
let index = 0 //默认哪个需要打补丁

function patch(node, patches) {
  allPatches = patches
  patchWalk(node)
}

function patchWalk(node) {
  let current = allPatches[index++]
  let childNodes = node.childNodes
  
  //先序深度，继续遍历递归子节点
  childNodes.forEach(child => patchWalk(child))
  
  if (current) {
    doPatch(node, current) //打补丁
  }
}

function doPatch(node, patches) {
  //遍历所有打过的补丁
  patches.forEach(patch => {
    switch (patch.type) {
      case 'ATTR':
        for (const key in patch.attr) {
          let val = patch.attr[key]
          if (val) {
            setAttr(node, key, val)
          } else {
            node.removeAttribute(key)
          }
        }
        break;
      case 'TEXT':
        node.textContent = patch.text
        break
      case 'REPLACE':
        let newNode = patch.newNode
        newNode = (newNode instanceof Element) ? render(newNode) : document.createTextNode(newNode)
        node.parentNode.replaceChild(newNode, node)
        break
      case 'REMOVE':
        node.parentNode.removeChild(node)
        break
      default:
        break
    }
  })
}
/******************************* patch end *******************************/

// let virtualDom = createElement('ul', {class: 'list'}, [
//   createElement('li', {class: 'item'}, ['狗狗']),
//   createElement('li', {class: 'item'}, ['猫猫']),
//   createElement('li', {class: 'item'}, ['猪猪']),
// ])


let virtualDom2 = createElement('ul', {class: 'list'}, [
  createElement('li', {class: 'item active'},  ['狗狗']),
  createElement('li', {class: 'item'}, ['英镑']),
  createElement('li', {class: 'item'}, [createElement('h1', {class: 'item'}, ['新猪猪'])]),
])

let patches = diff(virtualDom, virtualDom2)

console.log('patch',patches)

patch(el, patches)











