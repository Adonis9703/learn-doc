---
title: 面试记录
---

# 八股文
https://www.jianshu.com/p/48561530b519
promise.all
## 发布/订阅模式 & 观察者模式

发布/订阅模式和观察者模式最大的区别就是发布订阅模式有一个事件调度中心。

![avater](/model-1.png)

从图中可以看出，观察者模式中观察者和目标直接进行交互，而发布订阅模式中统一由调度中心进行处理，
订阅者和发布者互不干扰，这样一方面实现了解耦，另一方面可以实现更细粒度的一些控制。比如发布者
发布了很多消息，但是不想所有的订阅者都能接收，就可以在调度中心做一些控制，类似权限控制之类的，
还可以做一些节流操作。

### 发布/订阅模式

EventEmitter 本质上是一个发布订阅模式。
发布-订阅模式其实是一种对象间一对多的依赖关系，当一个对象的状态发送改变时，所有依赖于它的对象都将得到状态改变的通知。

订阅者（Subscriber）把自己想订阅的事件注册（Subscribe）到调度中心（Event Channel），当发布者（Publisher）发布该事件（Publish Event）到调度中心，也就是该事件触发时，由调度中心统一调度（Fire Event）订阅者注册到调度中心的处理代码。

```javascript
class EventEmitter {
  constructor() {
    this.events = {} //事件对象，存放订阅的名字和事件如：{click: [handle1, handle2]}  
  }
  
  //订阅事件的方法
  on(eventName, callback) {
    if (!this.events[eventName]) { //如果事件对象里没有则添加
      this.events[eventName] = [callback] //一个事件名可以订阅多个事件函数，所以用数组存放
    } else {
      this.events[eventName].push(callback)
    }
  }
  
  //触发事件的方法
  emit(eventName, ...args) {
    //遍历执行所有的订阅事件
    this.events[eventName] && this.events[eventName].forEach(fn => fn.apply(this, args))
  }
  
  //移除订阅事件
  off(eventName, callback) {
    if (this.events[name]) {
      this.events[eventName] = this.events[eventName].filter(fn => fn !== callback)
    } 
  }
  
  //只执行一次 然后移除
  once(eventName, callback) {
    const fn = (...args) => {
      callback.apply(this, args) //在fn中调用callback
      this.off(eventName, fn)
    }
    this.on(eventName, fn) 
  }
}

const event = new EventEmitter()
const handle = (...payload) => console.log(...payload)

event.on('check', handle)

event.emit('check', 'success') 
```

### 观察者模式

在观察者模式中，观察者需要直接订阅目标事件；在目标发出内容改变的事件后，直接接收事件并作出响应

```javascript
//观察者
class Observer {
  constructor() {}
  update(...args) {
    console.log('do something', args)
  }
}

//目标
class Subject {
  constructor() {
    this.observers = [] //维护一个观察者列表
  }
  //添加观察者
  add(observer) {
    this.observers.push(observer)
  }
  remove(observer) {
    this.observers = this.observers.filter(ob => ob !== observer)
  }
  //发布消息
  notify(...args) {
    this.observers.forEach(observer => observer.update(...args))
  }
}

const subject = new Subject()
subject.add(new Observer())
subject.add(new Observer())

subject.notify('a', 'b')
```

## 计算机网络

OSI参考模型

1. 物理层
2. 数据链路层
3. 网络层
4. 传输层
5. 会话层
6. 表示层
7. 应用层

### TCP和 UDP

#### TCP

TCP是传输层协议，为了准确无误的把数据传输给目标，通过TCP协议连接时需要先进行三次握手。

- 首先客户端要发送一个数据包告诉服务器要建立连接，根据上面我们了解到的控制位信息，建立连接需要把SYN置为1，seq指的是序号，是随机产生的。
- 然后服务器收到该数据包后，会为该TCP连接分配缓存和变量，缓存指的是一个字节流队列。（发送方和接收方都有这个队列，而且如果双方需要互相通信，那么双方都会有发送缓存和接收缓存），接着会返回一个确认报文，其中SYN控制位置为1，意思是允许建立连接，ACK是确认号，确认收到了发送方的包，并且会设一个seq序号，也为一个随机数。小写ack是确认号，也就是接下来希望发送方要发的数据从哪开始。
- 最后，客户端需要给服务器端返回一个确认，此时SYN控制位变为0，意思这不是建立连接的请求了，要正式发数据了，ACK是确认码，意思是收到了服务器的确认请求了。

