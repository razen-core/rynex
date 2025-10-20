/**
 * Rynex Table Elements
 * Table-related elements
 */

import { createElement, DOMProps, DOMChildren } from '../dom.js';

/**
 * Table container
 */
export function table(props: DOMProps, ...children: DOMChildren[]): HTMLTableElement {
  return createElement('table', props, ...children) as HTMLTableElement;
}

/**
 * Table head
 */
export function thead(props: DOMProps, ...children: DOMChildren[]): HTMLTableSectionElement {
  return createElement('thead', props, ...children) as HTMLTableSectionElement;
}

/**
 * Table body
 */
export function tbody(props: DOMProps, ...children: DOMChildren[]): HTMLTableSectionElement {
  return createElement('tbody', props, ...children) as HTMLTableSectionElement;
}

/**
 * Table footer
 */
export function tfoot(props: DOMProps, ...children: DOMChildren[]): HTMLTableSectionElement {
  return createElement('tfoot', props, ...children) as HTMLTableSectionElement;
}

/**
 * Table row
 */
export function tr(props: DOMProps, ...children: DOMChildren[]): HTMLTableRowElement {
  return createElement('tr', props, ...children) as HTMLTableRowElement;
}

/**
 * Table header cell
 */
export function th(props: DOMProps, ...content: DOMChildren[]): HTMLTableCellElement {
  return createElement('th', props, ...content) as HTMLTableCellElement;
}

/**
 * Table data cell
 */
export function td(props: DOMProps, ...content: DOMChildren[]): HTMLTableCellElement {
  return createElement('td', props, ...content) as HTMLTableCellElement;
}

/**
 * Table caption
 */
export function caption(props: DOMProps, ...content: DOMChildren[]): HTMLTableCaptionElement {
  return createElement('caption', props, ...content) as HTMLTableCaptionElement;
}

/**
 * Column group
 */
export function colgroup(props: DOMProps, ...children: DOMChildren[]): HTMLTableColElement {
  return createElement('colgroup', props, ...children) as HTMLTableColElement;
}

/**
 * Column
 */
export function col(props: DOMProps): HTMLTableColElement {
  return createElement('col', props) as HTMLTableColElement;
}
