/**
 * Rynex Form Helpers
 * Form elements and inputs with Rust-style Builder API
 */

import { createElement, DOMProps, DOMChildren } from "../dom.js";
import { ElementBuilder, InputBuilder } from "./builder.js";

/**
 * Form element - Builder API
 */
export class FormBuilder extends ElementBuilder<HTMLFormElement> {
  constructor() {
    super("form");
  }

  action(value: string): this {
    this.element.action = value;
    return this;
  }

  method(value: "get" | "post"): this {
    this.element.method = value;
    return this;
  }

  submit(handler: (event: Event) => void): this {
    this.element.addEventListener("submit", handler);
    return this;
  }
}

export function form(): FormBuilder {
  return new FormBuilder();
}

/**
 * Textarea element - Builder API
 */
export class TextareaBuilder extends ElementBuilder<HTMLTextAreaElement> {
  constructor() {
    super("textarea");
  }

  placeholder(value: string): this {
    this.element.placeholder = value;
    return this;
  }

  rows(value: number): this {
    this.element.rows = value;
    return this;
  }

  cols(value: number): this {
    this.element.cols = value;
    return this;
  }

  value(value: string): this {
    this.element.value = value;
    return this;
  }
}

export function textarea(): TextareaBuilder {
  return new TextareaBuilder();
}

/**
 * Select element - Builder API
 */
export class SelectBuilder extends ElementBuilder<HTMLSelectElement> {
  constructor() {
    super("select");
  }

  multiple(value: boolean = true): this {
    this.element.multiple = value;
    return this;
  }

  size(value: number): this {
    this.element.size = value;
    return this;
  }
}

export function select(): SelectBuilder {
  return new SelectBuilder();
}

/**
 * Option element - Builder API
 */
export class OptionBuilder extends ElementBuilder<HTMLOptionElement> {
  constructor(value?: string) {
    super("option");
    if (value) {
      this.element.value = value;
    }
  }

  value(val: string): this {
    this.element.value = val;
    return this;
  }

  selected(val: boolean = true): this {
    this.element.selected = val;
    return this;
  }
}

export function option(value?: string): OptionBuilder {
  return new OptionBuilder(value);
}

// Legacy support
export function formLegacy(
  props: DOMProps,
  ...children: DOMChildren[]
): HTMLFormElement {
  return createElement("form", props, ...children) as HTMLFormElement;
}

export function textareaLegacy(
  props: DOMProps,
  content?: string,
): HTMLTextAreaElement {
  return createElement("textarea", props, content || "") as HTMLTextAreaElement;
}

export function selectLegacy(
  props: DOMProps,
  ...children: DOMChildren[]
): HTMLSelectElement {
  return createElement("select", props, ...children) as HTMLSelectElement;
}

export function optionLegacy(
  props: DOMProps & { value: string },
  ...content: DOMChildren[]
): HTMLOptionElement {
  return createElement("option", props, ...content) as HTMLOptionElement;
}

/**
 * Checkbox input - Builder API
 */
export function checkbox(): InputBuilder {
  const builder = new InputBuilder();
  builder.type("checkbox");
  return builder;
}

/**
 * Radio input - Builder API
 */
export function radio(): InputBuilder {
  const builder = new InputBuilder();
  builder.type("radio");
  return builder;
}

// Legacy support
export function checkboxLegacy(
  props: DOMProps & { checked?: boolean },
): HTMLInputElement {
  return createElement("input", {
    ...props,
    type: "checkbox",
  }) as HTMLInputElement;
}

export function radioLegacy(
  props: DOMProps & { checked?: boolean; name?: string },
): HTMLInputElement {
  return createElement("input", {
    ...props,
    type: "radio",
  }) as HTMLInputElement;
}

/**
 * Fieldset element - Builder API
 */
export function fieldset(): ElementBuilder<HTMLFieldSetElement> {
  return new ElementBuilder<HTMLFieldSetElement>("fieldset");
}

/**
 * Legend element - Builder API
 */
export function legend(): ElementBuilder<HTMLLegendElement> {
  return new ElementBuilder<HTMLLegendElement>("legend");
}

/**
 * Datalist element - Builder API
 */
export function datalist(): ElementBuilder<HTMLDataListElement> {
  return new ElementBuilder<HTMLDataListElement>("datalist");
}

/**
 * Meter element - Builder API
 */
export class MeterBuilder extends ElementBuilder<HTMLMeterElement> {
  constructor() {
    super("meter");
  }

  value(val: number): this {
    this.element.value = val;
    return this;
  }

  min(val: number): this {
    this.element.min = val;
    return this;
  }

  max(val: number): this {
    this.element.max = val;
    return this;
  }
}

export function meter(): MeterBuilder {
  return new MeterBuilder();
}

/**
 * Progress element - Builder API
 */
export class ProgressBuilder extends ElementBuilder<HTMLProgressElement> {
  constructor() {
    super("progress");
  }

  value(val: number): this {
    this.element.value = val;
    return this;
  }

  max(val: number): this {
    this.element.max = val;
    return this;
  }
}

export function progress(): ProgressBuilder {
  return new ProgressBuilder();
}

/**
 * Output element - Builder API
 */
export class OutputBuilder extends ElementBuilder<HTMLOutputElement> {
  constructor() {
    super("output");
  }

  htmlFor(value: string): this {
    this.element.htmlFor = value;
    return this;
  }
}

export function output(): OutputBuilder {
  return new OutputBuilder();
}

// Legacy support
export function fieldsetLegacy(
  props: DOMProps,
  ...children: DOMChildren[]
): HTMLFieldSetElement {
  return createElement("fieldset", props, ...children) as HTMLFieldSetElement;
}

export function legendLegacy(
  props: DOMProps,
  ...content: DOMChildren[]
): HTMLLegendElement {
  return createElement("legend", props, ...content) as HTMLLegendElement;
}

export function datalistLegacy(
  props: DOMProps & { id: string },
  ...children: DOMChildren[]
): HTMLDataListElement {
  return createElement("datalist", props, ...children) as HTMLDataListElement;
}

export function meterLegacy(
  props: DOMProps & { value: number; min?: number; max?: number },
): HTMLMeterElement {
  return createElement("meter", props) as HTMLMeterElement;
}

export function progressLegacy(
  props: DOMProps & { value?: number; max?: number },
): HTMLProgressElement {
  return createElement("progress", props) as HTMLProgressElement;
}

export function outputLegacy(
  props: DOMProps & { htmlFor?: string },
  ...content: DOMChildren[]
): HTMLOutputElement {
  return createElement("output", props, ...content) as HTMLOutputElement;
}
