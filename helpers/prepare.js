import getInlineOption from './getInlineOption';
import { getPositionIn, getPositionOut } from './offsetCalculator';

import animations from '../animations';
import gsap from 'gsap/all';

const prepare = function ($elements, options) {
  $elements.forEach((el, i) => {
    const duration = getInlineOption(el.node, 'duration', options.duration);
    const mirror = getInlineOption(el.node, 'mirror', options.mirror);
    const once = getInlineOption(el.node, 'once', options.once);
    const ease = getInlineOption(el.node, 'ease', options.ease);
    const delay = getInlineOption(el.node, 'delay', options.delay);
    const offset = getInlineOption(el.node, 'offset', options.offset);
    const style = getInlineOption(el.node, 'style', options.style);
    const animationName = el.node.getAttribute('data-gos');

    if(!animations.hasOwnProperty(animationName)) {
      console.error(`The animation "${animationName}" does not exist.`);
      return;
    }

    gsap.set(el.node, {
      ...animations[animationName].defaultStyles,
      ...style,
      onComplete: () => {
        el.node.removeAttribute('data-gos');
        el.node.removeAttribute('data-gos-duration');
        el.node.removeAttribute('data-gos-mirror');
        el.node.removeAttribute('data-gos-once');
        el.node.removeAttribute('data-gos-ease');
        el.node.removeAttribute('data-gos-delay');
        el.node.removeAttribute('data-gos-offset');
        el.node.removeAttribute('data-gos-style');
      }
    });

    el.position = {
      in: getPositionIn(el.node, offset, options.anchorPlacement),
      out: mirror && getPositionOut(el.node, offset)
    };

    el.options = {
      duration, once, ease, delay, animationName
    }
  });

  return $elements;
};

export default prepare;
