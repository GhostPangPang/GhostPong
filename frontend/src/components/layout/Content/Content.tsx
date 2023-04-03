import styled from 'styled-components';

const StyledContent = styled.div`
  height: 100%;
`;

interface ContentProps {
  children?: JSX.Element | JSX.Element[];
}

export const Content = ({ children }: ContentProps) => {
  return <StyledContent>{children}</StyledContent>;
};
