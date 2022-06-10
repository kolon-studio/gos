// Modules & helpers
import throttle from './libs/throttle'
import debounce from './libs/debounce'
import merge from './libs/merge'
import observer from './libs/observer'

import detect from './helpers/detector'
import handleScroll from './helpers/handleScroll'
import prepare from './helpers/prepare'
import elements from './helpers/elements'
import defaultAnimations from './animations'

/**
 * Default options
 */
let options = {
  duration: 1000,
  ease: 'power1.inOut',
  delay: 0,
  startEvent: 'DOMContentLoaded',
  offset: 120,
  disable: false,
  mirror: false,
  once: false,
  anchorPlacement: 'top-bottom',
  disableMutationObserver: false,
  throttleDelay: 99,
  debounceDelay: 50,

  animations: defaultAnimations,
}

// Detect not supported browsers (<=IE9)
// http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
const isBrowserNotSupported = () => document.all && !window.atob

const initializeGos = function initializeGos() {
  // Extend elements objects in $gsapElements with their positions
  let $gsapElements = prepare(elements(), options)

  // Perform scroll event, to refresh view and show/hide elements
  handleScroll($gsapElements)

  /**
   * Handle scroll event to animate elements on scroll
   */
  window.addEventListener(
    'scroll',
    throttle(() => {
      handleScroll($gsapElements)
    }, options.throttleDelay),
  )
}

/**
 * Refresh GOS
 */
const refresh = function refresh() {
  initializeGos()
}

/**
 * Hard refresh
 * create array with new elements and trigger refresh
 */
const refreshHard = function refreshHard() {
  if (isDisabled(options.disable) || isBrowserNotSupported()) {
    return disable()
  }

  refresh()
}

/**
 * Disable GOS
 * Remove all attributes to reset applied styles
 */
const disable = function () {
  let $gsapElements = elements()
  $gsapElements.forEach(function (el, i) {
    el.node.removeAttribute('data-gos')
    el.node.removeAttribute('data-gos-offset')
    el.node.removeAttribute('data-gos-delay')
    el.node.removeAttribute('data-gos-duration')
    el.node.removeAttribute('data-gos-ease')
    el.node.removeAttribute('data-gos-mirror')
    el.node.removeAttribute('data-gos-once')
    el.node.removeAttribute('data-gos-placement')
  })
}

/**
 * Check if GOS should be disabled based on provided setting
 */
const isDisabled = function (optionDisable) {
  return (
    optionDisable === true ||
    (optionDisable === 'mobile' && detect.mobile()) ||
    (optionDisable === 'phone' && detect.phone()) ||
    (optionDisable === 'tablet' && detect.tablet()) ||
    (typeof optionDisable === 'function' && optionDisable() === true)
  )
}

/**
 * Initializing GOS
 * - Create options merging defaults with user defined options
 * - Attach preparing elements to options.startEvent,
 *   window resize and orientation change
 * - Attach function that handle scroll and everything connected to it
 *   to window scroll event and fire once document is ready to set initial state
 */

const init = function init(settings) {
  options = merge(options, settings)

  /**
   * Disable mutation observing if not supported
   */
  if (!options.disableMutationObserver && !observer.isSupported()) {
    console.info(`
      gsap: MutationObserver is not supported on this browser,
      code mutations observing has been disabled.
      You may have to call "refreshHard()" by yourself.
    `)
    options.disableMutationObserver = true
  }

  /**
   * Observe [data-gos] elements
   * If something is loaded by AJAX
   * it'll refresh plugin automatically
   */
  if (!options.disableMutationObserver) {
    observer.ready('[data-gos]', refreshHard)
  }

  /**
   * Don't init plugin if option `disable` is set
   * or when browser is not supported
   */
  if (isDisabled(options.disable) || isBrowserNotSupported()) {
    return disable()
  }

  /**
   * Handle initializing
   */

  if (
    options.startEvent === 'DOMContentLoaded' &&
    ['complete', 'interactive'].indexOf(document.readyState) > -1
  ) {
    // Initialize GOS if default startEvent was already fired
    refresh(true)
  } else {
    if (['DOMContentLoaded', 'load'].indexOf(options.startEvent) === -1) {
      // Listen to options.startEvent and initialize GOS
      document.addEventListener(options.startEvent, function () {
        refresh(true)
      })
    } else {
      window.addEventListener('load', function () {
        refresh(true)
      })
    }
  }

  /**
   * Refresh plugin on window resize or orientation change
   */
  window.addEventListener(
    'resize',
    debounce(() => refresh(false), options.debounceDelay, false),
  )

  window.addEventListener(
    'orientationchange',
    debounce(() => refresh(false), options.debounceDelay, false),
  )

  return true
}

export default {
  init,
  refresh,
  refreshHard,
}
