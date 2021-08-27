import gsap from 'gsap/all';
import {GOSAnimation} from "../types";

const fadeIn: GOSAnimation = {
  defaultStyles: {
    opacity: 0,
  },
  animateIn(el: gsap.TweenTarget) {
    return gsap.to(el, {
      opacity: 1
    })
  }
}
