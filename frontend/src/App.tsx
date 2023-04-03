import { GlobalStyle } from '@styles/GlobalStyle';
import { Box } from '@components/common/Box/Box';
import { ThemeProvider } from 'styled-components';
import theme from '@styles/theme';
import { Header } from '@components/layout/Header';
import { Content } from '@components/layout/Content';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Header />
      <Content>
        <Box />
      </Content>
    </ThemeProvider>
  );
}

export default App;
