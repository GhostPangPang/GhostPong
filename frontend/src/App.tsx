import { GlobalStyle } from '@/styles/GlobalStyle';
import { Box } from '@/common/Box/Box';
import { ThemeProvider } from 'styled-components';
import theme from '@/styles/theme';
import { Header } from '@/layout/Header';
import { Content } from '@/layout/Content';
import { ErrorFallback } from '@/error/ErrorFallback';
import { ErrorBoundary } from 'react-error-boundary';
import { Button } from './common/Button';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {
          // reset the state of your app so the error doesn't happen again
        }}
      >
        <Header />
      </ErrorBoundary>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {
          // reset the state of your app so the error doesn't happen again
        }}
      >
        <Content>
          <Button size="md">Button</Button>
        </Content>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
