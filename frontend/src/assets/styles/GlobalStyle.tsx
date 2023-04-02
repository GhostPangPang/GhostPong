import { createGlobalStyle } from 'styled-components';
import { normalize } from 'styled-normalize';

export const GlobalStyle = createGlobalStyle`
  ${normalize}

  /* 결과 → 16px × 62.5% = 10px */
  html {
    font-size: 62.5%;
  }

  html,
  body {
    overflow: hidden;
  }

  * {
    box-sizing: border-box;
  }
`;
