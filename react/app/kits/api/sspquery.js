
// web func
export const getURLParameter = (name) =>
  decodeURIComponent((new RegExp(`[?|&]${name}=([^&;]+?)(&|#|;|$)`)
    .exec(location.search) || [, ''])[1] // eslint-disable-line
    .replace(/\+/g, '%20')) || null

