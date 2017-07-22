import FastClick from 'fastclick'
import { httpHijack } from 'utils/httpHijack'
import { checkWeixin } from 'utils/checkUa'

// 防止劫持，不要放在 load 里，DOMNodeInserted 先于 load 执行
if (!checkWeixin()) {
  httpHijack()
}

window.addEventListener('load', () => {
  FastClick.attach(document.body)
})
