import styled from 'styled-components';
import { ReactComponent as Logo } from '@/svgs/logo-sm.svg';
import { Grid } from '../Grid';

export const Header = () => {
  return (
    <Grid as="header" height="12rem" container="flex" justifyContent="space-between" alignItems="center">
      <Logo />
    </Grid>
  );
};

const StyledHeader = styled.header`
  height: 12rem;

  display: flex;
  align-items: center;

  padding: ${(props) => props.theme.padding.layout};
`;
