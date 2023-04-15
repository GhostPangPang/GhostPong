import styled from 'styled-components';
import { GComponent, GComponentProps } from '../GComponent';

// interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
//   children?: React.ReactNode;
// }

type BoxProps = {
  width?: string;
  height?: string;
} & GComponentProps<'div'>;

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
