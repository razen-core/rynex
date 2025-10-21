/**
 * Rynex Helpers - Central Export Point
 * All helper functions organized by category
 */

// Layout Helpers
export {
  vbox,
  hbox,
  grid,
  container,
  stack,
  center,
  spacer,
  wrap,
  scroll,
  sticky,
  fixed,
  absolute,
  relative
} from './layout.js';

// Basic Elements
export {
  div,
  span,
  text,
  button,
  input,
  image,
  link,
  label,
  p,
  list,
  ul,
  ol,
  li,
  hr,
  br,
  dl,
  dt,
  dd
} from './basic_elements.js';

// Typography
export {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  strong,
  em,
  code,
  pre,
  blockquote,
  mark,
  small,
  del,
  ins,
  sub,
  sup,
  abbr,
  cite,
  kbd,
  samp,
  varElement
} from './typography.js';

// Forms
export {
  form,
  textarea,
  select,
  option,
  checkbox,
  radio,
  fieldset,
  legend,
  datalist,
  meter,
  progress,
  output
} from './forms.js';

// Semantic Elements
export {
  header,
  footer,
  nav,
  main,
  section,
  article,
  aside,
  figure,
  figcaption,
  time,
  address,
  details,
  summary,
  dialog
} from './semantic.js';

// Media Elements
export {
  video,
  audio,
  canvas,
  svg,
  svgPath,
  iframe,
  picture,
  source,
  track
} from './media.js';

// Table Elements
export {
  table,
  thead,
  tbody,
  tfoot,
  tr,
  th,
  td,
  caption,
  colgroup,
  col
} from './table.js';

// Utilities
export {
  fragment,
  when,
  show,
  each,
  switchCase,
  dynamic,
  portal,
  css,
  lazy,
  suspense,
  errorBoundary,
  memo
} from './utilities.js';

// UI Components
export {
  badge,
  card,
  avatar,
  icon,
  tooltip,
  modal,
  dropdown,
  toggle,
  slider,
  progressBar,
  spinner,
  tabs,
  accordion
} from './components.js';

// Routing Components
export {
  Link,
  NavLink,
  RouterOutlet,
  RouteGuard,
  Breadcrumb,
  BackButton,
  RouteParamsDebug,
  RouteLoading,
  NotFound
} from './routing.js';

// Lifecycle Hooks
export {
  onMount,
  onUnmount,
  onUpdate,
  watch,
  watchEffect,
  onError
} from './lifecycle.js';

// Performance Utilities
export {
  debounce,
  throttle,
  preload,
  getPreloaded,
  onIdle,
  cancelIdle
} from './performance.js';

// Refs and DOM Access
export {
  ref,
  useRef,
  forwardRef,
  callbackRef,
  mergeRefs
} from './refs.js';

// Style Utilities
export {
  styled,
  classNames,
  mergeStyles,
  setTheme,
  getTheme,
  useTheme,
  createCSSVariables,
  applyThemeVariables,
  getCSSVariable,
  setCSSVariable
} from './styles.js';
