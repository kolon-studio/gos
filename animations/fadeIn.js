import gsap from 'gsap'

const fadeIn = {
  defaultStyles: {
    opacity: 0,
  },
  animateIn(el, defaultOptions) {
    return gsap.to(el, {
      ...defaultOptions,
      opacity: 1,
    })
  },
  animateOut(el, defaultOptions) {
    return gsap.to(el, {
      ...defaultOptions,
      opacity: 0,
    })
  },
}

export default fadeIn
