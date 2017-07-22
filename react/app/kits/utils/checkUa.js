
const userAgent = navigator.userAgent

/**
 * 检查微信
 */
export const checkWeixin = () => {
  const isWeixin = userAgent.toLowerCase().indexOf('micromessenger') !== -1
  return isWeixin
}
