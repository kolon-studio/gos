import gsap from 'gsap/all';
import {GOSAnimation} from "../types";

const fadeIn: GOSAnimation = {
  defaultStyles: {
    opacity: 0,
  },
  animateIn(el: gsap.TweenTarget, defaultOptions: gsap.TweenVars) {
    return gsap.to(el, {
      ...defaultOptions,
      opacity: 1,
    })
  },
  animateOut(el: gsap.TweenTarget, defaultOptions: gsap.TweenVars) {
    return gsap.to(el, {
      ...defaultOptions,
      opacity: 0,
    })
  }
}

export default fadeIn;
