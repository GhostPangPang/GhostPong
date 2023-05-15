import { PropsWithChildren, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const wrapperId = 'modal';

function createWrapperAndAppendToBody() {
  const wrapperElement = document.createElement('div');
  wrapperElement.setAttribute('id', wrapperId);
  document.body.appendChild(wrapperElement);
  return wrapperElement;
}

export const ModalPortal = ({ children }: PropsWithChildren) => {
  const [portal, setPortal] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    let modalRoot = document.getElementById(wrapperId);

    if (!modalRoot) {
      modalRoot = createWrapperAndAppendToBody();
    }
    setPortal(modalRoot);
  }, []);

  if (portal === null) return null;

  return createPortal(children, portal);
};
