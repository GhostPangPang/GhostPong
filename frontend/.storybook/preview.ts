import type { Preview } from '@storybook/react';
import { GlobalStyle } from '../src/assets/styles/GlobalStyle';
import { withThemeFromJSXProvider } from '@storybook/addon-styling';
import theme from '../src/assets/styles/theme';
import { ThemeProvider } from 'styled-components';

export const decorators = [
  withThemeFromJSXProvider({
    themes: { theme },
    Provider: ThemeProvider,
    GlobalStyles: GlobalStyle,
  }),
];

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
