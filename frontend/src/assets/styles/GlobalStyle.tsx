import { createGlobalStyle } from 'styled-components';
import { normalize } from 'styled-normalize';
import bg from '@/assets/svgs/bg.svg';
import theme from './theme';

export const GlobalStyle = createGlobalStyle<{ theme: typeof theme }>`
  ${normalize}

  @font-face {
    font-family: 'ChailceNoggin';
    src: url('/font/ChailceNoggin.ttf');
  }

  /* 결과 → 16px × 62.5% = 10px */
  html {
    font-size: 62.5%;
  }

  #root {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  html,
  body {
    height: 100%;

    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    background-image: url(${bg});
    background-repeat: repeat-x;
  }

  * {
    box-sizing: border-box;
  }

  a[href], input[type='submit'], input[type='image'], label[for], select, button {
    cursor: pointer;
  }
  a:link {
    text-decoration: none;
  }
`;
