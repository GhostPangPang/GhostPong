import { describe, test, expect } from 'vitest';
import { render } from '@/test';
import { Header } from './Header';

describe('Header', () => {
  test('should render successfully', () => {
    const { baseElement } = render(<Header />);
    expect(baseElement).toBeTruthy();
  });
});
