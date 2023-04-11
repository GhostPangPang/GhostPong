/* eslint-disable import/export */
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import { customRender } from './customRender';

afterEach(() => {
  cleanup();
});

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
// override render export
export { customRender as render };
