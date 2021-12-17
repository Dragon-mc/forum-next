import mitt from 'mitt'
import router from '@/router'

export function guid(): string {
  function S4 () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
}

export function delHtmlTag (str: string) {
  return str.replace(/<[^>]+>/g, '') // 去掉所有的html标记
}

export function emphasizeKeywords(val: string, emphasized: string): string {
  let nowKeywords = emphasized
  return val.replace(
    nowKeywords,
    `<span style="color: #f00; font-size: 18px; font-weight: bold;">${nowKeywords}</span>`
  )
}

// 防抖函数
export function debounce(fn: Function, delay: number = 300) {
  let timer: number
  return function debounceFn(...args: any) {
    window.clearTimeout(timer)
    timer = window.setTimeout(fn, delay, ...args)
  }
}

export function back() {
  router.go(-1)
}

// 事件总线
export const bus = mitt()

export function getFuncValue(val: Function | string, merge: any = {}) {
  if (typeof val === 'function') {
    return val(merge)
  }
  return val
}

export function once(fn: Function) {
  let exec = false
  return function onceWrapper(...args: any) {
    if (!exec) {
      exec = true
      fn(...args)
    }
  }
}