释放连接需要四次挥手

- 客户端发起请求，请求断开链接。FIN=1，seq=u。u是之前传送过来的最后一个字节的序号+1。
- 服务器收到客户端的请求断开链接的报文之后，返回确认信息。ACK=1，seq=v，ack=u+1。这个时候，客户端不能给服务器发送信息报文，只能接收。但是服务器要是还有信息要传给服务器，仍然能传送。这里的v是什么意思呢，这就取决于服务器发送给客户端之前的一个包确认号是多少了。
- 当服务器也没有了可以传的信息之后，给客户端发送请求结束的报文。FIN=1，ACK=1，ack=u+1，seq=w。这里的w，跟上面的v是一个意思，为什么不都是v呢，因为这一步和上一步中间可能还在发数据呢，所以seq这个数据发送的字节流序号可能要变。
- 客户端接收到FIN=1的报文之后，返回确认报文，ACK=1，seq=u+1，ack=w+1。发送完毕之后，客户端进入等待状态，等待两个时间周期。关闭。

> 为什么是两个周期

- 客户端的最后一个ACK报文在传输的时候丢失，服务器并没有接收到这个报文。这个候时候服务器就会超时重传这个FIN消息，然后客户端就会重新返回最后一个ACK报文，等待两个时间周期，完成关闭。
- 如果不等待这两个时间周期，服务器重传的那条消息就不会收到。服务器就因为接收不到客户端的信息而无法正常关闭。

#### 区别

- TCP提供面向连接的可靠服务（需要三次握手），UDP提供无连接不可靠服务（想发就发，不会保证数据的完整性）
- TCP一对一，UDP可以多对多
- TCP适用于要求可靠传输的应用，如文件传输。UDP适用于实时应用，电话、视频等

### CDN 加速

CDN 可以加快用户访问网络资源的速度和稳定性，减轻源服务器的访问压力

## 浏览器原理

#### 浏览器是多进程的

1. Browser进程：浏览器的主进程，只有一个
- 负责浏览器界面显示，与用户交互
- 负责各个页面的管理，创建或销毁其他进程
- 将Renderer进程得到的内存中的Bitmap，会知道用户界面上
- 网络资源的管理，下载等

2. 第三方插件进程：每种类型的插件对应一个进程，仅当使用该插件时才会创建

3. GPU进程：用于3D绘制

4. 浏览器渲染进程（浏览器内核）:Renderer进程，内部是多线程的，默认每个Tab页面有一个进程，互不影响

#### 浏览器内核（渲染进程）

浏览器的渲染进程是多线程的

1. GUI渲染线程
- 负责渲染浏览器界面，解析HTML，CSS，构建DOM树和RenderObject树，布局和绘制等
- 当界面需要重绘（Repaint）或由于某种操作引发回流（reflow）时，该线程就会执行
- 注意：GUI渲染线程是和JS引擎线程互斥的，当JS引擎执行时，GUI线程会被挂起，GUI更新会被保存在一个队列中等到
JS引擎空闲时立即被执行

2. JS引擎线程
- 也被称为JS内核，负责处理Javascript脚本（例如V8引擎）
- JS引擎线程负责解析Javas脚本，运行代码
- JS引擎一直等待着任务队列中任务的到来，然后加以处理，每一个Tab页（render进程）中无论什么时候都仅有一个JS线程在运行JS程序
- 同样，JS线程和GUI线程是互斥的，所以如果JS执行时间过长，就会造成页面渲染异常，页面卡顿等问题

3. 事件触发线程
- 归属于浏览器而不是JS引擎，用来控制事件循环（可以理解为JS引擎自己都忙不过来，需要浏览器另开线程协助）
- 当JS引擎执行代码块如setTimeout（也可以是莱子浏览器内核的其他线程，如鼠标点击，异步请求等），会将对应的任务添加到事件线程中
- 当对应的事件符合触发条件被触发时，该线程会把事件添加到待处理队列的队尾，等待JS引擎处理
- 由于JS单线程的关系，所以这些待处理队列中的事件都得排队等待JS引擎处理（当JS引擎空闲时才会去执行）

