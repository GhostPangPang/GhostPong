import styled from 'styled-components';
import { GComponent, GComponentProps } from '../GComponent';

interface BoxProps extends GComponentProps<'div'> {
  width?: string;
  height?: string;
}

export const Box = ({ width, height, children, ...props }: BoxProps) => {
  return (
    <GBox width={width} height={height} {...props}>
      {children}
    </GBox>
  );
};

const GBox = styled(GComponent)<BoxProps>`
  width: ${({ width }) => width || '100%'};
  height: ${({ height }) => height || '100%'};
  background-color: black;
`;
