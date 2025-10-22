/**
 * Rynex Error System - Validation Schemas
 * Pre-defined schemas for common validations
 */

import { ValidationSchema } from '../types.js';

/**
 * Animation configuration schema
 */
export const animationConfigSchema: ValidationSchema = {
  duration: {
    type: 'number',
    min: 0,
    max: 60000,
    message: 'Duration must be between 0 and 60000ms'
  },
  easing: {
    type: 'string',
    enum: ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out', 'cubic-bezier'],
    message: 'Invalid easing function'
  },
  delay: {
    type: 'number',
    min: 0,
    message: 'Delay must be >= 0'
  },
  iterations: {
    type: 'number',
    min: 1,
    message: 'Iterations must be >= 1'
  },
  direction: {
    type: 'string',
    enum: ['normal', 'reverse', 'alternate', 'alternate-reverse'],
    message: 'Invalid animation direction'
  },
  fill: {
    type: 'string',
    enum: ['none', 'forwards', 'backwards', 'both'],
    message: 'Invalid fill mode'
  },
  onStart: {
    type: 'function'
  },
  onEnd: {
    type: 'function'
  },
  onCancel: {
    type: 'function'
  }
};

/**
 * Transition configuration schema
 */
export const transitionConfigSchema: ValidationSchema = {
  duration: {
    type: 'number',
    min: 0,
    max: 60000,
    message: 'Duration must be between 0 and 60000ms'
  },
  easing: {
    type: 'string',
    message: 'Easing must be a valid CSS timing function'
  },
  delay: {
    type: 'number',
    min: 0,
    message: 'Delay must be >= 0'
  },
  onStart: {
    type: 'function'
  },
  onEnd: {
    type: 'function'
  }
};

/**
 * Fade configuration schema
 */
export const fadeConfigSchema: ValidationSchema = {
  duration: {
    type: 'number',
    min: 0,
    max: 60000
  },
  easing: {
    type: 'string'
  },
  onEnd: {
    type: 'function'
  }
};

/**
 * Slide configuration schema
 */
export const slideConfigSchema: ValidationSchema = {
  duration: {
    type: 'number',
    min: 0,
    max: 60000
  },
  easing: {
    type: 'string'
  },
  distance: {
    type: 'number',
    min: 0
  },
  onEnd: {
    type: 'function'
  }
};

/**
 * DOM props schema
 */
export const domPropsSchema: ValidationSchema = {
  id: {
    type: 'string'
  },
  class: {
    type: 'string'
  },
  className: {
    type: 'string'
  },
  style: {
    type: 'object'
  },
  onclick: {
    type: 'function'
  },
  onchange: {
    type: 'function'
  },
  oninput: {
    type: 'function'
  },
  onsubmit: {
    type: 'function'
  },
  onkeydown: {
    type: 'function'
  },
  onkeyup: {
    type: 'function'
  },
  onmouseenter: {
    type: 'function'
  },
  onmouseleave: {
    type: 'function'
  }
};

/**
 * Logger configuration schema
 */
export const loggerConfigSchema: ValidationSchema = {
  level: {
    type: 'number',
    enum: [0, 1, 2, 3, 4],
    message: 'Invalid log level'
  },
  prefix: {
    type: 'string'
  },
  timestamp: {
    type: 'boolean'
  },
  colors: {
    type: 'boolean'
  }
};

/**
 * Router configuration schema
 */
export const routerConfigSchema: ValidationSchema = {
  routes: {
    type: 'array',
    required: true,
    message: 'Routes array is required'
  },
  mode: {
    type: 'string',
    enum: ['hash', 'history'],
    message: 'Mode must be "hash" or "history"'
  },
  base: {
    type: 'string'
  },
  fallback: {
    type: 'function'
  }
};

/**
 * Component props schema
 */
export const componentPropsSchema: ValidationSchema = {
  props: {
    type: 'object'
  },
  children: {
    type: ['array', 'object', 'string', 'number']
  },
  key: {
    type: ['string', 'number']
  },
  ref: {
    type: 'object'
  }
};