4. 定时触发线程
- setInterval 和 setTimeout所在的线程
- 浏览器定时计数器并不是由JS引擎计数的，因为JS引擎是单线程的，如果处于组塞线程状态就会影响计时器的准确性

5. 异步http请求线程
- XMLHttpRequest在连接后是通过浏览器重新开一个线程请求
- 将检测到状态变更时，如果设置有回调函数，异步线程就会产生状态变更事件，将这个事件放入事件队列中，再由JS引擎处理。


## 浏览器渲染步骤

大致分为以下几个步骤
1. HTML被HTML解析器解析成DOM Tree, CSS则被CSS解析器解析成CSSOM Tree
2. DOM Tree 和 CSSOM Tree合并形成渲染树 Render Tree
3. 节点信息计算，这个过程被称为Layout 或 Reflow，即根据渲染树计算每个节点的几何信息
4. 渲染绘制（重绘），这个过程被称为(Painting 或者 Repaint)。即根据计算好的信息绘制整个页面。

以上4步简述浏览器的一次渲染过程，理论上，每一次的dom更改或者css几何属性更改，都会引起一次浏览器的重排/重绘过程，而如果是css的非几何属性更改，则只会引起重绘过程。所以说重排一定会引起重绘，而重绘不一定会引起重排。

#### 重绘和回流

当元素的样式发生改变时，浏览器需要触发更新，重新绘制元素。在这个过程中，有两种类型的操作，即重绘和回流。

- 重绘（repaint）：当元素样式的改变不影响布局时，浏览器将使用重绘对元素进行更新，此时由于只需要UI层面的重新像素绘制，因此*损耗较少*
- 回流（reflow）： 当元素的尺寸、结构或触发某些属性时，浏览器会重新渲染页面，称为回流。此时浏览器需要重新计算，计算后重新进行页面布局，
消耗较大。以下行为会触发回流操作：
    - 页面初次渲染
    - 浏览器窗口大小改变
    - 元素尺寸、位置、内容发生变化
    - 元素字体大小变化
    - 添加或删除可见的dom元素
    - 激活CSS伪类（:hover）
    - 查询某些属性或调用某些方法：
        - clientWidth, clientHeight, clientTop, clientLeft
        - offsetWidth, offsetHeight, offsetTop, offsetLeft
        - scrollWidth, scrollHeight, scrollTop, scrollLeft
        - getComputedStyle(), getBoundingClientReact
        - scrollTo()

*回流必定触发重绘，重绘不一定触发回流。重绘开销较小，回流代价较高*

#### 最佳实践

- css
    - 避免使用`table`布局
    - 将动画效果应用到`position`属性为`absolute`或`fixed`的元素上

- javascript
    - 避免频繁操作样式，可以汇总后统一修改
    - 尽量使用`class`进行样式修改
    - 减少`dom`的删减次数，可使用字符串或者`documentFragment`一次性插入

## 浏览器存储

cookie、localStorage受同源策略限制，也就是不同协议、域名、端口网页之间不能相互访问；sessionStorage每创建一个页面会创建独立的会话。

#### Cookie

- 一般由服务器生成，可以设置失效时间
- 如果在浏览器生成，默认是关闭浏览器后失效
- 4KB
- 每次都会携带在HTTP头中
- 用于标识用户身份

#### LocalStorage

- 除非被清楚，否则永久保留
- 一般5MB
- 仅在客户端保存

#### sessionStorage

- 仅在当前会话有效
- 关闭页面或浏览器后被清除
- 一般5MB
- 仅在客户端保存

## 常见状态码

- 100 Continue 接受，继续处理，一般在发送post请求时，已发送了http header之后服务端将返回此信息，表示确认，之后发送具体参数信息

- 200 OK       正常返回信息
- 201 Created  请求成功并且服务器创建了新的资源
- 202 Accepted 服务器已接受请求，但尚未处理

- 301 Moved Permanently 请求的网页已永久移动到新的位置
- 302 Found     临时性重定向
- 303 See Other 临时性重定向，且总是使用GET请求新的 URI
- 304 Not Modified 自从从上次请求后，请求的内容未修改过

