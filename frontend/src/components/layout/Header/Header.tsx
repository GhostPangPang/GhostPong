import styled from 'styled-components';
import { ReactComponent as Logo } from '@/svgs/logo-sm.svg';

const StyledHeader = styled.header`
  display: flex;
  align-items: center;

  width: 100%;
  height: 9.6rem;
`;

export const Header = () => {
  return (
    <StyledHeader>
      <Logo />
    </StyledHeader>
  );
};
