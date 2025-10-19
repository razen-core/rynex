/**
 * ZenWeb Type Definitions
 */

export type VNodeType = string | Function;

export interface VNodeProps {
  [key: string]: any;
  class?: string;
  id?: string;
  style?: string | Record<string, string>;
  onClick?: (event: MouseEvent) => void;
  onInput?: (event: Event) => void;
  onChange?: (event: Event) => void;
  onSubmit?: (event: Event) => void;
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;
  onKeyDown?: (event: KeyboardEvent) => void;
  onKeyUp?: (event: KeyboardEvent) => void;
  onMouseEnter?: (event: MouseEvent) => void;
  onMouseLeave?: (event: MouseEvent) => void;
}

export interface VNode {
  type: VNodeType;
  props: VNodeProps;
  children: VNodeChild[];
  key?: string | number;
  el?: HTMLElement | Text;
}

export type VNodeChild = VNode | string | number | boolean | null | undefined;

export interface ComponentInstance {
  vnode: VNode | null;
  el: HTMLElement | null;
  update: () => void;
  unmount: () => void;
}