- 400 Bad Request  服务器无法理解请求格式，客户端不应当尝试再次用同样的内容发起请求
- 401 Unauthorized 请求未授权
- 403 Forbidden    禁止访问
- 404 Not Found    找不到如何与URI 相匹配的资源

- 500 Internal Server Error 服务端错误
- 503 Service Unavailable   服务端暂时无法处理请求（过载或维护等） 

## 浏览器缓存策略

缓存分为强缓存和协商缓存。强缓存不过服务器，协商缓存需要过服务器，协商缓存返回的状态码是304。两类缓存机制可以同时存在，强缓存的优先级高于协商缓存。、
当执行强缓存时，如若缓存命中，则直接使用缓存数据库中的数据，不再进行缓存协商。

### 强缓存

#### Expires 

在HTTP/1.0时期，通过`Expires`来检查，而在HTTP/1.1中，使用的是`Cache-Control`。

`Expires`即过期时间，存在于服务端返回的*响应头*中，告诉浏览器在这个过期时间之前可以直接从缓存中获取数据而无需再次请求。

```
Expires: Wed, 22 Nov 2021 09:21:00 GMT
```
表示如果在上述时间过期后，需要向服务器重新请求资源。

由于使用的是绝对时间，如果服务端和客户端的时间产生偏差，那么会导致命中缓存产生偏差。

#### Cache-Control

在HTTP1.1中，采用了`Cache-Control`字段来控制缓存，其拥有很多属性：

- private：客户端可以缓存
- public：客户端和代理服务器都可以缓存
- max-age=t：缓存将在t秒后失效
- no-cache：需要使用协商缓存来验证缓存数据
- no-store：所有内容都不会缓存

请注意no-cache指令很多人误以为是不缓存，这是不准确的，no-cache的意思是可以缓存，但每次用应该去向服务器验证缓存是否可用。no-store才是不缓存内容。
当在首部字段Cache-Control 有指定 max-age 指令时，比起首部字段 Expires，会优先处理 max-age 指令。命中强缓存的表现形式：Firefox浏览器表现为一个灰色的200状态码。
Chrome浏览器状态码表现为200 (from disk cache)或是200 OK (from memory cache)。

### 协商缓存

协商缓存需要进行对比判断是否可以使用缓存。浏览器第一次请求数据时，服务器会将缓存标识与数据一起响应给客户端，客户端将它们备份至缓存中。
再次请求时，客户端会将缓存中的标识发送给服务器，服务器根据此标识判断。若未失效，返回304状态码，浏览器拿到此状态码就可以直接使用缓存数据了。

**Last-Modified**：服务器在响应请求时，会告诉浏览器资源的最后修改时间。

**if-Modified-Since**：浏览器再次请求服务器的时候，请求头会包含此字段，后面跟着在缓存中获得的最后修改时间。服务端收到此请求头发现有if-Modified-Since，
则与被请求资源的最后修改时间进行对比，如果一致则返回304和响应报文头，浏览器只需要从缓存中获取信息即可。  
- 如果真的被修改，那么开始传输响应一个整体，服务器返回：200 OK
- 如果没有被修改，那么只需传输响应header，服务器返回：304 Not Modified

**if-Unmodified-Since**：从某个时间点算起，文件是否没有被修改，使用的相对时间，不需要关心客户端和服务端的时间偏差。
- 如果没有被修改：则开始继续传送文件，服务器返回200 OK
- 如果文件被修改：则不传输，服务器返回412 Precondition failed（预处理错误）

这两个的区别是：一个是修改了才下载，另一个是没修改才下载。如果在服务器上，一个资源被修改了，但其实际内容根本没有发生改变，，会因为Last-Modified时间
匹配不上而返回了整个实体给客户端（即使客户端缓存里有一模一样的资源）。为了解决这个问题，HTTP1.1推出了Etag。

**E-tag**：服务器相应请求时，通过此字段告诉浏览器当前资源在服务器生产的唯一标识（生成规则由服务器决定）。

**if-Match**：条件请求，携带上一次请求中资源的ETag，服务器根据这个字段判断文件是否有新的修改。

