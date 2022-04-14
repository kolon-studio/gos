/**
 * Get inline option with a fallback.
 *
 * @param  {Node} el [Dom element]
 * @param  {String} key [Option key]
 * @param  {String} fallback [Default (fallback) value]
 * @return {Mixed} [Option set with inline attributes or fallback value if not set]
 */

const isObject = (string = '') =>
  string.charAt(0) === '{' && string.charAt(string.length - 1) === '}'

export default (el, key, fallback = null) => {
  let attr = el.getAttribute('data-gos-' + key)

  if (typeof attr !== 'undefined') {
    if (attr === 'true') {
      return true
    } else if (attr === 'false') {
      return false
    }
  }

  if (attr && isObject(attr)) {
    attr = JSON.parse(attr)
  }

  return attr || fallback
}
