import gsap from "gsap";

export type GOSAnimation = {
  defaultStyles: gsap.TweenVars;
  animateIn: (targets: gsap.TweenTarget) => gsap.core.Tween;
  animateOut?: (targets: gsap.TweenTarget) => gsap.core.Tween;
}

export type GOSOptions = {
  offset: number,
  delay: number,
  style: Object,
  animation: string,
  easing: string,
  duration: number,
  disable: Boolean,
  mirror: Boolean,
  anchorPlacement: string,
  startEvent: string,
  useClassNames: Boolean,
  disableMutationObserver: Boolean,
  throttleDelay: number,
  debounceDelay: number,
  animations: Record<string, GOSAnimation>
}