**if-None-Match**：再次请求服务器时，浏览器的请求报文头部会包含此字段，后面的值为在缓存中获取的标识。服务器接收到此报文后发现`if-None-Match`则与
被请求资源的唯一标识进行对比。
- 不同，说明资源被改动，则响应整个资源内容，返回状态码200。
- 相同，说明资源无需修改，则响应header，浏览器直接从缓存中获取数据信息。返回状态码304。

但是实际应用中由于Etag的计算是使用算法来得出的，而算法会占用服务端计算的资源，所有服务端的资源都是宝贵的，所以就很少使用Etag了。

- 发起请求前，浏览器发现缓存中有这个文件，则不发起请求，直接从缓存中获取
- F5就是告诉浏览器，别偷懒，好歹去服务器看看这个文件是否有过期了。于是浏览器就胆胆襟襟的发送一个请求带上If-Modify-since
- Ctrl+F5告诉浏览器，你先把你缓存中的这个文件给我删了，然后再去服务器请求个完整的资源文件下来。于是客户端就完成了强行更新的操作

#### 缓存过程

1. 浏览器第一次加载资源，服务器返回200，浏览器将资源文件从服务器下载下来，并把response header 及该请求的返回时间一并缓存
2. 下一次加载资源时，先比较当前时间和上一次返回200时的时间差，如果没有超过`cache-control`设置的`max-age`，则缓存没有过期，命中
强缓存，不发起请求，直接从本地缓存中获取资源；如果过期了，则向服务器发送header中带有`if-None-Match`和`if-Modified-Since`的请求
3. 服务器收到请求后，优先根据`E-tag`的值判断被请求的文件有没有被修改，如果`Etag`值一致则没有修改，命中协商缓存，返回304；如果不一致则
返回新的资源文件并带上新的`E-tag`值并返回200
4. 如果服务器收到的请求没有`E-tag`值，则将`if-Modified-Since`和被请求文件的最后修改时间做对比，一致则命中协商缓存，返回304；
不一致则返回新的`last-modified`和文件并返回200


## Promise

> Promise 是异步编程的一种解决方案。

`Promise`对象有以下两个特点

1. 对象的状态不受外界影响。`Promise`对象代表一个异步操作，有三种状态：`pending`（进行中），`fulfilled`（已成功），
和`reject`（失败）。只有异步操作的结果，可以决定当前是哪一种状态，其他任何操作都无法改变这个状态。
2. 状态一旦改变，就不会再次改变。`Promise`对象的状态改变只有两种可能：从pending变为fulfilled和从pending变为
rejected，当状态确定后就会一直保持这个结果，此时成为resolved()

```javascript
let promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    if (Math.random() > 0.5) {
      resolve('resolved')
    } else {
      reject('rejected')
    }
  }, 1000)
})

promise.then(res => {
  console.log(res) //resolved
}, err => {
  console.log(err) //rejected
})
```

## 手写一个Promise

首先了解Promise的基本特征：

1. promise有三种状态：`pending`，`fulfilled`，和`rejected`
2. new promise时，需要传递一个`executor()`执行器，执行器立刻执行
3. `executror`接受两个参数，分别是`resolve`和reject
4. promise的默认状态是`pending`
5. promise需要一个字段保存成功状态的值resolved
6. promise需要一个字段保存失败的状态rejected
7. promise只能从`pending`到`rejected`，或者从`pending`到`fulfilled`，状态一旦确认，
就不会再改变
8. promise必须有一个`then`方法，`then`接受两个参数，分别是成功的回调`onFulfilled`和失败的回调`onRejected`
9. 如果调用`then`时，promise已经成功，则执行`onFulfilled`，参数是promise的成功字段resolved
10. 如果调用`then`时，promise已经失败，则执行`onRejected`，参数是promise的失败字段rejected
11. 如果then中抛出了异常，那么就会把这个异常作为参数，传递给下一个then的失败的回调`onRejected`


