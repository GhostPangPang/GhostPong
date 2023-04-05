import { createGlobalStyle } from 'styled-components';
import { normalize } from 'styled-normalize';
import theme from './theme';

export const GlobalStyle = createGlobalStyle<{ theme: typeof theme }>`
  ${normalize}

  @font-face {
    font-family: 'ChailceNoggin';
    src: url('../font/ChailceNoggin.ttf');
  }

  /* 결과 → 16px × 62.5% = 10px */
  html {
    font-size: 62.5%;
  }

  #root {
    height: 100%;
	padding: 0 2.4rem;
  }

  html,
  body {
    height: 100%;

    background-color: ${(props) => props.theme.color.background};
    overflow: hidden;
  }

  * {
    box-sizing: border-box;
  }
`;