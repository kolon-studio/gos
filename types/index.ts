import gsap from "gsap";

export type GOSAnimation = {
  defaultStyles: gsap.TweenVars;
  animateIn: (targets: gsap.TweenTarget, defaultOptions: gsap.TweenVars) => gsap.core.Tween;
  animateOut?: (targets: gsap.TweenTarget, defaultOptions: gsap.TweenVars) => gsap.core.Tween;
}

export type GOSOptions = {
  duration: number,
  ease: string,
  delay: number,

  startEvent: string,
  offset: number,
  disable: Boolean,
  mirror: Boolean,
  once: Boolean,
  anchorPlacement: string,
  disableMutationObserver: Boolean,
  throttleDelay: number,
  debounceDelay: number,

  animations: Record<string, GOSAnimation>
}
