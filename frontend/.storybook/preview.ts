import type { Preview } from '@storybook/react';
import { GlobalStyle } from '../src/assets/styles/GlobalStyle';
import { withThemeFromJSXProvider } from '@storybook/addon-styling';

export const decorators = [
  withThemeFromJSXProvider({
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
