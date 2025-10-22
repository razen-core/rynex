/**
 * Rynex Animation & Transition Helpers
 * Simple, performant animations without external dependencies
 */

import { debugLog, debugWarn } from '../debug.js';

export interface TransitionConfig {
  duration?: number;
  easing?: string;
  delay?: number;
  onStart?: () => void;
  onEnd?: () => void;
}

export interface AnimationConfig extends TransitionConfig {
  keyframes: Keyframe[] | PropertyIndexedKeyframes;
  iterations?: number;
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fill?: 'none' | 'forwards' | 'backwards' | 'both';
}

/**
 * Transition wrapper - applies CSS transitions to elements
 * Usage: transition(element, { duration: 300, easing: 'ease-in-out' })
 */
export function transition(
  element: HTMLElement,
  config: TransitionConfig = {}
): HTMLElement {
  if (!element || !(element instanceof HTMLElement)) {
    debugWarn('Animation', 'Invalid element provided to transition');
    return element;
  }

  const {
    duration = 300,
    easing = 'ease',
    delay = 0,
    onStart,
    onEnd
  } = config;

  try {
    element.style.transition = `all ${duration}ms ${easing} ${delay}ms`;
    debugLog('Animation', `Transition applied: ${duration}ms ${easing}`);

    if (onStart) {
      onStart();
    }

    if (onEnd) {
      element.addEventListener('transitionend', () => onEnd(), { once: true });
    }
  } catch (error) {
    debugWarn('Animation', 'Error applying transition:', error);
  }

  return element;
}

/**
 * Animate - Web Animations API wrapper
 * Usage: animate(element, { keyframes: [{ opacity: 0 }, { opacity: 1 }], duration: 300 })
 */
export function animate(
  element: HTMLElement,
  config: AnimationConfig
): Animation | null {
  if (!element || !(element instanceof HTMLElement)) {
    debugWarn('Animation', 'Invalid element provided to animate');
    return null;
  }

  const {
    keyframes,
    duration = 300,
    easing = 'ease',
    delay = 0,
    iterations = 1,
    direction = 'normal',
    fill = 'both',
    onStart,
    onEnd
  } = config;

  try {
    if (onStart) {
      onStart();
    }

    const animation = element.animate(keyframes, {
      duration,
      easing,
      delay,
      iterations,
      direction,
      fill
    });

    debugLog('Animation', `Animation started: ${duration}ms`);

    if (onEnd) {
      animation.onfinish = () => onEnd();
    }

    return animation;
  } catch (error) {
    debugWarn('Animation', 'Error creating animation:', error);
    return null;
  }
}

/**
 * Fade transition - fade in/out
 * Usage: fade(element, 'in', { duration: 300 })
 */
export function fade(
  element: HTMLElement,
  direction: 'in' | 'out' | 'toggle' = 'in',
  config: TransitionConfig = {}
): Animation | null {
  if (!element || !(element instanceof HTMLElement)) {
    debugWarn('Animation', 'Invalid element provided to fade');
    return null;
  }
  const { duration = 300, easing = 'ease', delay = 0, onStart, onEnd } = config;

  const currentOpacity = window.getComputedStyle(element).opacity;
  let keyframes: Keyframe[];

  if (direction === 'toggle') {
    direction = parseFloat(currentOpacity) > 0.5 ? 'out' : 'in';
  }

  if (direction === 'in') {
    keyframes = [
      { opacity: 0 },
      { opacity: 1 }
    ];
  } else {
    keyframes = [
      { opacity: 1 },
      { opacity: 0 }
    ];
  }

  return animate(element, {
    keyframes,
    duration,
    easing,
    delay,
    onStart,
    onEnd
  });
}

/**
 * Slide transition - slide in/out
 * Usage: slide(element, 'down', { duration: 300 })
 */
export function slide(
  element: HTMLElement,
  direction: 'up' | 'down' | 'left' | 'right' = 'down',
  config: TransitionConfig = {}
): Animation | null {
  if (!element || !(element instanceof HTMLElement)) {
    debugWarn('Animation', 'Invalid element provided to slide');
    return null;
  }
  const { duration = 300, easing = 'ease', delay = 0, onStart, onEnd } = config;

  let keyframes: Keyframe[];

  switch (direction) {
    case 'up':
      keyframes = [
        { transform: 'translateY(100%)', opacity: 0 },
        { transform: 'translateY(0)', opacity: 1 }
      ];
      break;
    case 'down':
      keyframes = [
        { transform: 'translateY(-100%)', opacity: 0 },
        { transform: 'translateY(0)', opacity: 1 }
      ];
      break;
    case 'left':
      keyframes = [
        { transform: 'translateX(100%)', opacity: 0 },
        { transform: 'translateX(0)', opacity: 1 }
      ];
      break;
    case 'right':
      keyframes = [
        { transform: 'translateX(-100%)', opacity: 0 },
        { transform: 'translateX(0)', opacity: 1 }
      ];
      break;
  }

  return animate(element, {
    keyframes,
    duration,
    easing,
    delay,
    onStart,
    onEnd
  });
}

/**
 * Scale transition - scale in/out
 * Usage: scale(element, 'in', { duration: 300 })
 */
export function scale(
  element: HTMLElement,
  direction: 'in' | 'out' | 'toggle' = 'in',
  config: TransitionConfig = {}
): Animation | null {
  if (!element || !(element instanceof HTMLElement)) {
    debugWarn('Animation', 'Invalid element provided to scale');
    return null;
  }
  const { duration = 300, easing = 'ease', delay = 0, onStart, onEnd } = config;

  const currentTransform = window.getComputedStyle(element).transform;
  let keyframes: Keyframe[];

  if (direction === 'toggle') {
    direction = currentTransform !== 'none' && currentTransform.includes('scale') ? 'out' : 'in';
  }

  if (direction === 'in') {
    keyframes = [
      { transform: 'scale(0)', opacity: 0 },
      { transform: 'scale(1)', opacity: 1 }
    ];
  } else {
    keyframes = [
      { transform: 'scale(1)', opacity: 1 },
      { transform: 'scale(0)', opacity: 0 }
    ];
  }

  return animate(element, {
    keyframes,
    duration,
    easing,
    delay,
    onStart,
    onEnd
  });
}

/**
 * Rotate transition - rotate element
 * Usage: rotate(element, 360, { duration: 300 })
 */
export function rotate(
  element: HTMLElement,
  degrees: number = 360,
  config: TransitionConfig = {}
): Animation | null {
  if (!element || !(element instanceof HTMLElement)) {
    debugWarn('Animation', 'Invalid element provided to rotate');
    return null;
  }
  const { duration = 300, easing = 'ease', delay = 0, onStart, onEnd } = config;

  const keyframes: Keyframe[] = [
    { transform: 'rotate(0deg)' },
    { transform: `rotate(${degrees}deg)` }
  ];

  return animate(element, {
    keyframes,
    duration,
    easing,
    delay,
    onStart,
    onEnd
  });
}
