/**
 * Rynex Error System - Element Validator
 * Validates DOM elements and their properties
 */

import { RynexValidationError, RynexDOMError, createErrorContext } from '../errors.js';
import { isHTMLElement, isElement, isNullOrUndefined, validateNotNullOrUndefined } from './type-validator.js';

/**
 * Validate that value is an HTMLElement
 */
export function validateElement(
  element: any,
  functionName: string,
  parameterName: string = 'element'
): asserts element is HTMLElement {
  // Check if null or undefined
  validateNotNullOrUndefined(element, functionName, parameterName);

  // Check if it's an HTMLElement
  if (!isHTMLElement(element)) {
    const context = createErrorContext(functionName, { [parameterName]: element });
    const error = new RynexValidationError(
      `Invalid element in ${functionName}()`,
      parameterName,
      'HTMLElement',
      element,
      context
    );

    // Add specific suggestions based on what was passed
    if (typeof element === 'string') {
      error.addSuggestion(
        'You passed a string. Use a DOM element instead.',
        `// Instead of:\n${functionName}('myElement')\n\n// Use:\nconst el = div({}, 'content');\n${functionName}(el);`
      );
    } else if (typeof element === 'function') {
      error.addSuggestion(
        'You passed a function. Did you forget to call it?',
        `// Instead of:\n${functionName}(myComponent)\n\n// Use:\n${functionName}(myComponent())`
      );
    } else if (isElement(element)) {
      error.addSuggestion(
        'The element is not an HTMLElement. Make sure you\'re using a valid HTML element.'
      );
    } else {
      error.addSuggestion(
        'Create a valid HTML element using Rynex element functions.',
        `const element = div({}, 'content');\n${functionName}(element);`
      );
    }

    throw error;
  }
}

/**
 * Validate that element is in the DOM
 */
export function validateElementInDOM(
  element: HTMLElement,
  functionName: string
): void {
  if (!document.body.contains(element)) {
    const context = createErrorContext(functionName, { element });
    const error = new RynexDOMError(
      `Element is not in the DOM in ${functionName}()`,
      'dom_check',
      context,
      element
    );

    error.addSuggestion(
      'Make sure the element is mounted to the DOM before performing this operation.',
      `// Mount the element first:\nmount(element, document.body);\n\n// Then use it:\n${functionName}(element);`
    );

    throw error;
  }
}

/**
 * Validate that element is visible
 */
export function validateElementVisible(
  element: HTMLElement,
  functionName: string
): void {
  const style = window.getComputedStyle(element);
  
  if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
    const context = createErrorContext(functionName, { element });
    const error = new RynexDOMError(
      `Element is not visible in ${functionName}()`,
      'visibility_check',
      context,
      element
    );

    error.addSuggestion(
      'The element is hidden. Make it visible before performing this operation.',
      `element.style.display = 'block';\nelement.style.visibility = 'visible';\nelement.style.opacity = '1';`
    );

    throw error;
  }
}

/**
 * Validate element has specific tag name
 */
export function validateElementTag(
  element: HTMLElement,
  allowedTags: string[],
  functionName: string
): void {
  const tagName = element.tagName.toLowerCase();
  
  if (!allowedTags.includes(tagName)) {
    const context = createErrorContext(functionName, { element, tagName });
    const error = new RynexValidationError(
      `Invalid element tag in ${functionName}()`,
      'element',
      allowedTags.join(' | '),
      tagName,
      context
    );

    error.addSuggestion(
      `Use one of these element types: ${allowedTags.join(', ')}`,
      `// Example:\nconst element = ${allowedTags[0]}({}, 'content');\n${functionName}(element);`
    );

    throw error;
  }
}

/**
 * Validate element has specific attribute
 */
export function validateElementHasAttribute(
  element: HTMLElement,
  attribute: string,
  functionName: string
): void {
  if (!element.hasAttribute(attribute)) {
    const context = createErrorContext(functionName, { element, attribute });
    const error = new RynexDOMError(
      `Element missing required attribute "${attribute}" in ${functionName}()`,
      'attribute_check',
      context,
      element
    );

    error.addSuggestion(
      `Add the "${attribute}" attribute to the element.`,
      `element.setAttribute('${attribute}', 'value');`
    );

    throw error;
  }
}

/**
 * Validate element is animatable
 */
export function validateElementAnimatable(
  element: HTMLElement,
  functionName: string
): void {
  const style = window.getComputedStyle(element);
  
  // Check if element has dimensions
  if (element.offsetWidth === 0 && element.offsetHeight === 0) {
    const context = createErrorContext(functionName, { element });
    const error = new RynexDOMError(
      `Element has no dimensions and cannot be animated in ${functionName}()`,
      'animation_check',
      context,
      element
    );

    error.addSuggestion(
      'Give the element dimensions before animating it.',
      `element.style.width = '100px';\nelement.style.height = '100px';`
    );

    throw error;
  }
}

/**
 * Validate parent element
 */
export function validateParentElement(
  parent: any,
  functionName: string
): asserts parent is HTMLElement {
  validateElement(parent, functionName, 'parent');
}

/**
 * Validate child element or elements
 */
export function validateChildren(
  children: any,
  functionName: string
): void {
  if (isNullOrUndefined(children)) {
    return; // Children can be optional
  }

  if (Array.isArray(children)) {
    children.forEach((child, index) => {
      if (!isHTMLElement(child) && typeof child !== 'string' && typeof child !== 'number') {
        const context = createErrorContext(functionName, { child, index });
        const error = new RynexValidationError(
          `Invalid child at index ${index} in ${functionName}()`,
          `children[${index}]`,
          'HTMLElement | string | number',
          child,
          context
        );

        error.addSuggestion(
          'Children must be HTMLElements, strings, or numbers.',
          `// Valid children:\n[\n  div({}, 'text'),\n  'plain text',\n  42\n]`
        );

        throw error;
      }
    });
  } else if (!isHTMLElement(children) && typeof children !== 'string' && typeof children !== 'number') {
    const context = createErrorContext(functionName, { children });
    const error = new RynexValidationError(
      `Invalid children in ${functionName}()`,
      'children',
      'HTMLElement | string | number | Array',
      children,
      context
    );

    error.addSuggestion(
      'Children must be an HTMLElement, string, number, or array of these types.'
    );

    throw error;
  }
}
