/**
 * ZenWeb Form Helpers
 * Form elements and inputs
 */

import { createElement, DOMProps, DOMChildren } from '../dom.js';

/**
 * Form element
 */
export function form(props: DOMProps, ...children: DOMChildren[]): HTMLFormElement {
  return createElement('form', props, ...children) as HTMLFormElement;
}

/**
 * Textarea element
 */
export function textarea(props: DOMProps, content?: string): HTMLTextAreaElement {
  return createElement('textarea', props, content || '') as HTMLTextAreaElement;
}

/**
 * Select element
 */
export function select(props: DOMProps, ...children: DOMChildren[]): HTMLSelectElement {
  return createElement('select', props, ...children) as HTMLSelectElement;
}

/**
 * Option element
 */
export function option(props: DOMProps & { value: string }, ...content: DOMChildren[]): HTMLOptionElement {
  return createElement('option', props, ...content) as HTMLOptionElement;
}

/**
 * Checkbox input
 */
export function checkbox(props: DOMProps & { checked?: boolean }): HTMLInputElement {
  return createElement('input', { ...props, type: 'checkbox' }) as HTMLInputElement;
}

/**
 * Radio input
 */
export function radio(props: DOMProps & { checked?: boolean; name?: string }): HTMLInputElement {
  return createElement('input', { ...props, type: 'radio' }) as HTMLInputElement;
}

/**
 * Fieldset element
 */
export function fieldset(props: DOMProps, ...children: DOMChildren[]): HTMLFieldSetElement {
  return createElement('fieldset', props, ...children) as HTMLFieldSetElement;
}

/**
 * Legend element
 */
export function legend(props: DOMProps, ...content: DOMChildren[]): HTMLLegendElement {
  return createElement('legend', props, ...content) as HTMLLegendElement;
}

/**
 * Datalist element
 */
export function datalist(props: DOMProps & { id: string }, ...children: DOMChildren[]): HTMLDataListElement {
  return createElement('datalist', props, ...children) as HTMLDataListElement;
}

/**
 * Meter element
 */
export function meter(props: DOMProps & { value: number; min?: number; max?: number }): HTMLMeterElement {
  return createElement('meter', props) as HTMLMeterElement;
}

/**
 * Progress element
 */
export function progress(props: DOMProps & { value?: number; max?: number }): HTMLProgressElement {
  return createElement('progress', props) as HTMLProgressElement;
}

/**
 * Output element
 */
export function output(props: DOMProps & { htmlFor?: string }, ...content: DOMChildren[]): HTMLOutputElement {
  return createElement('output', props, ...content) as HTMLOutputElement;
}
