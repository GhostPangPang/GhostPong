import { useState } from 'react';
import styled from 'styled-components';

interface ProgressBarProps {
  percentage: number;
}

const StyledProgressBar = styled.div`
  background-color: ${({ theme }) => theme.color.gray100};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.boxShadow.md};
  width: 100%;
  height: 1rem;
`;

const StyledBar = styled.div<ProgressBarProps>`
  width: ${({ percentage }) => (percentage < 0 ? 0 : percentage > 100 ? 100 : percentage)}%;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  height: 100%;
  background: linear-gradient(268.76deg, #7875ff, #61ffe3);
`;

interface StyledExpProps {
  visible: boolean;
  left: number;
}

const StyledExp = styled.div<{ expInfo: StyledExpProps }>`
  position: absolute;
  width: min-content;
  font-size: ${({ theme }) => theme.fontSize.xxs};
  background-color: ${({ theme }) => theme.color.surface};
  color: ${({ theme }) => theme.color.foreground};
  padding: 0.4rem;
  margin-top: 0.5rem;

  display: ${({ expInfo }) => (expInfo.visible ? 'block' : 'none')};
  left: ${({ expInfo }) => expInfo.left}px;
`;

export const ProgressBar = ({ percentage }: ProgressBarProps) => {
  const [expInfo, setExpInfo] = useState({ visible: false, left: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setExpInfo((prev) => ({ ...prev, visible: true, left: e.clientX }));
  };

  const handleMouseLeave = () => {
    setExpInfo((prev) => ({ ...prev, visible: false }));
  };

  return (
    <StyledProgressBar onMouseMoveCapture={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <StyledBar percentage={percentage} />
      <StyledExp expInfo={expInfo}>{Math.round(percentage)}%</StyledExp>
    </StyledProgressBar>
  );
};
