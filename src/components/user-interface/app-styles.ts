import { createGlobalStyle } from 'styled-components';

export const AppBodyStyle = createGlobalStyle`
  html, body {
    padding: 0;
    margin: 0;
    font-size: 14px;
    font-family: "SF UI Text", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  }
  .is-resizing * {
    pointer-events: none !important;
  }
  .is-dragging {
    cursor: grabbing !important;
  }
  .is-resizing-horizontal {
    cursor: col-resize !important;
  }
  .is-resizing-vertical {
    cursor: row-resize !important;
  }
`;
