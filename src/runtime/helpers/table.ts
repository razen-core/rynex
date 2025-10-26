/**
 * Rynex Table Elements
 * Table-related elements with Rust-style Builder API
 */

import { createElement, DOMProps, DOMChildren } from '../dom.js';
import { ElementBuilder } from './builder.js';

/**
 * Table container - Builder API
 */
export function table(): ElementBuilder<HTMLTableElement> {
  return new ElementBuilder<HTMLTableElement>('table');
}

/**
 * Table head - Builder API
 */
export function thead(): ElementBuilder<HTMLTableSectionElement> {
  return new ElementBuilder<HTMLTableSectionElement>('thead');
}

/**
 * Table body - Builder API
 */
export function tbody(): ElementBuilder<HTMLTableSectionElement> {
  return new ElementBuilder<HTMLTableSectionElement>('tbody');
}

/**
 * Table footer - Builder API
 */
export function tfoot(): ElementBuilder<HTMLTableSectionElement> {
  return new ElementBuilder<HTMLTableSectionElement>('tfoot');
}

/**
 * Table row - Builder API
 */
export function tr(): ElementBuilder<HTMLTableRowElement> {
  return new ElementBuilder<HTMLTableRowElement>('tr');
}

/**
 * Table header cell - Builder API
 */
export class ThBuilder extends ElementBuilder<HTMLTableCellElement> {
  constructor() {
    super('th');
  }

  colspan(value: number): this {
    this.element.colSpan = value;
    return this;
  }

  rowspan(value: number): this {
    this.element.rowSpan = value;
    return this;
  }

  scope(value: 'col' | 'row' | 'colgroup' | 'rowgroup'): this {
    this.element.scope = value;
    return this;
  }
}

export function th(): ThBuilder {
  return new ThBuilder();
}

/**
 * Table data cell - Builder API
 */
export class TdBuilder extends ElementBuilder<HTMLTableCellElement> {
  constructor() {
    super('td');
  }

  colspan(value: number): this {
    this.element.colSpan = value;
    return this;
  }

  rowspan(value: number): this {
    this.element.rowSpan = value;
    return this;
  }
}

export function td(): TdBuilder {
  return new TdBuilder();
}

/**
 * Table caption - Builder API
 */
export function caption(): ElementBuilder<HTMLTableCaptionElement> {
  return new ElementBuilder<HTMLTableCaptionElement>('caption');
}

/**
 * Column group - Builder API
 */
export function colgroup(): ElementBuilder<HTMLTableColElement> {
  return new ElementBuilder<HTMLTableColElement>('colgroup');
}

/**
 * Column - Builder API
 */
export class ColBuilder extends ElementBuilder<HTMLTableColElement> {
  constructor() {
    super('col');
  }

  span(value: number): this {
    this.element.span = value;
    return this;
  }
}

export function col(): ColBuilder {
  return new ColBuilder();
}

// Legacy support
export function tableLegacy(props: DOMProps, ...children: DOMChildren[]): HTMLTableElement {
  return createElement('table', props, ...children) as HTMLTableElement;
}

export function theadLegacy(props: DOMProps, ...children: DOMChildren[]): HTMLTableSectionElement {
  return createElement('thead', props, ...children) as HTMLTableSectionElement;
}

export function tbodyLegacy(props: DOMProps, ...children: DOMChildren[]): HTMLTableSectionElement {
  return createElement('tbody', props, ...children) as HTMLTableSectionElement;
}

export function tfootLegacy(props: DOMProps, ...children: DOMChildren[]): HTMLTableSectionElement {
  return createElement('tfoot', props, ...children) as HTMLTableSectionElement;
}

export function trLegacy(props: DOMProps, ...children: DOMChildren[]): HTMLTableRowElement {
  return createElement('tr', props, ...children) as HTMLTableRowElement;
}

export function thLegacy(props: DOMProps, ...content: DOMChildren[]): HTMLTableCellElement {
  return createElement('th', props, ...content) as HTMLTableCellElement;
}

export function tdLegacy(props: DOMProps, ...content: DOMChildren[]): HTMLTableCellElement {
  return createElement('td', props, ...content) as HTMLTableCellElement;
}

export function captionLegacy(props: DOMProps, ...content: DOMChildren[]): HTMLTableCaptionElement {
  return createElement('caption', props, ...content) as HTMLTableCaptionElement;
}

export function colgroupLegacy(props: DOMProps, ...children: DOMChildren[]): HTMLTableColElement {
  return createElement('colgroup', props, ...children) as HTMLTableColElement;
}

export function colLegacy(props: DOMProps): HTMLTableColElement {
  return createElement('col', props) as HTMLTableColElement;
}
