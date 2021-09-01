# GOS
Gos "Greensock on scroll" is a library inspired by [AOS](https://github.com/michalsnik/aos).

GOS allows you to animate elements as you scroll down, and up. If you scroll back to top, elements will animate to it's previous state and are ready to animate again if you scroll down.

Rather than using Css animations as AOS does, GOS utilizes Greensock Tweens.

---
## ⚙ Installation
### Using package managers

Install `aos` package:
* `yarn add @kolonstudio/gos`
* or `npm install --save @kolonstudio/gos`

Import script, initialize AOS:
```js
import GOS from '@kolonstudio/gos';

// You can also pass an option settings object
// below listed deafult settings
GOS.init({
  duration: 1000, // duration in milliseconds
  ease: 'power1.inOut', // easeing string See https://greensock.com/ease-visualizer for all availiable easings
  delay: 0, // Delat the animation by x milliseconds
  startEvent: 'DOMContentLoaded', // name of the event dispatched on the document, that GOS should initialize on
  offset: 0, // offset (in px) from teh original trigger point
  disable: false, // accepts true or false
  mirror: false, // whether elements should animate out while scrolling past them
  once: false, // whether animation should happen only once - while scrolling down
  anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation
  disableMutationObserver: false,  // disables automatic mutations' detections (advanced)
  throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)
  debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
  animations: {} // Read more about the animations below 
});
```

---
🤔 How to use it?


The element you wish to animate can have the following attributes `data-gos-*` attributes:
```html
  <div
    data-gos="fadeIn"
    data-gos-delay="50"
    data-gos-offset="200"
    data-gos-duration="1000"
    data-gos-ease="power1.inOut"
    data-aos-mirror="true"
    data-aos-once="false"
    data-aos-anchor-placement="top-center"
  >
  </div>
```

---
## 💣 The animations

Here is an example of the standard "fadeIn" animation
```ts
import gsap from 'gsap/all';
import {GOSAnimation} from '@kolonstudio/gos';

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
  // The animationOut method is optional
  animateOut(el: gsap.TweenTarget, defaultOptions: gsap.TweenVars) {
    return gsap.to(el, {
      ...defaultOptions,
      opacity: 0,
    })
  }
}

export default fadeIn;
```

Here the GOSAnimation contract
```ts
export type GOSAnimation = {
  defaultStyles: gsap.TweenVars;
  animateIn: (targets: gsap.TweenTarget, defaultOptions: gsap.TweenVars) => gsap.core.Tween;
  animateOut?: (targets: gsap.TweenTarget, defaultOptions: gsap.TweenVars) => gsap.core.Tween;
}
```

🤔 How to import the animation ?

When you initialize the GOS.init() you can pass an animations object as an option like so
```js

import GOS from '@kolonstudio/gos';
import fadeUp from './animations/fadeUp'

// You can also pass an option settings object
// below listed deafult settings
GOS.init({
  animations: {fadeUp}
})
```

Each key (name) in the animations object can be used in the `data-gos` attribute on
```html
<div data-gos="fadeUp"></div>
```

## ❔Questions

If you found a bug, have a question or an idea, please contact [kolon.studio](https://kolon.studio/about).
