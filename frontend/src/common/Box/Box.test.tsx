import { describe, test, expect } from 'vitest';
import { render, screen } from '@/test';
import { Box } from './Box';

describe('Header', () => {
  test('should render successfully', () => {
    render(<Box width="300px" height="300px" borderRadius="sm" />);
  });
  screen.debug();
  expect(screen.getByRole('div')).toBeTruthy();
});
