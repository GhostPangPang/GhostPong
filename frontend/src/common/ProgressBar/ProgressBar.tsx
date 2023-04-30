import { useState } from 'react';
import styled from 'styled-components';

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
  background: ${({ theme }) => theme.backgroundColor.gradient};
`;

interface StyledExpProps {
  visible: boolean;
  left: number;
}

const StyledExp = styled.div<{ expInfo: StyledExpProps }>`
  position: absolute;
  font-size: ${({ theme }) => theme.fontSize.xxs};
  background-color: ${({ theme }) => theme.color.surface};
  color: ${({ theme }) => theme.color.foreground};
  border-radius: 0.2rem;
  padding: 0.4rem;
  margin-top: 0.5rem;

  display: ${({ expInfo }) => (expInfo.visible ? 'block' : 'none')};
  left: ${({ expInfo }) => expInfo.left}px;
`;

interface ProgressBarProps {
  percentage: number;
  msg?: string;
}

export const ProgressBar = ({ percentage, msg }: ProgressBarProps) => {
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
      <StyledExp expInfo={expInfo}>{(msg ? `${msg} ,` : '') + Math.round(percentage)}%</StyledExp>
    </StyledProgressBar>
  );
};
