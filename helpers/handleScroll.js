import detect from './detector';
import animations from '../animations';

const fireEvent = (eventName, data) => {
  let customEvent;

  if (detect.ie11()) {
    customEvent = document.createEvent('CustomEvent');
    customEvent.initCustomEvent(eventName, true, true, {detail: data});
  } else {
    customEvent = new CustomEvent(eventName, {
      detail: data
    });
  }

  return document.dispatchEvent(customEvent);
};

/**
 * Set or remove gsap-animate class
 * @param {node} el         element
 * @param {int}  top        scrolled distance
 */
const applyAnimations = (el, top) => {
  const {options, position, node} = el;

  const hide = () => {
    if (!el.animated) return;
    if(animations[options.animationName].hasOwnProperty('animateOut')) {
      animations[options.animationName].animateOut(el.node, {
        duration: options.duration / 1000,
        ease: options.ease,
        delay: options.delay / 1000,
      });
    }

    fireEvent('gsap:out', node);

    el.animated = false;
  };

  const show = () => {
    if (el.animated) return;

    animations[options.animationName].animateIn(el.node, {
      duration: options.duration / 1000,
      ease: options.ease,
      delay: options.delay / 1000,
    });

    fireEvent('gsap:in', node);

    el.animated = true;
  };

  if (options.mirror && top >= position.out && !options.once) {
    hide();
  } else if (top >= position.in) {
    show();
  } else if (el.animated && !options.once) {
    hide();
  }
};

/**
 * Scroll logic - add or remove 'gsap-animate' class on scroll
 *
 * @param  {array} $elements         array of elements nodes
 * @return {void}
 */
const handleScroll = $elements =>
  $elements.forEach((el, i) => applyAnimations(el, window.pageYOffset));

export default handleScroll;
