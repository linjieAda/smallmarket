import * as API from './api'
require('es6-promise').polyfill()
import fetch from 'isomorphic-fetch'
import Cookies from 'cookies-js'
import { hex_md5 } from './md5' // eslint-disable-line
import Utf8 from 'utf8'

// token 请求失败后的重新请求数（异步请求数）
const tokenMaxFetchNum = 10
let tokenFetchNum = 0

// 登录态
const getToken = () => Cookies.get('front_tk') || Cookies.get('sign') || ''

// 动态签名
const getTls = () => Cookies.get('front_tls') || ''

// const getToken = () => {
//   const tk = Cookies.get('tls')
//   if (tk == null || tk === undefined) {
//     return ''
//   }
//   return tk
// }

// private methods
const getApiSign = (jsondata) => {
  const dataArray = Object.keys(jsondata).sort()
  let str = ''
  for (let i = 0; i < dataArray.length; i++) {
    str = str + dataArray[i] + jsondata[dataArray[i]]
  }
  // str = str + getToken()
  str = Utf8.encode(str)
  return hex_md5(str)
}

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response
  }
  const error = new Error(response.statusText)
  error.response = response
  throw error
}

// reload when error code 40
const isH5TokenValid = (response) => {
  tokenFetchNum ++
  if (response.success === false && response.errCode === '40' && (tokenFetchNum <= tokenMaxFetchNum)) {
    if (response.tls) {
      Cookies.set('front_tls', response.tls)
    }

    return false
  }
  return true
}

// nodeFetch
export const nodeFetch = (options) => {
  const {
    url = '',
    methodType = 'GET',
    callback = () => {},
  } = options

  fetch(url, {
    method: methodType,
  })
  .then((res) => {
    const data = res.json()
    return data
  })
  .then((jsonData) => {
    callback(jsonData)
  })
  .catch((ex) => {
    console.log('failed', ex)
  })
}

// exports
export const query = (rawdata, success) => {
  const basedata = {
    appKey: API.APP_KEY,
    timestamp: new Date().getTime(),
    tk: getToken(),
    tls: getTls(),
    v: '1.0',
  }

  if (rawdata.method === 'login.in' || rawdata.method === 'login.renew') {
    Cookies.expire('front_tk')
  }

  Object.keys(rawdata).forEach((s) => { basedata[s] = rawdata[s] })
  basedata.apiSign = getApiSign(basedata)

  const body = Object.keys(basedata)
    .map(key => (`${encodeURIComponent(key)}=${encodeURIComponent(basedata[key])}`))
    .join('&')

  const myInit = {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'POST',
    mode: 'cors',
    cache: 'default',
    credentials: 'include',
    body,
  }

  return fetch(API.getRouterUrl(), myInit)
    .then(checkStatus)
    .then(response => response.json())
    .then(response => isH5TokenValid(response) ? success(response) : query(rawdata, success)) // eslint-disable-line
    // .catch((e) => console.log('网络错误', e))
}

export const queryurl = (url, success) =>
  fetch(url, { headers: { 'Content-Type': 'application/x-www-form-urlencoded', mode: 'cors', } })
    .then(res => res.text())
    .then(res => success(res))
    // .catch(() => console.log('网络错误'))

export const getRouterUrl = () => API.getRouterUrl()
export const urlFromMainPath = (path) => API.getMainPathUrl(path)
export const urlFromWxApiPath = (path) => API.getWxApiUrl(path)
// web func
export const getURLParameter = (name) =>
  decodeURIComponent((new RegExp(`[?|&]${name}=([^&;]+?)(&|#|;|$)`)
    .exec(location.search) || [, ''])[1] // eslint-disable-line
    .replace(/\+/g, '%20')) || null

//  有时value会是null字符串
export const getURLParameterClearNull = (param) => {
  let str = ''
  const paramVal = getURLParameter(param)
  if (paramVal && paramVal !== 'null') {
    str = paramVal
  }

  return str
}

//  取得所有非空的参数生成obj
const getAllParamToSignObj = () => {
  const signObj = {}
  const search = location.search
  const allParam = search.split('?')[1]
  if (allParam) {
    const paramArr = allParam.split('&')
    if (paramArr.length > 0) {
      paramArr.forEach((oneParam) => {
        const param = oneParam.split('=')[0]
        if (param !== 'validSign') {
          const value = getURLParameterClearNull(param)
          if (value) {
            signObj[param] = value
          }
        }
      })
    }
  }

  return signObj
}

//  act-renter中validSign
export const getPoolSign = () => {
  const jsondata = getAllParamToSignObj()
  const dataArray = Object.keys(jsondata).sort()
  let str = ''
  for (let i = 0; i < dataArray.length; i++) {
    str = str + dataArray[i] + jsondata[dataArray[i]]
  }
  str = `userpool${str}userpool`
  str = Utf8.encode(str)
  return hex_md5(str)
}