```javascript
class mPromise {
  constructor(executor) {
    this.status = 'pending' //默认为pending
    this.resolved = undefined //成功状态 默认为undefined
    this.rejected = undefined //失败状态 默认为undefined
   
    this.onResolvedCallbacks = [] //存放成功的回调
    this.onRejectedCallbacks = [] //存放失败的回调
    
    let resolve = resolved => { //成功的方法
      if (this.status === 'pending') {
        this.status = 'fulfilled'
        this.resolved = resolved
        this.onResolvedCallbacks.forEach(fn => fn()) //依次执行回调函数
      } 
    }
    
    let reject = rejected => {
      if (this.status === 'pending') {
        this.status = 'rejected'
        this.rejected = rejected
        this.onRejectedCallbacks.forEach(fn => fn())
      } 
    }
    
    try {
      executor(resolve, reject) //尝试执行，将resolve和reject函数传给使用者
    } catch (e) {
      reject(e)
    }
  }
  
  //定义一个then方法，并接受两个参数，分别是成功和失败的回调。
  then(onFulFilled, onRejected) {
    if (this.status === 'fulfilled') {
      onFulFilled(this.resolved)
    } 
    if (this.status === 'rejected') {
      onRejected(this.rejected)
    } 
    // 如果promise的状态是 pending，需要将 onFulfilled 和 onRejected 函数存放起来，等待状态确定后，再依次将对应的函数执行
   if (this.status === 'pending') {
     this.onResolvedCallbacks.push(() => {
       onFulFilled(this.resolved)
     })
     this.onRejectedCallbacks.push(() => {
       onRejected(this.rejected)
     })
   }
  }
}

const promise = new mPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功')
  }, 1000)
}).then(res => {
  console.log('success', res)
}, err => {
})
```

## 实现一个类

通过构造函数

```javascript
function Animal(name, age, color) {
  this.name = name
  this.age = age
  this.color = color
  //实例方法
  this.checkColor = function () {
    console.log('kind: ' + color)
  }
}
//原型方法
Animal.prototype.printInfo = function() {
  console.log('name:'+ this.name + ' age:' + this.age)
}

let cat = new Animal('Pound', 2, 'white')

cat.printInfo()
cat.checkColor()
```

ES6 语法糖 `class`

```javascript
class Person {
  constructor(name, age) {
    this.name = name
    this.age = age
  }
  printInfo() {
    console.log('name:'+ this.name + ' age:' + this.age)
  }
}

let me = new Person('adonis', 24)
me.printInfo()
```

## 原型和原型链

如何理解原型，先记住并理解下面的几条：

- 所有的引用类型（数组、对象、函数），都具有对象特性，即可自由扩展属性（null除外）
- 所有的引用类型（数组、对象、函数），都有一个`__proto__`属性，属性值是一个普通的对象
- 所有的函数，都有一个`prototype`属性，属性值也是一个普通的对象
- 所有的引用类型（数组、对象、函数），`__proto__`属性值指向它的构造函数的`prototype`属性

```javascript
let obj = {}
obj.a = 100

let arr = []
arr.push(1)
arr.a = 100
arr.b = 200

function func() {}
func.a = 100

console.log(obj, arr, func)
console.log(obj.__proto__) //引用类型的__proto__指向它的构造函数的prototype
console.log(Object.prototype) //Object() 是 obj 的构造函数
console.log(obj.__proto__ === Object.prototype) //true
console.log(arr.__proto__)
console.log(func.__proto__)
console.log(func.prototype) //函数具有 prototype
```
#### 原型
示例如下

```javascript
function Foo(name, age) {
  this.name = name
  this.age = age
}
Foo.prototype.printName = function () {
  console.log(this.name)
}

let obj = new Foo('Adonis', 10)

obj.printAge = function () {
  console.log(this.age)
}

obj.printAge()  //10
console.log(obj) // {name: 'Adonis', age: 10, printAge: f}
obj.printName() // Adonis
```
当试图获得一个对象的某个属性时，如果这个对象本身没有这个属性，那么会去它的`__proto__`(即它的构造函数的`prototype`)
中寻找，因此`obj.printName`就会找到 `Foo.prototype.printName`

那么如何判断某个属性是否是对象本身的属性？可以使用 `hasOwnProperty`，常用于遍历一个对象的时候。
```javascript
for(const item in obj) {
  //某些高级浏览器已经在for in 中屏蔽了来自原型的属性，但这里加上判断可以保证代码的健壮性
  if (obj.hasOwnProperty(item)) {
    console.log(item + ':' + obj[item])
  }
}
```

