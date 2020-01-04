---
title: Vue 相关
---

# Vue 相关

## eventHub

eventHub || eventBus 用于不同组件实例间的数据传递

新增eventHub.js
```javascript
//eventHub.js
import Vue from 'vue'

const eventHub = new Vue()
export default eventHub
```

在A组件中
```javascript
//pageA.vue
import eventHub from '@/eventHub.js'

export default {
  methods: {
    test() {
      eventHub.$emit('test', 'hello')
    }
  }
}
```
在B组件中
```javascript
//pageB.vue
import eventHub from '@/eventHub.js'

export default {
  created() {
    eventHub.$on('test', this.callback)
  },
  methods: {
    callback(value) {
      console.log(value)
    }
  }
}
```
