import styled from 'styled-components';
import { ReactComponent as Logo } from '@/svgs/logo-sm.svg';

export const Header = () => {
  return (
    <StyledHeader>
      <Logo />
    </StyledHeader>
  );
};

const StyledHeader = styled.header`
  height: 12rem;

  display: flex;
  align-items: center;

  padding: ${(props) => props.theme.padding.layout};
`;