#### 原型链
接上述的例子
```javascript
console.log(obj.toString()) //[object Object]
```
因为obj本身没有`toString`，并且`obj.__proto__`（`Foo.prototype`）也没有`toString`，因此将继续在`obj.__proto__.__proto__`中寻找。

1. `obj.__proto__ `即`Foo.prototype`，没有`toString`，继续向上寻找
2. `obj.__proto__.__proto__ `即`Foo.prototype.__proto__`，即普通的Object对象，因此`Foo.prototype.__proto__ `=== `Object.prototype`,在这里可以找到`toString`
3. 因此`obj.toString` 最终对应的是`Object.prototype.toString`

这样一直往上找，你会发现是一个链式的结构，所以叫做“原型链”。如果一直找到最上层都没有找到，那么就宣告失败，返回`undefined`。
## Call Apply Bind

可以通过`call`、`apply`、`bind`来改变函数调用时的上下文。

```javascript
function Fruits() {}

Fruits.prototype = {
  color: 'red',
  say: function () {
    console.log(this.color)
  }
}
let apple = new Fruits()

apple.say() //red

let banana = {color: 'yellow'}

apple.say.call(banana) //yellow
apple.say.apply(banana) //yellow

let arr1 = [12, 'foo']
let arr2 = ['bar', 20]

Array.prototype.push.call(arr1, 'add', 123123)
Array.prototype.pop.apply(arr2)

console.log(arr1, arr2) //[12, 'foo', 'add', 123123] ['bar']

let Bar = function () {
  console.log(this.x)
}
let foo = {x: 100}

let newFunc = Bar.bind(foo)
newFunc() //100
```

## 继承

首先定义一个父类

```javascript
function Animal(name, age, color) {
  this.name = name
  this.age = age
  this.color = color
  //实例方法
  this.checkColor = function () {
    console.log('kind: ' + color)
  }
}
//原型方法
Animal.prototype.printInfo = function() {
  console.log('name:'+ this.name + ' age:' + this.age)
}
```

1. 构造函数绑定

```javascript
function Cat(name, age, color) {
  Animal.apply(this, arguments)
}
let pound = new Cat('pound', 2, 'white')
pound.checkColor()
console.log(pound)
```

2. 原型链继承

```javascript
Cat.prototype = new Animal()
Cat.prototype.name = 'newPound'

let cat = new Cat()
console.log(cat)
```

3. 实例继承（原型式继承）

```javascript
function Cat(name, age, color) {
  return new Animal(...arguments)
}
let pound = new Cat('pound', 2, 'white')
console.log(pound)
```

4.组合继承

```javascript
function Cat(name, age, color) {
  Animal.apply(this, arguments)
}
Cat.prototype = new Animal()
Cat.prototype.constructor = Cat

let pound = new Cat('pound', 2, 'white')
console.log(pound)
```

5. 寄生组合继承

```javascript
function Cat() {
  //继承父类属性
  Animal.apply(this, arguments)
}

(function () {
  //创建空类
  let Super = function () {
  }
  Super.prototype = Animal.prototype
  //父类的实例作为子类的原型
  Cat.prototype = new Super()
})()
//修复构造函数指向问题
Cat.prototype.constructor = Cat
let pound = new Cat('pound', 2, 'white')
console.log(pound)
```

6. ES6`extends`继承

```javascript
class Animal {
  constructor(name, age, color) {
    this.name = name
    this.age = age
    this.color = color
  }

  checkColor() {
    console.log('color: ' + this.color)
  }
}

class Cat extends Animal {
  constructor(name, age, color) {
    super(...arguments)
  }

  checkColor() {
    super.checkColor()
  }
}

let pound = new Cat('pound', 2, 'white')

console.log(pound)
```

## 函数柯里化

> 柯里化又称部分求值，核心思想是把多参数传入的函数拆成单参数（或部分）函数，内部再返回调用下一个参数的函数，以此依次处理剩余参数。

柯里化有三个常见的作用：
1. 参数复用
2. 提前返回
3. 延迟计算/运行

