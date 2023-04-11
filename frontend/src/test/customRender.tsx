import theme from '@/assets/styles/theme';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

export function customRender(ui: React.ReactElement, options = {}) {
  return render(ui, {
    wrapper: ({ children }) => <ThemeProvider theme={theme}>{children}</ThemeProvider>,
    ...options,
  });
}
