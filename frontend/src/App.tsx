import { GlobalStyle } from '@/styles/GlobalStyle';
import { Box } from '@/components/common/Box/Box';
import { ThemeProvider } from 'styled-components';
import theme from '@/styles/theme';
import { Header } from '@/components/layout/Header';
import { Content } from '@/components/layout/Content';
import ErrorFallback from '@/components/error/ErrorFallback';
import { ErrorBoundary } from 'react-error-boundary';

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
          <Box />
        </Content>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
