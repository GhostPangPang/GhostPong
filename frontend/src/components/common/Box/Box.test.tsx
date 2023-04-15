import { describe, test, expect } from 'vitest';
import { render } from '@/test';
import { Box } from './Box';

describe('Header', () => {
  test('should render successfully', () => {
    const { baseElement } = render(<Box>Box</Box>);
    expect(baseElement).toBeTruthy();
  });
});
