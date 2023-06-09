import { createGlobalStyle } from 'styled-components';
import { normalize } from 'styled-normalize';
import theme from './theme';

export const GlobalStyle = createGlobalStyle<{ theme: typeof theme }>`
  ${normalize}

  @font-face {
    font-family: 'game';
    src: url('/font/ChailceNoggin.ttf');
  }
  @font-face {
    font-family: 'normal';
    src: url('/font/CookieRun.ttf');
  }

  #root {
    display: flex;
    flex-direction: column;
    height: 100%;
    align-items: center;
    justify-content: center;
  }

  html,
  body {
    height: 100%;

    font-family: 'normal', 'game', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    font-size: 62.5%;

    background-image: url('/svg/bg.svg');
    background-repeat: repeat;
  }

  /* Box sizing rules */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  /* Remove default margin */
  body,
  h1,
  h2,
  h3,
  h4,
  p,
  ul,
  ol,
  li,
  blockquote,
  dl,
  dd {
    margin: 0;
  }

  /* Remove default padding */
  ul,
  ol {
    padding: 0;
  }

  /* Remove list styles */
  ul,
  ol {
    list-style: none;
  }

  /* Remove input styles */
  input,
  button,
  textarea,
  select {
    appearance: none;
    border: none;
    background: none;
    outline: none;
    resize: none;
    border-radius: 0;
    font-family: inherit;
    font-size: inherit;
    color: inherit;
    line-height: inherit;
  }

  a[href], input[type='submit'], input[type='image'], label[for], select, button {
    cursor: pointer;
  }

  a:link {
    text-decoration: none;
  }

  /* Scroll bar */
  ::-webkit-scrollbar {
    width: 0.5rem;
    background-color: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background-color: ${(props) => props.theme.color.gray100};
    border-radius: 0.5rem;
  }
`;
