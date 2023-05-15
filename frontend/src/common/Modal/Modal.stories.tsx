import { Modal } from './Modal';
import { useState } from 'react';
import { GameButton } from '../Button';

const meta = {
  title: 'Common/Modal',
  component: Modal,
  argTypes: {},
  parameters: {},
  decorators: [],
};

export default meta;

export const Default = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <GameButton size="md" onClick={() => setIsOpen(true)}>
        Open Modal
      </GameButton>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h1>Modal</h1>
      </Modal>
    </>
  );
};

export const Scroll = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <GameButton size="md" onClick={() => setIsOpen(true)}>
        Open Modal
      </GameButton>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h1>Modal</h1>
        <h1>Modal</h1>
        <h1>Modal</h1>
        <h1>Modal</h1>
        <h1>Modal</h1>
        <h1>Modal</h1>
        <h1>Modal</h1>
        <h1>Modal</h1>
        <h1>Modal</h1>
        <h1>Modal</h1>
        <h1>Modal</h1>
        <h1>Modal</h1>
        <h1>Modal</h1>
        <h1>Modal</h1>
        <h1>Modal</h1>
        <h1>Modal</h1>
        <h1>Modal</h1>
        <h1>Modal</h1>
        <h1>Modal</h1>
        <h1>Modal</h1>
        <h1>Modal</h1>
        <h1>Modal</h1>
        <h1>Modal</h1>
        <h1>Modal</h1>
        <h1>Modal</h1>
        <h1>Modal</h1>
        <h1>Modal</h1>
        <h1>Modal</h1>
        <h1>Modal</h1>
        <h1>Modal</h1>
        <h1>Modal</h1>
        <h1>Modal</h1>
        <h1>Modal</h1>
        <h1>Modal</h1>
        <h1>Modal</h1>
        <h1>Modal</h1>
      </Modal>
    </>
  );
};
