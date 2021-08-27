/**
 * *******************************************************
 * GOS (Gsap on scroll) - aos alternative
 * made to animate elements on scroll in both directions
 * *******************************************************
 */

// Modules & helpers
import throttle from 'lodash.throttle';
import debounce from 'lodash.debounce';
import merge from 'lodash.merge';

import observer from './libs/observer';

import detect from './helpers/detector';
import handleScroll from './helpers/handleScroll';
import prepare from './helpers/prepare';
import elements from './helpers/elements';
import defaultAnimations from './animations';
import {GOSOptions} from './types'
/**
 * Private variables
 */
let $gsapElements = [];
let initialized = false;

/**
 * Default options
 */
let options: GOSOptions = {
  offset: 0,
  delay: 0,
  style: {},
  animation: 'fadeIn',
  easing: 'power1.inOut',
  duration: 400,
  disable: false,
  mirror: false,
  anchorPlacement: 'top-bottom',
  startEvent: 'DOMContentLoaded',
  useClassNames: false,
  disableMutationObserver: false,
  throttleDelay: 99,
  debounceDelay: 50,
  animations: defaultAnimations
};

// Detect not supported browsers (<=IE9)
// http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
const isBrowserNotSupported = () => document.all && !window.atob;

const initializeScroll = function initializeScroll() {
  // Extend elements objects in $gsapElements with their positions
  $gsapElements = prepare($gsapElements, options);
  // Perform scroll event, to refresh view and show/hide elements
  handleScroll($gsapElements);

  /**
   * Handle scroll event to animate elements on scroll
   */
  window.addEventListener(
    'scroll',
    throttle(() => {
      handleScroll($gsapElements);
    }, options.throttleDelay)
  );

  return $gsapElements;
};

/**
 * Refresh GOS
 */
const refresh = function refresh(initialize = false) {
  // Allow refresh only when it was first initialized on startEvent
  if (initialize) initialized = true;
  if (initialized) initializeScroll();
};

/**
 * Hard refresh
 * create array with new elements and trigger refresh
 */
const refreshHard = function refreshHard() {
  $gsapElements = elements();

  if (isDisabled(options.disable) || isBrowserNotSupported()) {
    return disable();
  }

  refresh();
};

/**
 * Disable GOS
 * Remove all attributes to reset applied styles
 */
const disable = function () {
  $gsapElements.forEach(function (el, i) {
    el.node.removeAttribute('data-gos');
    el.node.removeAttribute('data-gos-duration');
    el.node.removeAttribute('data-gos-mirror');
    el.node.removeAttribute('data-gos-once');
    el.node.removeAttribute('data-gos-ease');
    el.node.removeAttribute('data-gos-delay');
    el.node.removeAttribute('data-gos-offset');
    el.node.removeAttribute('data-gos-style');
  });
};

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
  );
};

/**
 * Initializing GOS
 * - Create options merging defaults with user defined options
 * - Set attributes on <body> as global setting - css relies on it
 * - Attach preparing elements to options.startEvent,
 *   window resize and orientation change
 * - Attach function that handle scroll and everything connected to it
 *   to window scroll event and fire once document is ready to set initial state
 */
const init = function init(settings) {
  options = merge(options, settings);

  // Create initial array with elements -> to be fullfilled later with prepare()
  $gsapElements = elements();

  /**
   * Disable mutation observing if not supported
   */
  if (!options.disableMutationObserver && !observer.isSupported()) {
    console.info(`
      gsap: MutationObserver is not supported on this browser,
      code mutations observing has been disabled.
      You may have to call "refreshHard()" by yourself.
    `);
    options.disableMutationObserver = true;
  }

  /**
   * Observe [gsap] elements
   * If something is loaded by AJAX
   * it'll refresh plugin automatically
   */
  if (!options.disableMutationObserver) {
    observer.ready('[data-gos]', refreshHard);
  }

  /**
   * Don't init plugin if option `disable` is set
   * or when browser is not supported
   */
  if (isDisabled(options.disable) || isBrowserNotSupported()) {
    return disable();
  }

  /**
   * Set global settings on body, based on options
   * so CSS can use it
   */
  document
    .querySelector('body')
    .setAttribute('data-gos-easing', options.easing);

  document
    .querySelector('body')
    .setAttribute('data-gos-duration', options.duration.toString());

  document.querySelector('body').setAttribute('data-gos-delay', options.delay.toString());

  /**
   * Handle initializing
   */
  if (['DOMContentLoaded', 'load'].indexOf(options.startEvent) === -1) {
    // Listen to options.startEvent and initialize GOS
    document.addEventListener(options.startEvent, function () {
      refresh(true);
    });
  } else {
    window.addEventListener('load', function () {
      refresh(true);
    });
  }

  if (
    options.startEvent === 'DOMContentLoaded' &&
    ['complete', 'interactive'].indexOf(document.readyState) > -1
  ) {
    // Initialize GOS if default startEvent was already fired
    refresh(true);
  }

  /**
   * Refresh plugin on window resize or orientation change
   */
  window.addEventListener(
    'resize',
    debounce(refresh, options.debounceDelay, true)
  );

  window.addEventListener(
    'orientationchange',
    debounce(refresh, options.debounceDelay, true)
  );

  return $gsapElements;
};

/**
 * Export Public API
 */

export * from './types';

export default {
  init,
  refresh,
  refreshHard
};
