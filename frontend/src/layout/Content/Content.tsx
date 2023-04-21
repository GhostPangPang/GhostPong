import styled from 'styled-components';

interface ContentProps {
  children?: JSX.Element | JSX.Element[];
}

export const Content = ({ children }: ContentProps) => {
  return <StyledContent>{children}</StyledContent>;
};

const StyledContent = styled.main`
  height: 100%;

  padding: ${(props) => props.theme.padding.layout};
`;
