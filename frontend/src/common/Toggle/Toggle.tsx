import React from 'react';
import styled from 'styled-components';

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 3.6rem;
  height: 2.04rem;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: #2196f3;
  }

  &:checked + span:before {
    transform: translateX(1.56rem);
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 3.4rem;

  &:before {
    position: absolute;
    content: '';
    height: 1.56rem;
    width: 1.56rem;
    left: 0.24rem;
    bottom: 0.24rem;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

// export { toggle };

interface ToggleProps {
  toggle: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export const Toggle = ({ toggle, onChange: handleToggle }: ToggleProps) => {
  return (
    <div>
      <ToggleSwitch>
        <ToggleInput type="checkbox" checked={toggle} onChange={handleToggle} />
        <ToggleSlider />
      </ToggleSwitch>
    </div>
  );
};
