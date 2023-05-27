import styled, { keyframes } from 'styled-components';
import { ModalPortal } from './ModalPortal';
import { ModalComponent, ModalProps } from './Modal';

export const WideModal: ModalComponent = ({ children, isOpen }: ModalProps) => {
  if (!isOpen) return null;
  return (
    <ModalPortal>
      <ModalOverlay>
        <ModalContainer>{children}</ModalContainer>
      </ModalOverlay>
    </ModalPortal>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const grow = keyframes`
  0% { width: 0; }
  100% { width: 100%; }
`;

const ModalContainer = styled.div`
  width: 100%;
  min-height: 400px;
  display: flex;
  direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  transition: width 0.3s ease 0s, left 0.3s ease 0s;
  animation: ${grow} 0.5s forwards;
`;
