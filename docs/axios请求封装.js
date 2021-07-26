import axios from 'axios'
// import Qs from 'qs'
import {cookies} from '../utils/cookies'

import { Loading, Message } from 'element-ui'
import { logger,widget } from '@/utils/index'
import {apis} from '@/request/api'
export const setURL = (url, args) => {
  if (typeof url === 'undefined') { throw 'no url!' }
  if (!args) return url;
  for (var i = 0; i < args.length; i++) {
    if (url.indexOf('{?}') < 0) {
      break
    }
    url = url.replace(/\{\?\}/, args[i] + '');
  }
  // 最后是否有/{?}
  if (url.lastIndexOf('/{?}') > -1) {
    url = url.substr(0, url.lastIndexOf('/{?}'));
  }
  return url;
}

const postBase = {
  // 请求的接口，在请求的时候，如axios.get(url,config);这里的url会覆盖掉config中的url
  url: '/post',
  // 请求方法同上
//   transformRequest: [
//     function (data) {
//       // 这里可以在发送请求之前对请求数据做处理，比如form-data格式化等，这里可以使用开头引入的Qs（这个模块在安装axios的时候就已经安装了，不需要另外安装）
//       data = Qs.stringify(data)
//       return data
//     }
//   ],
//   paramsSerializer: function (params) {
//     return Qs.stringify(params)
//   },
  // 请求头信息
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset-utf-8'
  },
  // 设置超时时间
  timeout: 500000,
  // `withCredentials` 表示跨域请求时是否需要使用凭证
  withCredentials: true, // default
  // 返回数据类型
  responseType: 'json' // default
}


const postBaseResponseText = { ...postBase, responseType: 'text' }

const postBaseJsontype = {...postBase,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
}

const postFile = {...postBase,
  timeout: 1800000,
  // 请求头信息
  headers: {
    'Content-Type': 'multipart/form-data'
  }
}

const postResArraybuffer = {...postBase,
  // 请求头信息
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  },
  // 返回数据类型
  responseType: 'arraybuffer'
}
/**
 * option {
    isLoading: boolean true 菊花， false， 没有菊花（ 相当于无声请求）
    loadingTarget: 覆盖的元素,默认是ts - main - content, 传入body全屏
    loadingText: 请稍等...
    url: '' //可以传apiurl中的key, 也可以传整个url
    param: 作为post数据传过去，json对象或者字符串, 如果是字符串那么可能是body形式传过去，
    postType: postBase//不写默认 text:postBase_responseText json postBase_jsontype file: post_File, arraybuffer: post_resArraybuffer
  }
  返回 Promise
 */
let loading
export const post = (option) => {
  let url = setURL(option.url, option.requestParam)
  let isLoading = option.isLoading
  if (isLoading) {
    if (loading) {
      loading.close()
    }
    loading = Loading.service({
      lock: true,
      text: option.loadingText ? option.loadingText : '加载中...',
      spinner: 'el-icon-ts-loading',
      // background: 'rgba(0, 0, 0, 0.7)',
      target: option.loadingTarget ? option.loadingTarget : '.ts-main-content'
    })
  }
  let param

  if (option.param) {
    if (typeof option.param === 'string') {
      param = option.param
    } else {
      if (option.postType === 'json' || option.postType === 'file') {
        param = option.param
      } else {
        param = new URLSearchParams()
        for (let x in option.param) {
          param.append(x, option.param[x])
        }
      }
    }
  }
  if (option.query && typeof option.query === 'object') {
    let queryString = ''
    let keyList = Object.keys(option.query)
    keyList.forEach(key => {
      let value = option.query[key]
      if (value!==''&&value!==undefined) {
        queryString += `${key}=${value}&`
      }
    })
    let urlString = `${url}?${queryString}`
    url = urlString.substr(0, urlString.length - 1)
  }
  let postType = postBase
  if (option.postType === 'text') {
    postType = postBaseResponseText
  } else if (option.postType === 'json') {
    postType = postBaseJsontype
  } else if (option.postType === 'file') {
    postType = postFile
  } else if (option.postType === 'arraybuffer') {
    postType = postResArraybuffer
  }
  postType.headers.token = cookies.getToken() || ''
  let method = option.method ? option.method : 'post'
  let arr = [url, param, postType]
  if(method=='get'){
    arr =[url, postType]
  }
  return new Promise((resolve, reject) => {
    axios[method](...arr).then((response) => {
      if (isLoading) {
        if (loading) { loading.close() }
      }
      if (response.status === 200) {
          console.log('>>>>>>>>>>>>>>>>>>>>>response',response)
          if(response.data.code==410||response.data.code==430){
            widget.alert('登录已经过期，点击确定重新登录','',()=>{
                window.location.replace(apis.loginurl)   //预生产 0医生端 1药店端
            })
          }
        resolve(response.data)
      } else {
        if (isLoading) {
          // todo 哪些状态不要手动处理的
        }
        reject(response.data)
      }
      logger.log('=====>' + url + '<=======')
      logger.log(param)
      logger.log(response.data)
    }).catch((error) => {
      if (isLoading) {
        if (loading) { loading.close() }
        if (!error || error.status === 404 || error.status === 500 || error.status === 502 || error.status === 503 || error.status === 504) {
          Message({
            message: '网络或服务器异常,请检查网络',
            type: 'warning'
          })
          
        }
      }
      reject(error || {})
      logger.log('=====>' + url + '<=======')
      logger.log(param)
      logger.log(error)
    })
  })
}

export const get = (option) => {
  option.method = 'get'
  return post(option)
}