```javascript
function plus(a, b, c) {
  return a+b+c
}
function add(a) {
  return function(b) {
    return function(c) {
      return a + b + c 
    }
  }
}
const Add = a => {
  return b => {
    return c => {
      return a + b + c
    }
  }
}

const ADD = (a, a1 = 0) => (b, b1 = 0) => c => (a+ a1 + b + b1 + c)
 

console.log(plus(1,2,3))  //6
console.log(add(1)(2)(3)) //6
console.log(Add(1)(2)(3)) //6
console.log(ADD(1, 2)(3, 4)(5)) //15
```
柯里化 封装正则
```javascript
function check(reg, txt) {
  return reg.test(txt)
}

check(/[a-z]/g, 'test') //true

function curryCheck(reg) {
  return function (txt) {
    return reg.test(txt)
  }
}

let checkNumber = curryCheck(/[0-9]/g)
let checkChars = curryCheck(/[a-z]/g)

console.log(checkNumber('123asd')) //true
console.log(checkChars('123asd'))  //true
```

## 函数的四种调用方式

一般形式函数调用

```javascript
function Func(x, y) {
  return x * y
}

console.log(Func(1, 2))

function Func2(x) {
  return function (y) {
    return x * y
  }
}

console.log(Func2(1)(2))
```
作为对象方法调用
```javascript
let obj = {
  val: 0,
  plus: function (n) {
    this.val += typeof n === 'number' ? n : 1
  }
}

obj.plus()
console.log(obj.val)

obj.plus(2)
console.log(obj.val)
```
使用`call`, `apply`
```javascript
function Func(x, y) {
return x + y
}

console.log(Func.call(null, 1, 2))
console.log(Func.apply(null, [1, 2]))
```
`new`命令间接调用
```javascript
function Func(x, y) {
  console.log(x + y)
}

let newF = new Func(1, 2)
```

## 防抖
> 触发高频事件后n秒内函数只会执行一次，如果n秒内高频事件在此触发，则重新计算时间

```html
<div>
    <button id="btn">防抖</button>
</div>
```
```javascript
function debounce(fn) {
  let timer = null //创建一个标记用来存放定时器
  return function () {
    clearTimeout(timer) //每当用户操作的时候便清除定时器
    timer = setTimeout(() => { //创建一个新的定时器
      fn.apply(this, arguments) //为了确保上下文环境为当前this，不能直接用fn
    }, 500)
  }
}

function check() {
  console.log('防抖测试')
}

let btn = document.getElementById('btn')
btn.addEventListener('click', debounce(check))
```
## 节流
> 高频事件触发 但在n秒内只会执行一次，所以节流会稀释函数的执行频率

```javascript
function throttle(fn) {
  let canRun = true //标记是否可以进行 //此处为闭包
  return function () {
    if (!canRun) return
    canRun = false
    setTimeout(() => { //将传入的方法放在setTimeout中执行
      // fn.apply(this, arguments)
      fn.apply(this, arguments)
      //关键在第一个参数，为了确保上下文环境为当前的this，所以不能直接用fn。
      // 最后在setTimeout执行完毕后再把标记设置为true
      //(关键)表示可以执行下一次循环了。
      //当定时器没有执行的时候标记永远是false，在开头被return掉
      canRun = true
    }, 500)
  }
}

function checkThrottle() {
  console.log('节流测试')
}

let btn2 = document.getElementById('btn2')
btn2.addEventListener('click', throttle(checkThrottle))
```



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

## css 优先级

不同级别下：
1. 在属性后使用`!important`会覆盖页面内任何位置定义的元素样式。
2. 行内样式
3. id选择器
4. class类选择器
5. 标签选择器
6. 通配符选择器
7. 浏览器默认属性

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

## 如何间隔1s输出内容

```javascript
const list = [1, 2, 3]
const square = num => {
  return new Promise((resolve,reject) => {
    setTimeout(()=> {
      resolve(num * num)
    }, 1000)
  })
}
async function test() {
  for (let i = 0; i < list.length; i++) {
    let res = await square(list[i])
    console.log(res)
  }
  // list.forEach(async x => {
  //   const res = await square(x)
  //   console.log(res)
  // })
}
test()
```
如果使用`forEach`循环，会导致在一秒后同时输出
